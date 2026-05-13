import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { clearanceAPI } from '../../services/api';
import { Card, ProgressBar } from '../../components/UI';
import { Users, CheckCircle, Clock, XCircle, ArrowRight, AlertTriangle, MessageSquare } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Link } from 'react-router-dom';

const ROLE_LABELS = {
  bursary: 'Bursary Officer',
  library: 'Library Officer',
  department: 'Department Officer',
  faculty: 'Faculty Officer',
  clinic: 'Medical Officer',
  hostel: 'Hall Warden',
  student_affairs: 'Student Affairs Officer',
};

export default function StaffOverview() {
  const { user } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await clearanceAPI.getPending();
        setRequests(res.data.requests);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }} />
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const clearedCount = requests.filter(r => r.status === 'cleared').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;
  const totalCount = requests.length;

  const chartData = [
    { name: 'Cleared', value: clearedCount, color: 'var(--success)' },
    { name: 'Pending', value: pendingCount, color: 'var(--warning)' },
    { name: 'Rejected', value: rejectedCount, color: 'var(--danger)' },
  ].filter(d => d.value > 0);

  const recentActivity = requests
    .filter(r => r.reviewed_at)
    .sort((a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at))
    .slice(0, 6);

  return (
    <div>
      {/* ═══ Welcome Banner ═══ */}
      <div style={{
        background: 'var(--primary-gradient)', borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem', color: 'white', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ margin: '0 0 0.25rem', opacity: 0.8, fontSize: '0.8125rem' }}>Welcome back,</p>
        <h1 style={{ fontSize: '1.375rem', marginBottom: '0.25rem', color: 'white' }}>{user.fullName}</h1>
        <p style={{ opacity: 0.7, margin: 0, fontSize: '0.8125rem' }}>{ROLE_LABELS[user.role] || user.role}</p>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Pending', value: pendingCount, icon: Clock, bg: 'var(--warning-bg)', color: 'var(--warning)' },
          { label: 'Cleared', value: clearedCount, icon: CheckCircle, bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'Rejected', value: rejectedCount, icon: XCircle, bg: 'var(--danger-bg)', color: 'var(--danger)' },
          { label: 'Total', value: totalCount, icon: Users, bg: 'var(--info-bg)', color: 'var(--info)' },
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

      {/* ═══ Pending Alert ═══ */}
      {pendingCount > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.25rem', background: 'var(--warning-bg)', borderLeft: '4px solid var(--warning)',
          borderRadius: 'var(--radius)', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem'
        }}>
          <div>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9375rem' }}>{pendingCount} pending request{pendingCount !== 1 ? 's' : ''} awaiting review</p>
            <p className="text-muted text-sm" style={{ margin: '0.25rem 0 0' }}>Review and process them to avoid delaying student graduation.</p>
          </div>
          <Link to="/staff/pending" className="btn btn--primary btn--sm">
            Review Now <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* ═══ Two Column: Chart + Activity ═══ */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Status Distribution</h3>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value" stroke="none">
                    {chartData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} students`, name]} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center" style={{ height: '100%', color: 'var(--text-muted)' }}>
                No requests to display
              </div>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Recent Activity</h3>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1.5rem' }}>
            {recentActivity.length > 0 ? recentActivity.map((r, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: r.status === 'cleared' ? 'var(--success)' : 'var(--danger)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 500 }}>
                    {r.status === 'cleared' ? 'Approved' : 'Rejected'}: {r.student_name}
                  </p>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {r.student_id} &bull; {new Date(r.reviewed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )) : (
              <p className="text-muted text-sm" style={{ textAlign: 'center', padding: '1rem 0' }}>No recent activity</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
