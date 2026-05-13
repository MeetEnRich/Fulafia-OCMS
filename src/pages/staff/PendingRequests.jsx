import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { clearanceAPI, ticketAPI } from '../../services/api';
import { Card, StatusBadge } from '../../components/UI';
import { Search, CheckCircle, XCircle, ChevronDown, ChevronUp, Users, MessageSquare, Send, Inbox, X } from 'lucide-react';

export default function PendingRequests() {
  const { user, showToast } = useApp();
  const [requests, setRequests] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [selected, setSelected] = useState([]);
  const [bulkProcessing, setBulkProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');
  const [replyText, setReplyText] = useState('');
  const [replyingId, setReplyingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reqRes, ticketRes] = await Promise.all([
        clearanceAPI.getPending(),
        ticketAPI.getTickets(),
      ]);
      setRequests(reqRes.data.requests);
      setTickets(ticketRes.data.tickets);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAction = async (studentId, status) => {
    if (status === 'rejected' && !comment.trim()) {
      showToast('Please provide a reason for rejection.', 'warning');
      return;
    }
    setProcessing(true);
    try {
      await clearanceAPI.updateClearance(user.role, { studentId, status, comment: comment || undefined });
      showToast(`Student ${status === 'cleared' ? 'approved' : 'rejected'} successfully.`, status === 'cleared' ? 'success' : 'info');
      setExpandedId(null);
      setComment('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Action failed.', 'error');
    }
    setProcessing(false);
  };

  const handleBulkApprove = async () => {
    if (selected.length === 0) {
      showToast('No students selected.', 'warning');
      return;
    }
    setBulkProcessing(true);
    try {
      const res = await clearanceAPI.bulkApprove({ studentIds: selected, comment: 'Bulk approved.' });
      showToast(res.data.message, 'success', 'Bulk Approve');
      setSelected([]);
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Bulk approve failed.', 'error');
    }
    setBulkProcessing(false);
  };

  const handleTicketReply = async (ticketId) => {
    if (!replyText.trim()) {
      showToast('Please enter a reply.', 'warning');
      return;
    }
    try {
      await ticketAPI.reply(ticketId, replyText);
      showToast('Reply sent and ticket closed.', 'success');
      setReplyingId(null);
      setReplyText('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to reply.', 'error');
    }
  };

  const toggleSelect = (sid) => {
    setSelected(prev => prev.includes(sid) ? prev.filter(s => s !== sid) : [...prev, sid]);
  };

  const toggleSelectAll = () => {
    const pendingIds = filtered.filter(r => r.status === 'pending').map(r => r.student_id);
    if (pendingIds.every(id => selected.includes(id))) {
      setSelected(prev => prev.filter(id => !pendingIds.includes(id)));
    } else {
      setSelected(prev => [...new Set([...prev, ...pendingIds])]);
    }
  };

  const filtered = requests.filter(r => {
    const matchesSearch = search === '' || r.student_name.toLowerCase().includes(search.toLowerCase()) || r.student_id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingFiltered = filtered.filter(r => r.status === 'pending');
  const openTickets = tickets.filter(t => t.status === 'open');

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: '2rem', width: '40%', marginBottom: '1.5rem' }} />
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 80, marginBottom: '0.75rem', borderRadius: 'var(--radius-xl)' }} />)}
    </div>
  );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Department Review</h1>
          <p className="text-secondary text-sm" style={{ margin: '0.25rem 0 0' }}>Review and process student clearance requests</p>
        </div>
      </div>

      {/* ═══ Tab Switcher ═══ */}
      <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1.5rem', background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '0.25rem', border: '1px solid var(--border)' }}>
        <button onClick={() => setActiveTab('requests')}
          className={`btn btn--sm ${activeTab === 'requests' ? 'btn--primary' : 'btn--ghost'}`}
          style={{ flex: 1, justifyContent: 'center' }}>
          <Users size={14} /> Requests ({requests.length})
        </button>
        <button onClick={() => setActiveTab('support')}
          className={`btn btn--sm ${activeTab === 'support' ? 'btn--primary' : 'btn--ghost'}`}
          style={{ flex: 1, justifyContent: 'center', position: 'relative' }}>
          <MessageSquare size={14} /> Support Inbox ({openTickets.length})
          {openTickets.length > 0 && (
            <span style={{
              position: 'absolute', top: 4, right: 8, width: 8, height: 8,
              borderRadius: '50%', background: 'var(--danger)', animation: 'pulse 2s infinite'
            }} />
          )}
        </button>
      </div>

      {activeTab === 'requests' && (
        <>
          {/* ═══ Toolbar ═══ */}
          <div className="flex items-center" style={{ gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="form-input" placeholder="Search students..."
                style={{ paddingLeft: '2.25rem' }}
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              {['all', 'pending', 'cleared', 'rejected'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`btn btn--sm ${filter === f ? 'btn--primary' : 'btn--ghost'}`}
                  style={{ textTransform: 'capitalize' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* ═══ Bulk Actions ═══ */}
          {selected.length > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0.75rem 1rem', background: 'var(--primary)', color: 'white',
              borderRadius: 'var(--radius)', marginBottom: '1rem', animation: 'slideDown 0.2s ease'
            }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {selected.length} student{selected.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center" style={{ gap: '0.5rem' }}>
                <button className="btn btn--sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none' }}
                  onClick={() => setSelected([])}>Clear</button>
                <button className="btn btn--sm" style={{ background: 'white', color: 'var(--primary)', border: 'none', fontWeight: 700 }}
                  onClick={handleBulkApprove} disabled={bulkProcessing}>
                  <CheckCircle size={14} /> {bulkProcessing ? 'Processing...' : 'Bulk Approve'}
                </button>
              </div>
            </div>
          )}

          {/* ═══ Request List ═══ */}
          {filtered.length === 0 ? (
            <Card>
              <div className="empty-state">
                <Inbox size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">No Requests Found</h3>
                <p className="empty-state-desc">There are no clearance requests matching your criteria.</p>
              </div>
            </Card>
          ) : (
            <div>
              {/* Select all for pending */}
              {pendingFiltered.length > 1 && (
                <div className="flex items-center" style={{ padding: '0.5rem 0', marginBottom: '0.5rem', gap: '0.5rem' }}>
                  <input type="checkbox"
                    checked={pendingFiltered.every(r => selected.includes(r.student_id))}
                    onChange={toggleSelectAll}
                    style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer' }} />
                  <span className="text-sm text-muted">Select all pending ({pendingFiltered.length})</span>
                </div>
              )}

              {filtered.map(req => {
                const isExpanded = expandedId === req.id;
                return (
                  <Card key={req.id} style={{ marginBottom: '0.75rem', transition: 'box-shadow 0.2s' }}>
                    <div style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}
                      onClick={() => setExpandedId(isExpanded ? null : req.id)}>

                      {req.status === 'pending' && (
                        <input type="checkbox" checked={selected.includes(req.student_id)}
                          onChange={(e) => { e.stopPropagation(); toggleSelect(req.student_id); }}
                          onClick={e => e.stopPropagation()}
                          style={{ width: 16, height: 16, accentColor: 'var(--primary)', cursor: 'pointer', flexShrink: 0 }} />
                      )}

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div className="flex items-center" style={{ gap: '0.5rem', flexWrap: 'wrap' }}>
                          <h4 style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-body)' }}>{req.student_name}</h4>
                          <StatusBadge status={req.status} />
                        </div>
                        <p className="text-muted text-xs" style={{ margin: '0.25rem 0 0' }}>
                          {req.student_id} &bull; {req.student_dept} &bull; {req.faculty} &bull; {req.level}L
                        </p>
                      </div>

                      {req.status === 'pending' && (
                        <button className="btn btn--sm btn--success" style={{ flexShrink: 0 }}
                          onClick={e => { e.stopPropagation(); handleAction(req.student_id, 'cleared'); }}>
                          <CheckCircle size={14} /> Approve
                        </button>
                      )}

                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>

                    {isExpanded && (
                      <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                        <div className="grid gap-3 sm:grid-cols-2" style={{ marginBottom: '1rem' }}>
                          <div><span className="text-xs text-muted">Department</span><p className="text-sm" style={{ margin: '0.125rem 0 0', fontWeight: 500 }}>{req.student_dept}</p></div>
                          <div><span className="text-xs text-muted">Faculty</span><p className="text-sm" style={{ margin: '0.125rem 0 0', fontWeight: 500 }}>{req.faculty}</p></div>
                          <div><span className="text-xs text-muted">Level</span><p className="text-sm" style={{ margin: '0.125rem 0 0', fontWeight: 500 }}>{req.level} Level</p></div>
                          <div><span className="text-xs text-muted">Applied</span><p className="text-sm" style={{ margin: '0.125rem 0 0', fontWeight: 500 }}>{new Date(req.created_at).toLocaleString()}</p></div>
                        </div>

                        {req.comment && (
                          <div style={{ padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius)', marginBottom: '1rem', fontSize: '0.8125rem' }}>
                            <strong>Previous remark:</strong> {req.comment}
                          </div>
                        )}

                        {(req.status === 'pending' || req.status === 'rejected') && (
                          <div>
                            <label className="form-label">Comment / Reason</label>
                            <textarea className="form-input" rows={2} placeholder="Add a comment (required for rejection)..."
                              value={expandedId === req.id ? comment : ''} onChange={e => setComment(e.target.value)}
                              style={{ resize: 'vertical', marginBottom: '0.75rem' }} />
                            <div className="flex items-center" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                              <button className="btn btn--sm btn--danger" disabled={processing}
                                onClick={() => handleAction(req.student_id, 'rejected')}>
                                <XCircle size={14} /> Reject
                              </button>
                              <button className="btn btn--sm btn--success" disabled={processing}
                                onClick={() => handleAction(req.student_id, 'cleared')}>
                                <CheckCircle size={14} /> Approve
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ═══ Support Inbox Tab ═══ */}
      {activeTab === 'support' && (
        <div>
          {tickets.length === 0 ? (
            <Card>
              <div className="empty-state">
                <MessageSquare size={48} className="empty-state-icon" />
                <h3 className="empty-state-title">No Support Tickets</h3>
                <p className="empty-state-desc">Students haven't sent any enquiries to your department yet.</p>
              </div>
            </Card>
          ) : (
            tickets.map(ticket => (
              <Card key={ticket.id} style={{ marginBottom: '0.75rem' }}>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9375rem', fontFamily: 'var(--font-body)' }}>{ticket.subject}</h4>
                      <p className="text-muted text-xs" style={{ margin: '0.25rem 0 0' }}>
                        From: {ticket.student_name} ({ticket.student_id}) &bull; {new Date(ticket.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`badge badge--${ticket.status === 'open' ? 'pending' : 'cleared'}`}>{ticket.status}</span>
                  </div>

                  <div style={{
                    padding: '0.75rem', background: 'var(--bg)', borderRadius: 'var(--radius)',
                    borderLeft: '3px solid var(--info)', fontSize: '0.8125rem', marginBottom: '0.75rem'
                  }}>
                    {ticket.message}
                  </div>

                  {ticket.staff_reply && (
                    <div style={{
                      padding: '0.75rem', background: 'var(--success-bg)', borderRadius: 'var(--radius)',
                      borderLeft: '3px solid var(--success)', fontSize: '0.8125rem', marginBottom: '0.75rem'
                    }}>
                      <strong>Your reply:</strong> {ticket.staff_reply}
                      <p className="text-xs text-muted" style={{ margin: '0.25rem 0 0' }}>
                        Replied by {ticket.replied_by_name} on {new Date(ticket.replied_at).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  {ticket.status === 'open' && (
                    <>
                      {replyingId === ticket.id ? (
                        <div>
                          <textarea className="form-input" rows={3} placeholder="Type your response..."
                            value={replyText} onChange={e => setReplyText(e.target.value)}
                            style={{ resize: 'vertical', marginBottom: '0.5rem' }} />
                          <div className="flex items-center" style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn--sm btn--ghost" onClick={() => { setReplyingId(null); setReplyText(''); }}>
                              Cancel
                            </button>
                            <button className="btn btn--sm btn--primary" onClick={() => handleTicketReply(ticket.id)}>
                              <Send size={12} /> Send & Close
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button className="btn btn--sm btn--primary" onClick={() => setReplyingId(ticket.id)}>
                          <MessageSquare size={12} /> Reply
                        </button>
                      )}
                    </>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
