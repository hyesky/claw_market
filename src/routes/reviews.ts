import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/product/:product_id', ReviewController.get);
router.get('/product/:product_id/rating', ReviewController.getRating);

// Protected routes
router.use(authenticate);

router.post('/product/:product_id', ReviewController.submit);
router.get('/user', ReviewController.getUserReviews);
router.put('/:id', ReviewController.update);
router.delete('/:id', ReviewController.delete);

export default router;
