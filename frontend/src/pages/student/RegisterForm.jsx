import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    teamName: '',
    memberCount: 1,
    projectTrack: 'web',
    projectTitle: '',
    leaderName: '',
    leaderEmail: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      const student_id = user ? user.id : 1;
      
      // Try calling our backend API
      const response = await fetch('https://hackathon-platform-3bd3.onrender.com/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id,
          hackathon_id: parseInt(id) || id,
          teamName: formData.teamName,
          projectName: formData.projectTitle,
          leaderEmail: formData.leaderEmail
        })
      });

      if (response.ok) {
        const data = await response.json();
        alert('Registered successfully. Please complete payment from My Registrations.');
        navigate('/dashboard');
      } else {
        const data = await response.json();
        alert(data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('API Error:', err);
      alert('Registration failed due to server error');
    }
  };

  const inputStyle = {
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'rgba(255, 255, 255, 0.03)',
    color: 'var(--text-color)',
    outline: 'none',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box'
  };

  const inputFocusStyle = (e) => {
    e.target.style.borderColor = 'var(--accent-color)';
    e.target.style.boxShadow = '0 0 0 3px rgba(168,85,247,0.12)';
  };

  const inputBlurStyle = (e) => {
    e.target.style.borderColor = 'var(--border)';
    e.target.style.boxShadow = 'none';
  };

  const labelStyle = {
    fontSize: '0.95rem',
    color: 'var(--muted)',
    fontWeight: '500',
    marginBottom: '8px',
    display: 'block'
  };

  const formGroupStyle = {
    marginBottom: '18px'
  };

  const primaryBtnStyle = {
    padding: '1.1rem',
    backgroundColor: 'var(--accent-color)',
    color: '#fff',
    fontWeight: '700',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 20px rgba(168,85,247,0.25)',
    fontSize: '1.05rem',
    flex: 1
  };
  
  const secondaryBtnStyle = {
    padding: '1.1rem',
    backgroundColor: 'transparent',
    color: 'var(--text-color)',
    fontWeight: '700',
    borderRadius: '10px',
    border: '1px solid var(--border)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1.05rem',
    flex: 1
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px', margin: '2rem auto', transition: 'all 0.5s ease', overflow: 'hidden', position: 'relative' }}>
      
      {/* Progress Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', justifyContent: 'center' }}>
        <div style={{ 
          width: '35px', height: '35px', borderRadius: '50%', 
          backgroundColor: step >= 1 ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
          color: step >= 1 ? '#fff' : 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
          transition: 'all 0.4s ease',
          boxShadow: step >= 1 ? '0 0 15px rgba(168,85,247,0.4)' : 'none'
        }}>1</div>
        <div style={{ 
          height: '4px', width: '60px', 
          backgroundColor: step >= 2 ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
          transition: 'all 0.4s ease',
          margin: '0 10px'
        }}></div>
        <div style={{ 
          width: '35px', height: '35px', borderRadius: '50%', 
          backgroundColor: step >= 2 ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
          color: step >= 2 ? '#fff' : 'var(--muted)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
          transition: 'all 0.4s ease',
          boxShadow: step >= 2 ? '0 0 15px rgba(168,85,247,0.4)' : 'none'
        }}>2</div>
      </div>

      <h2 style={{ marginBottom: '25px', color: 'var(--text-color)', fontSize: '1.8rem', letterSpacing: '-0.5px', textAlign: 'center' }}>
        {step === 1 ? 'Team Information' : 'Leader Information'}
      </h2>

      <form onSubmit={step === 1 ? handleNext : handleRegister} style={{ display: 'flex', flexDirection: 'column' }}>
        
        {/* Step 1 */}
        {step === 1 && (
          <div style={{ animation: 'fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Team Name</label>
              <input type="text" name="teamName" required value={formData.teamName} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle} placeholder="Enter your team name"/>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Number of Members</label>
              <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.5rem', width: 'fit-content' }}>
                <button type="button" onClick={() => setFormData(prev => ({...prev, memberCount: Math.max(1, prev.memberCount - 1)}))} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 10px' }}>↓</button>
                <input type="number" name="memberCount" min="1" max="6" value={formData.memberCount} onChange={handleChange} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', textAlign: 'center', width: '40px', fontSize: '1rem', outline: 'none', appearance: 'none', MozAppearance: 'textfield' }} readOnly />
                <button type="button" onClick={() => setFormData(prev => ({...prev, memberCount: Math.min(6, prev.memberCount + 1)}))} style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', fontSize: '1.2rem', cursor: 'pointer', padding: '0 10px' }}>↑</button>
              </div>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Project Track</label>
              <select name="projectTrack" value={formData.projectTrack} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle}>
                <option value="web" style={{background: '#0f172a', color: '#fff'}}>Web Development</option>
                <option value="ai" style={{background: '#0f172a', color: '#fff'}}>AI & Machine Learning</option>
                <option value="blockchain" style={{background: '#0f172a', color: '#fff'}}>Blockchain & Web3</option>
                <option value="mobile" style={{background: '#0f172a', color: '#fff'}}>Mobile App</option>
                <option value="hardware" style={{background: '#0f172a', color: '#fff'}}>IoT & Hardware</option>
              </select>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Project Title</label>
              <input type="text" name="projectTitle" required value={formData.projectTitle} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle} placeholder="Enter your project title"/>
            </div>

            <div style={{ display: 'flex', marginTop: '20px' }}>
              <button type="submit" style={{...primaryBtnStyle, width: '100%'}} 
                onMouseOver={(e) => { e.target.style.transform='translateY(-2px)'; e.target.style.backgroundColor='#c084fc'; e.target.style.boxShadow='0 8px 30px rgba(168,85,247,0.45)'}} 
                onMouseOut={(e) => { e.target.style.transform='none'; e.target.style.backgroundColor='var(--accent-color)'; e.target.style.boxShadow='0 4px 20px rgba(168,85,247,0.25)'}}>
                Next Step
              </button>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div style={{ animation: 'fadeInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>Leader Name</label>
              <input type="text" name="leaderName" required value={formData.leaderName} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle} placeholder="Full name of team leader"/>
            </div>
            
            <div style={formGroupStyle}>
              <label style={labelStyle}>Leader Email</label>
              <input type="email" name="leaderEmail" required value={formData.leaderEmail} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle} placeholder="leader@example.com"/>
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Phone Number</label>
              <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} style={inputStyle} onFocus={inputFocusStyle} onBlur={inputBlurStyle} placeholder="+1 234 567 8900"/>
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
              <button type="button" onClick={handleBack} style={secondaryBtnStyle}
                onMouseOver={(e) => { e.target.style.background='rgba(255,255,255,0.05)' }} 
                onMouseOut={(e) => { e.target.style.background='transparent' }}>
                Back
              </button>
              
              <button type="submit" style={primaryBtnStyle}
                onMouseOver={(e) => { e.target.style.transform='translateY(-2px)'; e.target.style.backgroundColor='#c084fc'; e.target.style.boxShadow='0 8px 30px rgba(168,85,247,0.45)'}} 
                onMouseOut={(e) => { e.target.style.transform='none'; e.target.style.backgroundColor='var(--accent-color)'; e.target.style.boxShadow='0 4px 20px rgba(168,85,247,0.25)'}}>
                Submit Registration
              </button>
            </div>
          </div>
        )}
      </form>
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateX(-15px); }
            to { opacity: 1; transform: translateX(0); }
          }
          @keyframes fadeInRight {
            from { opacity: 0; transform: translateX(15px); }
            to { opacity: 1; transform: translateX(0); }
          }
        `}
      </style>
    </div>
  );
};

export default RegisterForm;
