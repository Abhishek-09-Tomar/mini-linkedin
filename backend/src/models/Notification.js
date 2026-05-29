import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  relatedPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
  type: { type: String, enum: ['welcome', 'like', 'comment', 'share', 'connection', 'system'], default: 'system' },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
