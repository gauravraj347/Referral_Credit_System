import { Router } from 'express';
import { requireAuth } from '../middleware';
import { purchase } from '../controllers/purchaseController';

const router = Router();

router.post('/', requireAuth, purchase);

export default router;



