const express = require("express");
const {
  createComment,
  deleteComment,
  getTaskComments,
} = require("../controllers/commentController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/", createComment);
router.get("/task/:taskId", getTaskComments);
router.delete("/:id", deleteComment);

module.exports = router;
