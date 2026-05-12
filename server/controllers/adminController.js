import db from '../config/db.js';
import bcrypt from 'bcryptjs';

const DEFAULT_PASSWORD = 'password123';

/**
 * GET /api/stats
 * Dashboard statistics for admin
 */
export function getStats(req, res) {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get().count;

  const fullyClearedResult = db.prepare(`
    SELECT COUNT(DISTINCT student_id) as count
    FROM clearance_requests
    WHERE student_id IN (
      SELECT student_id FROM clearance_requests
      GROUP BY student_id
      HAVING COUNT(CASE WHEN status = 'cleared' THEN 1 END) = 4
    )
  `).get();
  const fullyCleared = fullyClearedResult ? fullyClearedResult.count : 0;

  const deptStats = db.prepare(`
    SELECT department,
      COUNT(CASE WHEN status = 'cleared' THEN 1 END) as cleared,
      COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
      COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
    FROM clearance_requests
    GROUP BY department
  `).all();

  const totalPayments = db.prepare("SELECT COALESCE(SUM(amount), 0) as total FROM payments WHERE status = 'success'").get().total;

  return res.json({
    stats: {
      totalStudents,
      fullyCleared,
      inProgress: totalStudents - fullyCleared,
      deptStats,
      totalPayments,
    },
  });
}

/**
 * GET /api/audit
 * Full audit log
 */
export function getAuditLog(req, res) {
  const logs = db.prepare(`
    SELECT a.id, a.actor_id, a.action, a.target_student, a.department, a.details, a.created_at,
           u.full_name as actor_name, u.role as actor_role
    FROM audit_log a
    JOIN users u ON a.actor_id = u.user_id
    ORDER BY a.created_at DESC
    LIMIT 100
  `).all();

  return res.json({ logs });
}

/**
 * GET /api/users
 * List all users for admin management
 */
export function getUsers(req, res) {
  const users = db.prepare(`
    SELECT u.id, u.user_id, u.role, u.full_name, u.department, u.created_at,
           s.faculty, s.level
    FROM users u
    LEFT JOIN students s ON u.user_id = s.user_id
    ORDER BY u.role, u.full_name
  `).all();

  return res.json({ users });
}

/**
 * POST /api/users
 * Create a new user (admin only)
 */
export function createUser(req, res) {
  const { userId, fullName, role, department, faculty, level, session } = req.body;

  if (!userId || !fullName || !role || !department) {
    return res.status(400).json({ error: 'User ID, Full Name, Role, and Department are required.' });
  }

  const validRoles = ['student', 'bursary', 'library', 'hod', 'student_affairs', 'admin'];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: 'Invalid role.' });
  }

  // Check if user_id already exists
  const existing = db.prepare('SELECT id FROM users WHERE user_id = ?').get(userId.trim());
  if (existing) {
    return res.status(409).json({ error: 'A user with this ID already exists.' });
  }

  const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

  db.prepare(
    'INSERT INTO users (user_id, password_hash, role, full_name, department) VALUES (?, ?, ?, ?, ?)'
  ).run(userId.trim(), hash, role, fullName.trim(), department.trim());

  // If student, also insert into students table
  if (role === 'student') {
    db.prepare(
      'INSERT INTO students (user_id, faculty, level, session) VALUES (?, ?, ?, ?)'
    ).run(userId.trim(), faculty || '', level || '', session || '2024/2025');

    // Create pending clearance rows for all departments
    const depts = ['bursary', 'library', 'hod', 'student_affairs'];
    const insertClearance = db.prepare(
      'INSERT INTO clearance_requests (student_id, department, status) VALUES (?, ?, ?)'
    );
    depts.forEach(d => insertClearance.run(userId.trim(), d, 'pending'));
  }

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, details) VALUES (?, ?, ?, ?)'
  ).run(req.user.user_id, 'USER_CREATED', userId.trim(), `Created ${role} account for ${fullName}`);

  return res.json({ message: `User created successfully. Default password: ${DEFAULT_PASSWORD}` });
}

