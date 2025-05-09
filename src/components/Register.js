import React, { useState } from 'react';
import './Register.css';

function Register({ onRegister }) {
  const [enrollmentId, setEnrollmentId] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [division, setDivision] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!enrollmentId || !rollNo || !fullName || !yearOfStudy || !division || !email) {
      setMessage('Please fill in all fields.');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enrollmentId, rollNo, fullName, yearOfStudy, division, email }),
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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/verify-otp-register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, enrollmentId, rollNo, fullName, yearOfStudy, division }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else {
        setMessage(data.error || 'Registration failed.');
      }
    } catch (err) {
      setMessage('Error: Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Register for DSSA Portal</h2>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="form-group">
              <label>Enrollment ID:</label>
              <input
                type="text"
                value={enrollmentId}
                onChange={(e) => setEnrollmentId(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Roll No:</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Full Name:</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Year of Study:</label>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                <option value="First">First</option>
                <option value="Second">Second</option>
                <option value="Third">Third</option>
                <option value="Fourth">Fourth</option>
              </select>
            </div>
            <div className="form-group">
              <label>Division:</label>
              <input
                type="text"
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                required
              />
            </div>
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
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
            <button type="submit">Verify OTP & Register</button>
          </form>
        )}
        {message && (
          <p className={message.includes('Error') || message.includes('failed') ? 'error' : 'success'}>
            {message}
          </p>
        )}
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
