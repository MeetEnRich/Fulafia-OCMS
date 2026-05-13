import { Router } from 'express';
import { login, getProfile, changePassword } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.get('/me', authenticate, getProfile);
router.put('/change-password', authenticate, changePassword);

export default router;
