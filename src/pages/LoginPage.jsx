import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, Btn, Input } from '../components/UI';
import { Lock, User } from 'lucide-react';

export default function LoginPage() {
  const { login } = useApp();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const res = await login(userId, password);
    if (!res.success) {
      setError(res.error);
    }
    setLoading(false);
  };

  const handleDemoLogin = (user, pass) => {
    setUserId(user);
    setPassword(pass);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: '1rem'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="FULafia Logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: '1rem' }} />
          <h1 style={{ fontSize: '1.5rem', color: 'var(--primary)', marginBottom: '0.5rem' }}>FULafia OCMS</h1>
          <p className="text-secondary">Online Clearance Management System</p>
        </div>

        <Card>
          <div style={{ padding: '2rem' }}>
            {error && (
              <div style={{
                background: 'var(--danger-bg)', color: 'var(--danger)',
                padding: '0.75rem', borderRadius: 'var(--radius)',
                fontSize: '0.875rem', marginBottom: '1.5rem',
                textAlign: 'center'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">User ID (Matric No / Staff ID)</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Enter ID"
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="Enter Password"
                    required
                  />
                </div>
              </div>

              <Btn type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Authenticating...' : 'Sign In'}
              </Btn>
            </form>

            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Demo Accounts
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                <button onClick={() => handleDemoLogin('2021/CP/CSC/0076', 'student123')} className="badge badge--info" style={{ cursor: 'pointer', border: '1px solid var(--info)' }}>Student</button>
                <button onClick={() => handleDemoLogin('2021/ENG/EEE/0043', 'student123')} className="badge badge--success" style={{ cursor: 'pointer', border: '1px solid var(--success)' }}>Cleared Student</button>
                <button onClick={() => handleDemoLogin('BURS001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Bursary</button>
                <button onClick={() => handleDemoLogin('LIB001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Library</button>
                <button onClick={() => handleDemoLogin('DEPT001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Department</button>
                <button onClick={() => handleDemoLogin('FAC001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Faculty</button>
                <button onClick={() => handleDemoLogin('CLN001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Clinic</button>
                <button onClick={() => handleDemoLogin('HST001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Hostel</button>
                <button onClick={() => handleDemoLogin('SA001', 'staff123')} className="badge badge--pending" style={{ cursor: 'pointer', border: '1px solid var(--warning)' }}>Student Affairs</button>
                <button onClick={() => handleDemoLogin('ADMIN001', 'admin123')} className="badge badge--rejected" style={{ cursor: 'pointer', border: '1px solid var(--danger)' }}>Admin</button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
