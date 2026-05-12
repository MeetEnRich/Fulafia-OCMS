import { Router } from 'express';
import { listStudents, getStudent } from '../controllers/studentController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', authenticate, authorize('bursary', 'library', 'hod', 'student_affairs', 'admin'), listStudents);
router.get('/:userId', authenticate, getStudent);

export default router;
