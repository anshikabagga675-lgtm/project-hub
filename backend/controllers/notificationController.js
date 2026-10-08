const Notification = require("../models/Notification");
const { createHttpError, validateObjectId } = require("../utils/http");

async function getNotifications(req, res, next) {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name email avatar")
      .populate("project", "name")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    return res.json({ success: true, notifications });
  } catch (error) {
    return next(error);
  }
}

async function markNotificationRead(req, res, next) {
  try {
    validateObjectId(req.params.id, "notification id");
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });
    if (!notification) throw createHttpError(404, "Notification not found.");

    notification.read = true;
    await notification.save();
    return res.json({ success: true, notification });
  } catch (error) {
    return next(error);
  }
}

async function markAllNotificationsRead(req, res, next) {
  try {
    const result = await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { $set: { read: true } },
    );
    return res.json({
      success: true,
      message: "Notifications marked as read.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
};
