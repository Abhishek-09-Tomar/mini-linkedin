import express from 'express';
import { getUserProfile, searchUsers, updateMyProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/:id', protect, getUserProfile);
router.patch('/me/profile', protect, upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'coverImage', maxCount: 1 }
]), updateMyProfile);

export default router;
