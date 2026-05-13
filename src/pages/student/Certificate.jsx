import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { Card, Btn } from '../../components/UI';
import { Download, Award, AlertCircle, CheckCircle, CreditCard } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Certificate() {
  const { user } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [unpaidFees, setUnpaidFees] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await adminAPI.getCertificate(user.userId);
        setData(res.data.certificate);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load certificate');
        setErrorCode(err.response?.data?.code || null);
        setUnpaidFees(err.response?.data?.unpaidFees || []);
      }
      setLoading(false);
    };
    fetchCert();
  }, [user.userId]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`FULafia_Clearance_${user.userId.replace(/\//g, '_')}.pdf`);
    } catch (err) {
      console.error('Download error:', err);
    }
    setDownloading(false);
  };

  if (loading) return (
    <div>
      <div className="skeleton" style={{ height: '2rem', width: '50%', marginBottom: '1.5rem' }} />
      <div className="skeleton" style={{ height: 400, borderRadius: 'var(--radius-xl)' }} />
    </div>
  );

  if (error) {
    const isBioError = errorCode === 'BIO_NOT_VERIFIED';
    const isPaymentError = errorCode === 'PAYMENTS_INCOMPLETE';
    return (
      <Card style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div className="card-body" style={{ padding: '3rem 2rem' }}>
          {isPaymentError ? (
            <CreditCard size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          ) : (
            <AlertCircle size={48} color={isBioError ? 'var(--gold)' : 'var(--warning)'} style={{ marginBottom: '1rem' }} />
          )}
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            {isBioError ? 'Bio-Data Verification Required' : isPaymentError ? 'Outstanding Payments' : 'Certificate Not Available'}
          </h2>
          <p className="text-secondary text-sm" style={{ maxWidth: 360, margin: '0 auto 1rem' }}>
            {isPaymentError ? 'You must complete all required fee payments before your certificate can be generated.' : error}
          </p>
          {isPaymentError && unpaidFees.length > 0 && (
            <div style={{ textAlign: 'left', background: 'var(--bg)', borderRadius: 'var(--radius)', padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Unpaid Fees</p>
              {unpaidFees.map(fee => {
                const amounts = { 'Convocation Fee': 15000, 'Clearance Processing Fee': 5000, 'Library Processing Fee': 2000, 'Alumni Association Fee': 10000 };
                return (
                  <div key={fee} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                    <span>{fee}</span>
                    <span style={{ fontWeight: 600, color: 'var(--danger)' }}>₦{(amounts[fee] || 0).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
          )}
          {isBioError && (
            <a href="/student/bio-verification" className="btn btn--gold">Verify Bio-Data</a>
          )}
          {isPaymentError && (
            <a href="/student/payment" className="btn btn--primary">Go to Payments</a>
          )}
        </div>
      </Card>
    );
  }

  const verificationUrl = `https://fulafia.edu.ng/verify/${data.certNo}`;

  return (
    <div>
      <div className="page-header">
        <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Clearance Certificate</h1>
        <Btn onClick={handleDownload} disabled={downloading} variant="primary">
          <Download size={16} />
          {downloading ? 'Generating PDF...' : 'Download PDF'}
        </Btn>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: '2rem' }}>
        {/* Certificate container — landscape A4 aspect ratio, fits on screen */}
        <div ref={certRef} style={{
          background: '#FFFFFF', width: '100%', maxWidth: '900px', aspectRatio: '297 / 210',
          padding: '6% 8%', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          position: 'relative', color: '#111827', fontFamily: '"Times New Roman", Times, serif',
          boxSizing: 'border-box'
        }}>

          {/* Watermark */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
            fontSize: '5rem', color: 'rgba(26,92,42,0.03)', fontWeight: 'bold', letterSpacing: '0.2em',
            textTransform: 'uppercase', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0
          }}>FULAFIA</div>

          {/* Double border */}
          <div style={{ position: 'absolute', inset: '3%', border: '3px double #1A5C2A', pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: '4%', border: '1px solid #C9A84C', pointerEvents: 'none', zIndex: 1 }} />

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            
            {/* Top Section */}
            <div>
              <img src="/logo.png" alt="FULafia Logo" style={{ width: 64, height: 64, objectFit: 'contain', marginBottom: '0.5rem' }} />

              <h1 style={{ fontSize: '1.5rem', textTransform: 'uppercase', color: '#1A5C2A', marginBottom: '0.125rem', letterSpacing: '3px' }}>
                Federal University of Lafia
              </h1>
              <p style={{ fontSize: '0.75rem', color: '#666', marginBottom: '0.25rem', letterSpacing: '1px' }}>
                P.M.B. 146, Lafia, Nasarawa State, Nigeria
              </p>
              <div style={{ width: 60, height: 2, background: '#C9A84C', margin: '0.5rem auto 0.75rem' }} />

              <h2 style={{ fontSize: '1.125rem', fontWeight: 'normal', fontStyle: 'italic', marginBottom: '1rem', color: '#333' }}>
                Final Year Clearance Certificate
              </h2>

              <p style={{ fontSize: '0.9375rem', marginBottom: '0.75rem' }}>This is to certify that</p>

              <h3 style={{ fontSize: '1.625rem', color: '#111', borderBottom: '2px dotted #C9A84C', display: 'inline-block', padding: '0 1.5rem 0.2rem', marginBottom: '0.5rem' }}>
                {data.student.full_name}
              </h3>

              <div style={{ fontSize: '0.875rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap', marginBottom: '1rem', marginTop: '0.5rem' }}>
                <p><strong>Matric No:</strong> {data.student.user_id}</p>
                <p><strong>Department:</strong> {data.student.department}</p>
                <p><strong>Faculty:</strong> {data.student.faculty}</p>
              </div>

              <p style={{ fontSize: '0.875rem', maxWidth: 600, margin: '0 auto', lineHeight: 1.8 }}>
                has successfully completed all necessary exit clearance procedures for the <strong>{data.student.session}</strong> academic session and is hereby cleared of all university obligations.
              </p>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '1rem' }}>
              <div style={{ textAlign: 'left' }}>
                <p style={{ borderTop: '1px solid #333', paddingTop: '0.25rem', fontWeight: 'bold', fontSize: '0.6875rem' }}>Certificate No.</p>
                <p style={{ fontSize: '0.6875rem', color: '#444' }}>{data.certNo}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <QRCodeSVG
                  value={verificationUrl}
                  size={56}
                  level="M"
                  includeMargin={false}
                  fgColor="#1A5C2A"
                />
                <p style={{ fontSize: '0.4375rem', color: '#999', marginTop: '0.125rem' }}>Scan to verify</p>
              </div>

              <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '-5px' }}>
                  <img src="/signature.png" alt="Signature" style={{ width: 80, height: 'auto', display: 'block', margin: '0 auto' }} />
                </div>
                <p style={{ borderTop: '1px solid #333', paddingTop: '0.25rem', fontWeight: 'bold', fontSize: '0.6875rem', marginBottom: 0 }}>Registrar</p>
                <p style={{ fontSize: '0.5625rem', color: '#666', marginTop: '0.125rem' }}>Dr. Abubakar Sani</p>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ borderTop: '1px solid #333', paddingTop: '0.25rem', fontWeight: 'bold', fontSize: '0.6875rem' }}>Date Issued</p>
                <p style={{ fontSize: '0.6875rem', color: '#444' }}>{new Date(data.issuedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
