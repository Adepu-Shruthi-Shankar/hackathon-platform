import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const StudentSignup = () => {
  const [role, setRole] = useState('student');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await fetch('https://hackathon-platform-3bd3.onrender.com/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await response.json();
      if (response.ok) navigate('/login');
      else setError(data.message || 'Signup failed');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#060608', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Space Grotesk, sans-serif' }}>
      <div style={{ width: 420, padding: 40, borderRadius: 24, border: '1px solid rgba(168,85,247,0.3)', background: 'linear-gradient(145deg, rgba(168,85,247,0.1), rgba(13,13,20,0.95))' }}>
        <h2 style={{ color: '#fff', textAlign: 'center', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Create Account</h2>
        <p style={{ color: '#6b7280', textAlign: 'center', marginBottom: 24 }}>Join NexusHack Platform</p>

        {error && <div style={{ color: '#ef4444', marginBottom: 16, textAlign: 'center', fontSize: 14 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {['student', 'college', 'jury', 'admin'].map(r => (
            <button key={r} onClick={() => setRole(r)} type="button" style={{
              flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: role === r ? 'linear-gradient(90deg,#a855f7,#9333ea)' : 'rgba(255,255,255,0.05)',
              color: '#fff', fontWeight: 600, textTransform: 'capitalize', fontSize: 13
            }}>{r}</button>
          ))}
        </div>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { label: 'Full Name', type: 'text', value: name, onChange: setName, placeholder: 'Enter your name' },
            { label: 'Email Address', type: 'email', value: email, onChange: setEmail, placeholder: 'Enter your email' },
            { label: 'Password', type: 'password', value: password, onChange: setPassword, placeholder: 'Create a password' }
          ].map(field => (
            <div key={field.label}>
              <label style={{ display: 'block', color: '#aaa', marginBottom: 6, fontSize: 14 }}>{field.label}</label>
              <input type={field.type} placeholder={field.placeholder} value={field.value}
                onChange={e => field.onChange(e.target.value)} required
                style={{ width: '100%', padding: 14, borderRadius: 12, border: 'none', background: '#fff', color: '#000', boxSizing: 'border-box' }} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{
            padding: 14, borderRadius: 12, border: 'none',
            background: 'linear-gradient(90deg,#a855f7,#9333ea)', color: '#fff', fontWeight: 700, cursor: 'pointer', marginTop: 8
          }}>
            {loading ? 'Creating account...' : `Sign Up as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#6b7280', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#a855f7' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};

export default StudentSignup;