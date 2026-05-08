import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import '../styles/Sidebar.css';
import '../styles/Hackathons.css';

const initialForm = {
  title: '', description: '', start_date: '',
  end_date: '', fee: '', eligibility: '', status: 'active'
};

function Hackathons() {
  const [activeTab,   setActiveTab]   = useState('list');
  const [hackathons,  setHackathons]  = useState([]);
  const [form,        setForm]        = useState(initialForm);
  const [editId,      setEditId]      = useState(null);
  const [loading,     setLoading]     = useState(false);
  const [fetching,    setFetching]    = useState(true);
  const [success,     setSuccess]     = useState('');
  const [error,       setError]       = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchHackathons(); }, []);

  const fetchHackathons = async () => {
    try {
      const res = await API.get('/hackathons');
      setHackathons(res.data.hackathons);
    } catch (err) {
      console.error(err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (h) => {
    setEditId(h.id);
    setForm({
      title:       h.title,
      description: h.description,
      start_date:  h.start_date?.split('T')[0] || h.start_date,
      end_date:    h.end_date?.split('T')[0]   || h.end_date,
      fee:         h.fee,
      eligibility: h.eligibility,
      status:      h.status
    });
    setActiveTab('create');
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      if (editId) {
        await API.put(`/hackathons/${editId}`, {
          ...form,
          fee: form.fee === '' ? 0 : parseFloat(form.fee)
        });
        setSuccess('Hackathon updated successfully!');
        setEditId(null);
      } else {
        await API.post('/hackathons', {
          ...form,
          fee: form.fee === '' ? 0 : parseFloat(form.fee)
        });
        setSuccess('Hackathon created successfully!');
      }
      setForm(initialForm);
      fetchHackathons();
      setTimeout(() => { setActiveTab('list'); setSuccess(''); }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this hackathon?')) return;
    try {
      await API.delete(`/hackathons/${id}`);
      setHackathons(hackathons.filter(h => h.id !== id));
    } catch (err) {
      alert('Failed to delete.');
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setEditId(null);
    setError('');
    setSuccess('');
  };

  return (
    <div className="hackathons-page">
      <Sidebar />
      <div className="page-header">
        <h3>Hackathons</h3>
        <p>Create and manage all hackathon events</p>
      </div>
      <div className="page-content">

        <div className="page-tabs">
          <button
            className={'tab-btn ' + (activeTab === 'list' ? 'active' : '')}
            onClick={() => { setActiveTab('list'); handleReset(); }}
          >
            📋 All Hackathons
          </button>
          <button
            className={'tab-btn ' + (activeTab === 'create' ? 'active' : '')}
            onClick={() => { setActiveTab('create'); handleReset(); }}
          >
            {editId ? '✏️ Edit Hackathon' : '➕ Create New'}
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="table-card">
            <div className="table-card-header">
              <h4>All Hackathons</h4>
              <span>{hackathons.length} total</span>
            </div>
            {fetching ? (
              <div className="empty-table">Loading...</div>
            ) : hackathons.length === 0 ? (
              <div className="empty-table">No hackathons yet.</div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Title</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Fee</th>
                    <th>Eligibility</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {hackathons.map((h, i) => (
                    <tr key={h.id}>
                      <td className="td-muted">{i + 1}</td>
                      <td className="td-title">{h.title}</td>
                      <td className="td-muted">
                        {new Date(h.start_date).toLocaleDateString()}
                      </td>
                      <td className="td-muted">
                        {new Date(h.end_date).toLocaleDateString()}
                      </td>
                      <td className="td-muted">
                        {h.fee == 0 ? 'Free' : '₹' + h.fee}
                      </td>
                      <td className="td-muted">{h.eligibility}</td>
                      <td>
                        <span className={'status-badge status-' + h.status}>
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-table-manage"
                            onClick={() => navigate('/manage/' + h.id)}
                          >
                            Manage
                          </button>
                          <button
                            className="btn-table-manage"
                            style={{ color: '#FBB030', borderColor: 'rgba(251,176,48,0.3)', background: 'rgba(251,176,48,0.08)' }}
                            onClick={() => handleEdit(h)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-table-delete"
                            onClick={() => handleDelete(h.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {activeTab === 'create' && (
          <div className="form-card">
            <div className="form-card-title">
              {editId ? '✏️ Edit Hackathon' : 'Create New Hackathon'}
            </div>
            {success && <div className="form-success">✅ {success}</div>}
            {error   && <div className="form-error">❌ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="form-row single">
                <div className="form-field">
                  <label>Hackathon Title</label>
                  <input
                    type="text" name="title"
                    placeholder="e.g. Code Sprint 2024"
                    value={form.title} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-row single">
                <div className="form-field">
                  <label>Description</label>
                  <textarea
                    name="description"
                    placeholder="Describe the hackathon..."
                    value={form.description} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Start Date</label>
                  <input
                    type="date" name="start_date"
                    value={form.start_date} onChange={handleChange} required
                  />
                </div>
                <div className="form-field">
                  <label>End Date</label>
                  <input
                    type="date" name="end_date"
                    value={form.end_date} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Registration Fee (₹)</label>
                  <input
                    type="number" name="fee"
                    placeholder="0 for free"
                    value={form.fee} onChange={handleChange} min="0"
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select name="status" value={form.status} onChange={handleChange}>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="ended">Ended</option>
                  </select>
                </div>
              </div>
              <div className="form-row single">
                <div className="form-field">
                  <label>Eligibility</label>
                  <input
                    type="text" name="eligibility"
                    placeholder="e.g. All engineering students"
                    value={form.eligibility} onChange={handleChange} required
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : editId ? '✏️ Update Hackathon' : '🚀 Create Hackathon'}
                </button>
                <button type="button" className="btn-secondary" onClick={handleReset}>
                  {editId ? 'Cancel Edit' : 'Reset Form'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Hackathons;