import { useState, useEffect } from 'react';
import { clearanceAPI } from '../../services/api';
import { Card, StatusBadge, ProgressBar, Skeleton } from '../../components/UI';
import { CheckCircle, Clock, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';

export default function ClearancePage() {
  const [clearances, setClearances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clearanceAPI.getMyClearance();
        setClearances(res.data.clearances);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: '2rem', width: '40%', marginBottom: '1.5rem' }} />
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 100, marginBottom: '1rem', borderRadius: 'var(--radius-xl)' }} />)}
    </div>
  );

  const clearedCount = clearances.filter(c => c.status === 'cleared').length;
  const progressPercent = clearances.length > 0 ? Math.round((clearedCount / 4) * 100) : 0;
  const allCleared = clearedCount === 4;

  const formatDept = (dept) => ({
    bursary: 'Bursary Department',
    library: 'University Library',
    hod: 'Department (HOD)',
    student_affairs: 'Student Affairs'
  })[dept] || dept;

  const deptDesc = (dept) => ({
    bursary: 'Verification of all fee payments and financial obligations.',
    library: 'Confirmation that all borrowed books and resources have been returned.',
    hod: 'Academic requirements including project submission and exam results.',
    student_affairs: 'Return of student ID card and settlement of all dues.'
  })[dept] || '';

  const getIcon = (status) => {
    if (status === 'cleared') return <CheckCircle size={12} color="white" />;
    if (status === 'rejected') return <XCircle size={12} color="white" />;
    return null;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Clearance Status</h1>
          <p className="text-secondary text-sm" style={{ margin: '0.25rem 0 0' }}>Track your clearance progress across all departments</p>
        </div>
      </div>

      {/* ═══ Overall Progress Card ═══ */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-body)' }}>Overall Progress</h3>
              <p className="text-muted text-sm" style={{ margin: '0.125rem 0 0' }}>{clearedCount} of 4 departments cleared</p>
            </div>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              {allCleared ? (
                <span className="badge badge--success" style={{ padding: '0.375rem 0.875rem' }}>✓ Fully Cleared</span>
              ) : (
                <span className="badge badge--pending" style={{ padding: '0.375rem 0.875rem' }}>In Progress</span>
              )}
              <span style={{ fontWeight: 700, fontSize: '1.25rem', color: allCleared ? 'var(--success)' : 'var(--primary)' }}>{progressPercent}%</span>
            </div>
          </div>
          <ProgressBar value={progressPercent} color={allCleared ? 'var(--success)' : undefined} />
        </div>
      </Card>

      {/* ═══ What's Next? ═══ */}
      {!allCleared && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
          padding: '1rem 1.25rem', background: 'var(--warning-bg)', border: '1px solid rgba(217,119,6,0.2)',
          borderRadius: 'var(--radius)', marginBottom: '1.5rem'
        }}>
          <AlertTriangle size={18} color="var(--warning)" style={{ flexShrink: 0, marginTop: '0.125rem' }} />
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--warning)' }}>Action Required</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              {clearances.find(c => c.status === 'rejected')
                ? 'One or more departments have rejected your clearance. Please review the remarks below and take the necessary action.'
                : 'Your clearance request is being reviewed by the remaining departments. You will be notified once each department processes your request.'}
            </p>
          </div>
        </div>
      )}

      {/* ═══ Vertical Timeline ═══ */}
      <div style={{ maxWidth: 700 }}>
        <div className="timeline">
          {clearances.map((c, index) => (
            <div key={index} className="timeline-item">
              <div className={`timeline-dot timeline-dot--${c.status}`}>
                {getIcon(c.status)}
              </div>
              <div className="timeline-content">
                <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-body)' }}>{formatDept(c.department)}</h4>
                    <p className="text-muted text-xs" style={{ margin: '0.125rem 0 0' }}>{deptDesc(c.department)}</p>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {c.reviewer_name && (
                  <p className="text-sm" style={{ margin: '0.5rem 0 0' }}>
                    <span className="text-muted">Reviewed by:</span> <strong>{c.reviewer_name}</strong>
                  </p>
                )}
                {c.reviewed_at && (
                  <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>
                    {new Date(c.reviewed_at).toLocaleString()}
                  </p>
                )}

                {c.comment && (
                  <div style={{
                    marginTop: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)',
                    background: c.status === 'rejected' ? 'var(--danger-bg)' : 'var(--bg)',
                    borderLeft: `3px solid ${c.status === 'rejected' ? 'var(--danger)' : 'var(--primary)'}`,
                    fontSize: '0.8125rem'
                  }}>
                    <strong>Remark:</strong> {c.comment}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {clearances.length === 0 && (
          <Card>
            <div className="empty-state">
              <Clock size={48} className="empty-state-icon" />
              <h3 className="empty-state-title">No Clearance Records</h3>
              <p className="empty-state-desc">You haven't applied for clearance yet. Go to your dashboard to start the application process.</p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
