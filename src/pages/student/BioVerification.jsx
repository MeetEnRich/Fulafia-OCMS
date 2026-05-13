import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { studentAPI, adminAPI } from '../../services/api';
import { Card, Btn } from '../../components/UI';
import { CheckCircle, AlertCircle, User, Phone, MapPin, GraduationCap, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function BioVerification() {
  const { user, showToast } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ phone_number: '', address: '' });
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await studentAPI.getStudentDetails(user.userId);
        const s = res.data.student;
        setData(s);
        setForm({ phone_number: s.phone_number || '', address: s.address || '' });
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetch();
  }, [user.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!confirmed) {
      showToast('Please confirm that all details are correct.', 'warning');
      return;
    }
    setSaving(true);
    try {
      await adminAPI.verifyBio(user.userId, form);
      showToast('Bio-data verified successfully! Your certificate is now available.', 'success', 'Bio-Data Verified');
      navigate('/student/certificate');
    } catch (err) {
      showToast(err.response?.data?.error || 'Verification failed.', 'error');
    }
    setSaving(false);
  };

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: '2rem', width: '50%', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)' }} />
    </div>
  );

  if (data?.bio_verified) {
    return (
      <Card style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div className="card-body" style={{ padding: '3rem 2rem' }}>
          <CheckCircle size={56} color="var(--success)" style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Bio-Data Already Verified</h2>
          <p className="text-secondary text-sm" style={{ marginBottom: '1.5rem' }}>
            Your graduation details have been confirmed. You can now download your certificate.
          </p>
          <Btn variant="primary" onClick={() => navigate('/student/certificate')}>View Certificate</Btn>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Bio-Data Verification</h1>
          <p className="text-secondary text-sm" style={{ margin: '0.25rem 0 0' }}>
            Confirm your graduation details before your certificate can be issued
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Warning */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          padding: '1rem 1.25rem', background: 'var(--warning-bg)', border: '1px solid rgba(217,119,6,0.2)',
          borderRadius: 'var(--radius)', marginBottom: '1.5rem'
        }}>
          <AlertCircle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--warning)' }}>Important Notice</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Please review all details carefully. Once verified, your name and graduation details will appear on your official clearance certificate. Any errors must be corrected by the Registrar's office.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Read-Only Details */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Academic Details</h3>
              <span className="badge badge--info">Read-Only</span>
            </div>
            <div className="card-body">
              {[
                { icon: User, label: 'Full Name', value: data?.full_name },
                { icon: GraduationCap, label: 'Matric Number', value: data?.user_id },
                { icon: Building2, label: 'Department', value: data?.department },
                { icon: Building2, label: 'Faculty', value: data?.faculty },
                { icon: GraduationCap, label: 'Level', value: data?.level ? `${data.level} Level` : '—' },
                { icon: GraduationCap, label: 'Session', value: data?.session },
              ].map(item => (
                <div key={item.label} className="flex items-center" style={{ padding: '0.625rem 0', borderBottom: '1px solid var(--border)', gap: '0.75rem' }}>
                  <item.icon size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p className="text-xs text-muted" style={{ margin: 0 }}>{item.label}</p>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: '0.875rem' }}>{item.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Editable Fields */}
          <Card style={{ marginBottom: '1.5rem' }}>
            <div className="card-header">
              <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Contact Information</h3>
            </div>
            <div className="card-body">
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label"><Phone size={14} style={{ marginRight: '0.375rem', verticalAlign: -2 }} />Phone Number</label>
                <input type="tel" className="form-input" required placeholder="e.g. 08012345678"
                  value={form.phone_number} onChange={e => setForm(f => ({ ...f, phone_number: e.target.value }))} />
              </div>
              <div>
                <label className="form-label"><MapPin size={14} style={{ marginRight: '0.375rem', verticalAlign: -2 }} />Contact Address</label>
                <textarea className="form-input" rows={2} required placeholder="Enter your contact address"
                  value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
            </div>
          </Card>

          {/* Confirmation Checkbox */}
          <Card style={{ marginBottom: '1.5rem', background: confirmed ? 'var(--success-bg)' : 'var(--bg)' }}>
            <div className="card-body">
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
                  style={{ marginTop: '0.25rem', width: 18, height: 18, accentColor: 'var(--primary)' }} />
                <span style={{ fontSize: '0.8125rem', lineHeight: 1.6 }}>
                  I confirm that the above details are <strong>correct and accurate</strong>. I understand that these details will appear on my official clearance certificate and any discrepancies must be resolved with the Registrar's office before verification.
                </span>
              </label>
            </div>
          </Card>

          <Btn type="submit" variant="primary" className="w-full" disabled={saving || !confirmed}>
            <CheckCircle size={16} />
            {saving ? 'Verifying...' : 'Verify & Confirm Bio-Data'}
          </Btn>
        </form>
      </div>
    </div>
  );
}
