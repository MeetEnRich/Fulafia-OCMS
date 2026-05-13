import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

import StudentOverview from './pages/student/Overview';
import PaymentPage from './pages/student/Payment';
import ClearancePage from './pages/student/Clearance';
import CertificatePage from './pages/student/Certificate';
import BioVerification from './pages/student/BioVerification';
import MyTickets from './pages/student/MyTickets';
import ChangePassword from './pages/ChangePassword';

import StaffOverview from './pages/staff/Overview';
import PendingRequests from './pages/staff/PendingRequests';
import StaffHistory from './pages/staff/History';

import AdminOverview from './pages/admin/Overview';
import AuditLog from './pages/admin/AuditLog';
import UserManagement from './pages/admin/UserManagement';

const STAFF_ROLES = ['bursary', 'library', 'department', 'faculty', 'clinic', 'hostel', 'student_affairs'];

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useApp();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  const { user, loading } = useApp();

  if (loading) return <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/" />} />
        
        {/* Authenticated Routes */}
        <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          
          {/* Default routing based on role */}
          <Route index element={
            user?.role === 'student' ? <Navigate to="/student/overview" /> :
            user?.role === 'admin' ? <Navigate to="/admin/overview" /> :
            <Navigate to="/staff/overview" />
          } />

          {/* Student Routes */}
          <Route path="student/overview" element={<ProtectedRoute allowedRoles={['student']}><StudentOverview /></ProtectedRoute>} />
          <Route path="student/payment" element={<ProtectedRoute allowedRoles={['student']}><PaymentPage /></ProtectedRoute>} />
          <Route path="student/clearance" element={<ProtectedRoute allowedRoles={['student']}><ClearancePage /></ProtectedRoute>} />
          <Route path="student/certificate" element={<ProtectedRoute allowedRoles={['student']}><CertificatePage /></ProtectedRoute>} />
          <Route path="student/bio-verification" element={<ProtectedRoute allowedRoles={['student']}><BioVerification /></ProtectedRoute>} />
          <Route path="student/tickets" element={<ProtectedRoute allowedRoles={['student']}><MyTickets /></ProtectedRoute>} />

          {/* Staff Routes */}
          <Route path="staff/overview" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><StaffOverview /></ProtectedRoute>} />
          <Route path="staff/pending" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><PendingRequests /></ProtectedRoute>} />
          <Route path="staff/history" element={<ProtectedRoute allowedRoles={STAFF_ROLES}><StaffHistory /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="admin/overview" element={<ProtectedRoute allowedRoles={['admin']}><AdminOverview /></ProtectedRoute>} />
          <Route path="admin/audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditLog /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />

          {/* Shared Routes */}
          <Route path="change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />

        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
