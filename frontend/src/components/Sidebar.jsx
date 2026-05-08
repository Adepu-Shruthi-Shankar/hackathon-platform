import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));
  const adminName = user?.name || 'Admin';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <h2>⚡ HackAdmin</h2>
        <span>Platform</span>
      </div>
      <div className="navbar-links">
        <button className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
          <span className="nav-icon">🏠</span> Dashboard
        </button>
        <button className={`nav-link ${isActive('/hackathons') ? 'active' : ''}`} onClick={() => navigate('/hackathons')}>
          <span className="nav-icon">🏆</span> Hackathons
        </button>
        <button className={`nav-link ${isActive('/jury') ? 'active' : ''}`} onClick={() => navigate('/jury')}>
          <span className="nav-icon">👨‍⚖️</span> Jury Panel
        </button>
      </div>
      <div className="navbar-right">
        <div className="navbar-icon-btn">🔔</div>
        <div className="nav-avatar">{adminName.charAt(0).toUpperCase()}</div>
        <button className="nav-logout-btn" onClick={handleLogout}>🚪 Logout</button>
      </div>
    </nav>
  );
}

export default Sidebar;