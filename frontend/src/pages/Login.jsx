import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../styles/Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await API.post('/auth/login', { email, password });
      const { token, role, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));
      if (role === 'admin') navigate('/');
      else if (role === 'student') navigate('/dashboard');
      else if (role === 'college') navigate('/college/form');
      else if (role === 'jury') navigate('/jury-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow"></div>
      <div className="login-bg-glow-2"></div>
      <div className="login-card">
        <div className="login-logo">
          <h1>⚡ HackAdmin</h1>
          <p>Hackathon Management Platform</p>
        </div>
        <h2 className="login-title">Welcome back</h2>
        <p className="login-subtitle">Sign in to your account</p>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 16, color: '#6b7280', fontSize: 14 }}>
          Don't have an account? <a href="/signup" style={{ color: '#a855f7' }}>Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;