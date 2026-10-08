const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const { createHttpError, sameId, validateObjectId } = require("../utils/http");
const { findProjectForMember, isProjectOwner } = require("../utils/projectAccess");

const PROJECT_FIELDS = ["name", "description", "status", "deadline"];
const PROJECT_STATUSES = ["active", "completed", "archived"];

function validateProjectBody(body, { partial = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createHttpError(400, "A project details object is required.");
  }

  const hasName = Object.prototype.hasOwnProperty.call(body, "name");
  if (!partial || hasName) {
    if (typeof body.name !== "string" || !body.name.trim() || body.name.trim().length > 120) {
      throw createHttpError(400, "Project name is required and must be 120 characters or fewer.");
    }
  }

  if (Object.prototype.hasOwnProperty.call(body, "description")
    && (typeof body.description !== "string" || body.description.length > 2000)) {
    throw createHttpError(400, "Project description must be 2000 characters or fewer.");
  }

  if (Object.prototype.hasOwnProperty.call(body, "status")
    && !PROJECT_STATUSES.includes(body.status)) {
    throw createHttpError(400, "Project status must be active, completed, or archived.");
  }

  if (Object.prototype.hasOwnProperty.call(body, "deadline")
    && body.deadline !== null
    && body.deadline !== ""
    && (Number.isNaN(Date.parse(body.deadline)) || typeof body.deadline !== "string")) {
    throw createHttpError(400, "Project deadline must be a valid date.");
  }
}

async function createProject(req, res, next) {
  try {
    const body = req.body || {};
    validateProjectBody(body);
    const project = await Project.create({
      name: body.name.trim(),
      description: body.description?.trim() || "",
      status: body.status || "active",
      deadline: body.deadline || undefined,
      owner: req.user._id,
      members: [req.user._id],
    });
    await project.populate("owner", "name email avatar role");
    await project.populate("members", "name email avatar role");

    return res.status(201).json({ success: true, project });
  } catch (error) {
    return next(error);
  }
}

async function getProjects(req, res, next) {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }],
    })
      .populate("owner", "name email avatar role")
      .populate("members", "name email avatar role")
      .sort({ updatedAt: -1 });

    return res.json({ success: true, projects });
  } catch (error) {
    return next(error);
  }
}

async function getProjectById(req, res, next) {
  try {
    const project = await findProjectForMember(req.params.id, req.user, { populate: true });
    return res.json({ success: true, project });
  } catch (error) {
    return next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    validateObjectId(req.params.id, "project id");
    validateProjectBody(req.body, { partial: true });
    const project = await Project.findById(req.params.id);

    if (!project) throw createHttpError(404, "Project not found.");
    if (!isProjectOwner(project, req.user)) {
      throw createHttpError(403, "Only the project owner can update project details.");
    }

    for (const field of PROJECT_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) continue;
      project[field] = field === "name" || field === "description"
        ? req.body[field].trim()
        : req.body[field] || undefined;
    }

    await project.save();
    await project.populate("owner", "name email avatar role");
    await project.populate("members", "name email avatar role");
    return res.json({ success: true, project });
  } catch (error) {
    return next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    validateObjectId(req.params.id, "project id");
    const project = await Project.findById(req.params.id);
    if (!project) throw createHttpError(404, "Project not found.");
    if (!isProjectOwner(project, req.user)) {
      throw createHttpError(403, "Only the project owner can delete this project.");
    }

    const taskIds = await Task.find({ project: project._id }).distinct("_id");
    await Promise.all([
      Comment.deleteMany({ task: { $in: taskIds } }),
      Task.deleteMany({ project: project._id }),
      Notification.deleteMany({ project: project._id }),
    ]);
    await project.deleteOne();
    return res.json({ success: true, message: "Project deleted." });
  } catch (error) {
    return next(error);
  }
}

async function addProjectMember(req, res, next) {
  try {
    validateObjectId(req.params.id, "project id");
    const memberId = req.body?.userId;
    validateObjectId(memberId, "user id");
    const project = await Project.findById(req.params.id);

    if (!project) throw createHttpError(404, "Project not found.");
    if (!isProjectOwner(project, req.user)) {
      throw createHttpError(403, "Only the project owner can add members.");
    }
    if (project.members.some((member) => sameId(member, memberId))) {
      throw createHttpError(409, "This user is already a project member.");
    }

    const member = await User.findById(memberId);
    if (!member) throw createHttpError(404, "User not found.");

    project.members.push(member._id);
    await project.save();
    await Notification.create({
      recipient: member._id,
      sender: req.user._id,
      type: "project-member",
      message: `You were added to the project: ${project.name}`,
      project: project._id,
    });

    await project.populate("owner", "name email avatar role");
    await project.populate("members", "name email avatar role");
    return res.status(201).json({ success: true, project });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  addProjectMember,
  createProject,
  deleteProject,
  getProjectById,
  getProjects,
  updateProject,
};
