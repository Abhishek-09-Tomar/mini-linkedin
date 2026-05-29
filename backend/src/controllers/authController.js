import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateToken } from '../utils/generateToken.js';
import { toPublicPath } from '../utils/fileHelpers.js';

const publicUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  mobile: user.mobile,
  email: user.email,
  profession: user.profession,
  professionalSummary: user.professionalSummary,
  about: user.about,
  skills: user.skills,
  education: user.education,
  experience: user.experience,
  college: user.college,
  company: user.company,
  location: user.location,
  profileImage: user.profileImage,
  coverImage: user.coverImage,
  isVerified: user.isVerified,
  createdAt: user.createdAt
});

const createOtp = async (user, purpose) => {
  const otp = String(Math.floor(100000 + Math.random() * 900000));
  const salt = await bcrypt.genSalt(10);
  user.otpHash = await bcrypt.hash(otp, salt);
  user.otpPurpose = purpose;
  user.otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  return otp;
};

export const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: errors.array()[0].msg });

  const {
    fullName, mobile, email, password, profession, professionalSummary,
    about, skills, college, company, location, education, experience
  } = req.body;

  const exists = await User.findOne({ $or: [{ email: email.toLowerCase() }, { mobile }] });
  if (exists) return res.status(409).json({ message: 'Email or mobile number is already registered.' });

  const skillsArray = typeof skills === 'string'
    ? skills.split(',').map((skill) => skill.trim()).filter(Boolean)
    : [];

  const user = await User.create({
    fullName,
    mobile,
    email,
    passwordHash: password,
    profession,
    professionalSummary,
    about: about || professionalSummary,
    skills: skillsArray,
    college,
    company,
    location,
    education,
    experience,
    profileImage: toPublicPath(req.file) || '/default-avatar.svg',
    isVerified: false
  });

  const devOtp = await createOtp(user, 'signup');

  await Notification.create({
    user: user._id,
    type: 'welcome',
    message: 'Welcome to Mini LinkedIn. Complete your profile and start networking.'
  });

  res.status(201).json({
    message: 'Signup successful. Verify OTP to continue.',
    userId: user._id,
    devOtp: process.env.APP_ENV === 'development' ? devOtp : undefined
  });
});

export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;
  const user = await User.findById(userId).select('+otpHash');
  if (!user) return res.status(404).json({ message: 'User not found.' });
  if (!user.otpHash || user.otpPurpose !== 'signup') return res.status(400).json({ message: 'No signup OTP found.' });
  if (user.otpExpiresAt && user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired.' });

  const ok = await bcrypt.compare(String(otp), user.otpHash);
  if (!ok) return res.status(400).json({ message: 'Invalid OTP.' });

  user.isVerified = true;
  user.otpHash = null;
  user.otpPurpose = null;
  user.otpExpiresAt = null;
  await user.save();

  res.json({
    token: generateToken(user._id),
    user: publicUser(user)
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email).toLowerCase(), status: 'active' });

  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password.' });
  }

  if (!user.isVerified) {
    const devOtp = await createOtp(user, 'signup');
    return res.status(403).json({
      message: 'Account is not verified. Verify OTP first.',
      userId: user._id,
      devOtp: process.env.APP_ENV === 'development' ? devOtp : undefined
    });
  }

  res.json({ token: generateToken(user._id), user: publicUser(user) });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json(publicUser(req.user));
});

export const deleteMyAccount = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { status: 'deleted', email: `deleted-${Date.now()}-${req.user.email}` });
  res.json({ message: 'Account deleted successfully.' });
});
