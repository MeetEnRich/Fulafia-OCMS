import db from '../config/db.js';

/**
 * GET /api/students
 * List all students (for staff/admin)
 */
export function listStudents(req, res) {
  const students = db.prepare(`
    SELECT u.user_id, u.full_name, u.department, s.faculty, s.level, s.session
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    WHERE u.role = 'student'
    ORDER BY u.full_name
  `).all();

  // Attach clearance summary to each student
  const result = students.map(stu => {
    const clearances = db.prepare(
      'SELECT department, status, comment, reviewed_by, reviewed_at FROM clearance_requests WHERE student_id = ?'
    ).all(stu.user_id);

    const payments = db.prepare(
      'SELECT COUNT(*) as count FROM payments WHERE student_id = ? AND status = ?'
    ).get(stu.user_id, 'success');

    return {
      ...stu,
      clearances,
      paymentCount: payments.count,
      clearedCount: clearances.filter(c => c.status === 'cleared').length,
      totalDepts: 4,
    };
  });

  return res.json({ students: result });
}

/**
 * GET /api/students/:userId
 * Get a single student's full details
 */
export function getStudent(req, res) {
  const { userId } = req.params;

  const user = db.prepare(`
    SELECT u.user_id, u.full_name, u.department, s.faculty, s.level, s.session
    FROM users u
    JOIN students s ON u.user_id = s.user_id
    WHERE u.user_id = ? AND u.role = 'student'
  `).get(userId);

  if (!user) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const clearances = db.prepare(
    'SELECT department, status, comment, reviewed_by, reviewed_at, created_at FROM clearance_requests WHERE student_id = ? ORDER BY created_at'
  ).all(userId);

  const payments = db.prepare(
    'SELECT reference_no, fee_type, amount, card_last_four, status, paid_at FROM payments WHERE student_id = ? ORDER BY paid_at DESC'
  ).all(userId);

  return res.json({ student: { ...user, clearances, payments } });
}
