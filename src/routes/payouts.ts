import { Router } from 'express';
import { PayoutController } from '../controllers/payoutController';
import { authenticate, requireCreator, requireAdmin } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(authenticate);

router.get('/balance', PayoutController.getBalance);
router.post('/withdraw', PayoutController.requestWithdrawal);
router.get('/withdrawals', PayoutController.getWithdrawals);
router.get('/statement', PayoutController.getStatement);

// Admin routes
router.post('/withdrawals/:id/approve', requireAdmin, PayoutController.approveWithdrawal);
router.post('/withdrawals/:id/reject', requireAdmin, PayoutController.rejectWithdrawal);

export default router;
