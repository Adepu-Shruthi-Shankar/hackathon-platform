import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../api/axios';
import '../styles/Sidebar.css';
import '../styles/Jury.css';

const initialForm = {
  full_name: '',
  email: '',
  expertise: '',
  organization: '',
  designation: ''
};

const designations = [
  'Senior Evaluator',
  'Technical Judge',
  'Domain Expert',
  'Industry Mentor',
  'Academic Advisor',
  'Chief Jury',
  'Panel Member'
];

function Jury() {
  const [activeTab, setActiveTab] = useState('list');
  const [juryList,  setJuryList]  = useState([]);
  const [form,      setForm]      = useState(initialForm);
  const [loading,   setLoading]   = useState(false);
  const [fetching,  setFetching]  = useState(true);
  const [error,     setError]     = useState('');
  const [success,   setSuccess]   = useState('');

  useEffect(() => { fetchJury(); }, []);

  const fetchJury = async () => {
    try {
      const res = await API.get('/jury');
      setJuryList(res.data.jury);
    } catch (err) {
      console.error('Fetch jury error:', err);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await API.post('/jury', form);
      setSuccess('Jury member added successfully! Credentials have been stored in the database.');
      setForm(initialForm);
      fetchJury();
      setTimeout(() => {
        setActiveTab('list');
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to add jury member.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setForm(initialForm);
    setError('');
    setSuccess('');
  };

  return (
    <div className="jury-page">
      <Sidebar />

      <div className="page-header">
        <h3>Jury Panel</h3>
        <p>Onboard and manage jury members for hackathons</p>
      </div>

      <div className="page-content">

        {/* Tabs */}
        <div className="page-tabs">
          <button
            className={`tab-btn ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => setActiveTab('list')}
          >
            👨‍⚖️ All Jury Members
          </button>
          <button
            className={`tab-btn ${activeTab === 'add' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('add');
              setError('');
              setSuccess('');
            }}
          >
            ➕ Add Jury Member
          </button>
        </div>

        {/* ── LIST TAB ── */}
        {activeTab === 'list' && (
          <div className="table-card">
            <div className="table-card-header">
              <h4>All Jury Members</h4>
              <span>{juryList.length} members</span>
            </div>

            {fetching ? (
              <div className="empty-table">Loading...</div>
            ) : juryList.length === 0 ? (
              <div className="empty-table">
                No jury members yet. Click "Add Jury Member" to onboard one.
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Designation</th>
                    <th>Expertise</th>
                    <th>Organization</th>
                    <th>Username</th>
                    <th>Added On</th>
                  </tr>
                </thead>
                <tbody>
                  {juryList.map((j, i) => (
                    <tr key={j.id}>
                      <td className="td-muted">{i + 1}</td>
                      <td className="td-bold">{j.full_name}</td>
                      <td className="td-muted">{j.email}</td>
                      <td>
                        <span className="designation-badge">
                          {j.designation}
                        </span>
                      </td>
                      <td className="td-muted">{j.expertise}</td>
                      <td className="td-muted">{j.organization}</td>
                      <td>
                        <span className="username-text">
                          {j.username}
                        </span>
                      </td>
                      <td className="td-muted">
                        {new Date(j.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── ADD TAB ── */}
        {activeTab === 'add' && (
          <div className="jury-form-card">
            <div className="jury-form-title">
              Onboard New Jury Member
            </div>
            <div className="jury-form-subtitle">
              Fill in the details below. A username and password will be
              auto-generated from their name and email, then stored
              securely in the database.
            </div>

            {success && (
              <div className="form-success">✅ {success}</div>
            )}

            {error && (
              <div className="form-error">❌ {error}</div>
            )}

            <form onSubmit={handleSubmit}>

              <div className="form-row">
                <div className="form-field">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="e.g. Dr. John Smith"
                    value={form.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. john@university.edu"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Designation</label>
                  <select
                    name="designation"
                    value={form.designation}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select designation</option>
                    {designations.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div className="form-field">
                  <label>Area of Expertise</label>
                  <input
                    type="text"
                    name="expertise"
                    placeholder="e.g. Machine Learning, Web Dev"
                    value={form.expertise}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row single">
                <div className="form-field">
                  <label>Organization / Institution</label>
                  <input
                    type="text"
                    name="organization"
                    placeholder="e.g. IIT Madras, Google, Microsoft"
                    value={form.organization}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Adding...' : '👨‍⚖️ Add Jury Member'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleReset}
                >
                  Reset Form
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
}

export default Jury;