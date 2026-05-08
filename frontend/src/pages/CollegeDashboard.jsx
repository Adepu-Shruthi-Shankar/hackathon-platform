import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';
import '../index.css';

const banners = ['c1','c2','c3','c4','c5','c6'];

function CollegeDashboard() {
  const [hackathons, setHackathons] = useState([]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/hackathons/public')
      .then(res => setHackathons(res.data.hackathons))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const activeCount = hackathons.filter(h => h.status === 'active').length;

  return (
    <div className="student-page">

      {/* Navbar */}
      <div className="student-navbar">
        <div className="student-navbar-logo">
          <h2>⚡ HackAdmin</h2>
          <span>College Portal</span>
        </div>
        <div className="student-role-badge" 
          style={{background:'rgba(0,194,255,0.1)',
            borderColor:'rgba(0,194,255,0.2)',color:'#00C2FF'}}>
          🏫 College View
        </div>
      </div>

      {/* Hero */}
      <div className="student-hero">
        <h1>Hackathons at Your College 🏫</h1>
        <p>
          View all active hackathons your students can participate in.
        </p>
        <div className="student-hero-stats">
          <div className="hero-stat">
            <span style={{color:'var(--accent-cyan)'}}>
              {hackathons.length}
            </span>
            <span>Total Events</span>
          </div>
          <div className="hero-stat">
            <span style={{color:'var(--accent-cyan)'}}>
              {activeCount}
            </span>
            <span>Active Now</span>
          </div>
          <div className="hero-stat">
            <span style={{color:'var(--accent-cyan)'}}>
              {hackathons.filter(h => h.fee == 0).length}
            </span>
            <span>Free Events</span>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="student-grid">
        {loading ? (
          <div className="student-empty">
            <p>Loading hackathons...</p>
          </div>
        ) : hackathons.length === 0 ? (
          <div className="student-empty">
            <h3>No hackathons posted yet</h3>
            <p>The admin has not posted any events yet</p>
          </div>
        ) : (
          hackathons.map((h, i) => (
            <div className="student-hack-card" key={h.id}>
              <div className={`shc-banner ${banners[i % banners.length]}`} />
              <div className="shc-body">
                <div className="shc-top">
                  <h4>{h.title}</h4>
                  <span className={`status-badge status-${h.status}`}>
                    {h.status}
                  </span>
                </div>

                <p className="shc-desc">{h.description}</p>

                <div className="shc-meta">
                  <div className="shc-meta-item">
                    📅 <span>{new Date(h.start_date).toLocaleDateString()}</span>
                  </div>
                  <div className="shc-meta-item">
                    🏁 <span>{new Date(h.end_date).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="shc-divider" />

                <div className="shc-eligibility">Eligibility</div>
                <div className="shc-tag">{h.eligibility}</div>

                <div className="shc-fee">
                  {h.fee == 0 ? 'Free' : `₹${h.fee}`}
                  <span>
                    {h.fee == 0 
                      ? '— No registration fee' 
                      : '— Registration fee'}
                  </span>
                </div>

                <button
                  className={`shc-apply-btn ${h.status === 'ended' ? 'ended' : ''}`}
                  disabled={h.status === 'ended'}
                  style={{background: h.status !== 'ended' 
                    ? 'var(--accent-cyan)' : ''}}
                >
                  {h.status === 'ended' 
                    ? 'Event Ended' 
                    : 'View Details →'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default CollegeDashboard;