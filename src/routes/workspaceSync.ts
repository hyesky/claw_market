import { Router } from 'express';
import { WorkspaceSyncController } from '../controllers/workspaceSyncController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Sync endpoints
router.post('/sync', WorkspaceSyncController.syncToWorkspace);
router.post('/bundle', WorkspaceSyncController.syncBundle);
router.get('/verify', WorkspaceSyncController.verifySync);
router.get('/user/syncs', WorkspaceSyncController.getUserSyncs);

export default router;
