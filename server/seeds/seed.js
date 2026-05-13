import { DatabaseSync } from 'node:sqlite';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbPath = path.resolve(__dirname, '..', process.env.DB_PATH || './database.sqlite');
const db = new DatabaseSync(dbPath);

db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

console.log('\n  Seeding FULafia OCMS Database (7-Department Architecture)...\n');

// ── Drop existing tables ──
db.exec(`
  DROP TABLE IF EXISTS tickets;
  DROP TABLE IF EXISTS notifications;
  DROP TABLE IF EXISTS audit_log;
  DROP TABLE IF EXISTS payments;
  DROP TABLE IF EXISTS clearance_requests;
  DROP TABLE IF EXISTS students;
  DROP TABLE IF EXISTS users;
`);

// ── Create tables ──
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('student','bursary','library','department','faculty','clinic','hostel','student_affairs','admin')),
    full_name TEXT NOT NULL,
    department TEXT,
    photo_url TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT UNIQUE NOT NULL,
    faculty TEXT,
    level TEXT,
    session TEXT,
    phone_number TEXT,
    address TEXT,
    bio_verified INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE clearance_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    department TEXT NOT NULL CHECK(department IN ('bursary','library','department','faculty','clinic','hostel','student_affairs')),
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending','cleared','rejected')),
    comment TEXT,
    reviewed_by TEXT,
    reviewed_at DATETIME,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES users(user_id),
    UNIQUE(student_id, department)
  );

  CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    reference_no TEXT UNIQUE NOT NULL,
    fee_type TEXT NOT NULL,
    amount REAL NOT NULL,
    card_last_four TEXT,
    status TEXT DEFAULT 'success' CHECK(status IN ('success','failed')),
    paid_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
  );

  CREATE TABLE audit_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    actor_id TEXT NOT NULL,
    action TEXT NOT NULL,
    target_student TEXT,
    department TEXT,
    details TEXT,
    created_at DATETIME DEFAULT (datetime('now'))
  );

  CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info' CHECK(type IN ('info','success','warning','danger')),
    is_read INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
  );

  CREATE TABLE tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT NOT NULL,
    department TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'open' CHECK(status IN ('open','closed')),
    staff_reply TEXT,
    replied_by TEXT,
    replied_at DATETIME,
    created_at DATETIME DEFAULT (datetime('now')),
    FOREIGN KEY (student_id) REFERENCES users(user_id)
  );
