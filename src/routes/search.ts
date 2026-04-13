import { Router } from 'express';
import { SearchController } from '../controllers/searchController';

const router = Router();

// Public routes
router.get('/', SearchController.search);
router.get('/suggestions', SearchController.suggestions);
router.get('/filters', SearchController.filters);
router.get('/popular', SearchController.popular);

export default router;
