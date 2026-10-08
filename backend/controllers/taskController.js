const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const Task = require("../models/Task");
const User = require("../models/User");
const { createHttpError, sameId, validateObjectId } = require("../utils/http");
const { findProjectForMember } = require("../utils/projectAccess");

const TASK_FIELDS = ["title", "description", "assignedTo", "status", "priority", "dueDate"];
const TASK_STATUSES = ["todo", "in-progress", "review", "completed"];
const TASK_PRIORITIES = ["low", "medium", "high", "urgent"];

function validateTaskBody(body, { partial = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw createHttpError(400, "Task details are required.");
  }

  if (!partial || Object.prototype.hasOwnProperty.call(body, "title")) {
    if (typeof body.title !== "string" || !body.title.trim() || body.title.trim().length > 200) {
      throw createHttpError(400, "Task title is required and must be 200 characters or fewer.");
    }
  }
  if (Object.prototype.hasOwnProperty.call(body, "description")
    && (typeof body.description !== "string" || body.description.length > 5000)) {
    throw createHttpError(400, "Task description must be 5000 characters or fewer.");
  }
  if (Object.prototype.hasOwnProperty.call(body, "status")
    && !TASK_STATUSES.includes(body.status)) {
    throw createHttpError(400, "Task status is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(body, "priority")
    && !TASK_PRIORITIES.includes(body.priority)) {
    throw createHttpError(400, "Task priority is invalid.");
  }
  if (Object.prototype.hasOwnProperty.call(body, "dueDate")
    && body.dueDate !== null
    && body.dueDate !== ""
    && (typeof body.dueDate !== "string" || Number.isNaN(Date.parse(body.dueDate)))) {
    throw createHttpError(400, "Task due date must be a valid date.");
  }
  if (Object.prototype.hasOwnProperty.call(body, "assignedTo")
    && body.assignedTo !== null
    && body.assignedTo !== "") {
    validateObjectId(body.assignedTo, "assignee id");
  }
}

async function resolveAssignee(assignedTo, project) {
  if (assignedTo === undefined || assignedTo === null || assignedTo === "") return null;

  const userId = validateObjectId(assignedTo, "assignee id");
  const isMember = sameId(project.owner, userId)
    || project.members.some((member) => sameId(member, userId));
  if (!isMember) {
    throw createHttpError(400, "Tasks can only be assigned to project members.");
  }

  const user = await User.findById(userId);
  if (!user) throw createHttpError(404, "Assignee not found.");
  return user;
}

async function createTask(req, res, next) {
  try {
    const body = req.body || {};
    validateTaskBody(body);
    const project = await findProjectForMember(body.project, req.user);
    const assignee = await resolveAssignee(body.assignedTo, project);
    const task = await Task.create({
      title: body.title.trim(),
      description: body.description?.trim() || "",
      project: project._id,
      assignedTo: assignee?._id || null,
      createdBy: req.user._id,
      status: body.status || "todo",
      priority: body.priority || "medium",
      dueDate: body.dueDate || undefined,
    });

    if (assignee && !sameId(assignee._id, req.user._id)) {
      await Notification.create({
        recipient: assignee._id,
        sender: req.user._id,
        type: "task-assigned",
        message: `You have been assigned a new task: ${task.title}`,
        project: project._id,
        task: task._id,
      });
    }

    await task.populate([
      { path: "assignedTo", select: "name email avatar role" },
      { path: "createdBy", select: "name email avatar role" },
    ]);
    return res.status(201).json({ success: true, task });
  } catch (error) {
    return next(error);
  }
}

async function getProjectTasks(req, res, next) {
  try {
    await findProjectForMember(req.params.projectId, req.user);
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email avatar role")
      .populate("createdBy", "name email avatar role")
      .sort({ createdAt: -1 });

    return res.json({ success: true, tasks });
  } catch (error) {
    return next(error);
  }
}

async function getTaskById(req, res, next) {
  try {
    validateObjectId(req.params.id, "task id");
    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email avatar role")
      .populate("createdBy", "name email avatar role");

    if (!task) throw createHttpError(404, "Task not found.");
    await findProjectForMember(task.project, req.user);
    return res.json({ success: true, task });
  } catch (error) {
    return next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    validateObjectId(req.params.id, "task id");
    validateTaskBody(req.body, { partial: true });
    const task = await Task.findById(req.params.id);
    if (!task) throw createHttpError(404, "Task not found.");
    const project = await findProjectForMember(task.project, req.user);
    const previousAssignee = task.assignedTo;

    for (const field of TASK_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(req.body, field)) continue;

      if (field === "assignedTo") {
        const assignee = await resolveAssignee(req.body.assignedTo, project);
        task.assignedTo = assignee?._id || null;
      } else if (field === "title" || field === "description") {
        task[field] = req.body[field].trim();
      } else {
        task[field] = req.body[field] || undefined;
      }
    }

    await task.save();
    if (
      task.assignedTo &&
      !sameId(task.assignedTo, previousAssignee) &&
      !sameId(task.assignedTo, req.user._id)
    ) {
      await Notification.create({
        recipient: task.assignedTo,
        sender: req.user._id,
        type: "task-assigned",
        message: `You have been assigned a new task: ${task.title}`,
        project: project._id,
        task: task._id,
      });
    }

    await task.populate([
      { path: "assignedTo", select: "name email avatar role" },
      { path: "createdBy", select: "name email avatar role" },
    ]);
    return res.json({ success: true, task });
  } catch (error) {
    return next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    validateObjectId(req.params.id, "task id");
    const task = await Task.findById(req.params.id);
    if (!task) throw createHttpError(404, "Task not found.");
    await findProjectForMember(task.project, req.user);
    await Promise.all([
      Comment.deleteMany({ task: task._id }),
      Notification.deleteMany({ task: task._id }),
      task.deleteOne(),
    ]);
    return res.json({ success: true, message: "Task deleted." });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  createTask,
  deleteTask,
  getProjectTasks,
  getTaskById,
  updateTask,
};
