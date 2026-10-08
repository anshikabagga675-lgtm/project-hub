const express = require("express");
const {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
} = require("../controllers/projectController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.post("/", createProject);
router.get("/", getProjects);
router.post("/:id/members", addProjectMember);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

module.exports = router;
