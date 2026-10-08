const express = require("express");
const {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskById,
  updateTask,
} = require("../controllers/taskController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/", createTask);
router.get("/project/:projectId", getProjectTasks);
router.get("/:id", getTaskById);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
