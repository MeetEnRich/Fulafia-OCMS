import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, LogOut, Menu, User, X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/* ═══════════════════════════════════════════
   TOAST CONTAINER
   ═══════════════════════════════════════════ */
export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  const iconMap = {
    success: <CheckCircle size={18} color="var(--success)" />,
    error: <AlertCircle size={18} color="var(--danger)" />,
    warning: <AlertTriangle size={18} color="var(--warning)" />,
    info: <Info size={18} color="var(--info)" />,
  };

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast--${t.type} ${t.exiting ? 'toast--exiting' : ''}`}>
          <div className="toast-icon">{iconMap[t.type]}</div>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            <div className="toast-message">{t.message}</div>
          </div>
          <button className="toast-close" onClick={() => dismissToast(t.id)}><X size={14} /></button>
          <div className="toast-progress" style={{ animationDuration: `${t.duration}ms` }} />
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   HEADER
   ═══════════════════════════════════════════ */
export function Header({ onMenuToggle, isMobile }) {
  const { user, logout, notifications, markNotificationRead } = useApp();
  const [showNotifs, setShowNotifs] = useState(false);
  const unread = notifications.filter(n => !n.is_read).length;

  const portalTitle = user?.role === 'student' ? 'Student Portal' : user?.role === 'admin' ? 'Admin Portal' : 'Staff Portal';

  return (
    <header style={{
      height: '60px', background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 1.5rem', position: 'sticky', top: 0, zIndex: 40,
    }}>
      <div className="flex items-center" style={{ gap: '1rem' }}>
        {isMobile && (
          <button onClick={onMenuToggle} style={{ color: 'var(--text-secondary)', padding: '0.375rem' }}><Menu size={22} /></button>
        )}
        {!isMobile && (
          <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0, fontFamily: 'var(--font-body)' }}>{portalTitle}</h2>
        )}
      </div>

      <div className="flex items-center" style={{ gap: '0.75rem' }}>
        {/* Notification Bell */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setShowNotifs(!showNotifs)} style={{
            position: 'relative', color: 'var(--text-secondary)', padding: '0.5rem',
            borderRadius: '50%', background: showNotifs ? 'var(--bg)' : 'transparent', transition: 'all var(--transition)'
          }}>
            <Bell size={18} />
            {unread > 0 && (
              <span style={{
                position: 'absolute', top: 2, right: 2, background: 'var(--danger)', color: 'white',
                borderRadius: '50%', width: 16, height: 16, fontSize: '9px', fontWeight: 'bold',
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--surface)'
              }}>{unread > 9 ? '9+' : unread}</span>
            )}
          </button>

          {showNotifs && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 40 }} onClick={() => setShowNotifs(false)} />
              <div className="card animate-scale-in" style={{ position: 'absolute', top: '100%', right: 0, width: 340, marginTop: '0.5rem', zIndex: 50, padding: 0 }}>
                <div className="card-header">
                  <h3 style={{ margin: 0, fontSize: '0.875rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Notifications</h3>
                  <span className="badge badge--info">{unread} new</span>
                </div>
                <div style={{ maxHeight: 320, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div className="empty-state" style={{ padding: '2rem' }}>
                      <Bell size={32} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                      <p className="text-sm text-muted">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} onClick={() => !n.is_read && markNotificationRead(n.id)} style={{
                        padding: '0.875rem 1rem', borderBottom: '1px solid var(--border)',
                        background: n.is_read ? 'transparent' : 'var(--bg)',
                        cursor: n.is_read ? 'default' : 'pointer', transition: 'background var(--transition)'
                      }}>
                        <div style={{ display: 'flex', gap: '0.625rem' }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: '50%', marginTop: 6, flexShrink: 0,
                            background: n.is_read ? 'transparent' : 'var(--primary)'
                          }} />
                          <div>
                            <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{n.message}</p>
                            <span className="text-xs text-muted">{new Date(n.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center" style={{ gap: '0.625rem' }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem'
          }}>
            {user?.fullName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>
          {!isMobile && (
            <div>
              <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.fullName}</p>
              <p style={{ margin: 0, fontSize: '0.6875rem', color: 'var(--text-muted)' }}>{user?.department}</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ═══════════════════════════════════════════
   STATUS BADGE
   ═══════════════════════════════════════════ */
export function StatusBadge({ status }) {
  const map = {
    pending: { label: 'Pending', className: 'badge--pending' },
    cleared: { label: 'Cleared', className: 'badge--cleared' },
    rejected: { label: 'Rejected', className: 'badge--rejected' },
    success: { label: 'Success', className: 'badge--success' },
    failed: { label: 'Failed', className: 'badge--danger' },
  };
  const s = map[status?.toLowerCase()] || map.pending;
  return <span className={`badge ${s.className}`}>{s.label}</span>;
}

/* ═══════════════════════════════════════════
   CARD
   ═══════════════════════════════════════════ */
export function Card({ children, className = '', style = {}, interactive = false, ...props }) {
  return (
    <div className={`card ${interactive ? 'card-interactive' : ''} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   BUTTON
   ═══════════════════════════════════════════ */
export function Btn({ children, variant = 'primary', size = '', className = '', onClick, disabled = false, type = 'button', style = {} }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`btn btn--${variant} ${size ? `btn--${size}` : ''} ${className}`} style={style}
    >{children}</button>
  );
}

/* ═══════════════════════════════════════════
   INPUT
   ═══════════════════════════════════════════ */
export function Input({ label, error, ...props }) {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input className="form-input" style={{ borderColor: error ? 'var(--danger)' : '' }} {...props} />
      {error && <span style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════
   SKELETON LOADER
   ═══════════════════════════════════════════ */
export function Skeleton({ width, height, circle = false, style = {} }) {
  return (
    <div className={`skeleton ${circle ? 'skeleton-circle' : ''}`}
      style={{ width: width || '100%', height: height || '1rem', ...style }} />
  );
}

export function SkeletonCard() {
  return (
    <div className="card" style={{ padding: '1.5rem' }}>
      <Skeleton height="1rem" width="40%" style={{ marginBottom: '1rem' }} />
      <Skeleton height="0.875rem" width="80%" style={{ marginBottom: '0.5rem' }} />
      <Skeleton height="0.875rem" width="60%" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   EMPTY STATE
   ═══════════════════════════════════════════ */
export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty-state">
      {Icon && <Icon size={48} className="empty-state-icon" />}
      {title && <h3 className="empty-state-title">{title}</h3>}
      {description && <p className="empty-state-desc">{description}</p>}
      {action}
    </div>
  );
}

/* ═══════════════════════════════════════════
   PROGRESS BAR
   ═══════════════════════════════════════════ */
export function ProgressBar({ value = 0, color }) {
  return (
    <div className="progress-bar-track">
      <div className="progress-bar-fill" style={{ width: `${Math.min(value, 100)}%`, background: color || undefined }} />
    </div>
  );
}
