import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HackathonCard from '../../components/HackathonCard';
import './StudentHome.css';

const StudentHome = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || 'Student';
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);

  const StatusBadge = ({ status }) => {
    let color = '#c4b5fd', bgColor = 'rgba(168,85,247,0.1)';
    if (status === 'approved' || status === 'paid') { color = '#a855f7'; bgColor = 'rgba(168,85,247,0.1)'; }
    else if (status === 'rejected') { color = '#ef4444'; bgColor = 'rgba(239,68,68,0.1)'; }
    return (
      <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, color, backgroundColor: bgColor, fontWeight: 'bold', fontSize: '0.75rem', textTransform: 'uppercase', border: `1px solid ${color}` }}>
        {status}
      </span>
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regRes, hackRes] = await Promise.all([
          fetch(`https://hackathon-platform-3bd3.onrender.com/api/my-registrations/${user?.id}`),
          fetch('https://hackathon-platform-3bd3.onrender.com/api/hackathons/public')
        ]);
        const regData = await regRes.json();
        const hackData = await hackRes.json();
        if (regData.success) setRegistrations(regData.data);
        if (hackData.hackathons) setHackathons(hackData.hackathons);
        const winnerRes = await fetch('https://hackathon-platform-3bd3.onrender.com/api/winners');
        const winnerData = await winnerRes.json();
        if (winnerData.success) setWinners(winnerData.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    { label: 'REGISTERED', value: String(registrations.length).padStart(2, '0'), color: 'var(--accent-color)' },
    { label: 'AVAILABLE', value: String(hackathons.length).padStart(2, '0'), color: 'var(--secondary-color)' },
    { label: 'APPROVED', value: String(registrations.filter(r => r.approval_status === 'approved').length).padStart(2, '0'), color: '#a855f7' },
    { label: 'PENDING', value: String(registrations.filter(r => r.approval_status === 'pending').length).padStart(2, '0'), color: '#c4b5fd' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3 style={{ color: '#8892B0', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, fontSize: '0.9rem' }}>Student Dashboard</h3>
        <h1 className="welcome-text">Welcome back, <span>{userName}</span></h1>
        <p className="subtitle">Here's an overview of your hackathon journey.</p>
      </div>

      <div className="stats-row">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i} style={{ borderTopColor: stat.color }}>
            <span className="stat-label">{stat.label}</span>
            <h2 className="stat-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      {registrations.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: 40 }}>
            <h2>My Registrations</h2>
          </div>
          <div className="hackathon-grid">
            {registrations.map(reg => {
              const details = typeof reg.team_details === 'string' ? JSON.parse(reg.team_details) : reg.team_details;
              const hackathon = hackathons.find(h => String(h.id) === String(reg.hackathon_id));
              return (
                <div key={reg.id} className="hackathon-card glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ color: 'var(--accent-color)', marginBottom: 5 }}>{hackathon?.title || 'Hackathon'}</h3>
                    <h4 style={{ marginBottom: 10 }}>{details?.projectName}</h4>
                    <p style={{ marginBottom: 15 }}><strong>Team:</strong> {details?.teamName}</p>
                    <div style={{ display: 'flex', gap: 15, marginBottom: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Payment</span>
                        <StatusBadge status={reg.payment_status} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                        <span style={{ fontSize: '0.8rem', color: 'var(--muted)', textTransform: 'uppercase' }}>Approval</span>
                        <StatusBadge status={reg.approval_status} />
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/registration/${reg.id}`)}
                    style={{ padding: 10, backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', borderRadius: 6, cursor: 'pointer', fontWeight: 'bold' }}>
                    View Details
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className="section-header" style={{ marginTop: 40 }}>
        <h2>Available Hackathons</h2>
      </div>

      {winners.length > 0 && (
  <>
    <div className="section-header" style={{ marginTop: 40 }}>
      <h2>🏆 Winners Announced</h2>
    </div>
    <div className="hackathon-grid">
      {winners.map(w => (
        <div key={w.id} className="hackathon-card glass-card" style={{ borderTop: '3px solid #a855f7' }}>
          <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 10 }}>🏆</div>
          <h3 style={{ color: '#a855f7', textAlign: 'center', marginBottom: 5 }}>{w.team_name}</h3>
          <p style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: 5 }}>{w.project_name}</p>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 13 }}>Rating: {w.rating}/10 ⭐</p>
          {w.feedback && <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>"{w.feedback}"</p>}
        </div>
      ))}
    </div>
  </>
)}

      {loading ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading hackathons...</p>
      ) : hackathons.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No hackathons available yet.</p>
      ) : (
        <div className="hackathon-grid">
          {hackathons.map(h => (
            <HackathonCard
              key={h.id}
              id={h.id}
              title={h.title}
              description={h.description}
              fee={h.fee}
              status={h.status}
              eligibility={h.eligibility}
              start_date={h.start_date}
              end_date={h.end_date}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentHome;