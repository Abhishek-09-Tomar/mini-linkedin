import express from 'express';
import { acceptRequest, cancelRequest, getConnections, rejectRequest, removeConnection, sendRequest } from '../controllers/connectionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getConnections);
router.post('/request/:receiverId', protect, sendRequest);
router.patch('/:requestId/accept', protect, acceptRequest);
router.patch('/:requestId/reject', protect, rejectRequest);
router.delete('/request/:receiverId/cancel', protect, cancelRequest);
router.delete('/:userId/remove', protect, removeConnection);

export default router;