/**
 * PUT /api/users/:id
 * Edit user profile (admin only)
 */
export function updateUser(req, res) {
  const targetUserId = req.params.id;
  const { fullName, department, faculty, level } = req.body;

  const user = db.prepare('SELECT id, role, user_id FROM users WHERE user_id = ?').get(targetUserId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  if (fullName) {
    db.prepare('UPDATE users SET full_name = ? WHERE user_id = ?').run(fullName.trim(), targetUserId);
  }
  if (department) {
    db.prepare('UPDATE users SET department = ? WHERE user_id = ?').run(department.trim(), targetUserId);
  }

  // Update student-specific fields
  if (user.role === 'student') {
    if (faculty) {
      db.prepare('UPDATE students SET faculty = ? WHERE user_id = ?').run(faculty.trim(), targetUserId);
    }
    if (level) {
      db.prepare('UPDATE students SET level = ? WHERE user_id = ?').run(level.trim(), targetUserId);
    }
  }

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, details) VALUES (?, ?, ?, ?)'
  ).run(req.user.user_id, 'USER_UPDATED', targetUserId, `Updated profile for ${fullName || targetUserId}`);

  return res.json({ message: 'User updated successfully.' });
}

/**
 * POST /api/users/:id/reset-password
 * Reset a user's password to default (admin only)
 */
export function resetPassword(req, res) {
  const targetUserId = req.params.id;

  const user = db.prepare('SELECT id, full_name FROM users WHERE user_id = ?').get(targetUserId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const hash = bcrypt.hashSync(DEFAULT_PASSWORD, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE user_id = ?').run(hash, targetUserId);

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, target_student, details) VALUES (?, ?, ?, ?)'
  ).run(req.user.user_id, 'PASSWORD_RESET', targetUserId, `Password reset for ${user.full_name}`);

  return res.json({ message: `Password has been reset to "${DEFAULT_PASSWORD}" for ${user.full_name}.` });
}

/**
 * GET /api/notifications
 * Get notifications for current user
 */
export function getNotifications(req, res) {
  const notifications = db.prepare(
    'SELECT id, message, type, is_read, created_at FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(req.user.user_id);

  return res.json({ notifications });
}

/**
 * PUT /api/notifications/:id/read
 * Mark a notification as read
 */
export function markNotificationRead(req, res) {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?').run(req.params.id, req.user.user_id);
  return res.json({ message: 'Marked as read.' });
}

/**
 * GET /api/certificate/:studentId
 * Get certificate data if student is fully cleared
 */
export function getCertificate(req, res) {
  const studentId = req.params.studentId;

  // Check if current user is the student or an admin
  if (req.user.role === 'student' && req.user.user_id !== studentId) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  const student = db.prepare(`
    SELECT u.user_id, u.full_name, u.department, s.faculty, s.level, s.session
    FROM users u JOIN students s ON u.user_id = s.user_id
    WHERE u.user_id = ?
  `).get(studentId);

  if (!student) {
    return res.status(404).json({ error: 'Student not found.' });
  }

  const clearances = db.prepare(
    'SELECT department, status, comment, reviewed_by, reviewed_at FROM clearance_requests WHERE student_id = ?'
  ).all(studentId);

  const allCleared = clearances.length === 4 && clearances.every(c => c.status === 'cleared');

  if (!allCleared) {
    return res.status(400).json({
      error: 'Student has not been fully cleared by all departments.',
      clearances,
    });
  }

  // Get reviewer names
  const clearanceDetails = clearances.map(c => {
    const reviewer = db.prepare('SELECT full_name FROM users WHERE user_id = ?').get(c.reviewed_by);
    return { ...c, reviewer_name: reviewer ? reviewer.full_name : 'Unknown' };
  });

  const year = new Date().getFullYear();
  const certNo = `FUL/CLR/${year}/${student.user_id.split('/').pop()}`;

  return res.json({
    certificate: {
      certNo,
      student,
      clearances: clearanceDetails,
      issuedAt: new Date().toISOString(),
    },
  });
}
