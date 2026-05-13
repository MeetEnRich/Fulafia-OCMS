import db from '../config/db.js';
import { ROLE_LABELS } from '../utils/helpers.js';

/**
 * POST /api/tickets
 * Student creates a support ticket for a department
 */
export function createTicket(req, res) {
  const { department, subject, message } = req.body;
  const studentId = req.user.user_id;

  if (!department || !subject || !message) {
    return res.status(400).json({ error: 'Department, subject, and message are required.' });
  }

  db.prepare(`
    INSERT INTO tickets (student_id, department, subject, message)
    VALUES (?, ?, ?, ?)
  `).run(studentId, department, subject.trim(), message.trim());

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, department, details) VALUES (?, ?, ?, ?, ?)'
  ).run(studentId, 'TICKET_CREATED', studentId, department, `Subject: ${subject}`);

  return res.json({ message: 'Support ticket submitted successfully.' });
}

/**
 * GET /api/tickets
 * Get tickets — students see their own, staff see their department's
 */
export function getTickets(req, res) {
  let tickets;

  if (req.user.role === 'student') {
    tickets = db.prepare(`
      SELECT t.*, u.full_name as replied_by_name
      FROM tickets t
      LEFT JOIN users u ON t.replied_by = u.user_id
      WHERE t.student_id = ?
      ORDER BY t.created_at DESC
    `).all(req.user.user_id);
  } else {
    // Staff sees tickets for their department
    tickets = db.prepare(`
      SELECT t.*, su.full_name as student_name, su.department as student_dept,
             ru.full_name as replied_by_name
      FROM tickets t
      JOIN users su ON t.student_id = su.user_id
      LEFT JOIN users ru ON t.replied_by = ru.user_id
      WHERE t.department = ?
      ORDER BY CASE t.status WHEN 'open' THEN 0 ELSE 1 END, t.created_at DESC
    `).all(req.user.role);
  }

  return res.json({ tickets });
}

/**
 * PUT /api/tickets/:id/reply
 * Staff replies to and closes a ticket
 */
export function replyToTicket(req, res) {
  const { id } = req.params;
  const { reply } = req.body;

  if (!reply || !reply.trim()) {
    return res.status(400).json({ error: 'Reply message is required.' });
  }

  const ticket = db.prepare('SELECT * FROM tickets WHERE id = ?').get(id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  if (ticket.department !== req.user.role) {
    return res.status(403).json({ error: 'You can only reply to tickets for your department.' });
  }

  db.prepare(`
    UPDATE tickets SET staff_reply = ?, replied_by = ?, replied_at = datetime('now'), status = 'closed'
    WHERE id = ?
  `).run(reply.trim(), req.user.user_id, id);

  // Notify student
  const deptLabel = ROLE_LABELS[req.user.role] || req.user.role;
  db.prepare(
    'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)'
  ).run(ticket.student_id, `${deptLabel} has responded to your enquiry: "${ticket.subject}"`, 'info');

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, department, details) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.user_id, 'TICKET_REPLIED', ticket.student_id, req.user.role, `Replied to ticket: ${ticket.subject}`);

  return res.json({ message: 'Reply sent and ticket closed.' });
}
