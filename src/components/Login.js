import React, { useState } from 'react';
import './Login.css';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpSent(true);
        setMessage('OTP sent to your email.');
      } else {
        setMessage(data.error || 'Failed to send OTP.');
      }
    } catch (err) {
      setMessage('Error: Failed to send OTP.');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        const userRes = await fetch(`${process.env.REACT_APP_API_URL}/verify-token`, {
          headers: { 'Authorization': `Bearer ${data.token}` },
        });
        const userData = await userRes.json();
        if (userRes.ok) {
          onLogin(userData);
        } else {
          setMessage('Failed to verify user.');
        }
      } else {
        setMessage(data.error || 'Login failed.');
      }
    } catch (err) {
      setMessage('Error: Login failed.');
    }
  };

  return (
    <div className="login-container">
      <h2>Login to DSSA Portal</h2>
      {!otpSent ? (
        <form onSubmit={handleSendOtp}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit">Send OTP</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled
            />
          </div>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      )}
      {message && <p className={message.startsWith('Error') ? 'error' : ''}>{message}</p>}
    </div>
  );
}

export default Login;
