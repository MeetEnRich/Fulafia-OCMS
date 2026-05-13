import { Router } from 'express';
import { listStudents, getStudent } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const STAFF_ROLES = ['bursary', 'library', 'department', 'faculty', 'clinic', 'hostel', 'student_affairs', 'admin'];

const router = Router();

router.get('/', authenticate, authorize(...STAFF_ROLES), listStudents);
router.get('/:userId', authenticate, getStudent);

export default router;
