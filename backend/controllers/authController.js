const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_MAX_BYTES = 72;

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is required to issue authentication tokens.");
  }

  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

function publicUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    role: user.role,
  };
}

function validateEmail(email) {
  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return "Enter a valid email address.";
  }

  return null;
}

function validateRegistrationPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN_LENGTH ||
    Buffer.byteLength(password, "utf8") > BCRYPT_MAX_BYTES
  ) {
    return "Password must be at least 8 characters and no more than 72 bytes.";
  }

  return null;
}

async function registerUser(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    const emailError = validateEmail(email);
    const passwordError = validateRegistrationPassword(password);

    if (emailError || passwordError) {
      return res.status(400).json({
        success: false,
        message: emailError || passwordError,
      });
    }

    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      return res.status(400).json({
        success: false,
        message: "Name is required (maximum 80 characters).",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password,
    });

    return res.status(201).json({
      success: true,
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    return next(error);
  }
}

async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const emailError = validateEmail(email);

    if (
      emailError ||
      typeof password !== "string" ||
      !password ||
      Buffer.byteLength(password, "utf8") > BCRYPT_MAX_BYTES
    ) {
      return res.status(400).json({
        success: false,
        message: emailError || "Email and a password of no more than 72 bytes are required.",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const passwordMatches = user && await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Email or password is incorrect.",
      });
    }

    return res.json({
      success: true,
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

function getCurrentUser(req, res) {
  return res.json({ success: true, user: publicUser(req.user) });
}

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
};
