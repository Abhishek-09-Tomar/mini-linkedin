import express from 'express'
import {
  updateProfile,
  getUserProfile,
  followUser
} from '../controllers/userController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// update profile
router.put('/profile', protect, updateProfile)

// get user profile
router.get('/:id', protect, getUserProfile)

// follow/unfollow
router.put('/follow/:id', protect, followUser)

export default router
