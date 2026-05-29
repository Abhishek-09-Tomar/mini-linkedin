import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  content: { type: String, trim: true, default: '' },
  mediaPath: { type: String, default: '' },
  mediaType: { type: String, enum: ['none', 'image', 'video'], default: 'none' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  shares: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);
export default Post;
