import { Router } from 'express';
import { getStats, getAuditLog, getUsers, createUser, updateUser, resetPassword, getNotifications, markNotificationRead, getCertificate, verifyBioData } from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/stats', authenticate, authorize('admin'), getStats);
router.get('/audit', authenticate, authorize('admin'), getAuditLog);
router.get('/users', authenticate, authorize('admin'), getUsers);
router.post('/users', authenticate, authorize('admin'), createUser);
router.put('/users/:id', authenticate, authorize('admin'), updateUser);
router.post('/users/:id/reset-password', authenticate, authorize('admin'), resetPassword);
router.get('/notifications', authenticate, getNotifications);
router.put('/notifications/:id/read', authenticate, markNotificationRead);
router.get('/certificate/:studentId', authenticate, getCertificate);
router.put('/students/:userId/verify-bio', authenticate, authorize('student'), verifyBioData);

export default router;
