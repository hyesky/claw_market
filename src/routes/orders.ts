import { Router } from 'express';
import { OrderController } from '../controllers/orderController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(authenticate);

router.post('/', OrderController.create);
router.get('/', OrderController.list);
router.get('/:id', OrderController.get);
router.post('/:id/pay', OrderController.processPayment);
router.post('/:id/refund', OrderController.refund);

// Admin routes
router.get('/statistics', requireAdmin, OrderController.getStatistics);

export default router;
