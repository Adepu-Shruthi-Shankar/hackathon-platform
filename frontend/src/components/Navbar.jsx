import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup');
  const isCollegeForm = location.pathname === '/college/form';
  
  const user = JSON.parse(localStorage.getItem('user'));
  const role = user?.role;

  const dashboardPath = role === 'college' ? '/college/dashboard' : '/';

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="top-navbar">
      <div className="navbar-container">
        {isCollegeForm ? (
          <span className="navbar-logo" style={{ cursor: 'default' }}>
            Hackathon<span>Hub</span>
          </span>
        ) : (
          <Link to={dashboardPath} className="navbar-logo">
            Hackathon<span>Hub</span>
          </Link>
        )}
        
        {!isAuthPage && (
          <div className="navbar-links">
            {isCollegeForm ? (
              <span className="nav-link" style={{ cursor: 'default', textTransform: 'capitalize' }}>
                Role: {role}
              </span>
            ) : (
              <>
                <Link to={dashboardPath} className={`nav-link ${location.pathname === dashboardPath ? 'active' : ''}`}>Dashboard</Link>
                {role === 'college' && (
                  <Link to="/college/verifications" className={`nav-link ${location.pathname === '/college/verifications' ? 'active' : ''}`}>Verifications</Link>
                )}
              </>
            )}
            <a href="#" onClick={handleLogout} className="nav-link logout">Logout</a>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
