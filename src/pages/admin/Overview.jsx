import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { Card, ProgressBar } from '../../components/UI';
import { Users, CheckCircle, Clock, DollarSign, MessageSquare, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DEPT_SHORT = {
  bursary: 'Bursary', library: 'Library', department: 'Dept',
  faculty: 'Faculty', clinic: 'Clinic', hostel: 'Hostel', student_affairs: 'S. Affairs'
};

export default function AdminOverview() {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchStats();
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

  if (!stats) return null;

  const clearanceRate = stats.totalStudents > 0 ? Math.round((stats.fullyCleared / stats.totalStudents) * 100) : 0;

  // Prepare chart data
  const deptChartData = (stats.deptStats || []).map(d => ({
    name: DEPT_SHORT[d.department] || d.department,
    Cleared: d.cleared,
    Pending: d.pending,
    Rejected: d.rejected,
  }));

  const pieData = [
    { name: 'Fully Cleared', value: stats.fullyCleared, color: '#1A5C2A' },
    { name: 'In Progress', value: stats.inProgress, color: '#C9A84C' },
  ].filter(d => d.value > 0);

  return (
    <div>
      {/* ═══ Welcome Banner ═══ */}
      <div style={{
        background: 'var(--primary-gradient)', borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem', color: 'white', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ margin: '0 0 0.25rem', opacity: 0.8, fontSize: '0.8125rem' }}>System Administrator</p>
        <h1 style={{ fontSize: '1.375rem', marginBottom: '0.25rem', color: 'white' }}>{user.fullName}</h1>
        <p style={{ opacity: 0.7, margin: 0, fontSize: '0.8125rem' }}>System Administrator &bull; {user.department}</p>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Students', value: stats.totalStudents, icon: Users, bg: 'var(--info-bg)', color: 'var(--info)' },
          { label: 'Fully Cleared', value: stats.fullyCleared, icon: CheckCircle, bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'In Progress', value: stats.inProgress, icon: Clock, bg: 'var(--warning-bg)', color: 'var(--warning)' },
          { label: 'Revenue', value: `₦${stats.totalPayments.toLocaleString()}`, icon: DollarSign, bg: 'var(--gold-light)', color: 'var(--gold)' },
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

      {/* ═══ Clearance Rate ═══ */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <TrendingUp size={18} color="var(--primary)" />
              <h3 style={{ margin: 0, fontSize: '1rem', fontFamily: 'var(--font-body)' }}>University Clearance Rate</h3>
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 700, color: clearanceRate >= 50 ? 'var(--success)' : 'var(--warning)' }}>{clearanceRate}%</span>
          </div>
          <ProgressBar value={clearanceRate} color={clearanceRate >= 50 ? 'var(--success)' : 'var(--warning)'} />
          <p className="text-muted text-sm" style={{ marginTop: '0.5rem' }}>
            {stats.fullyCleared} of {stats.totalStudents} students have completed all {stats.totalDepartments || 7} clearance requirements.
          </p>
        </div>
      </Card>

      {/* ═══ Charts ═══ */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Department Performance</h3>
          </div>
          <div className="card-body" style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptChartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                <Bar dataKey="Cleared" fill="#1A5C2A" radius={[4,4,0,0]} />
                <Bar dataKey="Pending" fill="#C9A84C" radius={[4,4,0,0]} />
                <Bar dataKey="Rejected" fill="#DC2626" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Clearance Distribution</h3>
          </div>
          <div className="card-body" style={{ height: 320 }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={95} paddingAngle={3} dataKey="value" stroke="none">
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                  <Tooltip formatter={(val, name) => [`${val} students`, name]} />
                  <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center" style={{ height: '100%', color: 'var(--text-muted)' }}>No data</div>
            )}
          </div>
        </Card>
      </div>

      {/* ═══ System Info Footer ═══ */}
      {stats.openTickets > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '1rem 1.25rem', background: 'var(--info-bg)', border: '1px solid rgba(37,99,235,0.2)',
          borderRadius: 'var(--radius)', marginTop: '1.5rem', fontSize: '0.8125rem'
        }}>
          <MessageSquare size={18} color="var(--info)" />
          <span><strong>{stats.openTickets} open support ticket{stats.openTickets !== 1 ? 's' : ''}</strong> across all departments.</span>
        </div>
      )}
    </div>
  );
}
