import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';

// We'll import pages dynamically or directly when created.
// For now we'll setup the routing structure.
import StudentOverview from './pages/student/Overview';
import PaymentPage from './pages/student/Payment';
import ClearancePage from './pages/student/Clearance';
import CertificatePage from './pages/student/Certificate';

import StaffOverview from './pages/staff/Overview';
import PendingRequests from './pages/staff/PendingRequests';
import StaffHistory from './pages/staff/History';

import AdminOverview from './pages/admin/Overview';
import AuditLog from './pages/admin/AuditLog';
import UserManagement from './pages/admin/UserManagement';

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

          {/* Staff Routes */}
          <Route path="staff/overview" element={<ProtectedRoute allowedRoles={['bursary', 'library', 'hod', 'student_affairs']}><StaffOverview /></ProtectedRoute>} />
          <Route path="staff/pending" element={<ProtectedRoute allowedRoles={['bursary', 'library', 'hod', 'student_affairs']}><PendingRequests /></ProtectedRoute>} />
          <Route path="staff/history" element={<ProtectedRoute allowedRoles={['bursary', 'library', 'hod', 'student_affairs']}><StaffHistory /></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="admin/overview" element={<ProtectedRoute allowedRoles={['admin']}><AdminOverview /></ProtectedRoute>} />
          <Route path="admin/audit" element={<ProtectedRoute allowedRoles={['admin']}><AuditLog /></ProtectedRoute>} />
          <Route path="admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManagement /></ProtectedRoute>} />

        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
