import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { studentAPI, clearanceAPI, paymentAPI } from '../../services/api';
import { Card, ProgressBar, Skeleton, EmptyState } from '../../components/UI';
import { CheckCircle, Clock, XCircle, CreditCard, ArrowRight, Award, FileText, ClipboardList, AlertTriangle, Megaphone, UserCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const TOTAL_DEPTS = 7;
const FEE_TYPES = ['Convocation Fee', 'Clearance Processing Fee', 'Library Processing Fee', 'Alumni Association Fee'];

export default function Overview() {
  const { user, showToast } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasApplied, setHasApplied] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user.userId]);

  const fetchData = async () => {
    try {
      const res = await studentAPI.getStudentDetails(user.userId);
      setData(res.data.student);
      const hasClearance = res.data.student.clearances && res.data.student.clearances.length > 0;
      setHasApplied(hasClearance);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleApply = async () => {
    setApplying(true);
    try {
      await clearanceAPI.applyForClearance();
      showToast('Your clearance application has been submitted to all 7 departments!', 'success', 'Application Submitted');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to apply', 'error');
    }
    setApplying(false);
  };

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }} />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      </div>
    );
  }

  const clearances = data?.clearances || [];
  const payments = data?.payments || [];
  const bioVerified = data?.bio_verified;
  const clearedCount = clearances.filter(c => c.status === 'cleared').length;
  const pendingCount = clearances.filter(c => c.status === 'pending').length;
  const rejectedCount = clearances.filter(c => c.status === 'rejected').length;
  const progressPercent = clearances.length > 0 ? Math.round((clearedCount / TOTAL_DEPTS) * 100) : 0;
  const totalPaid = payments.filter(p => p.status === 'success').reduce((sum, p) => sum + p.amount, 0);
  const totalRequired = 35000; // Sum of all 5 fees
  const paidFeeTypes = payments.filter(p => p.status === 'success').map(p => p.fee_type);
  const unpaidFees = FEE_TYPES.filter(f => !paidFeeTypes.includes(f));
  const allCleared = clearedCount === TOTAL_DEPTS;

  const deptLabels = {
    bursary: 'Bursary', library: 'Library', department: 'Department',
    faculty: 'Faculty', clinic: 'Clinic', hostel: 'Hostel', student_affairs: 'Student Affairs'
  };

  return (
    <div>
      {/* ═══ Welcome Banner ═══ */}
      <div style={{
        background: 'var(--primary-gradient)', borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem', color: 'white', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '1.5rem', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 60, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: '0 0 0.25rem', opacity: 0.8, fontSize: '0.8125rem' }}>Welcome back,</p>
          <h1 style={{ fontSize: '1.375rem', marginBottom: '0.375rem', color: 'white' }}>{user.fullName}</h1>
          <p style={{ opacity: 0.7, margin: 0, fontSize: '0.8125rem' }}>
            {user.userId} &bull; {user.department} &bull; {user.level}L &bull; {user.session || '2024/2025'} Session
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'right' }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>Clearance</p>
            <p style={{ margin: 0, opacity: 0.7, fontSize: '0.8125rem' }}>{clearedCount}/{TOTAL_DEPTS} Depts</p>
          </div>
          <div style={{ position: 'relative', width: 64, height: 64 }}>
            <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3.5" />
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--gold)" strokeWidth="3.5" strokeDasharray={`${progressPercent}, 100`} strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '0.875rem' }}>
              {progressPercent}%
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Bio-Data Verification Alert ═══ */}
      {allCleared && !bioVerified && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.25rem', background: 'var(--gold-light)', border: '1px solid rgba(201,168,76,0.3)',
          borderRadius: 'var(--radius)', marginBottom: '1.5rem'
        }}>
          <UserCheck size={20} color="var(--gold)" style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--gold)' }}>Action Required: Verify Bio-Data</p>
            <p style={{ margin: '0.125rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              All departments have cleared you! Please verify your graduation details to unlock your certificate.
            </p>
          </div>
          <Link to="/student/bio-verification"><button className="btn btn--gold btn--sm">Verify Now</button></Link>
        </div>
      )}

      {/* ═══ Apply for Clearance CTA (if not applied) ═══ */}
      {!hasApplied && (
        <Card style={{ marginBottom: '1.5rem', border: '2px dashed var(--gold)', background: 'var(--gold-light)' }}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>
            <ClipboardList size={40} color="var(--gold)" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>Apply for Clearance</h3>
            <p className="text-secondary text-sm" style={{ maxWidth: 480, margin: '0 auto 1rem' }}>
              Your clearance request will be sent to all 7 departments. Ensure you have completed all requirements before applying.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {['Paid all fees', 'Returned library books', 'Submitted project', 'Medical check-up', 'Returned hostel key', 'Returned ID card'].map(item => (
                <span key={item} className="badge badge--info" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem' }}>{item}</span>
              ))}
            </div>
            <button className="btn btn--gold btn--lg" onClick={handleApply} disabled={applying}>
              {applying ? 'Submitting...' : 'Apply for Clearance'}
            </button>
          </div>
        </Card>
      )}

      {/* ═══ Announcement Banner ═══ */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '0.75rem 1.25rem', background: 'var(--info-bg)', border: '1px solid rgba(37,99,235,0.2)',
        borderRadius: 'var(--radius)', marginBottom: '1.5rem', fontSize: '0.8125rem', color: 'var(--info)'
      }}>
        <Megaphone size={16} style={{ flexShrink: 0 }} />
        <span><strong>Notice:</strong> Clearance deadline for the 2024/2025 session is <strong>May 30, 2026</strong>. Complete your clearance process before this date.</span>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Cleared', value: clearedCount, icon: CheckCircle, bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'Pending', value: pendingCount, icon: Clock, bg: 'var(--warning-bg)', color: 'var(--warning)' },
          { label: 'Rejected', value: rejectedCount, icon: XCircle, bg: 'var(--danger-bg)', color: 'var(--danger)' },
          { label: 'Payments', value: payments.length, icon: CreditCard, bg: 'var(--info-bg)', color: 'var(--info)' },
        ].map(s => (
          <Card key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={20} /></div>
            <div>
              <p className="text-muted text-sm" style={{ margin: 0, lineHeight: 1.2 }}>{s.label}</p>
              <h3 style={{ fontSize: '1.5rem', margin: 0, lineHeight: 1 }}>{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* ═══ Two Column: Clearance Summary + Payment Summary ═══ */}
      <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Clearance Summary</h3>
            <Link to="/student/clearance" style={{ fontSize: '0.75rem', fontWeight: 600 }}>View Details →</Link>
          </div>
          <div className="card-body">
            <div style={{ marginBottom: '1rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
                <span className="text-sm text-secondary">Overall Progress</span>
                <span className="text-sm font-semibold">{progressPercent}%</span>
              </div>
              <ProgressBar value={progressPercent} />
            </div>
            {clearances.map((c, i) => (
              <div key={i} className="flex items-center justify-between" style={{ padding: '0.375rem 0', borderBottom: i < clearances.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="flex items-center" style={{ gap: '0.5rem' }}>
                  {c.status === 'cleared' ? <CheckCircle size={14} color="var(--success)" /> :
                   c.status === 'rejected' ? <XCircle size={14} color="var(--danger)" /> :
                   <Clock size={14} color="var(--warning)" />}
                  <span className="text-sm">{deptLabels[c.department] || c.department}</span>
                </div>
                <span className={`badge badge--${c.status === 'cleared' ? 'cleared' : c.status === 'rejected' ? 'rejected' : 'pending'}`}>{c.status}</span>
              </div>
            ))}
            {clearances.length === 0 && <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem 0' }}>Apply for clearance to get started.</p>}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Payment Summary</h3>
            <Link to="/student/payment" style={{ fontSize: '0.75rem', fontWeight: 600 }}>Pay Now →</Link>
          </div>
          <div className="card-body">
            <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem' }}>
              <span className="text-sm text-secondary">Total Paid</span>
              <span className="font-semibold" style={{ color: 'var(--success)' }}>₦{totalPaid.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between" style={{ marginBottom: '1rem' }}>
              <span className="text-sm text-secondary">Total Required</span>
              <span className="font-semibold">₦{totalRequired.toLocaleString()}</span>
            </div>
            <ProgressBar value={(totalPaid / totalRequired) * 100} color="var(--gold)" />
            <div style={{ marginTop: '1rem' }}>
              {FEE_TYPES.map(fee => {
                const paid = paidFeeTypes.includes(fee);
                return (
                  <div key={fee} className="flex items-center justify-between" style={{ padding: '0.375rem 0', fontSize: '0.8125rem' }}>
                    <span className={paid ? '' : 'text-muted'}>{fee}</span>
                    {paid ? <CheckCircle size={14} color="var(--success)" /> : <Clock size={14} color="var(--text-muted)" />}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Quick Actions</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: '/student/payment', icon: CreditCard, label: 'Make Payment', desc: unpaidFees.length > 0 ? `${unpaidFees.length} fees remaining` : 'All paid', color: 'var(--primary)' },
          { to: '/student/clearance', icon: ClipboardList, label: 'Track Clearance', desc: `${clearedCount}/${TOTAL_DEPTS} departments`, color: 'var(--info)' },
          { to: allCleared && !bioVerified ? '/student/bio-verification' : '/student/certificate', icon: allCleared && !bioVerified ? UserCheck : Award, label: allCleared && !bioVerified ? 'Verify Bio-Data' : 'Get Certificate', desc: allCleared ? (bioVerified ? 'Ready to download' : 'Verify details first') : 'Complete clearance first', color: 'var(--gold)', disabled: !allCleared },
          { to: '/student/payment', icon: FileText, label: 'Payment History', desc: `${payments.length} transactions`, color: 'var(--text-secondary)' },
        ].map(action => (
          <Link key={action.label} to={action.to} style={{ textDecoration: 'none', opacity: action.disabled ? 0.5 : 1, pointerEvents: action.disabled ? 'none' : 'auto' }}>
            <Card interactive style={{ padding: '1.25rem' }}>
              <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius)', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <action.icon size={18} color={action.color} />
                </div>
                <ArrowRight size={14} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
              </div>
              <p style={{ margin: '0 0 0.125rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{action.label}</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{action.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {/* ═══ Recent Activity ═══ */}
      {payments.length > 0 && (
        <Card style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Recent Activity</h3>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1.5rem' }}>
            {payments.slice(0, 5).map((p, i) => (
              <div key={p.reference_no} className="activity-item">
                <div className="activity-dot" style={{ background: p.status === 'success' ? 'var(--success)' : 'var(--danger)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 500 }}>
                    {p.status === 'success' ? 'Payment successful' : 'Payment failed'}: {p.fee_type}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ₦{p.amount.toLocaleString()} &bull; {new Date(p.paid_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
