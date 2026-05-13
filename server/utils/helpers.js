/**
 * Generate a unique payment reference
 * Format: FUL-XXXXXX-XXXX
 */
export function generatePaymentRef() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `FUL-${ts}-${rand}`;
}

/**
 * Generate a unique certificate number
 * Format: FUL/CLR/YYYY/NNNN
 */
export function generateCertificateNo(matricNo) {
  const year = new Date().getFullYear();
  const suffix = matricNo.split('/').pop() || '0000';
  return `FUL/CLR/${year}/${suffix}`;
}

/**
 * Format date as readable string
 */
export function formatDate(date) {
  return new Date(date).toLocaleString('en-NG', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

/**
 * Standard staff role labels
 */
export const ROLE_LABELS = {
  bursary: 'Bursary Department',
  library: 'University Library',
  department: 'Department',
  faculty: 'Faculty',
  clinic: 'University Clinic',
  hostel: 'Hostel Management',
  student_affairs: 'Student Affairs',
  admin: 'System Administrator',
  student: 'Student',
};

/**
 * Departments involved in clearance (ordered by flow)
 */
export const CLEARANCE_DEPARTMENTS = [
  'bursary',
  'library',
  'department',
  'faculty',
  'clinic',
  'hostel',
  'student_affairs',
];

/**
 * Map department key to staff user ID prefix for notifications
 */
export const DEPT_STAFF_MAP = {
  bursary: 'BURS001',
  library: 'LIB001',
  department: 'DEPT001',
  faculty: 'FAC001',
  clinic: 'CLN001',
  hostel: 'HST001',
  student_affairs: 'SA001',
};

/**
 * Total number of clearance departments
 */
export const TOTAL_DEPARTMENTS = CLEARANCE_DEPARTMENTS.length;
