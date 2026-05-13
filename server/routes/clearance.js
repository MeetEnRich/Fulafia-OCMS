import { Router } from 'express';
import { getMyClearance, applyForClearance, getPendingRequests, updateClearance, bulkApprove } from '../controllers/clearanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const STAFF_ROLES = ['bursary', 'library', 'department', 'faculty', 'clinic', 'hostel', 'student_affairs'];

const router = Router();

// Student gets their own clearance status
router.get('/', authenticate, authorize('student'), getMyClearance);

// Student applies for clearance
router.post('/apply', authenticate, authorize('student'), applyForClearance);

// Staff gets pending requests for their department
router.get('/pending', authenticate, authorize(...STAFF_ROLES), getPendingRequests);

// Staff bulk approves students
router.post('/bulk-approve', authenticate, authorize(...STAFF_ROLES), bulkApprove);

// Staff approves/rejects clearance
router.put('/:dept', authenticate, authorize(...STAFF_ROLES), updateClearance);

export default router;
