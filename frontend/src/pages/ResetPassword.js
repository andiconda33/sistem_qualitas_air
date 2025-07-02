import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();
    alert(`Link reset telah dikirim ke email: ${email}`);
  };

  const containerStyle = {
    backgroundColor: '#2c3e50',
    padding: '2rem',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    width: '300px',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const wrapperStyle = {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4'
  };

  const inputStyle = {
    padding: '0.5rem',
    marginTop: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%'
  };

  const buttonStyle = {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.7rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.5rem'
  };

  const backButtonStyle = {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    padding: '0.5rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2>Reset Password</h2>
        <form onSubmit={handleReset} style={{ width: '100%' }}>
          <label>Masukkan Email</label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <button type="submit" style={buttonStyle}>Kirim Link Reset</button>
        </form>
        <button onClick={() => navigate('/login')} style={backButtonStyle}>Kembali ke Login</button>
      </div>
    </div>
  );
}

export default ResetPassword;
