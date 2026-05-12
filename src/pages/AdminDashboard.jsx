import { useApp } from '../context/AppContext';
import { Card, StatusBadge } from '../components/UI';
import { Users, ShieldCheck, BarChart2, Settings, Activity } from 'lucide-react';

const MOCK_AUDIT = [
  { action: 'Bursary Approved', student: '2021/CP/CSC/0076', officer: 'Mrs. Aisha Suleiman', time: '10:42 AM' },
  { action: 'Library Cleared', student: '2021/CP/CSC/0076', officer: 'Mr. Daniel Okeke', time: '11:15 AM' },
  { action: 'HOD Sign-off', student: '2021/CP/CSC/0076', officer: 'Dr. Fatima Aliyu', time: '11:58 AM' },
  { action: 'Payment Verified', student: '2021/ENG/EEE/0043', officer: 'Mrs. Aisha Suleiman', time: '12:10 PM' },
  { action: 'Library Rejected', student: '2020/CP/MIS/0018', officer: 'Mr. Daniel Okeke', time: '12:34 PM' },
];

const MOCK_DEPTS = [
  { name: 'Bursary', cleared: 142, pending: 23, rejected: 5 },
  { name: 'Library', cleared: 128, pending: 31, rejected: 12 },
  { name: 'HOD / Faculty', cleared: 156, pending: 14, rejected: 3 },
  { name: 'Student Affairs', cleared: 139, pending: 28, rejected: 7 },
];

export default function AdminDashboard() {
  const { user } = useApp();

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto' }}>
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,168,76,0.1)' }} />
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 3 }}>System Administrator</p>
          <h2 style={{ color: 'var(--gold)', fontSize: 20, marginBottom: 2 }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>ICT Directorate — FULafia OCMS Admin Panel</p>
        </div>
        <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>565</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Total Students</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
            <div style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>389</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Fully Cleared</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 16px', textAlign: 'center' }}>
            <div style={{ color: '#f5a623', fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700 }}>96</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>In Progress</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Department Stats */}
        <Card className="animate-fade-up delay-1" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={16} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 15 }}>Department Performance</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
            {MOCK_DEPTS.map(d => (
              <div key={d.name} style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 12 }}>{d.name}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { label: 'Cleared', val: d.cleared, color: 'var(--success)' },
                    { label: 'Pending', val: d.pending, color: 'var(--pending)' },
                    { label: 'Rejected', val: d.rejected, color: 'var(--danger)' },
                  ].map(s => (
                    <div key={s.label}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                        <span style={{ color: 'var(--gray-400)' }}>{s.label}</span>
                        <span style={{ fontWeight: 600, color: s.color }}>{s.val}</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--gray-200)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: s.color, width: Math.round((s.val / 170) * 100) + '%', borderRadius: 2 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Audit Log */}
        <Card className="animate-fade-up delay-2" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 15 }}>Recent Audit Log</h3>
          </div>
          {MOCK_AUDIT.map((entry, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 12, borderBottom: i < MOCK_AUDIT.length - 1 ? '1px solid var(--gray-100)' : 'none', marginBottom: i < MOCK_AUDIT.length - 1 ? 12 : 0 }}>
              <div style={{ width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{entry.action}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{entry.student} · by {entry.officer}</div>
              </div>
              <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{entry.time}</div>
            </div>
          ))}
        </Card>

        {/* Quick Actions */}
        <Card className="animate-fade-up delay-3" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Settings size={16} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 15 }}>Admin Tools</h3>
          </div>
          {[
            { icon: Users, label: 'Manage User Accounts', sub: '565 students · 12 staff' },
            { icon: ShieldCheck, label: 'Role & Permission Manager', sub: 'Assign departmental access' },
            { icon: BarChart2, label: 'Generate Reports', sub: 'Export clearance statistics' },
            { icon: Activity, label: 'Full Audit Trail', sub: 'Complete system action log' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 12px', borderRadius: 'var(--radius)',
              cursor: 'pointer', transition: 'background 0.2s',
              marginBottom: 4,
            }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--gray-50)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: 36, height: 36, background: 'var(--gold-pale)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={16} color="var(--gold)" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
