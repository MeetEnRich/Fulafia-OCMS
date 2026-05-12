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
  hod: 'Department / Faculty (HOD)',
  student_affairs: 'Student Affairs',
  admin: 'System Administrator',
  student: 'Student',
};

/**
 * Departments involved in clearance
 */
export const CLEARANCE_DEPARTMENTS = ['bursary', 'library', 'hod', 'student_affairs'];
