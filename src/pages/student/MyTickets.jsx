import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ticketAPI } from '../../services/api';
import { Card, Btn, StatusBadge, EmptyState } from '../../components/UI';
import { MessageSquare, Clock, CheckCircle, Send } from 'lucide-react';

export default function MyTickets() {
  const { user, showToast } = useApp();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await ticketAPI.getTickets();
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getStatusStyle = (status) => {
    if (status === 'resolved') return { background: '#dcfce7', color: '#16a34a' };
    if (status === 'replied') return { background: '#dbeafe', color: '#2563eb' };
    return { background: '#fef3c7', color: '#d97706' };
  };

  if (loading) return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Support Tickets</h1>
      {[1, 2, 3].map(i => (
        <div key={i} className="skeleton" style={{ height: 80, marginBottom: '1rem', borderRadius: 'var(--radius)' }} />
      ))}
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>My Support Tickets</h1>

      {tickets.length === 0 ? (
        <Card>
          <div className="card-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <MessageSquare size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>No Tickets Yet</h3>
            <p className="text-secondary text-sm" style={{ maxWidth: 360, margin: '0 auto' }}>
              If your clearance gets rejected, you can raise a support ticket from the Clearance Status page.
            </p>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {tickets.map(ticket => {
            const isExpanded = expandedId === ticket.id;
            const statusStyle = getStatusStyle(ticket.status);

            return (
              <Card key={ticket.id} style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = ''}
              >
                <div style={{ padding: '1.25rem' }}>
                  {/* Header Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isExpanded ? '1rem' : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...statusStyle
                      }}>
                        {ticket.status === 'resolved' ? <CheckCircle size={18} /> :
                         ticket.status === 'replied' ? <Send size={18} /> :
                         <Clock size={18} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: '0.9375rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {ticket.department.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} — Ticket #{ticket.id}
                        </p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                          {new Date(ticket.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.6875rem',
                      fontWeight: 600, textTransform: 'capitalize', ...statusStyle
                    }}>
                      {ticket.status}
                    </span>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Your Message</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, background: 'var(--bg)', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--warning)' }}>
                          {ticket.message}
                        </p>
                      </div>

                      {ticket.reply && (
                        <div>
                          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Staff Reply</p>
                          <p style={{ fontSize: '0.875rem', color: 'var(--text-primary)', lineHeight: 1.6, margin: 0, background: '#f0fdf4', padding: '0.75rem 1rem', borderRadius: 'var(--radius)', borderLeft: '3px solid var(--success)' }}>
                            {ticket.reply}
                          </p>
                          {ticket.replied_at && (
                            <p style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                              Replied on {new Date(ticket.replied_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      )}

                      {!ticket.reply && (
                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', fontStyle: 'italic', margin: 0 }}>
                          Awaiting staff response...
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
