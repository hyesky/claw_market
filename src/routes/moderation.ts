import { Router } from 'express';
import { ModerationController } from '../controllers/moderationController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes (anyone can flag)
router.post('/product/:product_id/flag', authenticate, ModerationController.flagContent);
router.get('/product/:product_id/history', ModerationController.getHistory);

// Protected routes
router.use(authenticate);

// Scan endpoint
router.post('/scan', ModerationController.scan);
router.post('/auto-moderate', ModerationController.autoModerate);

// Admin routes
router.use(requireAdmin);
router.get('/queue', ModerationController.getQueue);
router.post('/:id/approve', ModerationController.approve);
router.post('/:id/reject', ModerationController.reject);

export default router;
