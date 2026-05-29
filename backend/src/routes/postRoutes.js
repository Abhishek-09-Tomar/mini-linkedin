import express from 'express';
import { addComment, createPost, deletePost, getFeed, sharePost, toggleLike, updatePost } from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/feed', protect, getFeed);
router.post('/', protect, upload.single('postMedia'), createPost);
router.patch('/:id', protect, upload.single('postMedia'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.post('/:id/share', protect, sharePost);

export default router;
