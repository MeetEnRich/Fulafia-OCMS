import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LogOut, Home, CreditCard, CheckSquare, Award, Users, FileText, Activity, HelpCircle, ClipboardList } from 'lucide-react';

export default function Sidebar({ isOpen, isMobile, onClose }) {
  const { user, logout } = useApp();

  const studentLinks = [
    { to: '/student/overview', icon: Home, label: 'Dashboard' },
    { to: '/student/payment', icon: CreditCard, label: 'Make Payment' },
    { to: '/student/clearance', icon: ClipboardList, label: 'Clearance Status' },
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

  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '??';

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 40, backdropFilter: 'blur(2px)' }} onClick={onClose} />
      )}

      <aside style={{
        width: '250px', background: 'var(--surface)', borderRight: '1px solid var(--border)',
        height: '100vh', position: isMobile ? 'fixed' : 'sticky', top: 0,
        left: isMobile ? (isOpen ? 0 : '-100%') : 0, transition: 'left 0.3s ease',
        zIndex: 50, display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* Brand */}
        <div style={{ padding: '1.25rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="FULafia Logo" style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div>
            <h1 style={{ fontSize: '1rem', color: 'var(--primary)', margin: 0, lineHeight: 1.2, fontFamily: 'var(--font-display)' }}>FULafia</h1>
            <span style={{ fontSize: '0.625rem', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>OCMS Portal</span>
          </div>
        </div>

        {/* User info card */}
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%', background: 'var(--primary)', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem', flexShrink: 0
            }}>{initials}</div>
            <div style={{ minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }} className="truncate">{user?.fullName}</p>
              <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <p style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.5rem 0.75rem', margin: 0 }}>Navigation</p>
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink key={link.to} to={link.to} onClick={() => isMobile && onClose()}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <Icon size={17} />
                {link.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <a href="mailto:support@fulafia.edu.ng" className="nav-link" style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>
            <HelpCircle size={16} /> Need Help?
          </a>
          <button onClick={() => { logout(); onClose(); }} className="nav-link" style={{ width: '100%', color: 'var(--danger)', marginTop: '0.25rem' }}>
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}
