import User from '../models/User.js';
import Post from '../models/Post.js';
import Connection from '../models/Connection.js';
import ConnectionRequest from '../models/ConnectionRequest.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { removeLocalFile, toPublicPath } from '../utils/fileHelpers.js';

const normalizeSkills = (skills) => {
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  return String(skills || '').split(',').map((s) => s.trim()).filter(Boolean);
};

const getConnectionStatus = async (currentUserId, targetUserId) => {
  if (String(currentUserId) === String(targetUserId)) return 'self';
  const existing = await Connection.findOne({
    $or: [
      { userOne: currentUserId, userTwo: targetUserId },
      { userOne: targetUserId, userTwo: currentUserId }
    ]
  });
  if (existing) return 'connected';

  const request = await ConnectionRequest.findOne({
    $or: [
      { sender: currentUserId, receiver: targetUserId, status: 'pending' },
      { sender: targetUserId, receiver: currentUserId, status: 'pending' }
    ]
  });

  if (!request) return 'none';
  return String(request.sender) === String(currentUserId) ? 'request_sent' : 'request_received';
};

export const searchUsers = asyncHandler(async (req, res) => {
  const q = String(req.query.q || '').trim();
  const filter = { status: 'active', _id: { $ne: req.user._id } };

  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [
      { fullName: regex }, { profession: regex }, { skills: regex },
      { college: regex }, { company: regex }, { location: regex }
    ];
  }

  const users = await User.find(filter)
    .select('-passwordHash -otpHash')
    .limit(30)
    .sort({ createdAt: -1 });

  const enriched = await Promise.all(users.map(async (user) => ({
    ...user.toObject(),
    connectionStatus: await getConnectionStatus(req.user._id, user._id)
  })));

  res.json(enriched);
});

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, status: 'active' }).select('-passwordHash -otpHash');
  if (!user) return res.status(404).json({ message: 'User not found.' });

  const posts = await Post.find({ user: user._id })
    .populate('user', 'fullName profession profileImage')
    .populate('comments.user', 'fullName profileImage')
    .sort({ createdAt: -1 });

  const connectionCount = await Connection.countDocuments({ $or: [{ userOne: user._id }, { userTwo: user._id }] });
  const connectionStatus = await getConnectionStatus(req.user._id, user._id);

  res.json({ user, posts, connectionCount, connectionStatus });
});

export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const files = req.files || {};

  const fields = [
    'fullName', 'profession', 'professionalSummary', 'about',
    'education', 'experience', 'college', 'company', 'location'
  ];

  fields.forEach((field) => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  if (req.body.skills !== undefined) user.skills = normalizeSkills(req.body.skills);

  if (files.profileImage?.[0]) {
    removeLocalFile(user.profileImage);
    user.profileImage = toPublicPath(files.profileImage[0]);
  }

  if (files.coverImage?.[0]) {
    removeLocalFile(user.coverImage);
    user.coverImage = toPublicPath(files.coverImage[0]);
  }

  await user.save();
  res.json(user);
});
