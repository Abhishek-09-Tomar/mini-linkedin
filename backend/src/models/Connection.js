import mongoose from 'mongoose';

const connectionSchema = new mongoose.Schema({
  userOne: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  userTwo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }
}, { timestamps: true });

connectionSchema.index({ userOne: 1, userTwo: 1 }, { unique: true });

const Connection = mongoose.model('Connection', connectionSchema);
export default Connection;
