import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/login/phone', AuthController.loginWithPhone);
router.post('/refresh', AuthController.refreshToken);
router.post('/oauth', AuthController.thirdPartyLogin);

// Protected routes
router.use(authenticate);
router.get('/profile', AuthController.getProfile);
router.post('/logout', AuthController.logout);

export default router;
