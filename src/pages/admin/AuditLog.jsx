import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Card } from '../../components/UI';
import { Search, Activity } from 'lucide-react';

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await adminAPI.getAuditLog();
        setLogs(res.data.logs);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.actor_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.target_student?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getActionColor = (action) => {
    if (action.includes('APPROVED')) return 'var(--success)';
    if (action.includes('REJECTED')) return 'var(--danger)';
    if (action.includes('PAYMENT')) return 'var(--info)';
    return 'var(--text-secondary)';
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>System Audit Log</h1>
      
      <Card>
        <div className="card-header">
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search logs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
        </div>
        
        <div className="table-container" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <table className="data-table">
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr>
                <th>Date & Time</th>
                <th>Actor</th>
                <th>Action</th>
                <th>Target Student</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : filteredLogs.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No logs found.</td></tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(l.created_at).toLocaleString()}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{l.actor_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{l.actor_role}</div>
                    </td>
                    <td>
                      <span style={{ 
                        fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', 
                        borderRadius: 'var(--radius)', border: `1px solid ${getActionColor(l.action)}`, color: getActionColor(l.action) 
                      }}>
                        {l.action}
                      </span>
                    </td>
                    <td>{l.target_student || '-'}</td>
                    <td style={{ maxWidth: 300 }}>{l.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
