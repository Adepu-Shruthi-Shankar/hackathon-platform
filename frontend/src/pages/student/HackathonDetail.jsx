import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockHackathons } from '../../data/mockHackathons';

const HackathonDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const hackathon = mockHackathons.find(h => h.id === id);

  if (!hackathon) {
    return (
      <div>
        <h2>Hackathon not found</h2>
        <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="glass-card">
      <h2 style={{ color: 'var(--accent-color)', marginBottom: '10px' }}>{hackathon.title}</h2>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '20px', color: 'var(--secondary-color)' }}>
        <span>📅 {hackathon.date}</span>
        <span>💰 {hackathon.fee}</span>
        <span>🏷️ {hackathon.status}</span>
      </div>
      
      <div style={{ marginBottom: '30px', lineHeight: '1.6' }}>
        <h3>Description</h3>
        <p style={{ marginTop: '10px' }}>{hackathon.description}</p>
      </div>

      <button 
        style={{ 
          padding: '12px 24px', 
          backgroundColor: 'var(--accent-color)', 
          color: '#000', 
          fontWeight: 'bold',
          borderRadius: '4px',
          fontSize: '16px'
        }}
        onClick={() => navigate(`/register/${id}`)}
      >
        Proceed to Registration
      </button>
    </div>
  );
};

export default HackathonDetail;
