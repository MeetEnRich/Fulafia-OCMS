import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { Card, ProgressBar } from '../../components/UI';
import { Users, CheckCircle, Clock, DollarSign, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const PIE_COLORS = ['#059669', '#D97706', '#DC2626'];

export default function AdminOverview() {
  const { user } = useApp();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await adminAPI.getStats();
        setStats(res.data.stats);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: 100, borderRadius: 'var(--radius-xl)', marginBottom: '1.5rem' }} />
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
      </div>
    </div>
  );

  const { totalStudents, fullyCleared, inProgress, deptStats, totalPayments } = stats || {};
  const clearanceRate = totalStudents > 0 ? Math.round((fullyCleared / totalStudents) * 100) : 0;

  const deptLabels = { bursary: 'Bursary', library: 'Library', hod: 'HOD', student_affairs: 'Student Affairs' };
  const barData = (deptStats || []).map(d => ({
    name: deptLabels[d.department] || d.department,
    Cleared: d.cleared || 0,
    Pending: d.pending || 0,
    Rejected: d.rejected || 0,
  }));

  const overallPieData = [
    { name: 'Cleared', value: fullyCleared || 0 },
    { name: 'In Progress', value: inProgress || 0 },
  ].filter(d => d.value > 0);

  return (
    <div>
      {/* Welcome */}
      <div style={{
        background: 'var(--primary-gradient)', borderRadius: 'var(--radius-xl)',
        padding: '1.75rem 2rem', color: 'white', marginBottom: '1.5rem',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <p style={{ margin: '0 0 0.25rem', opacity: 0.8, fontSize: '0.8125rem' }}>Welcome back,</p>
        <h1 style={{ fontSize: '1.375rem', marginBottom: '0.25rem', color: 'white' }}>{user.fullName}</h1>
        <p style={{ opacity: 0.7, margin: 0, fontSize: '0.8125rem' }}>System Administrator &bull; {user.department}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Students', value: totalStudents, icon: Users, bg: 'var(--info-bg)', color: 'var(--info)' },
          { label: 'Fully Cleared', value: fullyCleared, icon: CheckCircle, bg: 'var(--success-bg)', color: 'var(--success)' },
          { label: 'In Progress', value: inProgress, icon: Clock, bg: 'var(--warning-bg)', color: 'var(--warning)' },
          { label: 'Revenue', value: `₦${(totalPayments || 0).toLocaleString()}`, icon: DollarSign, bg: 'var(--gold-light)', color: 'var(--gold)' },
        ].map(s => (
          <Card key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}><s.icon size={20} /></div>
            <div>
              <p className="text-muted text-sm" style={{ margin: 0, lineHeight: 1.2 }}>{s.label}</p>
              <h3 style={{ fontSize: '1.375rem', margin: 0, lineHeight: 1 }}>{s.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      {/* Clearance Rate */}
      <Card style={{ marginBottom: '1.5rem' }}>
        <div className="card-body">
          <div className="flex items-center justify-between" style={{ marginBottom: '0.75rem' }}>
            <div className="flex items-center" style={{ gap: '0.5rem' }}>
              <TrendingUp size={16} color="var(--primary)" />
              <span className="font-semibold text-sm">University Clearance Rate</span>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.25rem', color: clearanceRate >= 50 ? 'var(--success)' : 'var(--warning)' }}>{clearanceRate}%</span>
          </div>
          <ProgressBar value={clearanceRate} color={clearanceRate >= 50 ? 'var(--success)' : undefined} />
          <p className="text-xs text-muted" style={{ margin: '0.5rem 0 0' }}>{fullyCleared} of {totalStudents} students have completed all clearance requirements.</p>
        </div>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        {/* Department Performance Bar Chart */}
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Department Performance</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} barGap={2} barCategoryGap="20%">
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={{ stroke: 'var(--border)' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.8125rem' }} />
                  <Bar dataKey="Cleared" fill="#059669" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Pending" fill="#D97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Rejected" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Overall Distribution Pie */}
        <Card>
          <div className="card-header">
            <h3 className="card-title" style={{ fontFamily: 'var(--font-body)' }}>Clearance Distribution</h3>
          </div>
          <div className="card-body">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={overallPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                    {overallPieData.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 'var(--radius)', border: '1px solid var(--border)', fontSize: '0.8125rem' }} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Links */}
      <h3 style={{ marginBottom: '0.75rem', fontSize: '1rem', fontFamily: 'var(--font-body)', fontWeight: 600 }}>Quick Links</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/admin/users', label: 'Manage Users', desc: `${totalStudents} users registered`, color: 'var(--primary)' },
          { to: '/admin/audit', label: 'View Audit Log', desc: 'Review all system activities', color: 'var(--info)' },
        ].map(link => (
          <Link key={link.label} to={link.to} style={{ textDecoration: 'none' }}>
            <Card interactive style={{ padding: '1.25rem' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: '0.25rem' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{link.label}</p>
                <ArrowRight size={14} color="var(--text-muted)" />
              </div>
              <p className="text-xs text-muted" style={{ margin: 0 }}>{link.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
