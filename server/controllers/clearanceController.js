import db from '../config/db.js';
import { CLEARANCE_DEPARTMENTS, ROLE_LABELS, DEPT_STAFF_MAP, TOTAL_DEPARTMENTS } from '../utils/helpers.js';

/**
 * GET /api/clearance
 * Get clearance status for the logged-in student
 */
export function getMyClearance(req, res) {
  const clearances = db.prepare(`
    SELECT cr.department, cr.status, cr.comment, cr.reviewed_at, cr.created_at,
           u.full_name as reviewer_name
    FROM clearance_requests cr
    LEFT JOIN users u ON cr.reviewed_by = u.user_id
    WHERE cr.student_id = ?
    ORDER BY CASE cr.department
      WHEN 'bursary' THEN 1
      WHEN 'library' THEN 2
      WHEN 'department' THEN 3
      WHEN 'faculty' THEN 4
      WHEN 'clinic' THEN 5
      WHEN 'hostel' THEN 6
      WHEN 'student_affairs' THEN 7
      ELSE 8
    END
  `).all(req.user.user_id);

  // Returns actual clearance records (empty if student hasn't applied yet)
  return res.json({ clearances });
}

/**
 * POST /api/clearance/apply
 * Student initiates clearance process — creates pending rows for all 7 departments
 */
export function applyForClearance(req, res) {
  const studentId = req.user.user_id;

  // Check if already applied
  const existing = db.prepare('SELECT id FROM clearance_requests WHERE student_id = ?').get(studentId);
  if (existing) {
    return res.status(400).json({ error: 'You have already applied for clearance.' });
  }

  // Create pending clearance rows for all departments
  const insertClearance = db.prepare(
    'INSERT INTO clearance_requests (student_id, department, status) VALUES (?, ?, ?)'
  );
  CLEARANCE_DEPARTMENTS.forEach(dept => insertClearance.run(studentId, dept, 'pending'));

  // Notify each department officer
  const insertNotif = db.prepare('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)');
  CLEARANCE_DEPARTMENTS.forEach(dept => {
    const staffId = DEPT_STAFF_MAP[dept];
    if (staffId) {
      insertNotif.run(staffId, `New clearance request from ${req.user.full_name} (${studentId}).`, 'info');
    }
  });

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, details) VALUES (?, ?, ?, ?)'
  ).run(studentId, 'CLEARANCE_APPLIED', studentId, 'Student initiated clearance process');

  return res.json({ message: 'Clearance application submitted successfully.' });
}

/**
 * POST /api/clearance/bulk-approve
 * Staff approves multiple students at once
 */
export function bulkApprove(req, res) {
  const { studentIds, comment } = req.body;
  const staffRole = req.user.role;

  if (!CLEARANCE_DEPARTMENTS.includes(staffRole)) {
    return res.status(403).json({ error: 'Not a departmental officer' });
  }

  if (!Array.isArray(studentIds) || studentIds.length === 0) {
    return res.status(400).json({ error: 'No students selected.' });
  }

  let approved = 0;
  const updateStmt = db.prepare(`
    UPDATE clearance_requests
    SET status = 'cleared', comment = ?, reviewed_by = ?, reviewed_at = datetime('now')
    WHERE student_id = ? AND department = ? AND status = 'pending'
  `);
  const insertNotif = db.prepare('INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)');
  const insertAudit = db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, department, details) VALUES (?, ?, ?, ?, ?)'
  );

  const deptLabel = ROLE_LABELS[staffRole] || staffRole;

  studentIds.forEach(sid => {
    const result = updateStmt.run(comment || 'Bulk approved.', req.user.user_id, sid, staffRole);
    if (result.changes > 0) {
      approved++;
      insertNotif.run(sid, `Your ${deptLabel} clearance has been approved by ${req.user.full_name}.`, 'success');
      insertAudit.run(req.user.user_id, 'CLEARANCE_APPROVED', sid, staffRole, comment || 'Bulk approved.');
    }
  });

  return res.json({ message: `${approved} student(s) approved successfully.` });
}

/**
 * GET /api/clearance/pending
 * Get students pending clearance for the logged-in staff's department
 */
export function getPendingRequests(req, res) {
  const staffRole = req.user.role;

  // Map staff role to department
  if (!CLEARANCE_DEPARTMENTS.includes(staffRole)) {
    return res.status(403).json({ error: 'Not a departmental officer' });
  }

  const pending = db.prepare(`
    SELECT cr.id, cr.student_id, cr.status, cr.comment, cr.reviewed_by, cr.reviewed_at, cr.created_at,
           u.full_name as student_name, u.department as student_dept,
           s.faculty, s.level
    FROM clearance_requests cr
    JOIN users u ON cr.student_id = u.user_id
    JOIN students s ON cr.student_id = s.user_id
    WHERE cr.department = ?
    ORDER BY
      CASE cr.status
        WHEN 'pending' THEN 0
        WHEN 'rejected' THEN 1
        WHEN 'cleared' THEN 2
      END,
      cr.created_at DESC
  `).all(staffRole);

  return res.json({ requests: pending });
}

/**
 * PUT /api/clearance/:dept
 * Approve or reject a student's clearance
 */
export function updateClearance(req, res) {
  const { dept } = req.params;
  const { studentId, status, comment } = req.body;
  const staffRole = req.user.role;

  // Validate
  if (staffRole !== dept) {
    return res.status(403).json({ error: 'You can only manage clearances for your own department.' });
  }

  if (!['cleared', 'rejected'].includes(status)) {
    return res.status(400).json({ error: 'Status must be "cleared" or "rejected".' });
  }

  if (status === 'rejected' && (!comment || !comment.trim())) {
    return res.status(400).json({ error: 'A comment is required for rejection.' });
  }

  // Check student exists
  const student = db.prepare('SELECT user_id, full_name FROM users WHERE user_id = ? AND role = ?').get(studentId, 'student');
  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  // Update clearance
  const existing = db.prepare(
    'SELECT id FROM clearance_requests WHERE student_id = ? AND department = ?'
  ).get(studentId, dept);

  if (existing) {
    db.prepare(`
      UPDATE clearance_requests
      SET status = ?, comment = ?, reviewed_by = ?, reviewed_at = datetime('now')
      WHERE student_id = ? AND department = ?
    `).run(status, comment || (status === 'cleared' ? 'All requirements satisfied.' : ''), req.user.user_id, studentId, dept);
  } else {
    db.prepare(`
      INSERT INTO clearance_requests (student_id, department, status, comment, reviewed_by, reviewed_at)
      VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).run(studentId, dept, status, comment || '', req.user.user_id);
  }

  // Create notification for student
  const deptLabel = ROLE_LABELS[dept] || dept;
  const notifMsg = status === 'cleared'
    ? `Your ${deptLabel} clearance has been approved by ${req.user.full_name}.`
    : `Your ${deptLabel} clearance has been rejected: "${comment}"`;

  db.prepare(
    'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)'
  ).run(studentId, notifMsg, status === 'cleared' ? 'success' : 'danger');

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, department, details) VALUES (?, ?, ?, ?, ?)'
  ).run(req.user.user_id, status === 'cleared' ? 'CLEARANCE_APPROVED' : 'CLEARANCE_REJECTED', studentId, dept, comment || '');

  return res.json({ message: `Clearance ${status} successfully.` });
}
