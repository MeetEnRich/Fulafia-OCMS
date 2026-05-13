import { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { adminAPI } from '../../services/api';
import { Card, Btn } from '../../components/UI';
import { Download, Award, AlertCircle, CheckCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Certificate() {
  const { user } = useApp();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const certRef = useRef(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        const res = await adminAPI.getCertificate(user.userId);
        setData(res.data.certificate);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load certificate');
      }
      setLoading(false);
    };
    fetchCert();
  }, [user.userId]);

  const handleDownload = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
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
    const isBioError = error.includes('bio-data') || error.includes('bio_verified') || error === 'You must verify your bio-data before downloading your certificate.';
    return (
      <Card style={{ maxWidth: 500, margin: '3rem auto', textAlign: 'center' }}>
        <div className="card-body" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={48} color={isBioError ? 'var(--gold)' : 'var(--warning)'} style={{ marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            {isBioError ? 'Bio-Data Verification Required' : 'Certificate Not Available'}
          </h2>
          <p className="text-secondary text-sm" style={{ maxWidth: 360, margin: '0 auto 1rem' }}>{error}</p>
          {isBioError && (
            <a href="/student/bio-verification" className="btn btn--gold">Verify Bio-Data</a>
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

      <div style={{ overflowX: 'auto', paddingBottom: '2rem' }}>
        <div style={{ minWidth: 800 }}>
          {/* Certificate container */}
          <div ref={certRef} style={{
            background: '#FFFFFF', width: '297mm', minHeight: '210mm', margin: '0 auto',
            padding: '30mm 40mm', boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
            position: 'relative', color: '#111827', fontFamily: '"Times New Roman", Times, serif'
          }}>

            {/* Watermark */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-30deg)',
              fontSize: '6rem', color: 'rgba(26,92,42,0.03)', fontWeight: 'bold', letterSpacing: '0.2em',
              textTransform: 'uppercase', pointerEvents: 'none', whiteSpace: 'nowrap', zIndex: 0
            }}>FULAFIA</div>

            {/* Double border */}
            <div style={{ position: 'absolute', inset: '8mm', border: '3px double #1A5C2A', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', inset: '11mm', border: '1px solid #C9A84C', pointerEvents: 'none', zIndex: 1 }} />

            {/* Content */}
            <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <img src="/logo.png" alt="FULafia Logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: '0.75rem' }} />

              <h1 style={{ fontSize: '1.75rem', textTransform: 'uppercase', color: '#1A5C2A', marginBottom: '0.25rem', letterSpacing: '3px' }}>
                Federal University of Lafia
              </h1>
              <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.375rem', letterSpacing: '1px' }}>
                P.M.B. 146, Lafia, Nasarawa State, Nigeria
              </p>
              <div style={{ width: 80, height: 2, background: '#C9A84C', margin: '0.75rem auto 1.25rem' }} />

              <h2 style={{ fontSize: '1.375rem', fontWeight: 'normal', fontStyle: 'italic', marginBottom: '1.75rem', color: '#333' }}>
                Final Year Clearance Certificate
              </h2>

              <p style={{ fontSize: '1.125rem', marginBottom: '1.5rem' }}>This is to certify that</p>

              <h3 style={{ fontSize: '2rem', color: '#111', borderBottom: '2px dotted #C9A84C', display: 'inline-block', padding: '0 2rem 0.25rem', marginBottom: '0.75rem' }}>
                {data.student.full_name}
              </h3>

              <div style={{ fontSize: '1rem', display: 'flex', justifyContent: 'center', gap: '2.5rem', flexWrap: 'wrap', marginBottom: '2rem', marginTop: '0.75rem' }}>
                <p><strong>Matric No:</strong> {data.student.user_id}</p>
                <p><strong>Department:</strong> {data.student.department}</p>
                <p><strong>Faculty:</strong> {data.student.faculty}</p>
              </div>

              <p style={{ fontSize: '1rem', maxWidth: 700, margin: '0 auto 2rem', lineHeight: 1.8 }}>
                has successfully completed all necessary exit clearance procedures for the <strong>{data.student.session}</strong> academic session and is hereby cleared of all university obligations.
              </p>

              {/* Department Sign-offs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2.5rem', textAlign: 'center' }}>
                {data.clearances.map((c, i) => (
                  <div key={i} style={{ padding: '0.625rem 0.5rem', background: '#f8faf8', borderRadius: 4, border: '1px solid #e8e8e8' }}>
                    <CheckCircle size={14} color="#059669" style={{ marginBottom: '0.25rem' }} />
                    <p style={{ fontSize: '0.625rem', fontWeight: 'bold', textTransform: 'uppercase', color: '#1A5C2A', margin: '0 0 0.125rem', letterSpacing: '0.03em' }}>
                      {c.department.replace('_', ' ')}
                    </p>
                    <p style={{ fontSize: '0.5625rem', margin: 0, color: '#666' }}>{c.reviewer_name}</p>
                    <p style={{ fontSize: '0.5rem', margin: 0, color: '#999' }}>{new Date(c.reviewed_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '2rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <p style={{ borderTop: '1px solid #333', paddingTop: '0.375rem', fontWeight: 'bold', fontSize: '0.75rem' }}>Certificate No.</p>
                  <p style={{ fontSize: '0.75rem', color: '#444' }}>{data.certNo}</p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <QRCodeSVG
                    value={verificationUrl}
                    size={64}
                    level="M"
                    includeMargin={false}
                    fgColor="#1A5C2A"
                  />
                  <p style={{ fontSize: '0.5rem', color: '#999', marginTop: '0.25rem' }}>Scan to verify</p>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Award size={48} color="#C9A84C" style={{ opacity: 0.8 }} />
                  <p style={{ borderTop: '1px solid #333', paddingTop: '0.375rem', fontWeight: 'bold', fontSize: '0.75rem' }}>Registrar</p>
                  <p style={{ fontSize: '0.625rem', color: '#666' }}>Digitally Verified</p>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <p style={{ borderTop: '1px solid #333', paddingTop: '0.375rem', fontWeight: 'bold', fontSize: '0.75rem' }}>Date Issued</p>
                  <p style={{ fontSize: '0.75rem', color: '#444' }}>{new Date(data.issuedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
