import db from '../config/db.js';
import { generatePaymentRef } from '../utils/helpers.js';

/**
 * POST /api/payments
 * Process a payment (simulated gateway)
 */
export function makePayment(req, res) {
  const { feeType, amount, cardLastFour } = req.body;
  const studentId = req.user.user_id;

  if (!feeType || !amount) {
    return res.status(400).json({ error: 'Fee type and amount are required.' });
  }

  const ref = generatePaymentRef();

  db.prepare(`
    INSERT INTO payments (student_id, reference_no, fee_type, amount, card_last_four, status, paid_at)
    VALUES (?, ?, ?, ?, ?, 'success', datetime('now'))
  `).run(studentId, ref, feeType, amount, cardLastFour || '0000');

  // Create notification
  db.prepare(
    'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)'
  ).run(studentId, `Payment of ₦${Number(amount).toLocaleString()} successful. Ref: ${ref}`, 'success');

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, details) VALUES (?, ?, ?, ?)'
  ).run(studentId, 'PAYMENT_MADE', studentId, `${feeType} — ₦${Number(amount).toLocaleString()} — Ref: ${ref}`);

  const payment = db.prepare('SELECT * FROM payments WHERE reference_no = ?').get(ref);

  return res.json({
    message: 'Payment processed successfully.',
    payment: {
      referenceNo: payment.reference_no,
      feeType: payment.fee_type,
      amount: payment.amount,
      cardLastFour: payment.card_last_four,
      status: payment.status,
      paidAt: payment.paid_at,
    },
  });
}

/**
 * GET /api/payments
 * Get payment history
 */
export function getPayments(req, res) {
  let payments;

  if (req.user.role === 'student') {
    payments = db.prepare(
      'SELECT reference_no, fee_type, amount, card_last_four, status, paid_at FROM payments WHERE student_id = ? ORDER BY paid_at DESC'
    ).all(req.user.user_id);
  } else if (req.user.role === 'bursary' || req.user.role === 'admin') {
    // Bursary and admin can see all payments
    payments = db.prepare(`
      SELECT p.reference_no, p.fee_type, p.amount, p.card_last_four, p.status, p.paid_at,
             p.student_id, u.full_name as student_name
      FROM payments p
      JOIN users u ON p.student_id = u.user_id
      ORDER BY p.paid_at DESC
    `).all();
  } else {
    return res.status(403).json({ error: 'Access denied.' });
  }

  return res.json({ payments });
}

/**
 * GET /api/payments/student/:studentId
 * Get payments for a specific student (staff use)
 */
export function getStudentPayments(req, res) {
  const { studentId } = req.params;
  const payments = db.prepare(
    'SELECT reference_no, fee_type, amount, card_last_four, status, paid_at FROM payments WHERE student_id = ? ORDER BY paid_at DESC'
  ).all(studentId);

  return res.json({ payments });
}
