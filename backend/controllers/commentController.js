const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Task = require("../models/Task");
const { createHttpError, sameId, validateObjectId } = require("../utils/http");
const { findProjectForMember, isProjectOwner } = require("../utils/projectAccess");

async function findTaskWithAccess(taskId, user) {
  validateObjectId(taskId, "task id");
  const task = await Task.findById(taskId);
  if (!task) throw createHttpError(404, "Task not found.");
  const project = await findProjectForMember(task.project, user);
  return { task, project };
}

async function createComment(req, res, next) {
  try {
    const { task: taskId, text } = req.body || {};
    if (typeof text !== "string" || !text.trim() || text.trim().length > 5000) {
      throw createHttpError(400, "Comment text is required and must be 5000 characters or fewer.");
    }
    const { task, project } = await findTaskWithAccess(taskId, req.user);
    const comment = await Comment.create({
      task: task._id,
      user: req.user._id,
      text: text.trim(),
    });

    const recipients = new Set(
      [task.assignedTo, task.createdBy]
        .filter((recipient) => recipient && !sameId(recipient, req.user._id))
        .map((recipient) => recipient.toString()),
    );
    if (recipients.size) {
      await Notification.insertMany([...recipients].map((recipient) => ({
        recipient,
        sender: req.user._id,
        type: "comment",
        message: `New comment on your task: ${task.title}`,
        project: project._id,
        task: task._id,
      })));
    }

    await comment.populate("user", "name email avatar role");
    return res.status(201).json({ success: true, comment });
  } catch (error) {
    return next(error);
  }
}

async function getTaskComments(req, res, next) {
  try {
    await findTaskWithAccess(req.params.taskId, req.user);
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("user", "name email avatar role")
      .sort({ createdAt: 1 });

    return res.json({ success: true, comments });
  } catch (error) {
    return next(error);
  }
}

async function deleteComment(req, res, next) {
  try {
    validateObjectId(req.params.id, "comment id");
    const comment = await Comment.findById(req.params.id).populate({
      path: "task",
      select: "project",
    });
    if (!comment) throw createHttpError(404, "Comment not found.");
    if (!comment.task) throw createHttpError(404, "The task for this comment was not found.");

    const project = await findProjectForMember(
      comment.task.project,
      req.user,
      { allowAdmin: true },
    );
    const canDelete = sameId(comment.user, req.user._id)
      || isProjectOwner(project, req.user)
      || req.user.role === "admin";
    if (!canDelete) {
      throw createHttpError(403, "Only the comment author or a project administrator can delete this comment.");
    }

    await comment.deleteOne();
    return res.json({ success: true, message: "Comment deleted." });
  } catch (error) {
    return next(error);
  }
}

module.exports = { createComment, deleteComment, getTaskComments };
