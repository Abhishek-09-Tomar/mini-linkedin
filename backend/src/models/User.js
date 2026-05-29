import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, index: true },
  mobile: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  profession: { type: String, required: true, trim: true, index: true },
  professionalSummary: { type: String, required: true, trim: true },
  about: { type: String, default: '' },
  skills: { type: [String], default: [] },
  education: { type: String, default: '' },
  experience: { type: String, default: '' },
  college: { type: String, default: '', index: true },
  company: { type: String, default: '', index: true },
  location: { type: String, default: '', index: true },
  profileImage: { type: String, default: '/default-avatar.svg' },
  coverImage: { type: String, default: '' },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, default: null },
  isVerified: { type: Boolean, default: false },
  status: { type: String, enum: ['active', 'deleted'], default: 'active', index: true },
  otpHash: { type: String, default: null, select: false },
  otpPurpose: { type: String, enum: ['signup', 'login', null], default: null },
  otpExpiresAt: { type: Date, default: null }
}, { timestamps: true });

userSchema.methods.matchPassword = async function matchPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('passwordHash')) return next();
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