`);

console.log('  ✓ Tables created (7-department schema + tickets)');

// ── Hash passwords ──
const studentPwd = bcrypt.hashSync('student123', 10);
const staffPwd = bcrypt.hashSync('staff123', 10);
const adminPwd = bcrypt.hashSync('admin123', 10);

// ── Insert Staff & Admin Users ──
const insertUser = db.prepare(
  'INSERT INTO users (user_id, password_hash, role, full_name, department) VALUES (?, ?, ?, ?, ?)'
);

insertUser.run('BURS001', staffPwd, 'bursary', 'Mrs. Aisha Suleiman', 'Bursary');
insertUser.run('LIB001', staffPwd, 'library', 'Mr. Daniel Okeke', 'University Library');
insertUser.run('DEPT001', staffPwd, 'department', 'Dr. Fatima Aliyu', 'Computer Science');
insertUser.run('FAC001', staffPwd, 'faculty', 'Prof. Ibrahim Musa', 'Faculty of Computing');
insertUser.run('CLN001', staffPwd, 'clinic', 'Dr. Grace Adeyemi', 'University Clinic');
insertUser.run('HST001', staffPwd, 'hostel', 'Mr. Abdullahi Garba', 'Hostel Management');
insertUser.run('SA001', staffPwd, 'student_affairs', 'Mr. Chukwu Emeka', 'Student Affairs');
insertUser.run('ADMIN001', adminPwd, 'admin', 'Prof. Yusuf Bala', 'ICT Directorate');

console.log('  ✓ 7 Staff + 1 Admin users created');

// ── Insert Students ──
const insertStudent = db.prepare(
  'INSERT INTO students (user_id, faculty, level, session, phone_number, address) VALUES (?, ?, ?, ?, ?, ?)'
);

const students = [
  { userId: '2021/CP/CSC/0076', name: 'Mtser Emmanuel Terngu', dept: 'Computer Science', faculty: 'Computing', level: '400', session: '2024/2025', phone: '08012345678', address: 'Lafia, Nasarawa State' },
  { userId: '2021/CP/CSC/0042', name: 'Amina Bello Ibrahim', dept: 'Computer Science', faculty: 'Computing', level: '400', session: '2024/2025', phone: '08098765432', address: 'Keffi, Nasarawa State' },
  { userId: '2021/ENG/EEE/0043', name: 'Chinedu Okafor Sunday', dept: 'Electrical Engineering', faculty: 'Engineering', level: '400', session: '2024/2025', phone: '07011223344', address: 'Lafia, Nasarawa State' },
  { userId: '2020/CP/MIS/0018', name: 'Fatima Yusuf Abdullahi', dept: 'Management Info. Systems', faculty: 'Computing', level: '500', session: '2024/2025', phone: '09055667788', address: 'Akwanga, Nasarawa State' },
  { userId: '2021/SCI/PHY/0091', name: 'David Audu James', dept: 'Physics', faculty: 'Science', level: '400', session: '2024/2025', phone: '08133445566', address: 'Doma, Nasarawa State' },
  { userId: '2021/SCI/CHM/0055', name: 'Blessing Okonkwo', dept: 'Chemistry', faculty: 'Science', level: '400', session: '2024/2025', phone: '07044556677', address: 'Lafia, Nasarawa State' },
];

students.forEach(s => {
  insertUser.run(s.userId, studentPwd, 'student', s.name, s.dept);
  insertStudent.run(s.userId, s.faculty, s.level, s.session, s.phone, s.address);
});

console.log('  ✓ 6 Student accounts created');

// ── Insert Clearance Requests ──
const insertClearance = db.prepare(
  'INSERT INTO clearance_requests (student_id, department, status, comment, reviewed_by, reviewed_at) VALUES (?, ?, ?, ?, ?, ?)'
);

const depts = ['bursary', 'library', 'department', 'faculty', 'clinic', 'hostel', 'student_affairs'];
const staffMap = {
  bursary: 'BURS001', library: 'LIB001', department: 'DEPT001', faculty: 'FAC001',
  clinic: 'CLN001', hostel: 'HST001', student_affairs: 'SA001'
};

// Student 1 (Mtser Emmanuel) — has applied, all pending
depts.forEach(d => insertClearance.run('2021/CP/CSC/0076', d, 'pending', null, null, null));

// Student 2 (Amina) — 3 cleared, 4 pending
insertClearance.run('2021/CP/CSC/0042', 'bursary', 'cleared', 'All fees confirmed.', 'BURS001', '2026-04-20 10:30:00');
insertClearance.run('2021/CP/CSC/0042', 'library', 'cleared', 'No outstanding books.', 'LIB001', '2026-04-21 11:15:00');
insertClearance.run('2021/CP/CSC/0042', 'department', 'cleared', 'Project submitted, exams passed.', 'DEPT001', '2026-04-22 09:00:00');
insertClearance.run('2021/CP/CSC/0042', 'faculty', 'pending', null, null, null);
insertClearance.run('2021/CP/CSC/0042', 'clinic', 'pending', null, null, null);
insertClearance.run('2021/CP/CSC/0042', 'hostel', 'pending', null, null, null);
insertClearance.run('2021/CP/CSC/0042', 'student_affairs', 'pending', null, null, null);

// Student 3 (Chinedu) — ALL CLEARED (can get certificate once bio_verified)
depts.forEach(d => {
  const comments = {
    bursary: 'All fees confirmed.', library: 'All books returned.',
    department: 'Project submitted, exams passed.', faculty: 'Academic requirements met.',
    clinic: 'Medical clearance granted.', hostel: 'Room cleared, no damages.',
    student_affairs: 'ID card returned.'
  };
  const dates = {
    bursary: '2026-04-18 09:00:00', library: '2026-04-19 10:30:00',
    department: '2026-04-20 14:00:00', faculty: '2026-04-21 09:00:00',
    clinic: '2026-04-21 11:00:00', hostel: '2026-04-21 14:00:00',
    student_affairs: '2026-04-21 16:00:00'
  };
  insertClearance.run('2021/ENG/EEE/0043', d, 'cleared', comments[d], staffMap[d], dates[d]);
});
// Mark Chinedu's bio as verified
db.prepare('UPDATE students SET bio_verified = 1 WHERE user_id = ?').run('2021/ENG/EEE/0043');

// Student 4 (Fatima) — 1 rejected by library, others mixed
insertClearance.run('2020/CP/MIS/0018', 'bursary', 'cleared', 'Fees verified.', 'BURS001', '2026-04-22 10:00:00');
insertClearance.run('2020/CP/MIS/0018', 'library', 'rejected', 'Outstanding book: "Database Systems" not returned.', 'LIB001', '2026-04-22 11:30:00');
insertClearance.run('2020/CP/MIS/0018', 'department', 'pending', null, null, null);
insertClearance.run('2020/CP/MIS/0018', 'faculty', 'pending', null, null, null);
insertClearance.run('2020/CP/MIS/0018', 'clinic', 'cleared', 'Medically fit.', 'CLN001', '2026-04-23 10:00:00');
insertClearance.run('2020/CP/MIS/0018', 'hostel', 'pending', null, null, null);
insertClearance.run('2020/CP/MIS/0018', 'student_affairs', 'pending', null, null, null);

// Student 5 (David) — bursary cleared, rest pending
depts.forEach(d => {
  if (d === 'bursary') {
    insertClearance.run('2021/SCI/PHY/0091', d, 'cleared', 'Payment verified via gateway.', 'BURS001', '2026-04-25 08:30:00');
  } else {
    insertClearance.run('2021/SCI/PHY/0091', d, 'pending', null, null, null);
  }
});

// Student 6 (Blessing) — hasn't applied yet (no clearance rows)

console.log('  ✓ Clearance requests seeded (7 departments)');

// ── Insert payment records ──
const insertPayment = db.prepare(
  'INSERT INTO payments (student_id, reference_no, fee_type, amount, card_last_four, status, paid_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
);

// Chinedu — all fees paid
insertPayment.run('2021/ENG/EEE/0043', 'FUL-K8R4WX-F1G3', 'Convocation Fee', 15000, '5421', 'success', '2026-04-17 09:10:00');
insertPayment.run('2021/ENG/EEE/0043', 'FUL-K8R5YZ-H2J4', 'Library Processing Fee', 2000, '5421', 'success', '2026-04-17 09:15:00');
insertPayment.run('2021/ENG/EEE/0043', 'FUL-A1B2C3-D4E5', 'Clearance Processing Fee', 5000, '5421', 'success', '2026-04-17 09:20:00');
insertPayment.run('2021/ENG/EEE/0043', 'FUL-Q3R4S5-T6U7', 'Alumni Association Fee', 10000, '5421', 'success', '2026-04-17 09:30:00');

// Amina — partial
insertPayment.run('2021/CP/CSC/0042', 'FUL-M3N8KP-A2B4', 'Convocation Fee', 15000, '4532', 'success', '2026-04-19 14:20:00');
insertPayment.run('2021/CP/CSC/0042', 'FUL-M3N9LQ-C5D7', 'Clearance Processing Fee', 5000, '4532', 'success', '2026-04-19 14:25:00');

// Fatima — partial
insertPayment.run('2020/CP/MIS/0018', 'FUL-P2T7AB-K5L8', 'Convocation Fee', 15000, '3789', 'success', '2026-04-21 16:00:00');

// David — partial
insertPayment.run('2021/SCI/PHY/0091', 'FUL-Q9U1CD-M7N0', 'Convocation Fee', 15000, '6234', 'success', '2026-04-24 11:30:00');
insertPayment.run('2021/SCI/PHY/0091', 'FUL-Q9U2EF-P8R1', 'Library Processing Fee', 2000, '6234', 'success', '2026-04-24 11:35:00');

// Mtser — partial
insertPayment.run('2021/CP/CSC/0076', 'FUL-X1Y2Z3-A4B5', 'Convocation Fee', 15000, '7890', 'success', '2026-05-01 10:00:00');
insertPayment.run('2021/CP/CSC/0076', 'FUL-X1Y3Z4-C6D7', 'Library Processing Fee', 2000, '7890', 'success', '2026-05-01 10:05:00');
insertPayment.run('2021/CP/CSC/0076', 'FUL-X1Y4Z5-E8F9', 'Clearance Processing Fee', 5000, '7890', 'success', '2026-05-01 10:10:00');

console.log('  ✓ Payment records seeded');

// ── Insert audit log entries ──
const insertAudit = db.prepare(
  'INSERT INTO audit_log (actor_id, action, target_student, department, details, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);

insertAudit.run('BURS001', 'CLEARANCE_APPROVED', '2021/CP/CSC/0042', 'bursary', 'All fees confirmed.', '2026-04-20 10:30:00');
insertAudit.run('LIB001', 'CLEARANCE_APPROVED', '2021/CP/CSC/0042', 'library', 'No outstanding books.', '2026-04-21 11:15:00');
insertAudit.run('DEPT001', 'CLEARANCE_APPROVED', '2021/CP/CSC/0042', 'department', 'Project submitted, exams passed.', '2026-04-22 09:00:00');
insertAudit.run('BURS001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'bursary', 'All fees confirmed.', '2026-04-18 09:00:00');
insertAudit.run('LIB001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'library', 'All books returned.', '2026-04-19 10:30:00');
insertAudit.run('DEPT001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'department', 'Project submitted, exams passed.', '2026-04-20 14:00:00');
insertAudit.run('FAC001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'faculty', 'Academic requirements met.', '2026-04-21 09:00:00');
insertAudit.run('CLN001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'clinic', 'Medical clearance granted.', '2026-04-21 11:00:00');
insertAudit.run('HST001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'hostel', 'Room cleared, no damages.', '2026-04-21 14:00:00');
insertAudit.run('SA001', 'CLEARANCE_APPROVED', '2021/ENG/EEE/0043', 'student_affairs', 'ID card returned.', '2026-04-21 16:00:00');
insertAudit.run('BURS001', 'CLEARANCE_APPROVED', '2020/CP/MIS/0018', 'bursary', 'Fees verified.', '2026-04-22 10:00:00');
insertAudit.run('LIB001', 'CLEARANCE_REJECTED', '2020/CP/MIS/0018', 'library', 'Outstanding book not returned.', '2026-04-22 11:30:00');
insertAudit.run('CLN001', 'CLEARANCE_APPROVED', '2020/CP/MIS/0018', 'clinic', 'Medically fit.', '2026-04-23 10:00:00');
insertAudit.run('BURS001', 'CLEARANCE_APPROVED', '2021/SCI/PHY/0091', 'bursary', 'Payment verified via gateway.', '2026-04-25 08:30:00');

console.log('  ✓ Audit log seeded');

// ── Insert notifications ──
const insertNotif = db.prepare(
  'INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, ?, ?)'
);

insertNotif.run('2021/CP/CSC/0042', 'Your Bursary clearance has been approved by Mrs. Aisha Suleiman.', 'success', '2026-04-20 10:30:00');
insertNotif.run('2021/CP/CSC/0042', 'Your Library clearance has been approved by Mr. Daniel Okeke.', 'success', '2026-04-21 11:15:00');
insertNotif.run('2021/CP/CSC/0042', 'Your Department clearance has been approved by Dr. Fatima Aliyu.', 'success', '2026-04-22 09:00:00');
insertNotif.run('2020/CP/MIS/0018', 'Your Bursary clearance has been approved by Mrs. Aisha Suleiman.', 'success', '2026-04-22 10:00:00');
insertNotif.run('2020/CP/MIS/0018', 'Your Library clearance has been rejected: "Outstanding book: Database Systems not returned."', 'danger', '2026-04-22 11:30:00');
insertNotif.run('2021/ENG/EEE/0043', 'Congratulations! All departments have cleared you. Please verify your bio-data to download your certificate.', 'success', '2026-04-21 17:00:00');

console.log('  ✓ Notifications seeded');

// ── Insert sample ticket ──
db.prepare(`
  INSERT INTO tickets (student_id, department, subject, message, status, staff_reply, replied_by, replied_at, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`).run(
  '2020/CP/MIS/0018', 'library',
  'Book Return Confirmation',
  'I have returned the book "Database Systems" to the library on April 23rd. Please re-check and update my clearance status.',
  'closed',
  'Thank you for returning the book. Your clearance has been updated. Please re-apply for library clearance.',
  'LIB001', '2026-04-24 10:00:00', '2026-04-23 14:00:00'
);

console.log('  ✓ Sample support ticket seeded');

console.log('\n  ══════════════════════════════════════════');
console.log('  Database seeded successfully!');
console.log('  ══════════════════════════════════════════');
console.log('\n  Demo Login Credentials:');
console.log('  ─────────────────────────────────────────');
console.log('  Student:           2021/CP/CSC/0076 / student123');
console.log('  Student (Cleared): 2021/ENG/EEE/0043 / student123');
console.log('  Bursary Officer:   BURS001 / staff123');
console.log('  Library Officer:   LIB001 / staff123');
console.log('  Department:        DEPT001 / staff123');
console.log('  Faculty:           FAC001 / staff123');
console.log('  Clinic:            CLN001 / staff123');
console.log('  Hostel:            HST001 / staff123');
console.log('  Student Affairs:   SA001 / staff123');
console.log('  Admin:             ADMIN001 / admin123');
console.log('  ─────────────────────────────────────────\n');

db.close();
