import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { paymentAPI } from '../../services/api';
import { Card, Btn, Input, StatusBadge } from '../../components/UI';
import { CreditCard, CheckCircle } from 'lucide-react';

export default function Payment() {
  const { showToast } = useApp();
  const [step, setStep] = useState(1);
  const [feeType, setFeeType] = useState('');
  const [amount, setAmount] = useState(0);
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
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
    setStep(2);
  };

  const handleCardSubmit = (e) => {
    e.preventDefault();
    setStep(3);
    // Simulate OTP autofill
    setTimeout(() => setOtp('123456'), 2000);
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await paymentAPI.makePayment({
        feeType,
        amount,
        cardLastFour: card.number.slice(-4) || '0000'
      });
      setReceipt(res.data.payment);
      setStep(4);
      fetchHistory();
    } catch (err) {
      showToast(err.response?.data?.error || 'Payment failed. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Payment Gateway</h1>

      {/* Stepper */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', maxWidth: 600 }}>
        {['Select Fee', 'Card Details', 'OTP Verification', 'Receipt'].map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', margin: '0 auto 0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: step > i + 1 ? 'var(--success)' : step === i + 1 ? 'var(--primary)' : 'var(--border)',
              color: 'white', fontWeight: 'bold'
            }}>
              {step > i + 1 ? <CheckCircle size={18} /> : i + 1}
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: step === i + 1 ? 600 : 400, color: step === i + 1 ? 'var(--primary)' : 'var(--text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div style={{ maxWidth: 600 }}>
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: 'Convocation Fee', amount: 15000 },
              { name: 'Alumni Development Levy', amount: 5000 },
              { name: 'Library Processing Fee', amount: 2000 },
              { name: 'Transcript Fee', amount: 3000 }
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

        {step === 2 && (
          <Card>
            <div className="card-header">
              <h2 className="card-title">Card Details</h2>
              <span className="badge badge--info">₦{amount.toLocaleString()}</span>
            </div>
            <div className="card-body">
              <form onSubmit={handleCardSubmit}>
                <Input label="Cardholder Name" required value={card.name} onChange={e => setCard({...card, name: e.target.value})} />
                <Input label="Card Number" required maxLength="19" placeholder="**** **** **** ****" value={card.number} onChange={e => setCard({...card, number: e.target.value})} />
                <div className="grid grid-cols-2 gap-4">
                  <Input label="Expiry (MM/YY)" required placeholder="12/26" value={card.expiry} onChange={e => setCard({...card, expiry: e.target.value})} />
                  <Input label="CVV" type="password" required maxLength="3" placeholder="123" value={card.cvv} onChange={e => setCard({...card, cvv: e.target.value})} />
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <Btn type="button" variant="outline" onClick={() => setStep(1)}>Back</Btn>
                  <Btn type="submit" variant="primary" style={{ flex: 1 }}>Proceed</Btn>
                </div>
              </form>
            </div>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <div className="card-header">
              <h2 className="card-title">OTP Verification</h2>
            </div>
            <div className="card-body" style={{ textAlign: 'center' }}>
              <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Please enter the 6-digit OTP sent to your registered phone number.
              </p>
              <form onSubmit={handlePaymentSubmit}>
                <input
                  type="text"
                  maxLength="6"
                  required
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  style={{
                    fontSize: '2rem', letterSpacing: '0.5em', textAlign: 'center',
                    padding: '1rem', width: '100%', borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)', marginBottom: '1.5rem'
                  }}
                />
                <Btn type="submit" variant="primary" className="w-full" disabled={loading || otp.length !== 6}>
                  {loading ? 'Processing...' : 'Complete Payment'}
                </Btn>
              </form>
            </div>
          </Card>
        )}

        {step === 4 && receipt && (
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

              <Btn onClick={() => { setStep(1); setCard({ number: '', name: '', expiry: '', cvv: '' }); setOtp(''); }} variant="primary">Make Another Payment</Btn>
            </div>
          </Card>
        )}
      </div>

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
