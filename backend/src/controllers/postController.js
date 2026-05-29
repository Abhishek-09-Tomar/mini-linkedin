import Post from '../models/Post.js';
import Connection from '../models/Connection.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { detectMediaType, removeLocalFile, toPublicPath } from '../utils/fileHelpers.js';

const populatePost = (query) => query
  .populate('user', 'fullName profession profileImage')
  .populate('comments.user', 'fullName profileImage');

const notify = async ({ user, actor, post, type, message }) => {
  if (String(user) === String(actor)) return;
  await Notification.create({ user, actor, relatedPost: post, type, message });
};

export const getFeed = asyncHandler(async (req, res) => {
  const connections = await Connection.find({ $or: [{ userOne: req.user._id }, { userTwo: req.user._id }] });
  const connectedIds = connections.map((c) => String(c.userOne) === String(req.user._id) ? String(c.userTwo) : String(c.userOne));

  const posts = await populatePost(Post.find({}).sort({ createdAt: -1 }).limit(100));

  const profession = String(req.user.profession || '').toLowerCase();
  const smartSorted = posts.sort((a, b) => {
    const score = (post) => {
      let value = 0;
      if (String(post.user._id) === String(req.user._id)) value += 1000;
      if (connectedIds.includes(String(post.user._id))) value += 700;
      if (profession && String(post.user.profession || '').toLowerCase().includes(profession)) value += 250;
      value += post.likes.length * 10;
      value += post.comments.length * 5;
      value += Math.floor(new Date(post.createdAt).getTime() / 100000000);
      return value;
    };
    return score(b) - score(a);
  });

  res.json(smartSorted);
});

export const createPost = asyncHandler(async (req, res) => {
  const content = String(req.body.content || '').trim();
  const mediaPath = toPublicPath(req.file);

  if (!content && !mediaPath) return res.status(400).json({ message: 'Write content or upload media.' });

  const post = await Post.create({
    user: req.user._id,
    content,
    mediaPath: mediaPath || '',
    mediaType: req.file ? detectMediaType(req.file.mimetype) : 'none'
  });

  const populated = await populatePost(Post.findById(post._id));
  res.status(201).json(populated);
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (String(post.user) !== String(req.user._id)) return res.status(403).json({ message: 'You can edit only your own post.' });

  if (req.body.content !== undefined) post.content = String(req.body.content).trim();
  if (req.file) {
    removeLocalFile(post.mediaPath);
    post.mediaPath = toPublicPath(req.file);
    post.mediaType = detectMediaType(req.file.mimetype);
  }
  if (req.body.removeMedia === 'true') {
    removeLocalFile(post.mediaPath);
    post.mediaPath = '';
    post.mediaType = 'none';
  }

  await post.save();
  const populated = await populatePost(Post.findById(post._id));
  res.json(populated);
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });
  if (String(post.user) !== String(req.user._id)) return res.status(403).json({ message: 'You can delete only your own post.' });
  removeLocalFile(post.mediaPath);
  await post.deleteOne();
  res.json({ message: 'Post deleted successfully.' });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate('user', 'fullName');
  if (!post) return res.status(404).json({ message: 'Post not found.' });

  const alreadyLiked = post.likes.some((id) => String(id) === String(req.user._id));
  if (alreadyLiked) post.likes = post.likes.filter((id) => String(id) !== String(req.user._id));
  else {
    post.likes.push(req.user._id);
    await notify({ user: post.user._id, actor: req.user._id, post: post._id, type: 'like', message: `${req.user.fullName} liked your post.` });
  }

  await post.save();
  const populated = await populatePost(Post.findById(post._id));
  res.json(populated);
});

export const addComment = asyncHandler(async (req, res) => {
  const comment = String(req.body.comment || '').trim();
  if (!comment) return res.status(400).json({ message: 'Comment is required.' });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });

  post.comments.push({ user: req.user._id, comment });
  await post.save();
  await notify({ user: post.user, actor: req.user._id, post: post._id, type: 'comment', message: `${req.user.fullName} commented on your post.` });

  const populated = await populatePost(Post.findById(post._id));
  res.status(201).json(populated);
});

export const sharePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: 'Post not found.' });

  if (!post.shares.some((id) => String(id) === String(req.user._id))) {
    post.shares.push(req.user._id);
    await post.save();
    await notify({ user: post.user, actor: req.user._id, post: post._id, type: 'share', message: `${req.user.fullName} shared your post.` });
  }

  const populated = await populatePost(Post.findById(post._id));
  res.json(populated);
});
