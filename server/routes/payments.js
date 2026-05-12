import { Router } from 'express';
import { makePayment, getPayments, getStudentPayments } from '../controllers/paymentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, authorize('student'), makePayment);
router.get('/', authenticate, getPayments);
router.get('/student/:studentId', authenticate, authorize('bursary', 'admin'), getStudentPayments);

export default router;
