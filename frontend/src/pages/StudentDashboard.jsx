import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/StudentDashboard.css';
import '../index.css';

const banners = ['c1','c2','c3','c4','c5','c6'];

function StudentDashboard() {
  const [hackathons, setHackathons] = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    axios.get('http://localhost:5000/api/hackathons/public')
      .then(res => {
        setHackathons(res.data.hackathons);
        setFiltered(res.data.hackathons);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleFilter = (status) => {
    setActiveFilter(status);
    if (status === 'all') {
      setFiltered(hackathons);
    } else {
      setFiltered(hackathons.filter(h => h.status === status));
    }
  };

  const activeCount = hackathons.filter(h => h.status === 'active').length;

  return (
    <div className="student-page">

      {/* Navbar */}
      <div className="student-navbar">
        <div className="student-navbar-logo">
          <h2>⚡ HackAdmin</h2>
          <span>Student Portal</span>
        </div>
        <div className="student-role-badge">👨‍🎓 Student View</div>
      </div>

      {/* Hero */}
      <div className="student-hero">
        <h1>Explore Hackathons 🚀</h1>
        <p>Find and participate in exciting hackathons. Build, compete and win.</p>
        <div className="student-hero-stats">
          <div className="hero-stat">
            <span>{hackathons.length}</span>
            <span>Total Events</span>
          </div>
          <div className="hero-stat">
            <span>{activeCount}</span>
            <span>Active Now</span>
          </div>
          <div className="hero-stat">
            <span>
              {hackathons.filter(h => h.fee == 0).length}
            </span>
            <span>Free Events</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="student-filters">
        {['all','active','pending','ended'].map(f => (
          <button
            key={f}
            className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
            onClick={() => handleFilter(f)}
          >
            {f === 'all'     ? '🔵 All'      : ''}
            {f === 'active'  ? '🟢 Active'   : ''}
            {f === 'pending' ? '🟡 Upcoming' : ''}
            {f === 'ended'   ? '⚫ Ended'    : ''}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      <div className="student-grid">
        {loading ? (
          <div className="student-empty">
            <p>Loading hackathons...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="student-empty">
            <h3>No hackathons found</h3>
            <p>Check back later for new events</p>
          </div>
        ) : (
          filtered.map((h, i) => (
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
                  <span>{h.fee == 0 ? '— No registration fee' : '— Registration fee'}</span>
                </div>

                <button
                  className={`shc-apply-btn ${h.status === 'ended' ? 'ended' : ''}`}
                  disabled={h.status === 'ended'}
                >
                  {h.status === 'ended' ? 'Event Ended' : 'Apply Now →'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default StudentDashboard;