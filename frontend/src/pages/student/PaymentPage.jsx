import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { mockHackathons } from '../../data/mockHackathons';

const PaymentPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistration = async () => {
      try {
        const response = await fetch(`https://hackathon-platform-3bd3.onrender.com/api/registrations/${id}`);
        if (response.ok) {
          const data = await response.json();
          setRegistration(data.data);
        }
      } catch (err) {
        console.error('Error fetching registration:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistration();
  }, [id]);

  const hackathon = registration ? mockHackathons.find(h => String(h.id) === String(registration.hackathon_id)) : null;

  const handlePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://hackathon-platform-3bd3.onrender.com/api/payment/${id}`, {
        method: 'PUT',
      });
      if (response.ok) {
        alert('Payment Successful! You are registered.');
        navigate('/dashboard');
      } else {
        alert('Payment failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Payment failed due to server error.');
    }
  };

  if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;

  if (!hackathon) {
    return (
      <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Registration not found</h2>
        <button onClick={() => navigate('/dashboard')} style={{ padding: '10px 20px', marginTop: '15px' }}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px', color: 'var(--secondary-color)' }}>Complete Payment</h2>
      <p style={{ marginBottom: '5px', color: 'var(--text-color)', fontSize: '1.1rem' }}>
        Hackathon: <strong>{hackathon.title}</strong>
      </p>
      <p style={{ marginBottom: '20px', color: 'var(--accent-color)', fontSize: '1.2rem', fontWeight: 'bold' }}>
        Amount due: {hackathon.fee}
      </p>

      <form onSubmit={handlePayment} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <label style={{ marginBottom: '5px' }}>Card Number</label>
          <input type="text" placeholder="XXXX XXXX XXXX XXXX" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }} />
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px' }}>Expiry Date</label>
            <input type="text" placeholder="MM/YY" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <label style={{ marginBottom: '5px' }}>CVC</label>
            <input type="text" placeholder="123" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }} />
          </div>
        </div>
        <button type="submit" style={{ padding: '12px', backgroundColor: 'var(--secondary-color)', color: '#000', fontWeight: 'bold', marginTop: '10px', borderRadius: '4px', cursor: 'pointer' }}>
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default PaymentPage;
