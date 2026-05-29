import Connection from '../models/Connection.js';
import ConnectionRequest from '../models/ConnectionRequest.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const orderedPair = (a, b) => String(a) < String(b) ? [a, b] : [b, a];

export const getConnections = asyncHandler(async (req, res) => {
  const received = await ConnectionRequest.find({ receiver: req.user._id, status: 'pending' })
    .populate('sender', 'fullName profession profileImage location')
    .sort({ createdAt: -1 });

  const sent = await ConnectionRequest.find({ sender: req.user._id, status: 'pending' })
    .populate('receiver', 'fullName profession profileImage location')
    .sort({ createdAt: -1 });

  const connections = await Connection.find({ $or: [{ userOne: req.user._id }, { userTwo: req.user._id }] })
    .populate('userOne userTwo', 'fullName profession profileImage location')
    .sort({ createdAt: -1 });

  const connectedUsers = connections.map((c) => String(c.userOne._id) === String(req.user._id) ? c.userTwo : c.userOne);
  res.json({ received, sent, connectedUsers });
});

export const sendRequest = asyncHandler(async (req, res) => {
  const receiverId = req.params.receiverId;
  if (String(receiverId) === String(req.user._id)) return res.status(400).json({ message: 'You cannot connect with yourself.' });

  const receiver = await User.findOne({ _id: receiverId, status: 'active' });
  if (!receiver) return res.status(404).json({ message: 'User not found.' });

  const existingConnection = await Connection.findOne({
    $or: [{ userOne: req.user._id, userTwo: receiverId }, { userOne: receiverId, userTwo: req.user._id }]
  });
  if (existingConnection) return res.status(409).json({ message: 'Already connected.' });

  const existingRequest = await ConnectionRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId, status: 'pending' },
      { sender: receiverId, receiver: req.user._id, status: 'pending' }
    ]
  });
  if (existingRequest) return res.status(409).json({ message: 'Connection request already exists.' });

  const request = await ConnectionRequest.create({ sender: req.user._id, receiver: receiverId });
  await Notification.create({ user: receiverId, actor: req.user._id, type: 'connection', message: `${req.user.fullName} sent you a connection request.` });
  res.status(201).json(request);
});

export const acceptRequest = asyncHandler(async (req, res) => {
  const request = await ConnectionRequest.findOne({ _id: req.params.requestId, receiver: req.user._id, status: 'pending' });
  if (!request) return res.status(404).json({ message: 'Request not found.' });

  request.status = 'accepted';
  await request.save();

  const [userOne, userTwo] = orderedPair(request.sender, request.receiver);
  await Connection.findOneAndUpdate({ userOne, userTwo }, { userOne, userTwo }, { upsert: true, new: true });
  await Notification.create({ user: request.sender, actor: req.user._id, type: 'connection', message: `${req.user.fullName} accepted your connection request.` });

  res.json({ message: 'Connection request accepted.' });
});

export const rejectRequest = asyncHandler(async (req, res) => {
  const request = await ConnectionRequest.findOne({ _id: req.params.requestId, receiver: req.user._id, status: 'pending' });
  if (!request) return res.status(404).json({ message: 'Request not found.' });
  request.status = 'rejected';
  await request.save();
  res.json({ message: 'Connection request rejected.' });
});

export const cancelRequest = asyncHandler(async (req, res) => {
  await ConnectionRequest.deleteOne({ sender: req.user._id, receiver: req.params.receiverId, status: 'pending' });
  res.json({ message: 'Connection request cancelled.' });
});

export const removeConnection = asyncHandler(async (req, res) => {
  await Connection.deleteOne({
    $or: [
      { userOne: req.user._id, userTwo: req.params.userId },
      { userOne: req.params.userId, userTwo: req.user._id }
    ]
  });
  res.json({ message: 'Connection removed.' });
});
