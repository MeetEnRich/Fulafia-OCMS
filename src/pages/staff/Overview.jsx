import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { clearanceAPI } from '../../services/api';
import { Card } from '../../components/UI';
import { Users, CheckCircle, Clock, XCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#D97706', '#059669', '#DC2626'];

export default function StaffOverview() {
  const { user } = useApp();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await clearanceAPI.getPending();
        setRequests(res.data.requests);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 120, borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
      </div>
    </div>
  );

  const pending = requests.filter(r => r.status === 'pending');
  const cleared = requests.filter(r => r.status === 'cleared');
  const rejected = requests.filter(r => r.status === 'rejected');
  const total = requests.length;

  const chartData = [
    { name: 'Pending', value: pending.length },
    { name: 'Cleared', value: cleared.length },
    { name: 'Rejected', value: rejected.length },
  ].filter(d => d.value > 0);

  const recentActivity = [...cleared, ...rejected]
    .filter(r => r.reviewed_at)
    .sort((a, b) => new Date(b.reviewed_at) - new Date(a.reviewed_at))
    .slice(0, 5);

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--primary-gradient)', borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem', color: 'white', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ margin: '0 0 0.25rem', opacity: 0.8, fontSize: '0.8125rem' }}>Welcome back,</p>
        <h1 style={{ fontSize: '1.375rem', marginBottom: '0.25rem', color: 'white' }}>{user.fullName}</h1>
        <p style={{ opacity: 0.7, margin: 0, fontSize: '0.8125rem' }}>{user.department} Officer</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Pending', value: pending.length, icon: Clock, bg: 'var(--warning-bg)', color: 'var(--warning)' },
          { label: 'Cleared', value: cleared.length, icon: CheckCircle, bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'Rejected', value: rejected.length, icon: XCircle, bg: 'var(--danger-bg)', color: 'var(--danger)' },
          { label: 'Total', value: total, icon: Users, bg: 'var(--info-bg)', color: 'var(--info)' },
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

      {/* Pending Alert + Action */}
      {pending.length > 0 && (
        <Card style={{ marginBottom: '1.5rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontFamily: 'var(--font-body)' }}>
                {pending.length} pending request{pending.length > 1 ? 's' : ''} awaiting review
              </h3>
              <p className="text-muted text-sm" style={{ margin: 0 }}>Review and process them to avoid delaying student graduation.</p>
            </div>
            <Link to="/staff/pending"><button className="btn btn--primary">Review Now <ArrowRight size={14} /></button></Link>
          </div>
        </Card>
      )}

      {/* Two Column: Chart + Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Distribution Chart */}
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Status Distribution</h3>
          </div>
          <div className="card-body">
            {total === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <Users size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p className="text-sm text-muted">No clearance requests yet</p>
              </div>
            ) : (
              <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                      {chartData.map((entry, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.8125rem' }} />
                    <Legend iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Recent Activity</h3>
          </div>
          <div className="card-body" style={{ padding: '0.5rem 1.5rem' }}>
            {recentActivity.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <Clock size={36} style={{ opacity: 0.3, marginBottom: '0.5rem' }} />
                <p className="text-sm text-muted">No activity yet</p>
              </div>
            ) : recentActivity.map((r, i) => (
              <div key={i} className="activity-item">
                <div className="activity-dot" style={{ background: r.status === 'cleared' ? 'var(--success)' : 'var(--danger)' }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 500 }}>
                    {r.status === 'cleared' ? 'Approved' : 'Rejected'}: {r.student_name}
                  </p>
                  <p className="text-xs text-muted" style={{ margin: 0 }}>
                    {r.student_id} &bull; {new Date(r.reviewed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
