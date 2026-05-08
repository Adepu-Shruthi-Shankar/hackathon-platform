import React, { useEffect, useState } from 'react';
import HackathonCard from '../../components/HackathonCard';
import '../student/StudentHome.css';
import './CollegeDashboard.css';

const CollegeDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const userName = user?.name || 'College User';
  const [registrations, setRegistrations] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [winners, setWinners] = useState([]);

  const StatusBadge = ({ status }) => {
    let color = '#f59e0b', bgColor = 'rgba(245,158,11,0.1)';
    if (status === 'approved' || status === 'paid') { color = '#10b981'; bgColor = 'rgba(16,185,129,0.1)'; }
    else if (status === 'rejected') { color = '#ef4444'; bgColor = 'rgba(239,68,68,0.1)'; }
    return (
      <span style={{ display: 'inline-block', padding: '4px 8px', borderRadius: 4, color, backgroundColor: bgColor, fontWeight: 'bold', fontSize: '0.8rem', textTransform: 'uppercase', border: `1px solid ${color}` }}>
        {status}
      </span>
    );
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [regRes, hackRes] = await Promise.all([
        fetch('http://localhost:5000/api/college/registrations'),
        fetch('http://localhost:5000/api/hackathons/public')
      ]);
      const regData = await regRes.json();
      const hackData = await hackRes.json();
      if (regData.success) setRegistrations(regData.data);
      if (hackData.hackathons) setHackathons(hackData.hackathons);
      const winnerRes = await fetch('http://localhost:5000/api/winners');
      const winnerData = await winnerRes.json();
      if (winnerData.success) setWinners(winnerData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAction = async (id, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this registration?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/${action}/${id}`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) fetchData();
      else alert(data.message || `Failed to ${action}`);
    } catch (err) {
      alert(`Error trying to ${action}`);
    }
  };

  const filteredRegistrations = registrations.filter(reg => {
    const details = typeof reg.team_details === 'string' ? JSON.parse(reg.team_details) : reg.team_details;
    const hackathon = hackathons.find(h => String(h.id) === String(reg.hackathon_id));
    const hackathonTitle = hackathon?.title || 'Unknown';
    const matchesFilter = filter === 'All' || reg.approval_status === filter.toLowerCase();
    if (!matchesFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return reg.student_name?.toLowerCase().includes(q) || hackathonTitle.toLowerCase().includes(q) || details?.teamName?.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = [
    { label: 'TOTAL EVENTS', value: String(hackathons.length).padStart(2, '0'), color: 'var(--accent-color)' },
    { label: 'ACTIVE NOW', value: String(hackathons.filter(h => h.status === 'active').length).padStart(2, '0'), color: 'var(--secondary-color)' },
    { label: 'APPROVED', value: String(registrations.filter(r => r.approval_status === 'approved').length).padStart(2, '0'), color: '#10b981' },
    { label: 'PARTICIPANTS', value: String(registrations.length).padStart(2, '0'), color: '#B388FF' }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h3 style={{ color: '#8892B0', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 10, fontSize: '0.9rem' }}>College Dashboard</h3>
        <h1 className="welcome-text">Welcome back, <span>{userName}</span></h1>
        <p className="subtitle">Manage your institutional events, participants, and submissions.</p>
      </div>
      {winners.length > 0 && (
  <>
    <div className="section-header" style={{ marginTop: 40 }}>
      <h2>🏆 Winners Announced</h2>
    </div>
    <div className="hackathon-grid">
      {winners.map(w => (
        <div key={w.id} className="hackathon-card glass-card" style={{ borderTop: '3px solid #FBB030' }}>
          <div style={{ fontSize: 36, textAlign: 'center', marginBottom: 10 }}>🏆</div>
          <h3 style={{ color: '#FBB030', textAlign: 'center', marginBottom: 5 }}>{w.team_name}</h3>
          <p style={{ color: 'var(--text-color)', textAlign: 'center', marginBottom: 5 }}>{w.project_name}</p>
          <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 13 }}>Rating: {w.rating}/10 ⭐</p>
          {w.feedback && <p style={{ color: 'var(--muted)', textAlign: 'center', fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>"{w.feedback}"</p>}
        </div>
      ))}
    </div>
  </>
)}

      <div className="stats-row">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i} style={{ borderTopColor: stat.color }}>
            <span className="stat-label">{stat.label}</span>
            <h2 className="stat-value">{stat.value}</h2>
          </div>
        ))}
      </div>

      <div className="section-header" style={{ marginTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <h2>Registered Students & Submissions</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flex: 1, justifyContent: 'flex-end' }}>
          <input type="text" placeholder="Search student, hackathon, or team..."
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '8px 16px', borderRadius: 20, border: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)', color: 'var(--text-color)', minWidth: 250 }} />
          {['All', 'Pending', 'Approved', 'Rejected'].map(status => (
            <button key={status} onClick={() => setFilter(status)}
              style={{ padding: '8px 16px', background: filter === status ? 'var(--accent-color)' : 'transparent', color: filter === status ? '#000' : 'var(--text-color)', border: '1px solid var(--accent-color)', borderRadius: 20, cursor: 'pointer', fontWeight: 'bold' }}>
              {status}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40, marginTop: 20 }}>
        {loading ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>Loading registrations...</p>
        ) : filteredRegistrations.length === 0 ? (
          <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 20 }}>No registrations found.</p>
        ) : filteredRegistrations.map(reg => {
          const details = typeof reg.team_details === 'string' ? JSON.parse(reg.team_details) : reg.team_details;
          const hackathon = hackathons.find(h => String(h.id) === String(reg.hackathon_id));
          const hackathonTitle = hackathon?.title || 'Unknown Hackathon';
          return (
            <div key={reg.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
              <div style={{ flex: '1 1 300px' }}>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: 5 }}>{hackathonTitle}</h3>
                <h4 style={{ marginBottom: 5 }}>{details?.projectName || 'Unnamed Project'}</h4>
                <p style={{ marginBottom: 5 }}><strong>Team:</strong> {details?.teamName}</p>
                <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}><strong>Student:</strong> {reg.student_name}</p>
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <p style={{ marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>Payment:</span> <StatusBadge status={reg.payment_status} />
                </p>
                <p style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span>Status:</span> <StatusBadge status={reg.approval_status} />
                </p>
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {reg.submission_file ? (
                  <div style={{ display: 'flex', gap: 10 }}>
                    <a href={`http://localhost:5000/${reg.submission_file}`} target="_blank" rel="noreferrer"
                      style={{ padding: '6px 10px', background: 'rgba(255,255,255,0.1)', color: 'var(--accent-color)', textDecoration: 'none', borderRadius: 5, fontSize: '0.85rem', flex: 1, textAlign: 'center', border: '1px solid var(--border)' }}>View</a>
                    <a href={`http://localhost:5000/${reg.submission_file}`} download target="_blank" rel="noreferrer"
                      style={{ padding: '6px 10px', background: 'var(--accent-color)', color: '#000', textDecoration: 'none', borderRadius: 5, fontSize: '0.85rem', fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Download</a>
                  </div>
                ) : (
                  <span style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>No submission yet</span>
                )}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => handleAction(reg.id, 'approve')} disabled={reg.approval_status === 'approved'}
                    style={{ flex: 1, padding: 8, background: 'transparent', border: '1px solid #10b981', color: '#10b981', borderRadius: 5, cursor: reg.approval_status === 'approved' ? 'not-allowed' : 'pointer', opacity: reg.approval_status === 'approved' ? 0.5 : 1 }}>Approve</button>
                  <button onClick={() => handleAction(reg.id, 'reject')} disabled={reg.approval_status === 'rejected'}
                    style={{ flex: 1, padding: 8, background: 'transparent', border: '1px solid #ef4444', color: '#ef4444', borderRadius: 5, cursor: reg.approval_status === 'rejected' ? 'not-allowed' : 'pointer', opacity: reg.approval_status === 'rejected' ? 0.5 : 1 }}>Reject</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="section-header"><h2>Institutional Events</h2></div>
      {hackathons.length === 0 ? (
        <p style={{ color: 'var(--muted)', textAlign: 'center', padding: 40 }}>No hackathons yet.</p>
      ) : (
        <div className="hackathon-grid">
          {hackathons.map(h => (
            <HackathonCard key={h.id} id={h.id} title={h.title} description={h.description}
              fee={h.fee} status={h.status} eligibility={h.eligibility}
              start_date={h.start_date} end_date={h.end_date} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollegeDashboard;