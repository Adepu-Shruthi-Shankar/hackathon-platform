import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HackathonCard.css';

const HackathonCard = ({ id, title, description, fee, status, eligibility, start_date, end_date }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isCollege = user?.role === 'college';

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBA';
  const formatFee = (f) => (!f || f == 0) ? 'Free' : `₹${f}`;

  return (
    <div className="hackathon-card">
      <div className="card-header">
        <span className={`status-badge ${status === 'active' ? 'open' : status === 'ended' ? 'closed' : 'warning'}`}>
          {status}
        </span>
      </div>
      <h3 className="hackathon-title">{title || 'Hackathon Name'}</h3>
      <p className="hackathon-desc">{description || 'A brief description of the hackathon event.'}</p>
      <div className="hackathon-details">
        <div className="detail-item">
          <span className="detail-icon">📅</span>
          <span>{formatDate(start_date)} → {formatDate(end_date)}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💰</span>
          <span>{formatFee(fee)}</span>
        </div>
        {eligibility && (
          <div className="detail-item">
            <span className="detail-icon">🎓</span>
            <span>{eligibility}</span>
          </div>
        )}
      </div>
      {!isCollege && (
        <div className="card-footer">
          <button className="details-btn" onClick={() => navigate(`/hackathon/${id}`)}>
            View Details
          </button>
        </div>
      )}
    </div>
  );
};

export default HackathonCard;