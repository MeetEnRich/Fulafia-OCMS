import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Home, CreditCard, CheckSquare, Award, Users, FileText, Activity, HelpCircle, ClipboardList, UserCheck, MessageSquare, Lock } from 'lucide-react';

const ROLE_DISPLAY = {
  student: 'Student',
  bursary: 'Bursary',
  library: 'Library',
  department: 'Department',
  faculty: 'Faculty',
  clinic: 'Clinic',
  hostel: 'Hostel',
  student_affairs: 'Student Affairs',
  admin: 'Admin',
};

export default function Sidebar({ isOpen, isMobile, isCollapsed, onClose }) {
  const { user, logout } = useApp();

  const studentLinks = [
    { to: '/student/overview', icon: Home, label: 'Dashboard' },
    { to: '/student/payment', icon: CreditCard, label: 'Make Payment' },
    { to: '/student/clearance', icon: ClipboardList, label: 'Clearance Status' },
    { to: '/student/tickets', icon: MessageSquare, label: 'My Tickets' },
    { to: '/student/bio-verification', icon: UserCheck, label: 'Bio-Data' },
    { to: '/student/certificate', icon: Award, label: 'Certificate' },
  ];

  const staffLinks = [
    { to: '/staff/overview', icon: Home, label: 'Dashboard' },
    { to: '/staff/pending', icon: Users, label: 'Pending Requests' },
    { to: '/staff/history', icon: FileText, label: 'Clearance History' },
  ];

  const adminLinks = [
    { to: '/admin/overview', icon: Home, label: 'Dashboard' },
    { to: '/admin/audit', icon: Activity, label: 'Audit Log' },
    { to: '/admin/users', icon: Users, label: 'User Management' },
  ];

  const links = user?.role === 'student' ? studentLinks : user?.role === 'admin' ? adminLinks : staffLinks;
  const collapsedState = isCollapsed && !isMobile;

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      )}

      <aside style={{
        width: collapsedState ? '70px' : '250px', background: 'var(--surface)', borderRight: '1px solid var(--border)',
        height: '100vh', position: isMobile ? 'fixed' : 'sticky', top: 0,
        left: isMobile ? (isOpen ? 0 : '-100%') : 0, transition: 'all 0.3s ease',
        zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {/* Brand */}
        <div style={{ height: '60px', padding: '0 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: collapsedState ? 'center' : 'flex-start' }}>
          <img src="/logo.png" alt="FULafia Logo" style={{ width: 36, height: 36, objectFit: 'contain', flexShrink: 0 }} />
          {!collapsedState && (
            <div>
              <h1 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>FULafia</h1>
              <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>OCMS Portal</span>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: collapsedState ? '1rem 0.5rem' : '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {!collapsedState && <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem', margin: 0 }}>Navigation</p>}
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} onClick={() => isMobile && onClose()}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
                title={collapsedState ? link.label : ''}
                style={{ justifyContent: collapsedState ? 'center' : 'flex-start', padding: collapsedState ? '0.75rem' : '0.625rem 1rem' }}
              >
                <Icon size={19} style={{ flexShrink: 0 }} />
                {!collapsedState && link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: collapsedState ? '0.75rem 0.5rem' : '0.75rem', borderTop: '1px solid var(--border)' }}>
          <a href="mailto:support@fulafia.edu.ng" className="nav-link" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', justifyContent: collapsedState ? 'center' : 'flex-start', padding: collapsedState ? '0.75rem' : '0.625rem 1rem' }} title="Need Help?">
            <HelpCircle size={18} style={{ flexShrink: 0 }} /> {!collapsedState && 'Need Help?'}
          </a>
          <NavLink to="/change-password" onClick={() => isMobile && onClose()} className="nav-link" style={{ color: 'var(--text-muted)', fontSize: '0.75rem', justifyContent: collapsedState ? 'center' : 'flex-start', padding: collapsedState ? '0.75rem' : '0.625rem 1rem' }} title="Change Password">
            <Lock size={18} style={{ flexShrink: 0 }} /> {!collapsedState && 'Change Password'}
          </NavLink>
          <button onClick={() => { logout(); onClose(); }} className="nav-link" style={{ width: '100%', color: 'var(--danger)', marginTop: '0.25rem', justifyContent: collapsedState ? 'center' : 'flex-start', padding: collapsedState ? '0.75rem' : '0.625rem 1rem' }} title="Logout">
            <LogOut size={18} style={{ flexShrink: 0 }} /> {!collapsedState && 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}
