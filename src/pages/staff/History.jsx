import { useState, useEffect } from 'react';
import { clearanceAPI } from '../../services/api';
import { Card, StatusBadge } from '../../components/UI';
import { Search } from 'lucide-react';

export default function StaffHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await clearanceAPI.getPending();
        setHistory(res.data.requests.filter(r => r.status !== 'pending'));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  const filteredHistory = history.filter(r => 
    r.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.student_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Clearance History</h1>
      
      <Card>
        <div className="card-header">
          <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input" 
              style={{ paddingLeft: '2.5rem' }} 
            />
          </div>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Matric No.</th>
                <th>Status</th>
                <th>Date Processed</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
              ) : filteredHistory.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No history found.</td></tr>
              ) : (
                filteredHistory.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium">{r.student_name}</td>
                    <td>{r.student_id}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>{new Date(r.reviewed_at).toLocaleString()}</td>
                    <td style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.comment || '-'}</td>
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
