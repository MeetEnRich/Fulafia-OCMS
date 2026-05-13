import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn } from '../components/UI';
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';

export default function ChangePassword() {
  const { showToast } = useApp();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      showToast('New passwords do not match.', 'error');
      return;
    }

    if (form.currentPassword === form.newPassword) {
      showToast('New password must be different from your current password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      showToast('Password changed successfully!', 'success');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to change password.', 'error');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Change Password</h1>

      <div style={{ maxWidth: 480 }}>
        <Card>
          <div className="card-body" style={{ padding: '2rem' }}>
            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                background: '#dcfce7', color: '#16a34a', padding: '0.75rem 1rem',
                borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.875rem'
              }}>
                <CheckCircle size={18} />
                Your password has been updated successfully.
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={form.currentPassword}
                    onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    placeholder="Enter current password"
                    required
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={form.newPassword}
                    onChange={e => setForm({ ...form, newPassword: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    placeholder="Enter new password (min 6 characters)"
                    required
                    minLength={6}
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Confirm New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Re-enter new password"
                    required
                  />
                </div>
                {form.confirmPassword && form.newPassword !== form.confirmPassword && (
                  <p style={{ color: 'var(--danger)', fontSize: '0.75rem', marginTop: '0.375rem' }}>Passwords do not match</p>
                )}
              </div>

              <Btn type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Updating...' : 'Change Password'}
              </Btn>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
