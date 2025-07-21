import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', data.user.username);
        localStorage.setItem('userId', data.user.id);
        localStorage.setItem('role', 'admin'); // Bisa ubah kalau nanti ada role dari DB

        navigate('/dashboard');
      } else {
        alert(data.error || 'Login gagal');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Gagal menghubungi server.');
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

          <div className="register-link">
             <span>Belum punya akun? </span>
             <Link to="/register" style={{ color: 'white', textDecoration: 'underline' }}>
             Daftar di sini</Link>
        </div>

          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
