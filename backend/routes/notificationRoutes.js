const express = require("express");
const {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} = require("../controllers/notificationController");
const requireAuth = require("../middleware/authMiddleware");

const router = express.Router();

router.use(requireAuth);
router.get("/", getNotifications);
router.put("/read-all", markAllNotificationsRead);
router.put("/:id/read", markNotificationRead);

module.exports = router;
