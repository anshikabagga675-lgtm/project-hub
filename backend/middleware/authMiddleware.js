const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function requireAuth(req, res, next) {
  const authorization = req.get("authorization");
  const match = authorization && authorization.match(/^Bearer\s+(\S+)$/i);
  const token = match && match[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required.",
    });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Your session is no longer valid.",
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or has expired.",
      });
    }

    return next(error);
  }
}

module.exports = requireAuth;
