import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RegistrationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [registration, setRegistration] = useState(null);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDetails = useCallback(async () => {
    try {
      const res = await fetch(`https://hackathon-platform-3bd3.onrender.com/api/registrations/${id}`);
      const data = await res.json();
      if (data.success) {
        setRegistration(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  }, [id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload');

    setUploading(true);
    const formData = new FormData();
    formData.append('submission_file', file);
    formData.append('registration_id', id);

    try {
      const res = await fetch('https://hackathon-platform-3bd3.onrender.com/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert('File uploaded successfully!');
        // Refetch to sync data
        fetchDetails();
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setUploading(false);
      setFile(null);
    }
  };

  const handlePayment = () => {
    navigate(`/payment/${id}`);
  };

  if (!registration) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--accent-color)' }}>
        <div className="loading-spinner" style={{ border: '4px solid rgba(255,255,255,0.1)', borderTop: '4px solid var(--accent-color)', borderRadius: '50%', width: '40px', height: '40px', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        <h2>Loading details...</h2>
      </div>
    );
  }

  const StatusBadge = ({ status }) => {
    let color, bgColor;
    if (status === 'approved') { color = '#a855f7'; bgColor = 'rgba(168,85,247, 0.1)'; }
    else if (status === 'rejected') { color = '#ef4444'; bgColor = 'rgba(239, 68, 68, 0.1)'; }
    else { color = '#c4b5fd'; bgColor = 'rgba(168,85,247, 0.1)'; }
    
    return (
      <span style={{ 
        display: 'inline-block', padding: '4px 8px', borderRadius: '4px',
        color: color, backgroundColor: bgColor, fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', border: `1px solid ${color}`
      }}>
        {status}
      </span>
    );
  };

  const details = typeof registration.team_details === 'string' ? JSON.parse(registration.team_details) : registration.team_details;
  const isRejected = registration.approval_status === 'rejected';
  const isApproved = registration.approval_status === 'approved';

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem auto', color: 'var(--text-color)' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{ background: 'transparent', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' }}>
        ← Back to Dashboard
      </button>

      <h2 style={{ marginBottom: '20px', color: 'var(--accent-color)' }}>Registration Details</h2>

      {isRejected && (
        <div style={{ padding: '15px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#ef4444', margin: 0, fontWeight: 'bold' }}>
            ❌ Your registration was rejected. Please contact the college administration.
          </p>
        </div>
      )}

      {isApproved && (
        <div style={{ padding: '15px', background: 'rgba(168,85,247, 0.1)', border: '1px solid rgba(168,85,247, 0.3)', borderRadius: '8px', marginBottom: '20px' }}>
          <p style={{ color: '#a855f7', margin: 0, fontWeight: 'bold' }}>
            🎉 Your registration has been approved!
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Team Name</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{details?.teamName}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '5px' }}>Project Title</p>
          <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{details?.projectName}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Payment Status</p>
          <StatusBadge status={registration.payment_status === 'paid' ? 'approved' : 'pending'} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.03)', padding: '15px', borderRadius: '10px', border: '1px solid var(--border)' }}>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Approval Status</p>
          <StatusBadge status={registration.approval_status} />
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border)', opacity: isRejected ? 0.5 : 1, pointerEvents: isRejected ? 'none' : 'auto' }}>
        <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>Project Submission</h3>
        
        {registration.submission_file ? (
          <div>
            <p style={{ color: '#10b981', marginBottom: '10px' }}>✓ Project successfully submitted</p>
            <a href={`https://hackathon-platform-3bd3.onrender.com/${registration.submission_file}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-color)', textDecoration: 'none' }}>

              View Submission File
            </a>
          </div>
        ) : (
          <div>
            {registration.payment_status !== 'paid' ? (
              <div style={{ padding: '15px', background: 'rgba(168,85,247, 0.1)', border: '1px solid rgba(168,85,247, 0.3)', borderRadius: '8px' }}>
                <p style={{ color: '#c4b5fd', margin: 0 }}>
                  ⚠️ You must complete your payment before uploading the project.
                </p>
                <button 
                  onClick={handlePayment}
                  disabled={isRejected}
                  style={{ marginTop: '10px', padding: '8px 15px', background: '#c4b5fd', color: '#000', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: isRejected ? 'not-allowed' : 'pointer', opacity: isRejected ? 0.5 : 1 }}>
                  Proceed to Payment
                </button>
              </div>
            ) : registration.approval_status === 'pending' ? (
              <div style={{ padding: '15px', background: 'rgba(168,85,247, 0.1)', border: '1px solid rgba(168,85,247, 0.3)', borderRadius: '8px' }}>
                <p style={{ color: '#c4b5fd', margin: 0, fontWeight: 'bold' }}>
                  ⏳ Waiting for college approval to unlock project submission.
                </p>
              </div>
            ) : registration.approval_status === 'approved' ? (
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <p style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>Upload your project files (ZIP, PDF, etc.)</p>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  style={{
                    padding: '10px', border: '1px dashed var(--border)', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', cursor: 'pointer'
                  }}
                />
                <button 
                  type="submit" 
                  disabled={uploading || !file || isRejected}
                  style={{
                    padding: '12px',
                    backgroundColor: file ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)',
                    color: file ? '#000' : 'var(--muted)',
                    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: file && !isRejected ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s'
                  }}>
                  {uploading ? 'Uploading...' : 'Upload Project'}
                </button>
              </form>
            ) : null}
          </div>
        )}
      </div>

    </div>
  );
};

export default RegistrationDetails;
