import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, StatusBadge, Btn } from '../components/UI';
import { CheckCircle, XCircle, Clock, User, CreditCard, FileText, AlertCircle } from 'lucide-react';

const ROLE_META = {
  bursary: { label: 'Bursary Department', dept: 'bursary', color: '#1A5C2A', desc: 'Review payment transactions and approve financial clearance' },
  library: { label: 'University Library', dept: 'library', color: '#1A5C2A', desc: 'Verify book returns and library dues' },
  hod: { label: 'Department / Faculty', dept: 'hod', color: '#1A5C2A', desc: 'Academic sign-off and departmental requirements' },
  student_affairs: { label: 'Student Affairs', dept: 'student_affairs', color: '#1A5C2A', desc: 'ID card return and sundry dues verification' },
};

const MOCK_STUDENT = {
  name: 'Mtser Emmanuel Terngu',
  matric: '2021/CP/CSC/0076',
  department: 'Computer Science',
  level: '400',
  faculty: 'Computing',
};

export default function StaffDashboard() {
  const { user, clearanceData, updateClearance, paymentRecord } = useApp();
  const meta = ROLE_META[user.role];
  const myDept = clearanceData[meta.dept];
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState('');
  const [done, setDone] = useState(false);

  const handleAction = async (action) => {
    if (action === 'rejected' && !comment.trim()) return;
    setLoading(action);
    await new Promise(r => setTimeout(r, 1000));
    updateClearance(meta.dept, action, comment || (action === 'cleared' ? 'All requirements satisfied.' : ''));
    setLoading('');
    setDone(true);
  };

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, var(--green) 0%, var(--green-mid) 100%)',
        borderRadius: 'var(--radius-lg)', padding: '24px 28px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,168,76,0.1)' }} />
        <div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, marginBottom: 3 }}>Logged in as Officer</p>
          <h2 style={{ color: 'var(--gold)', fontSize: 20, marginBottom: 2 }}>{user.name}</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>{meta.label}</p>
        </div>
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <StatusBadge status={myDept.status} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 6 }}>Current student status</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Student Info Card */}
        <Card className="animate-fade-up delay-1" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 15 }}>Student on Clearance</h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Full Name', value: MOCK_STUDENT.name },
              { label: 'Matric No.', value: MOCK_STUDENT.matric },
              { label: 'Department', value: MOCK_STUDENT.department },
              { label: 'Level', value: MOCK_STUDENT.level + ' Level' },
              { label: 'Faculty', value: MOCK_STUDENT.faculty },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--gray-100)' }}>
                <span style={{ color: 'var(--gray-400)' }}>{r.label}</span>
                <span style={{ fontWeight: 500 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment / Verification Info */}
        <Card className="animate-fade-up delay-2" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gold-pale)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={16} color="var(--gold)" />
            </div>
            <h3 style={{ fontSize: 15 }}>
              {user.role === 'bursary' ? 'Payment Verification' : 'Requirements Check'}
            </h3>
          </div>

          {user.role === 'bursary' ? (
            paymentRecord ? (
              <div>
                <div style={{ background: 'var(--success-light)', borderRadius: 'var(--radius)', padding: 14, marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--success)', fontWeight: 600, marginBottom: 8, fontSize: 13 }}>
                    <CheckCircle size={14} /> Payment Confirmed via Gateway
                  </div>
                  {[
                    { label: 'Transaction Ref', value: paymentRecord.ref, mono: true },
                    { label: 'Fee Type', value: paymentRecord.feeType },
                    { label: 'Amount', value: '₦' + paymentRecord.amount.toLocaleString() },
                    { label: 'Date/Time', value: paymentRecord.date },
                  ].map(r => (
                    <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--gray-600)' }}>{r.label}</span>
                      <span style={{ fontWeight: 600, fontFamily: r.mono ? 'monospace' : 'inherit', color: 'var(--green)' }}>{r.value}</span>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                  Transaction automatically verified via FULafia Payment Gateway. No manual teller upload required.
                </p>
              </div>
            ) : (
              <div style={{ padding: '20px 0', textAlign: 'center' }}>
                <AlertCircle size={32} color="var(--gold)" style={{ marginBottom: 8 }} />
                <p style={{ fontSize: 13, color: 'var(--gray-600)' }}>No payment recorded yet for this student.</p>
                <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>Awaiting student payment via gateway.</p>
              </div>
            )
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {user.role === 'library' && [
                { label: 'Books Returned', value: 'Yes', ok: true },
                { label: 'Library Fine', value: '₦0', ok: true },
                { label: 'Library Card', value: 'Surrendered', ok: true },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ color: 'var(--gray-400)' }}>{r.label}</span>
                  <span style={{ color: r.ok ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              {user.role === 'hod' && [
                { label: 'Project Submitted', value: 'Yes', ok: true },
                { label: 'Exam Clearance', value: 'Passed', ok: true },
                { label: 'Dept. Dues', value: 'Paid', ok: true },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ color: 'var(--gray-400)' }}>{r.label}</span>
                  <span style={{ color: r.ok ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
              {user.role === 'student_affairs' && [
                { label: 'ID Card Returned', value: 'Yes', ok: true },
                { label: 'Sports Complex', value: 'Cleared', ok: true },
                { label: 'Hostel Dues', value: 'N/A', ok: true },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, paddingBottom: 8, borderBottom: '1px solid var(--gray-100)' }}>
                  <span style={{ color: 'var(--gray-400)' }}>{r.label}</span>
                  <span style={{ color: r.ok ? 'var(--success)' : 'var(--danger)', fontWeight: 500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Action Card */}
        <Card className="animate-fade-up delay-3" style={{ padding: 24, gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, background: 'var(--gray-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={16} color="var(--green)" />
            </div>
            <h3 style={{ fontSize: 15 }}>Clearance Decision</h3>
          </div>

          {(myDept.status !== 'pending' || done) ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: myDept.status === 'cleared' ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: 'var(--radius)' }}>
              {myDept.status === 'cleared'
                ? <CheckCircle size={20} color="var(--success)" />
                : <XCircle size={20} color="var(--danger)" />}
              <div>
                <div style={{ fontWeight: 600, color: myDept.status === 'cleared' ? 'var(--success)' : 'var(--danger)', fontSize: 14 }}>
                  {myDept.status === 'cleared' ? 'Clearance Approved' : 'Clearance Rejected'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-600)' }}>{myDept.comment}</div>
                <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>by {myDept.officer} · {myDept.date}</div>
              </div>
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-600)', display: 'block', marginBottom: 6 }}>
                  Comment (required for rejection)
                </label>
                <textarea
                  value={comment} onChange={e => setComment(e.target.value)}
                  placeholder="Enter a comment or reason for rejection..."
                  rows={3}
                  style={{
                    width: '100%', border: '1.5px solid var(--gray-200)', borderRadius: 'var(--radius)',
                    padding: '10px 13px', fontSize: 13, resize: 'vertical',
                    fontFamily: 'var(--font-body)',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                  onBlur={e => e.target.style.borderColor = 'var(--gray-200)'}
                />
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <Btn variant="primary" onClick={() => handleAction('cleared')} disabled={!!loading} style={{ flex: 1, justifyContent: 'center' }}>
                  <CheckCircle size={15} />
                  {loading === 'cleared' ? 'Approving...' : 'Approve Clearance'}
                </Btn>
                <Btn variant="danger" onClick={() => handleAction('rejected')} disabled={!!loading || !comment.trim()} style={{ flex: 1, justifyContent: 'center' }}>
                  <XCircle size={15} />
                  {loading === 'rejected' ? 'Rejecting...' : 'Reject Clearance'}
                </Btn>
              </div>
              <p style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 8 }}>A comment is required to reject a request.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
