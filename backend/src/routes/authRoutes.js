import express from 'express';
import { body } from 'express-validator';
import { deleteMyAccount, getMe, loginUser, registerUser, verifyOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/register', upload.single('profileImage'), [
  body('fullName').trim().notEmpty().withMessage('Full name is required.'),
  body('mobile').matches(/^[0-9]{10,15}$/).withMessage('Mobile number must contain 10 to 15 digits.'),
  body('email').isEmail().withMessage('Valid email is required.'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
  body('profession').trim().notEmpty().withMessage('Profession is required.'),
  body('professionalSummary').trim().notEmpty().withMessage('Professional summary is required.')
], registerUser);

router.post('/verify-otp', verifyOtp);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.delete('/me', protect, deleteMyAccount);

export default router;
