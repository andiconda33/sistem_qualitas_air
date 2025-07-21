import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Akun berhasil dibuat. Silakan login.");
        navigate("/login");
      } else {
        alert(`❌ Gagal mendaftar: ${data.error}`);
      }
    } catch (err) {
      alert("❌ Terjadi kesalahan saat menghubungi server.");
    }
  };

  // Styles
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
    width: '95%'
  };

  const buttonStyle = {
    backgroundColor: '#27ae60',
    color: '#fff',
    border: 'none',
    padding: '0.6rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%',
    marginBottom: '0.5rem'
  };

  const backButtonStyle = {
    backgroundColor: '#95a5a6',
    color: '#fff',
    border: 'none',
    padding: '0.6rem',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '100%'
  };

  return (
    <div style={wrapperStyle}>
      <div style={containerStyle}>
        <h2>Daftar Akun</h2>
        <form onSubmit={handleRegister} style={{ width: '100%' }}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={inputStyle}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="contoh@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          <button type="submit" style={buttonStyle}>Daftar</button>
        </form>
        <button onClick={() => navigate('/login')} style={backButtonStyle}>
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}

export default Register;
