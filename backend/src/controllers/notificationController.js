import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate('actor', 'fullName profileImage')
    .sort({ createdAt: -1 })
    .limit(30);

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });
  res.json({ notifications, unreadCount });
});

export const markNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.json({ message: 'Notifications marked as read.' });
});
