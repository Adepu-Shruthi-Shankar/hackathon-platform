import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import '../styles/Sidebar.css';
import '../styles/ManageHackathon.css';

function ManageHackathon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hackathon,    setHackathon]    = useState(null);
  const [registrations,setRegistrations]= useState([]);
  const [juryResults,  setJuryResults]  = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [activeTab,    setActiveTab]    = useState('teams');
  const [subTab,       setSubTab]       = useState('all');
  const [actionMsg,    setActionMsg]    = useState('');
  const [selectedReg,  setSelectedReg]  = useState(null);
  const [modalOpen,    setModalOpen]    = useState(false);
  const [winnerAnnounced, setWinnerAnnounced] = useState(false);

  useEffect(() => { fetchAll(); }, [id]);

  const fetchAll = async () => {
    try {
      const [hackRes, regRes, juryRes] = await Promise.all([
        API.get('/hackathons/' + id),
        fetch('http://localhost:5000/api/college/registrations').then(r => r.json()),
        fetch('http://localhost:5000/api/jury-dashboard/submissions').then(r => r.json())
      ]);
      setHackathon(hackRes.data.hackathon);

      // Filter registrations for this hackathon only
      const allRegs = regRes.success ? regRes.data : [];
      setRegistrations(allRegs.filter(r => String(r.hackathon_id) === String(id)));

      // Filter jury results for this hackathon only
      const allJury = juryRes.success ? juryRes.data : [];
      setJuryResults(allJury.filter(j => String(j.hackathon_id) === String(id)));

      // Check if winner already announced
      const winnerRes = await fetch('http://localhost:5000/api/winner/' + id).then(r => r.json());
      if (winnerRes.data) setWinnerAnnounced(true);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (regId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this registration?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/${action}/${regId}`, { method: 'PUT' });
      const data = await res.json();
      if (data.success) {
        setRegistrations(prev =>
          prev.map(r => r.id === regId ? { ...r, approval_status: action === 'approve' ? 'approved' : 'rejected' } : r)
        );
        if (selectedReg?.id === regId) {
          setSelectedReg(prev => ({ ...prev, approval_status: action === 'approve' ? 'approved' : 'rejected' }));
        }
        showMsg(action === 'approve' ? '✅ Registration approved!' : '❌ Registration rejected!');
      }
    } catch (err) {
      showMsg('Failed. Try again.');
    }
  };

  const handleAnnounceWinner = async () => {
  if (!topResult) return;
  if (!window.confirm('Announce winner to ALL dashboards? This cannot be undone.')) return;
  try {
    const details = typeof topResult.team_details === 'string'
      ? JSON.parse(topResult.team_details) : topResult.team_details;
    const res = await fetch('http://localhost:5000/api/announce-winner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hackathon_id: id,
        team_name: details?.teamName || topResult.student_name,
        project_name: details?.projectName || '',
        rating: topResult.rating,
        feedback: topResult.feedback || ''
      })
    });
    const data = await res.json();
    if (data.success) {
      setWinnerAnnounced(true);
      showMsg('🏆 Winner announced to all dashboards!');
    }
  } catch (err) {
    showMsg('Failed to announce winner.');
  }
};

  const showMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const approvedRegs  = registrations.filter(r => r.approval_status === 'approved');
  const rejectedRegs  = registrations.filter(r => r.approval_status === 'rejected');
  const pendingRegs   = registrations.filter(r => r.approval_status === 'pending');
  const withFile      = registrations.filter(r => r.submission_file);

  const filteredRegs = subTab === 'approved' ? approvedRegs
                     : subTab === 'rejected'  ? rejectedRegs
                     : withFile;

  // Top jury result (highest rated)
  const winners = juryResults.filter(j => Number(j.rating) >= 9);
  const topResult = winners.length
    ? [...winners].sort((a, b) => Number(b.rating) - Number(a.rating))[0]
    : null;

  if (loading) {
    return (
      <div className="manage-page">
        <Sidebar />
        <div className="page-content">
          <p style={{ color: '#6b7280' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-page">
      <Sidebar />

      <div className="page-header">
        <h3>Manage Hackathon</h3>
        <p>Registrations, submissions and results</p>
      </div>

      <div className="page-content">

        <button className="back-btn" onClick={() => navigate('/hackathons')}>← Back</button>

        {/* Hackathon Info */}
        {hackathon && (
          <div className="manage-info-card">
            <div className="manage-info-top">
              <h2>{hackathon.title}</h2>
              <span className={'status-badge status-' + hackathon.status}>{hackathon.status}</span>
            </div>
            <div className="manage-meta">
              <div className="manage-meta-item"><label>Start</label><span>{new Date(hackathon.start_date).toLocaleDateString()}</span></div>
              <div className="manage-meta-item"><label>End</label><span>{new Date(hackathon.end_date).toLocaleDateString()}</span></div>
              <div className="manage-meta-item"><label>Fee</label><span>{hackathon.fee == 0 ? 'Free' : '₹' + hackathon.fee}</span></div>
              <div className="manage-meta-item"><label>Eligibility</label><span>{hackathon.eligibility}</span></div>
            </div>
            <div className="manage-desc">{hackathon.description}</div>
          </div>
        )}

        {/* Action Message */}
        {actionMsg !== '' && (
          <div style={{ background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.2)', borderRadius: '10px', padding: '11px 16px', fontSize: '13px', color: '#c4b5fd', marginBottom: '20px', textAlign: 'center' }}>
            {actionMsg}
          </div>
        )}

        {/* Stats */}
        <div className="manage-stats-row">
          <div className="manage-stat-card">
            <span className="manage-stat-label">Registered Teams</span>
            <div className="manage-stat-number" style={{ color: '#c4b5fd' }}>{registrations.length}</div>
          </div>
          <div className="manage-stat-card">
            <span className="manage-stat-label">Submissions</span>
            <div className="manage-stat-number" style={{ color: '#a855f7' }}>{withFile.length}</div>
          </div>
          <div className="manage-stat-card">
            <span className="manage-stat-label">Approved</span>
            <div className="manage-stat-number" style={{ color: '#c4b5fd' }}>{approvedRegs.length}</div>
          </div>
          <div className="manage-stat-card">
            <span className="manage-stat-label">Winner Announced</span>
            <div className="manage-stat-number" style={{ color: winnerAnnounced ? '#a855f7' : '#f87171', fontSize: '18px', paddingTop: '8px' }}>
              {winnerAnnounced ? '✅ Yes' : '⏳ No'}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="page-tabs">
          <button className={'tab-btn ' + (activeTab === 'teams' ? 'active' : '')} onClick={() => setActiveTab('teams')}>
            👥 Registered Teams
          </button>
          <button className={'tab-btn ' + (activeTab === 'submissions' ? 'active' : '')} onClick={() => setActiveTab('submissions')}>
            📋 Submissions
          </button>
          <button className={'tab-btn ' + (activeTab === 'jury' ? 'active' : '')} onClick={() => setActiveTab('jury')}>
            🏆 Jury Result
          </button>
        </div>

        {/* REGISTERED TEAMS TAB */}
        {activeTab === 'teams' && (
          <div className="table-card">
            <div className="table-card-header">
              <h4>Registered Teams</h4>
              <span>{registrations.length} teams</span>
            </div>
            {registrations.length === 0 ? (
              <div className="empty-table">No teams registered yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Team Name</th>
                    <th>Project</th>
                    <th>Payment</th>
                    <th>Approval</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg, i) => {
                    const details = typeof reg.team_details === 'string' ? JSON.parse(reg.team_details) : reg.team_details;
                    return (
                      <tr key={reg.id}>
                        <td className="td-muted">{i + 1}</td>
                        <td className="td-bold">{reg.student_name}</td>
                        <td className="td-muted">{details?.teamName}</td>
                        <td className="td-muted">{details?.projectName}</td>
                        <td>
                          <span className={'status-badge status-' + (reg.payment_status === 'paid' ? 'active' : 'pending')}>
                            {reg.payment_status}
                          </span>
                        </td>
                        <td>
                          <span className={'status-badge status-' + (reg.approval_status === 'approved' ? 'active' : reg.approval_status === 'rejected' ? 'ended' : 'pending')}>
                            {reg.approval_status}
                          </span>
                        </td>
                        <td>
                          <button className="btn-table-manage" onClick={() => { setSelectedReg(reg); setModalOpen(true); }}>
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* SUBMISSIONS TAB */}
        {activeTab === 'submissions' && (
          <>
            <div className="page-tabs" style={{ marginBottom: '16px' }}>
              <button className={'tab-btn ' + (subTab === 'all' ? 'active' : '')} onClick={() => setSubTab('all')}>
                All ({withFile.length})
              </button>
              <button className={'tab-btn ' + (subTab === 'approved' ? 'active' : '')} onClick={() => setSubTab('approved')}>
                Approved ({approvedRegs.filter(r => r.submission_file).length})
              </button>
              <button className={'tab-btn ' + (subTab === 'rejected' ? 'active' : '')} onClick={() => setSubTab('rejected')}>
                Rejected ({rejectedRegs.filter(r => r.submission_file).length})
              </button>
            </div>
            <div className="table-card">
              <div className="table-card-header">
                <h4>Team Submissions</h4>
                <span>{filteredRegs.length} entries</span>
              </div>
              {withFile.length === 0 ? (
                <div className="empty-table">No submissions yet.</div>
              ) : filteredRegs.length === 0 ? (
                <div className="empty-table">No submissions in this category.</div>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Student</th>
                      <th>Team</th>
                      <th>Project</th>
                      <th>Status</th>
                      <th>File</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegs.map((reg, i) => {
                      const details = typeof reg.team_details === 'string' ? JSON.parse(reg.team_details) : reg.team_details;
                      return (
                        <tr key={reg.id}>
                          <td className="td-muted">{i + 1}</td>
                          <td className="td-bold">{reg.student_name}</td>
                          <td className="td-muted">{details?.teamName}</td>
                          <td className="td-muted">{details?.projectName}</td>
                          <td>
                            <span className={'status-badge status-' + (reg.approval_status === 'approved' ? 'active' : reg.approval_status === 'rejected' ? 'ended' : 'pending')}>
                              {reg.approval_status}
                            </span>
                          </td>
                          <td>
                            {reg.submission_file && (
                              <a href={`http://localhost:5000/${reg.submission_file}`} target="_blank" rel="noreferrer"
                                style={{ color: '#a855f7', fontSize: 12 }}>View File</a>
                            )}
                          </td>
                          <td>
                            <button className="btn-table-manage" onClick={() => { setSelectedReg(reg); setModalOpen(true); }}>
                              View
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {/* JURY RESULT TAB */}
        {activeTab === 'jury' && (
          <div>
            {winners.length === 0 ? (
              <div className="no-result-box">
                <div style={{ fontSize: '36px', marginBottom: '14px', opacity: 0.3 }}>⚖️</div>
                <h4>No winners yet</h4>
                <p style={{ fontSize: '13px', marginTop: '8px' }}>Winners are teams rated 9 or above by jury. Keep evaluating!</p>
              </div>
            ) : (
              <div className="jury-result-card">
                <div className="jury-result-icon">🏆</div>
                {topResult && (() => {
                  const details = typeof topResult.team_details === 'string' ? JSON.parse(topResult.team_details) : topResult.team_details;
                  return (
                    <>
                      <div className="jury-result-team">{details?.teamName || topResult.student_name}</div>
                      <div className="jury-result-project">{details?.projectName}</div>
                      <div className="jury-result-leader" style={{ color: '#a855f7', fontSize: 18, fontWeight: 700, margin: '10px 0' }}>
                        Rating: {topResult.rating}/10 ⭐
                      </div>
                      {topResult.feedback && (
                        <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>"{topResult.feedback}"</div>
                      )}
                    </>
                  );
                })()}

                {/* All rankings */}
                <div style={{ width: '100%', marginBottom: 24 }}>
                  {[...winners].sort((a, b) => Number(b.rating) - Number(a.rating)).map((jr, i) => {
                    const details = typeof jr.team_details === 'string' ? JSON.parse(jr.team_details) : jr.team_details;
                    return (
                      <div key={jr.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderRadius: 10, marginBottom: 8, background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.12)' }}>
                        <span style={{ color: '#c4b5fd' }}>#{i + 1} {details?.teamName || jr.student_name}</span>
                        <span style={{ color: '#c4b5fd', fontWeight: 700 }}>{jr.rating}/10 ⭐</span>
                      </div>
                    );
                  })}
                </div>

                {winnerAnnounced ? (
                  <div className="announced-badge">✅ Winner Announced to All Dashboards</div>
                ) : (
                  <button className="btn-primary" style={{ fontSize: '14px', padding: '12px 28px' }} onClick={handleAnnounceWinner}>
                    🏆 Announce Winner to All Dashboards
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* REGISTRATION MODAL */}
      {modalOpen && selectedReg && (() => {
        const details = typeof selectedReg.team_details === 'string' ? JSON.parse(selectedReg.team_details) : selectedReg.team_details;
        return (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-card" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{details?.teamName}</h3>
                <button className="modal-close" onClick={() => setModalOpen(false)}>✕</button>
              </div>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: 20, marginBottom: 20, padding: '14px 16px', background: 'rgba(168,85,247,0.04)', border: '1px solid rgba(168,85,247,0.12)', borderRadius: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Student</div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#c4b5fd' }}>{selectedReg.student_name}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Project</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{details?.projectName}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Leader Email</div>
                    <div style={{ fontSize: 13, color: '#6b7280' }}>{details?.leaderEmail}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 20, marginBottom: 18 }}>
                  <div>
                    <div className="modal-section-label">Payment</div>
                    <span className={'status-badge status-' + (selectedReg.payment_status === 'paid' ? 'active' : 'pending')}>
                      {selectedReg.payment_status}
                    </span>
                  </div>
                  <div>
                    <div className="modal-section-label">Approval</div>
                    <span className={'status-badge status-' + (selectedReg.approval_status === 'approved' ? 'active' : selectedReg.approval_status === 'rejected' ? 'ended' : 'pending')}>
                      {selectedReg.approval_status}
                    </span>
                  </div>
                </div>

                {selectedReg.submission_file && (
                  <>
                    <div className="modal-section-label">Submission File</div>
                    <div className="file-preview-box">
                      <span>📁 {selectedReg.submission_file.split('/').pop()}</span>
                      <a href={`http://localhost:5000/${selectedReg.submission_file}`} target="_blank" rel="noreferrer"
                        className="btn-table-manage" style={{ textDecoration: 'none' }}>Open File</a>
                    </div>
                  </>
                )}

                {selectedReg.approval_status === 'pending' && (
                  <div className="modal-actions">
                    <button className="btn-approve" style={{ padding: '10px 24px', fontSize: 13, borderRadius: 10 }}
                      onClick={() => handleAction(selectedReg.id, 'approve')}>✅ Approve</button>
                    <button className="btn-reject" style={{ padding: '10px 24px', fontSize: 13, borderRadius: 10 }}
                      onClick={() => handleAction(selectedReg.id, 'reject')}>❌ Reject</button>
                  </div>
                )}

                {selectedReg.approval_status === 'approved' && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 10, fontSize: 13, color: '#a855f7', textAlign: 'center' }}>
                    ✅ This registration has been approved
                  </div>
                )}

                {selectedReg.approval_status === 'rejected' && (
                  <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(248,113,113,0.06)', border: '1px solid rgba(248,113,113,0.15)', borderRadius: 10, fontSize: 13, color: '#f87171', textAlign: 'center' }}>
                    ❌ This registration has been rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

export default ManageHackathon;