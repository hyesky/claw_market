import { Router } from 'express';
import { CreatorController } from '../controllers/creatorController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Protected routes
router.use(authenticate);

router.post('/verify', CreatorController.verifyIdentity);
router.post('/bind-workspace', CreatorController.bindWorkspace);
router.post('/verify-workspace', CreatorController.verifyWorkspace);
router.post('/upgrade', CreatorController.upgradeToCreator);
router.get('/status', CreatorController.getStatus);
router.post('/unbind-workspace', CreatorController.unbindWorkspace);

export default router;
