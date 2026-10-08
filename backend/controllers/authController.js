const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;
const BCRYPT_MAX_BYTES = 72;

function createToken(userId) {
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
  };
}

function validateCredentials({ email, password }) {
  if (
    typeof email !== "string" ||
    email.trim().length > 254 ||
    !EMAIL_PATTERN.test(email.trim())
  ) {
    return "Enter a valid email address.";
  }

  if (
    typeof password !== "string" ||
    password.length < PASSWORD_MIN_LENGTH ||
    Buffer.byteLength(password, "utf8") > BCRYPT_MAX_BYTES
  ) {
    return "Password must be at least 8 characters and no more than 72 bytes.";
  }

  return null;
}

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body || {};
    const credentialError = validateCredentials({ email, password });

    if (credentialError) {
      return res.status(400).json({ message: credentialError });
    }

    if (typeof name !== "string" || !name.trim() || name.trim().length > 80) {
      return res.status(400).json({ message: "Name is required (maximum 80 characters)." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: passwordHash,
    });

    return res.status(201).json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body || {};
    const credentialError = validateCredentials({ email, password });

    if (credentialError) {
      return res.status(400).json({ message: credentialError });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    const passwordMatches = user && await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    return res.json({
      token: createToken(user._id),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

function getCurrentUser(req, res) {
  return res.json({ user: publicUser(req.user) });
}

module.exports = { register, login, getCurrentUser };
