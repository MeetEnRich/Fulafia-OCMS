import { useState, useEffect } from 'react';
import { clearanceAPI, paymentAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { Card, Btn, StatusBadge, EmptyState } from '../../components/UI';
import { Search, CheckCircle, XCircle, ChevronDown, ChevronUp, Users, Clock } from 'lucide-react';

export default function PendingRequests() {
  const { user, showToast } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [studentPayments, setStudentPayments] = useState({});
  const [comments, setComments] = useState({});
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    try {
      const res = await clearanceAPI.getPending();
      setRequests(res.data.requests);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleExpand = async (student) => {
    if (expandedId === student.student_id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(student.student_id);
    // Fetch payments for bursary
    if (user.role === 'bursary' && !studentPayments[student.student_id]) {
      try {
        const res = await paymentAPI.getStudentPayments(student.student_id);
        setStudentPayments(prev => ({ ...prev, [student.student_id]: res.data.payments }));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAction = async (student, status) => {
    const studentComment = comments[student.student_id] || '';
    if (status === 'rejected' && !studentComment.trim()) {
      showToast('Please provide a reason for rejection.', 'warning');
      return;
    }
    setActionLoading(student.student_id + status);
    try {
      await clearanceAPI.updateClearance(user.role, {
        studentId: student.student_id,
        status,
        comment: studentComment || (status === 'cleared' ? 'Approved.' : ''),
      });
      showToast(
        `${student.student_name}'s clearance has been ${status === 'cleared' ? 'approved' : 'rejected'}.`,
        status === 'cleared' ? 'success' : 'warning',
        status === 'cleared' ? 'Clearance Approved' : 'Clearance Rejected'
      );
      setExpandedId(null);
      fetchRequests();
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed.', 'error');
    }
    setActionLoading(null);
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.student_id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: '2rem', width: '50%', marginBottom: '1.5rem' }} />
      {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: '0.75rem', borderRadius: 'var(--radius-xl)' }} />)}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Pending Requests</h1>
          <p className="text-secondary text-sm" style={{ margin: '0.25rem 0 0' }}>
            {pendingCount} student{pendingCount !== 1 ? 's' : ''} awaiting your review
          </p>
        </div>
      </div>

      {/* Search + Filter Bar */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div style={{ padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search student name or ID..." value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)} className="form-input" style={{ paddingLeft: '2.25rem' }} />
          </div>
          <div className="flex" style={{ gap: '0.375rem' }}>
            {['all', 'pending', 'cleared', 'rejected'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
                style={{ textTransform: 'capitalize' }}
              >{f}</button>
            ))}
          </div>
        </div>
      </Card>

      {/* Request List */}
      {filteredRequests.length === 0 ? (
        <Card>
          <EmptyState icon={Users} title="No requests found"
            description={filter === 'all' ? 'There are no clearance requests for your department.' : `No ${filter} requests found.`} />
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filteredRequests.map(req => {
            const isExpanded = expandedId === req.student_id;
            const payments = studentPayments[req.student_id] || [];

            return (
              <Card key={req.student_id}>
                {/* Collapsed Row */}
                <div onClick={() => req.status === 'pending' ? handleExpand(req) : null}
                  style={{
                    padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem',
                    cursor: req.status === 'pending' ? 'pointer' : 'default',
                    transition: 'background var(--transition-fast)',
                  }}
                  onMouseEnter={e => { if (req.status === 'pending') e.currentTarget.style.background = 'var(--surface-hover)'; }}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Initials Avatar */}
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    background: req.status === 'pending' ? 'var(--warning-bg)' : req.status === 'cleared' ? 'var(--success-bg)' : 'var(--danger-bg)',
                    color: req.status === 'pending' ? 'var(--warning)' : req.status === 'cleared' ? 'var(--success)' : 'var(--danger)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.75rem'
                  }}>
                    {req.student_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem' }}>{req.student_name}</p>
                    <p className="text-xs text-muted" style={{ margin: 0 }}>{req.student_id} &bull; {req.department_name}</p>
                  </div>

                  <StatusBadge status={req.status} />

                  {req.status === 'pending' && (
                    <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                      {/* Quick approve */}
                      <button className="btn btn--sm btn--primary" style={{ padding: '0.375rem 0.625rem' }}
                        onClick={(e) => { e.stopPropagation(); handleAction(req, 'cleared'); }}
                        disabled={actionLoading === req.student_id + 'cleared'}
                      >
                        <CheckCircle size={14} /> <span className="hide-mobile">Approve</span>
                      </button>
                      {isExpanded ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                    </div>
                  )}
                </div>

                {/* Expanded Detail */}
                {isExpanded && req.status === 'pending' && (
                  <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem', animation: 'slideUp 0.2s ease' }}>
                    <div className="grid gap-4 md:grid-cols-2">
                      {/* Student Details */}
                      <div>
                        <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Student Details</h4>
                        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
                          {[
                            ['Name', req.student_name],
                            ['Matric No', req.student_id],
                            ['Department', req.department_name],
                            ['Faculty', req.faculty || '—'],
                            ['Level', req.level ? `${req.level}L` : '—'],
                          ].map(([label, val]) => (
                            <div key={label} className="flex justify-between" style={{ padding: '0.375rem 0', fontSize: '0.8125rem', borderBottom: '1px solid var(--border)' }}>
                              <span className="text-muted">{label}</span>
                              <span className="font-medium">{val}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Payments (Bursary only) */}
                      {user.role === 'bursary' && (
                        <div>
                          <h4 style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Payment Records</h4>
                          <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '0.875rem' }}>
                            {payments.length === 0 ? (
                              <p className="text-sm text-muted" style={{ textAlign: 'center', padding: '0.5rem 0' }}>No payments found.</p>
                            ) : payments.map((p, i) => (
                              <div key={i} className="flex justify-between" style={{ padding: '0.375rem 0', fontSize: '0.8125rem', borderBottom: i < payments.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <span>{p.fee_type}</span>
                                <span className="font-medium" style={{ color: 'var(--success)' }}>₦{p.amount.toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Comment + Actions */}
                    <div style={{ marginTop: '1rem' }}>
                      <label className="form-label">Comment / Reason (required for rejection)</label>
                      <textarea className="form-input" rows={2} placeholder="Add a comment or reason..."
                        value={comments[req.student_id] || ''} onChange={e => setComments(prev => ({ ...prev, [req.student_id]: e.target.value }))}
                        style={{ resize: 'vertical' }} />
                      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.75rem', justifyContent: 'flex-end' }}>
                        <button className="btn btn--danger" onClick={() => handleAction(req, 'rejected')}
                          disabled={actionLoading === req.student_id + 'rejected'}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                        <button className="btn btn--primary" onClick={() => handleAction(req, 'cleared')}
                          disabled={actionLoading === req.student_id + 'cleared'}
                        >
                          <CheckCircle size={14} /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
