import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

/**
 * POST /api/auth/login
 */
export function login(req, res) {
  const { userId, password } = req.body;

  if (!userId || !password) {
    return res.status(400).json({ error: 'User ID and password are required.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE user_id = ?').get(userId.trim());
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
  }

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
  }

  const token = jwt.sign(
    { id: user.id, userId: user.user_id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Log the action
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, details) VALUES (?, ?, ?)'
  ).run(user.user_id, 'LOGIN', `${user.full_name} logged in`);

  // Build response based on role
  const profile = {
    id: user.id,
    userId: user.user_id,
    role: user.role,
    fullName: user.full_name,
    department: user.department,
  };

  // Add student-specific fields
  if (user.role === 'student') {
    const student = db.prepare('SELECT faculty, level, session FROM students WHERE user_id = ?').get(user.user_id);
    if (student) {
      profile.faculty = student.faculty;
      profile.level = student.level;
      profile.session = student.session;
    }
  }

  return res.json({ token, user: profile });
}

/**
 * GET /api/auth/me
 */
export function getProfile(req, res) {
  const user = db.prepare('SELECT id, user_id, role, full_name, department FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const profile = {
    id: user.id,
    userId: user.user_id,
    role: user.role,
    fullName: user.full_name,
    department: user.department,
  };

  if (user.role === 'student') {
    const student = db.prepare('SELECT faculty, level, session FROM students WHERE user_id = ?').get(user.user_id);
    if (student) {
      profile.faculty = student.faculty;
      profile.level = student.level;
      profile.session = student.session;
    }
  }

  return res.json({ user: profile });
}

/**
 * PUT /api/auth/change-password
 */
export function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current and new passwords are required.' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters.' });
  }

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  const valid = bcrypt.compareSync(currentPassword, user.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Current password is incorrect.' });
  }

  const newHash = bcrypt.hashSync(newPassword, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(newHash, req.user.id);

  // Audit log
  db.prepare(
    'INSERT INTO audit_log (actor_id, action, details) VALUES (?, ?, ?)'
  ).run(user.user_id, 'PASSWORD_CHANGED', `${user.full_name} changed their password`);

  return res.json({ message: 'Password changed successfully.' });
}
