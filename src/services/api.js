import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ocms_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (userId, password) => api.post('/auth/login', { userId, password }),
  getProfile: () => api.get('/auth/me'),
};

export const studentAPI = {
  getStudents: () => api.get('/students'),
  getStudentDetails: (userId) => api.get(`/students/${encodeURIComponent(userId)}`),
};

export const clearanceAPI = {
  getMyClearance: () => api.get('/clearance'),
  getPending: () => api.get('/clearance/pending'),
  updateClearance: (dept, payload) => api.put(`/clearance/${dept}`, payload),
  applyForClearance: () => api.post('/clearance/apply'),
};

export const paymentAPI = {
  makePayment: (payload) => api.post('/payments', payload),
  getPayments: () => api.get('/payments'),
  getStudentPayments: (studentId) => api.get(`/payments/student/${encodeURIComponent(studentId)}`),
};

export const adminAPI = {
  getStats: () => api.get('/stats'),
  getAuditLog: () => api.get('/audit'),
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  updateUser: (userId, data) => api.put(`/users/${encodeURIComponent(userId)}`, data),
  resetPassword: (userId) => api.post(`/users/${encodeURIComponent(userId)}/reset-password`),
  getNotifications: () => api.get('/notifications'),
  markNotificationRead: (id) => api.put(`/notifications/${id}/read`),
  getCertificate: (studentId) => api.get(`/certificate/${encodeURIComponent(studentId)}`),
};

export default api;
