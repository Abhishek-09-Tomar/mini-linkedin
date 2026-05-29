import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized. Token missing.');
  }

  const token = header.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-passwordHash -otpHash');

  if (!user || user.status !== 'active') {
    res.status(401);
    throw new Error('Not authorized. User not found.');
  }

  req.user = user;
  next();
});
