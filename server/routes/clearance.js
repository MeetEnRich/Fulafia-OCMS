import { Router } from 'express';
import { getMyClearance, applyForClearance, getPendingRequests, updateClearance } from '../controllers/clearanceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Student gets their own clearance status
router.get('/', authenticate, authorize('student'), getMyClearance);

// Student applies for clearance
router.post('/apply', authenticate, authorize('student'), applyForClearance);

// Staff gets pending requests for their department
router.get('/pending', authenticate, authorize('bursary', 'library', 'hod', 'student_affairs'), getPendingRequests);

// Staff approves/rejects clearance
router.put('/:dept', authenticate, authorize('bursary', 'library', 'hod', 'student_affairs'), updateClearance);

export default router;
