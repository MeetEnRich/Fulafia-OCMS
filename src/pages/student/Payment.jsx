import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { paymentAPI } from '../../services/api';
import { Card, Btn, Input, StatusBadge } from '../../components/UI';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function Payment() {
  const { showToast, user } = useApp();
  const [step, setStep] = useState(1); // 1 = Fee Grid, 2 = Receipt
  const [feeType, setFeeType] = useState('');
  const [amount, setAmount] = useState(0);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [showModal, setShowModal] = useState(false);
  const [paymentState, setPaymentState] = useState('idle'); // 'idle' | 'loading' | 'success'
  const [receipt, setReceipt] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await paymentAPI.getPayments();
      setHistory(res.data.payments);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectFee = (name, cost) => {
    if (history.some(p => p.fee_type === name && p.status === 'success')) {
      showToast(`You have already paid the ${name}.`, 'warning', 'Already Paid');
      return;
    }
    setFeeType(name);
    setAmount(cost);
    setShowModal(true);
    setPaymentState('idle');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentState('loading');
    try {
      const res = await paymentAPI.makePayment({
        feeType,
        amount,
        cardLastFour: card.number.slice(-4) || '0000'
      });
      setReceipt(res.data.payment);
      setPaymentState('success');
      fetchHistory();
      
      setTimeout(() => {
        setShowModal(false);
        setStep(2); // Show receipt
        setCard({ number: '', name: '', expiry: '', cvv: '' });
      }, 2000);
      
    } catch (err) {
      showToast(err.response?.data?.error || 'Payment failed. Please try again.', 'error');
      setPaymentState('idle');
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Gateway</h1>

      {/* Stepper removed for modal flow */}

      <div>
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { name: 'Convocation Fee', amount: 15000 },
              { name: 'Alumni Development Levy', amount: 5000 },
              { name: 'Library Processing Fee', amount: 2000 },
              { name: 'Transcript Fee', amount: 3000 },
              { name: 'Alumni Association Fee', amount: 10000 }
            ].map((fee) => (
              <Card key={fee.name} className="p-4" style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: '1.5rem' }} onClick={() => handleSelectFee(fee.name, fee.amount)} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{fee.name}</h3>
                <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)', margin: 0 }}>
                  ₦{fee.amount.toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        )}



        {step === 2 && receipt && (
          <div style={{ maxWidth: 600 }}>
            <Card>
              <div className="card-body" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', background: 'var(--success-bg)', color: 'var(--success)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem'
                }}>
                  <CheckCircle size={32} />
                </div>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Payment Successful!</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Your payment of ₦{receipt.amount.toLocaleString()} for {receipt.feeType} was successful.</p>
                
                <div style={{ background: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius)', textAlign: 'left', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-secondary">Reference No:</span>
                    <span className="font-medium">{receipt.referenceNo}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span className="text-secondary">Date:</span>
                    <span className="font-medium">{new Date(receipt.paidAt).toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span className="text-secondary">Card:</span>
                    <span className="font-medium">**** **** **** {receipt.cardLastFour}</span>
                  </div>
                </div>

                <Btn onClick={() => { setStep(1); setCard({ number: '', name: '', expiry: '', cvv: '' }); }} variant="primary">Make Another Payment</Btn>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Remita Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel animate-slideDown" style={{ maxWidth: 450, padding: 0, overflow: 'hidden', background: '#f8f9fa' }}>
            {/* Orange Top Bar */}
            <div style={{ height: 6, background: '#F47920', width: '100%' }}></div>
            
            {/* Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', background: 'white', textAlign: 'center', position: 'relative' }}>
              <button 
                onClick={() => setShowModal(false)}
                style={{ position: 'absolute', top: '1rem', right: '1rem', color: '#64748b' }}
              >✕</button>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <img src="/logo.png" alt="FULafia" style={{ height: 32 }} />
                <h3 style={{ margin: 0, color: '#1e293b', fontWeight: 600, fontSize: '1.125rem' }}>FULafia OCMS</h3>
              </div>
              
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>{user?.email || `${String(user?.user_id || user?.id || 'student').toLowerCase().replace(/\//g, '')}@fulafia.edu.ng`}</p>
              <h2 style={{ margin: '0.5rem 0 0 0', color: '#0f172a', fontSize: '2rem', fontWeight: 700 }}>
                ₦{amount.toLocaleString()}
              </h2>
            </div>

            {/* Body */}
            <div style={{ padding: '2rem', background: 'white' }}>
              {paymentState === 'success' ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }} className="animate-pulse">
                  <div style={{ 
                    width: 80, height: 80, borderRadius: '50%', background: '#dcfce7', color: '#16a34a',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem'
                  }}>
                    <CheckCircle size={40} />
                  </div>
                  <h3 style={{ color: '#16a34a', fontSize: '1.25rem', fontWeight: 600 }}>Payment Successful</h3>
                  <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.5rem' }}>Redirecting to receipt...</p>
                </div>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1e293b', marginBottom: '1rem' }}>Enter Card Details</p>
                    <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                      <input 
                        type="text" 
                        required 
                        maxLength="19" 
                        placeholder="Card Number (e.g. 4000 1234 5678 9010)" 
                        value={card.number} 
                        onChange={e => setCard({...card, number: e.target.value})}
                        style={{ width: '100%', padding: '1rem', border: 'none', borderBottom: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9375rem' }}
                      />
                      <div style={{ display: 'flex' }}>
                        <input 
                          type="text" 
                          required 
                          placeholder="MM/YY" 
                          value={card.expiry} 
                          onChange={e => setCard({...card, expiry: e.target.value})}
                          style={{ width: '50%', padding: '1rem', border: 'none', borderRight: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9375rem' }}
                        />
                        <input 
                          type="password" 
                          required 
                          maxLength="3" 
                          placeholder="CVV" 
                          value={card.cvv} 
                          onChange={e => setCard({...card, cvv: e.target.value})}
                          style={{ width: '50%', padding: '1rem', border: 'none', outline: 'none', fontSize: '0.9375rem' }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={paymentState === 'loading'}
                    style={{ 
                      width: '100%', padding: '1rem', borderRadius: '8px',
                      background: paymentState === 'loading' ? '#fca5a5' : '#F47920', // Remita Orange
                      color: 'white', fontWeight: 600, fontSize: '1rem',
                      border: 'none', cursor: paymentState === 'loading' ? 'not-allowed' : 'pointer',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}
                  >
                    {paymentState === 'loading' ? (
                      <span style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    ) : (
                      `Pay ₦${amount.toLocaleString()}`
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Footer Trust Badge */}
            <div style={{ padding: '1rem', background: '#f8f9fa', textAlign: 'center', borderTop: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>🔒 Secured by</span>
              <span style={{ fontSize: '0.875rem', color: '#1e3a8a', fontWeight: 800, letterSpacing: '-0.5px' }}>Remita</span>
            </div>
          </div>
        </div>
      )}

      <h2 style={{ fontSize: '1.25rem', marginTop: '3rem', marginBottom: '1rem' }}>Payment History</h2>
      <Card>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Fee Type</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No payments found.</td></tr>
              ) : (
                history.map(p => (
                  <tr key={p.reference_no}>
                    <td className="font-medium">{p.reference_no}</td>
                    <td>{p.fee_type}</td>
                    <td>₦{p.amount.toLocaleString()}</td>
                    <td>{new Date(p.paid_at).toLocaleDateString()}</td>
                    <td><StatusBadge status={p.status} /></td>
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
