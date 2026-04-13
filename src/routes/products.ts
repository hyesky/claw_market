import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { authenticate, requireCreator } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', ProductController.list);
router.get('/:slug', ProductController.getBySlug);

// Protected routes
router.use(authenticate);

// Creator routes
router.post('/', requireCreator, ProductController.create);
router.put('/:id', requireCreator, ProductController.update);
router.delete('/:id', requireCreator, ProductController.delete);
router.post('/:id/publish', requireCreator, ProductController.publish);
router.post('/:id/archive', requireCreator, ProductController.archive);

// Version management
router.post('/:id/versions', requireCreator, ProductController.createVersion);
router.get('/:id/versions', ProductController.getVersions);
router.post('/:id/versions/:version/set-latest', requireCreator, ProductController.setLatest);

export default router;
