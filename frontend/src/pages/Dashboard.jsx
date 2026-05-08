import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import '../styles/Sidebar.css';
import '../styles/Dashboard.css';

function Dashboard() {
  const [hackathons, setHackathons] = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [juryCount,  setJuryCount]  = useState(0);
  const navigate  = useNavigate();
  const adminName = JSON.parse(localStorage.getItem('user'))?.name || 'Admin';

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [hackRes, juryRes] = await Promise.all([
        API.get('/hackathons'),
        API.get('/jury')
      ]);
      setHackathons(hackRes.data.hackathons);
      setJuryCount(juryRes.data.jury.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const activeCount  = hackathons.filter(h => h.status === 'active').length;
  const pendingCount = hackathons.filter(h => h.status === 'pending').length;

  return (
    <div className="layout">
      <Sidebar />

      <div className="page-header">
        <h3>Dashboard</h3>
        <p>Welcome back, {adminName}</p>
      </div>

      <div className="page-content">

        {/* ── 4 Stat Cards ── */}
        <div className="stat-row">
          <div className="stat-card">
            <div className="stat-card-inner">
              <span className="stat-label">Total Hackathons</span>
              <span className="stat-icon">🏆</span>
            </div>
            <div className="stat-number color-1">{hackathons.length}</div>
            <div className="stat-sub">all time events</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <span className="stat-label">Active Events</span>
              <span className="stat-icon">🔥</span>
            </div>
            <div className="stat-number color-2">{activeCount}</div>
            <div className="stat-sub">live right now</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <span className="stat-label">Jury Members</span>
              <span className="stat-icon">👨‍⚖️</span>
            </div>
            <div className="stat-number color-3">{juryCount}</div>
            <div className="stat-sub">onboarded</div>
          </div>

          <div className="stat-card">
            <div className="stat-card-inner">
              <span className="stat-label">Pending Review</span>
              <span className="stat-icon">⏳</span>
            </div>
            <div className="stat-number color-4">{pendingCount}</div>
            <div className="stat-sub">awaiting action</div>
          </div>
        </div>

        {/* ── Recent Hackathons Header ── */}
        <div className="section-header">
          <h3>Recent Hackathons</h3>
          <button
            className="see-more-btn"
            onClick={() => navigate('/hackathons')}
          >
            See all →
          </button>
          
        </div>

        {/* ── Hackathon Cards ── */}
        {loading ? (
          <div className="empty-state"><p>Loading...</p></div>
        ) : hackathons.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏆</div>
            <h3>No hackathons yet</h3>
            <p>Create your first hackathon to get started</p>
            <button
              className="btn-primary"
              onClick={() => navigate('/hackathons')}
            >
              + Create Hackathon
            </button>
          </div>
        ) : (
          <div className="hackathon-grid">
            {hackathons.slice(0, 6).map(function(h) {
              return (
                <div className="hack-card" key={h.id}>
                  <div className="hack-card-top" />
                  <div className="hack-card-body">
                    <div className="hack-card-header">
                      <h4>{h.title}</h4>
                      <span className={'status-badge status-' + h.status}>
                        {h.status}
                      </span>
                    </div>
                    <div className="hack-meta">
                      <span>
                        📅 {new Date(h.start_date).toLocaleDateString()}
                      </span>
                      <span>
                        💰 {h.fee == 0 ? 'Free' : '₹' + h.fee}
                      </span>
                    </div>
                    <div className="hack-divider" />
                    <div className="hack-stats">
                      <div className="hack-stat-item">
                        <label>Registered</label>
                        <span>{h.registered_count || 0}</span>
                      </div>
                      <div className="hack-stat-item">
                        <label>Submitted</label>
                        <span>{h.submitted_count || 0}</span>
                      </div>
                    </div>
                    <div className="hack-tags">
                      <span className="tag">{h.eligibility}</span>
                    </div>
                    <div className="hack-card-actions">
                      <button
                        className="btn-primary"
                        onClick={() => navigate('/manage/' + h.id)}
                      >
                        Manage
                      </button>
                      
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default Dashboard;