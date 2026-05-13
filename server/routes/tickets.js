import { Router } from 'express';
import { createTicket, getTickets, replyToTicket } from '../controllers/ticketController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const STAFF_ROLES = ['bursary', 'library', 'department', 'faculty', 'clinic', 'hostel', 'student_affairs'];

const router = Router();

// Student creates a ticket
router.post('/', authenticate, authorize('student'), createTicket);

// Get tickets (students see theirs, staff sees their dept)
router.get('/', authenticate, getTickets);

// Staff replies to a ticket
router.put('/:id/reply', authenticate, authorize(...STAFF_ROLES), replyToTicket);

export default router;
