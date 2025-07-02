import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'Admin' && password === '1234') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', 'Admin');
      localStorage.setItem('role', 'admin');
      navigate('/dashboard');
    } else if (username === 'Rina' && password === '5678') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', 'Rina');
      localStorage.setItem('role', 'user');
      navigate('/dashboard');
    } else {
      alert('Username atau password salah');
    }
  };

  const backgroundStyle = {
    backgroundImage: "url('/background.jpeg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  };

  return (
    <div style={backgroundStyle}>
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <img src="/logo.png" alt="Logo" className="login-logo" />
          <h2>Login</h2>

          <label>Username</label>
          <input
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="forgot-password">
            <Link to="/reset-password">Lupa Password?</Link>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
