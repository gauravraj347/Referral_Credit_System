import { Router } from 'express';
import { requireAuth } from '../middleware';
import { dashboard } from '../controllers/dashboardController';

const router = Router();

router.get('/', requireAuth, dashboard);

export default router;



