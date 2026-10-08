const express = require("express");
const {
  getCurrentUser,
  loginUser,
  registerUser,
} = require("../controllers/authController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", requireAuth, getCurrentUser);

module.exports = router;
