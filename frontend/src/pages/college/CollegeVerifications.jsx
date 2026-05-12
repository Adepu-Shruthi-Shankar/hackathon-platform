import React, { useState, useEffect } from 'react';
import '../student/StudentHome.css';
import './CollegeDashboard.css';

const CollegeVerifications = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        const response = await fetch('https://hackathon-platform-3bd3.onrender.com/api/college/verification');
        const data = await response.json();
        if (data.success) {
          setVerifications(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch verifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVerifications();
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3 style={{ color: '#8892B0', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '10px', fontSize: '0.9rem' }}>College Portal</h3>
        <h1 className="welcome-text">Verification <span>Records</span></h1>
        <p className="subtitle">All submitted institutional verification details.</p>
      </div>

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>Loading records...</p>
      ) : verifications.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: '3rem 0' }}>No verification records found.</p>
      ) : (
        <div className="hackathon-grid">
          {verifications.map((v) => (
            <div className="hackathon-card" key={v.id} style={{ opacity: 1, animation: 'none' }}>
              <div className="card-header" style={{ justifyContent: 'flex-start' }}>
                <span className="status-badge open">Verified</span>
              </div>
              <h3 className="hackathon-title">{v.email}</h3>
              <div className="hackathon-details">
                <div className="detail-item">
                  <span className="detail-icon">🏛️</span>
                  <span>{v.department}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <span>{new Date(v.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              {v.professor_id && (
                <div style={{ marginTop: 'auto', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img 
                    src={`https://hackathon-platform-3bd3.onrender.com/${v.professor_id}`} 
                    alt="Professor ID" 
                    style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CollegeVerifications;
