import { Router } from 'express';
import auth from './auth';
import purchase from './purchase';
import dashboard from './dashboard';

const router = Router();

router.use('/auth', auth);
router.use('/purchase', purchase);
router.use('/dashboard', dashboard);

export default router;



