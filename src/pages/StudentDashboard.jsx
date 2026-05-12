import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, StatusBadge, Btn } from '../components/UI';
import { CheckCircle, Clock, XCircle, CreditCard, Download, BookOpen, Briefcase, Users, Building2, ArrowRight, Shield } from 'lucide-react';

const DEPARTMENTS = [
  { key: 'bursary', label: 'Bursary', icon: CreditCard, desc: 'Financial clearance & fee verification' },
  { key: 'library', label: 'University Library', icon: BookOpen, desc: 'Book returns & library dues' },
  { key: 'hod', label: 'Department / HOD', icon: Briefcase, desc: 'Academic & departmental sign-off' },
  { key: 'student_affairs', label: 'Student Affairs', icon: Users, desc: 'ID card return & sundry dues' },
];

const FEES = [
  { key: 'alumni', label: 'Alumni Development Levy', amount: 5000 },
  { key: 'library_fine', label: 'Library Processing Fee', amount: 2000 },
  { key: 'convocation', label: 'Convocation Fee', amount: 15000 },
  { key: 'transcript', label: 'Transcript Fee', amount: 3000 },
];

export default function StudentDashboard() {
  const { user, clearanceData, paymentRecord, makePayment, allCleared } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [payStep, setPayStep] = useState(1);
  const [selectedFee, setSelectedFee] = useState(FEES[2]);
  const [processing, setProcessing] = useState(false);
  const [paidRecord, setPaidRecord] = useState(null);

  const clearedCount = Object.values(clearanceData).filter(d => d.status === 'cleared').length;
  const progress = Math.round((clearedCount / 4) * 100);

  const handlePayment = async () => {
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2000));
    const record = makePayment(selectedFee.amount, selectedFee.label);
    setPaidRecord(record);
    setPayStep(3);
    setProcessing(false);
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'payment', label: 'Make Payment' },
    { key: 'clearance', label: 'Clearance Status' },
    { key: 'certificate', label: 'Certificate' },
  ];

  return (
    <div style={{ padding: '28px 32px', maxWidth: 980, margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="animate-fade-up" style={{
        background: 'linear-gradient(135deg, var(--green) 0%, var(--green-light) 100%)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: 28,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,168,76,0.1)' }} />
        <div style={{ position: 'absolute', right: 80, bottom: -50, width: 140, height: 140, borderRadius: '50%', background: 'rgba(201,168,76,0.07)' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 4 }}>Welcome back,</p>
          <h2 style={{ color: 'white', fontSize: 22, marginBottom: 4 }}>{user.name}</h2>
          <p style={{ color: 'var(--gold-light)', fontSize: 13 }}>
            {user.matric} &nbsp;·&nbsp; {user.department} &nbsp;·&nbsp; {user.level} Level
          </p>
        </div>
        <div style={{ textAlign: 'right', position: 'relative', zIndex: 1 }}>
          <div style={{ color: 'var(--gold)', fontSize: 36, fontFamily: 'var(--font-display)', fontWeight: 700 }}>{progress}%</div>
          <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>Clearance Complete</div>
          <div style={{
            background: 'rgba(255,255,255,0.15)', borderRadius: 4, height: 6, width: 140, marginTop: 8, overflow: 'hidden'
          }}>
            <div style={{ background: 'var(--gold)', height: '100%', width: progress + '%', borderRadius: 4, transition: 'width 1s ease' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="animate-fade-up delay-1" style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'white', borderRadius: 'var(--radius)', padding: 4, width: 'fit-content', boxShadow: 'var(--shadow-sm)', border: '1px solid var(--gray-100)' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            padding: '8px 18px', borderRadius: 6,
            fontWeight: 500, fontSize: 13,
            background: activeTab === t.key ? 'var(--green)' : 'transparent',
            color: activeTab === t.key ? 'white' : 'var(--gray-600)',
            transition: 'all 0.2s',
          }}>{t.label}</button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="animate-fade">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
            {[
              { label: 'Cleared', count: Object.values(clearanceData).filter(d=>d.status==='cleared').length, color: 'var(--success)', bg: 'var(--success-light)', Icon: CheckCircle },
              { label: 'Pending', count: Object.values(clearanceData).filter(d=>d.status==='pending').length, color: 'var(--pending)', bg: 'var(--pending-light)', Icon: Clock },
              { label: 'Rejected', count: Object.values(clearanceData).filter(d=>d.status==='rejected').length, color: 'var(--danger)', bg: 'var(--danger-light)', Icon: XCircle },
              { label: 'Payment', count: paymentRecord ? 1 : 0, color: 'var(--green)', bg: 'var(--gold-pale)', Icon: CreditCard },
            ].map((s, i) => (
              <Card key={s.label} style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: 14 }} className={'animate-fade-up delay-' + (i+1)}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.Icon size={20} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-display)', color: s.color }}>{s.count}</div>
                  <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{s.label}</div>
                </div>
              </Card>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <Card style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Clearance Progress</h3>
              {DEPARTMENTS.map((dept, i) => {
                const d = clearanceData[dept.key];
                return (
                  <div key={dept.key} className={'animate-fade-up delay-' + (i+1)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--gray-100)' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <dept.icon size={16} color="var(--green)" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{dept.label}</div>
                      {d.comment && <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{d.comment}</div>}
                    </div>
                    <StatusBadge status={d.status} />
                  </div>
                );
              })}
            </Card>

            <Card style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>Payment Status</h3>
              {paymentRecord ? (
                <div>
                  <div style={{ background: 'var(--success-light)', borderRadius: 'var(--radius)', padding: 16, marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--success)', fontWeight: 600, marginBottom: 8 }}>
                      <CheckCircle size={16} /> Payment Confirmed
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                      <div><b>Fee:</b> {paymentRecord.feeType}</div>
                      <div><b>Amount:</b> ₦{paymentRecord.amount.toLocaleString()}</div>
                      <div><b>Ref:</b> <span style={{ fontFamily: 'monospace', color: 'var(--green)', fontWeight: 600 }}>{paymentRecord.ref}</span></div>
                      <div><b>Date:</b> {paymentRecord.date}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Your transaction reference has been sent to the Bursary for verification.</p>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CreditCard size={40} color="var(--gray-200)" style={{ marginBottom: 12 }} />
                  <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 16 }}>No payment made yet</p>
                  <Btn variant="gold" onClick={() => setActiveTab('payment')}>
                    Make Payment <ArrowRight size={14} />
                  </Btn>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <Card className="animate-fade" style={{ padding: 32, maxWidth: 520 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, background: 'var(--gold-pale)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={20} color="var(--gold)" />
            </div>
            <div>
              <h3 style={{ fontSize: 18 }}>Payment Gateway</h3>
              <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Simulated FULafia Payment Portal</p>
            </div>
          </div>

          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32, gap: 0 }}>
            {[1, 2, 3].map((s, i) => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < 2 ? 1 : 'none' }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700,
                  background: payStep >= s ? 'var(--green)' : 'var(--gray-100)',
                  color: payStep >= s ? 'white' : 'var(--gray-400)',
                  flexShrink: 0,
                }}>{s}</div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: payStep > s ? 'var(--green)' : 'var(--gray-200)', margin: '0 8px' }} />}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: -20, marginBottom: 28 }}>
            {['Select Fee', 'Confirm', 'Receipt'].map(l => (
              <span key={l} style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500 }}>{l}</span>
            ))}
          </div>

          {payStep === 1 && (
            <div className="animate-fade">
              <p style={{ fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>Select the fee you want to pay:</p>
              {FEES.map(fee => (
                <div key={fee.key} onClick={() => setSelectedFee(fee)} style={{
                  border: '1.5px solid ' + (selectedFee.key === fee.key ? 'var(--green)' : 'var(--gray-200)'),
                  background: selectedFee.key === fee.key ? 'var(--success-light)' : 'white',
                  borderRadius: 'var(--radius)', padding: '12px 16px', marginBottom: 10, cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  transition: 'all 0.2s',
                }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{fee.label}</div>
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--green)', fontFamily: 'var(--font-display)' }}>₦{fee.amount.toLocaleString()}</div>
                </div>
              ))}
              <Btn variant="primary" onClick={() => setPayStep(2)} style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                Continue <ArrowRight size={14} />
              </Btn>
            </div>
          )}

          {payStep === 2 && (
            <div className="animate-fade">
              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 20, marginBottom: 20 }}>
                <h4 style={{ fontSize: 14, marginBottom: 12 }}>Payment Summary</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Fee Type</span>
                    <span style={{ fontWeight: 500 }}>{selectedFee.label}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Student</span>
                    <span style={{ fontWeight: 500 }}>{user.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--gray-600)' }}>Matric No.</span>
                    <span style={{ fontWeight: 500 }}>{user.matric}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 700 }}>Total</span>
                    <span style={{ fontWeight: 700, color: 'var(--green)', fontSize: 16, fontFamily: 'var(--font-display)' }}>₦{selectedFee.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--gray-400)', marginBottom: 20 }}>
                <Shield size={12} /> Secured by FULafia Payment Gateway (Simulation)
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn variant="ghost" onClick={() => setPayStep(1)} style={{ flex: 1, justifyContent: 'center' }}>Back</Btn>
                <Btn variant="gold" onClick={handlePayment} disabled={processing} style={{ flex: 1, justifyContent: 'center' }}>
                  {processing ? 'Processing...' : 'Pay Now'}
                </Btn>
              </div>
            </div>
          )}

          {payStep === 3 && paidRecord && (
            <div className="animate-fade" style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'var(--success-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <CheckCircle size={32} color="var(--success)" />
              </div>
              <h3 style={{ fontSize: 20, color: 'var(--success)', marginBottom: 8 }}>Payment Successful!</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: 13, marginBottom: 20 }}>Your payment has been processed and the Bursary has been notified automatically.</p>
              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: 16, textAlign: 'left', fontSize: 13, marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--gray-600)' }}>Transaction Ref</span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--green)' }}>{paidRecord.ref}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: 'var(--gray-600)' }}>Amount</span>
                  <span style={{ fontWeight: 600 }}>₦{paidRecord.amount.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--gray-600)' }}>Date</span>
                  <span>{paidRecord.date}</span>
                </div>
              </div>
              <Btn variant="primary" onClick={() => setActiveTab('clearance')} style={{ justifyContent: 'center', width: '100%' }}>
                View Clearance Status <ArrowRight size={14} />
              </Btn>
            </div>
          )}
        </Card>
      )}

      {/* Clearance Status Tab */}
      {activeTab === 'clearance' && (
        <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {DEPARTMENTS.map((dept, i) => {
            const d = clearanceData[dept.key];
            return (
              <Card key={dept.key} className={'animate-fade-up delay-' + (i+1)} style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: d.status === 'cleared' ? 'var(--success-light)' : d.status === 'rejected' ? 'var(--danger-light)' : 'var(--gray-50)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <dept.icon size={20} color={d.status === 'cleared' ? 'var(--success)' : d.status === 'rejected' ? 'var(--danger)' : 'var(--gray-400)'} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 15 }}>{dept.label}</span>
                      <StatusBadge status={d.status} />
                    </div>
                    <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>{dept.desc}</p>
                    {d.comment && <p style={{ fontSize: 12, color: d.status === 'rejected' ? 'var(--danger)' : 'var(--gray-600)', marginTop: 4 }}>"{d.comment}"</p>}
                  </div>
                  {d.officer && (
                    <div style={{ textAlign: 'right', fontSize: 11, color: 'var(--gray-400)' }}>
                      <div>by {d.officer}</div>
                      <div>{d.date}</div>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Certificate Tab */}
      {activeTab === 'certificate' && (
        <Card className="animate-fade" style={{ padding: 32, maxWidth: 560 }}>
          {allCleared ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, background: 'var(--gold-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Download size={32} color="var(--gold)" />
              </div>
              <h3 style={{ fontSize: 20, marginBottom: 8 }}>Clearance Certificate Ready</h3>
              <p style={{ color: 'var(--gray-600)', fontSize: 13, marginBottom: 24 }}>All departments have approved your clearance. Your certificate is ready for download.</p>
              <Btn variant="gold" style={{ justifyContent: 'center', width: '100%' }}>
                <Download size={16} /> Download Certificate (PDF)
              </Btn>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 72, height: 72, background: 'var(--gray-50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Clock size={32} color="var(--gray-200)" />
              </div>
              <h3 style={{ fontSize: 18, color: 'var(--gray-400)', marginBottom: 8 }}>Certificate Not Yet Available</h3>
              <p style={{ color: 'var(--gray-400)', fontSize: 13, marginBottom: 20 }}>
                You need clearance from all {4} departments before your certificate can be generated.
              </p>
              <div style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius)', padding: '12px 20px', display: 'inline-block' }}>
                <span style={{ fontSize: 13, color: 'var(--gray-600)' }}>
                  {clearedCount} of 4 departments cleared
                </span>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
