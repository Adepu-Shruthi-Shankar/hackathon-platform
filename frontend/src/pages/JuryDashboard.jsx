import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function JuryDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(null);
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetchSubmissions();
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch('https://hackathon-platform-3bd3.onrender.com/api/jury-dashboard/submissions');
      const data = await res.json();
      if (data.success) setSubmissions(data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.clear(); navigate('/login'); };

  const handleEvaluate = (sub) => {
    setEvaluating(sub);
    setRating(sub.rating || null);
    setFeedback(sub.feedback || '');
  };

  const handleSubmitEvaluation = async () => {
    if (!rating) return alert('Please select a rating');
    setSubmitting(true);
    try {
      const res = await fetch('https://hackathon-platform-3bd3.onrender.com/api/jury-dashboard/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registration_id: evaluating.id, jury_id: user.id, rating, feedback })
      });
      const data = await res.json();
      if (data.success) { setEvaluating(null); fetchSubmissions(); }
    } catch (err) { alert('Error submitting evaluation'); }
    finally { setSubmitting(false); }
  };

  const reviewed = submissions.filter(s => s.rating);
  const pending = submissions.filter(s => !s.rating);
  const avgRating = reviewed.length
    ? (reviewed.reduce((a, b) => a + Number(b.rating), 0) / reviewed.length).toFixed(1)
    : '—';

  const statCards = [
    { label: 'TOTAL TEAMS', value: submissions.length, icon: '👥' },
    { label: 'WAITING', value: pending.length, icon: '⏳' },
    { label: 'FINISHED', value: reviewed.length, icon: '🏆' },
    { label: 'AVG RATING', value: avgRating, icon: '⭐' }
  ];

  const navbar = (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: isMobile ? '12px 16px' : '16px 40px',
      background: '#080B14', borderBottom: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky', top: 0, zIndex: 100, flexWrap: 'wrap', gap: 8
    }}>
      <div style={{ fontSize: isMobile ? 16 : 20, fontWeight: 800, color: '#F0EFFF' }}>
        ⚡ <span style={{ color: '#a855f7' }}>HackAdmin</span>{' '}
        {!isMobile && <span style={{ color: '#7A7A9D', fontWeight: 400, fontSize: 14 }}>Platform</span>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, flexWrap: 'wrap' }}>
        {!isMobile && <span style={{ color: '#7A7A9D', fontSize: 14 }}>{user?.name}</span>}
        <span style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
          {user?.designation || 'Jury'}
        </span>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#a855f7,#6038df)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: 14 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <button onClick={handleLogout} style={{ padding: isMobile ? '6px 10px' : '8px 16px', background: 'rgba(255,77,106,0.1)', border: '1px solid rgba(255,77,106,0.3)', color: '#FF4D6A', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: isMobile ? 12 : 14 }}>
          {isMobile ? '🚪' : '🚪 Logout'}
        </button>
      </div>
    </nav>
  );

  // ── EVALUATE FULL PAGE ──
  if (evaluating) {
    const details = typeof evaluating.team_details === 'string'
      ? JSON.parse(evaluating.team_details)
      : evaluating.team_details;

    return (
      <div style={{ minHeight: '100vh', background: '#080B14', color: '#F0EFFF', fontFamily: 'Outfit, sans-serif' }}>
        {navbar}
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px' }}>

          <h1 style={{ fontSize: isMobile ? 22 : 32, fontWeight: 800, marginBottom: 4 }}>
            Evaluate <span style={{ color: '#a855f7' }}>{details?.teamName || evaluating.student_name}</span>
          </h1>
          <p style={{ color: '#7A7A9D', marginBottom: 24, fontSize: 15 }}>{evaluating.hackathon_title}</p>

          {/* Description + Hackathon row */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <p style={{ color: '#7A7A9D', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>Description</p>
              <textarea
                defaultValue={details?.projectName || ''}
                readOnly
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, color: '#F0EFFF', resize: 'none', fontFamily: 'inherit', fontSize: 14, height: 80, boxSizing: 'border-box' }}
              />
            </div>
            <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <p style={{ color: '#7A7A9D', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>Hackathon</p>
              <textarea
                defaultValue={evaluating.hackathon_title || ''}
                readOnly
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, color: '#F0EFFF', resize: 'none', fontFamily: 'inherit', fontSize: 14, height: 80, boxSizing: 'border-box' }}
              />
            </div>
          </div>

          {/* Rating + File row */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <p style={{ color: '#7A7A9D', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, fontWeight: 600 }}>Select Rating</p>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <button key={n} onClick={() => setRating(n)} style={{
                    width: isMobile ? 40 : 46, height: isMobile ? 40 : 46,
                    borderRadius: 12, border: 'none', cursor: 'pointer',
                    fontWeight: 700, fontSize: isMobile ? 14 : 16,
                    background: rating === n ? 'linear-gradient(135deg,#a855f7,#6038df)' : 'rgba(255,255,255,0.07)',
                    color: '#fff', transition: 'all 0.2s',
                    boxShadow: rating === n ? '0 0 16px rgba(168,85,247,0.4)' : 'none'
                  }}>{n}</button>
                ))}
              </div>
            </div>
            <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: isMobile ? 16 : 24 }}>
              <p style={{ color: '#7A7A9D', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16, fontWeight: 600 }}>Submission File</p>
              {evaluating.submission_file ? (
                <a href={`https://hackathon-platform-3bd3.onrender.com/${evaluating.submission_file}`} target="_blank" rel="noreferrer"
                  style={{ color: '#8358FF', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', background: 'rgba(131,88,255,0.1)', borderRadius: 10, border: '1px solid rgba(131,88,255,0.2)', textDecoration: 'none' }}>
                  📁 View Submission File
                </a>
              ) : (
                <p style={{ color: '#7A7A9D', fontSize: 14 }}>No file submitted</p>
              )}
            </div>
          </div>

          {/* Review box */}
          <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: isMobile ? 16 : 24, marginBottom: 16 }}>
            <p style={{ color: '#7A7A9D', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14, fontWeight: 600 }}>Review</p>
            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Write your review here..."
              rows={5}
              style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: 14, color: '#F0EFFF', resize: 'vertical', fontFamily: 'inherit', fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          {/* Submit + Cancel */}
          <div style={{ display: 'flex', gap: 16, flexDirection: isMobile ? 'column' : 'row' }}>
            <button onClick={handleSubmitEvaluation} disabled={submitting} style={{
              flex: 2, padding: 18, background: '#a855f7', border: 'none', borderRadius: 14,
              color: '#fff', fontWeight: 800, fontSize: 17, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(168,85,247,0.3)'
            }}>
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
            <button onClick={() => setEvaluating(null)} style={{
              flex: 1, padding: 18, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 14, color: '#7A7A9D', fontWeight: 600, fontSize: 17, cursor: 'pointer'
            }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN DASHBOARD ──
  return (
    <div style={{ minHeight: '100vh', background: '#080B14', color: '#F0EFFF', fontFamily: 'Outfit, sans-serif' }}>
      {navbar}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: isMobile ? '20px 16px' : '40px 24px' }}>

        {/* Stat Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 10 : 16,
          marginBottom: isMobile ? 24 : 40
        }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(80,30,180,0.4))',
              borderRadius: 20, padding: isMobile ? '18px 14px' : '28px 24px',
              border: '1px solid rgba(168,85,247,0.25)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? 10 : 16 }}>
                <span style={{ fontSize: isMobile ? 10 : 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: isMobile ? 1 : 2, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: isMobile ? 18 : 22 }}>{s.icon}</span>
              </div>
              <div style={{ fontSize: isMobile ? 36 : 52, fontWeight: 800, color: '#a855f7', lineHeight: 1 }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Table + Rankings — stack on mobile */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 300px',
          gap: 24
        }}>

          {/* Table */}
          <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, overflow: 'hidden' }}>
            <div style={{ padding: isMobile ? '14px 16px' : '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h3 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700 }}>All Projects</h3>
            </div>
            {loading ? (
              <p style={{ padding: 40, color: '#7A7A9D', textAlign: 'center' }}>Loading...</p>
            ) : submissions.length === 0 ? (
              <p style={{ padding: 40, color: '#7A7A9D', textAlign: 'center' }}>No approved submissions yet.</p>
            ) : isMobile ? (
              /* Mobile card view instead of table */
              <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {submissions.map((sub, i) => {
                  const details = typeof sub.team_details === 'string' ? JSON.parse(sub.team_details) : sub.team_details;
                  const isReviewed = !!sub.rating;
                  return (
                    <div key={sub.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontWeight: 700, fontSize: 15 }}>{details?.teamName || sub.student_name}</span>
                        <span style={{
                          padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                          background: 'rgba(168,85,247,0.12)', color: isReviewed ? '#a855f7' : '#c4b5fd',
                          border: '1px solid rgba(168,85,247,0.3)'
                        }}>
                          {isReviewed ? 'Finished' : 'Waiting'}
                        </span>
                      </div>
                      <div style={{ color: '#7A7A9D', fontSize: 13, marginBottom: 10 }}>
                        {details?.projectName || '—'}
                        {sub.rating && <span style={{ marginLeft: 10, color: '#c4b5fd', fontWeight: 700 }}>{sub.rating} ⭐</span>}
                      </div>
                      <button onClick={() => handleEvaluate(sub)} style={{
                        width: '100%', padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                        background: isReviewed ? 'rgba(168,85,247,0.12)' : 'linear-gradient(135deg,#a855f7,#6038df)',
                        color: isReviewed ? '#a855f7' : '#fff',
                        border: isReviewed ? '1px solid rgba(168,85,247,0.3)' : 'none'
                      }}>
                        {isReviewed ? 'View' : 'Evaluate'}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#', 'Team', 'Project', 'Status', 'Rating', 'Action'].map(h => (
                      <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#7A7A9D', fontSize: 13, fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, i) => {
                    const details = typeof sub.team_details === 'string' ? JSON.parse(sub.team_details) : sub.team_details;
                    const isReviewed = !!sub.rating;
                    return (
                      <tr key={sub.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '14px 16px', color: '#7A7A9D' }}>{i + 1}</td>
                        <td style={{ padding: '14px 16px', fontWeight: 600 }}>{details?.teamName || sub.student_name}</td>
                        <td style={{ padding: '14px 16px', color: '#7A7A9D' }}>{details?.projectName || '—'}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                            background: 'rgba(168,85,247,0.12)',
                            color: isReviewed ? '#a855f7' : '#c4b5fd',
                            border: '1px solid rgba(168,85,247,0.3)'
                          }}>
                            {isReviewed ? 'Finished' : 'Waiting'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          {sub.rating
                            ? <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{sub.rating} ⭐</span>
                            : <span style={{ color: '#7A7A9D' }}>—</span>}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <button onClick={() => handleEvaluate(sub)} style={{
                            padding: '7px 18px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 700,
                            background: isReviewed ? 'rgba(168,85,247,0.12)' : 'linear-gradient(135deg,#a855f7,#6038df)',
                            color: isReviewed ? '#a855f7' : '#fff',
                            border: isReviewed ? '1px solid rgba(168,85,247,0.3)' : 'none'
                          }}>
                            {isReviewed ? 'View' : 'Evaluate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Rankings */}
          <div style={{ background: '#0E1221', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 20, padding: isMobile ? 16 : 24, height: 'fit-content' }}>
            <h3 style={{ fontSize: isMobile ? 15 : 18, fontWeight: 700, marginBottom: 16 }}>🏆 Rankings</h3>
            {reviewed.length === 0 ? (
              <p style={{ color: '#7A7A9D', fontSize: 14 }}>No evaluations yet.</p>
            ) : (
              [...reviewed]
                .sort((a, b) => Number(b.rating) - Number(a.rating))
                .slice(0, 5)
                .map((sub, i) => {
                  const details = typeof sub.team_details === 'string' ? JSON.parse(sub.team_details) : sub.team_details;
                  const rankColors = ['#c4b5fd', '#9ca3af', '#f97316', '#a855f7', '#a855f7'];
                  const rankBgs = ['rgba(168,85,247,0.12)', 'rgba(156,163,175,0.1)', 'rgba(249,115,22,0.12)', 'rgba(168,85,247,0.12)', 'rgba(168,85,247,0.08)'];
                  return (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: 12, marginBottom: 10, background: rankBgs[i], border: `1px solid ${rankColors[i]}33` }}>
                      <span style={{ fontWeight: 700, color: rankColors[i], fontSize: isMobile ? 13 : 14 }}>#{i + 1} {details?.teamName || sub.student_name}</span>
                      <span style={{ color: rankColors[i], fontWeight: 700, fontSize: isMobile ? 13 : 14 }}>{sub.rating} ⭐</span>
                    </div>
                  );
                })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JuryDashboard;