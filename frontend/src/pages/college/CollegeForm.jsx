import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CollegeDashboard.css'; // Reusing the same CSS

const CollegeForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.target;
    const email = form.email.value.trim();
    const department = form.department.value;
    const file = form.professor_id.files[0];

    // Client-side validation
    if (!email || !department || !file) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('department', department);
    formData.append('professor_id', file);

    try {
      const response = await fetch('https://hackathon-platform-3bd3.onrender.com/api/college/verify', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert('Profile submitted successfully!');
        navigate('/college/dashboard');
      } else {
        setError(data.message || 'Submission failed. Please try again.');
      }
    } catch (err) {
      console.error('Verification fetch error:', err);
      setError('Network error. Please make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="welcome-text">Complete Your <span>Profile</span></h1>
        <p className="subtitle">Please verify your institution before accessing the dashboard.</p>
      </div>

      <div className="college-card">
        <h2 className="card-title">Verification Form</h2>
        <p className="card-desc">Please provide your official details to gain verification status on HackathonHub.</p>
        
        {error && <div style={{ color: '#f87171', marginBottom: '18px', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <form className="college-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Official College Email</label>
            <input type="email" name="email" placeholder="dean@college.edu" required />
          </div>

          <div className="input-group">
            <label>Department Name</label>
            <select name="department" required defaultValue="">
              <option value="" disabled>Select your department</option>
              <option value="Computer Science & Engineering">Computer Science & Engineering</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="Administration">Administration</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="input-group">
            <label>Upload Professor ID</label>
            <div className="file-upload-wrapper">
              <input type="file" id="file-upload" name="professor_id" className="file-input" required onChange={handleFileChange} />
              <label htmlFor="file-upload" className="file-label">
                <span className="upload-icon">📁</span> {fileName || 'Choose File'}
              </label>
            </div>
          </div>
          
          <button type="submit" className="college-submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit for Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CollegeForm;
