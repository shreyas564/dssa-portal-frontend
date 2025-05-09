import React, { useState } from 'react';

function Register({ onRegister }) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      setMessage('Please enter both email and name.');
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
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
        body: JSON.stringify({ email, otp }),
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register for DSSA Portal</h2>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">OTP:</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md"
            >
              Verify OTP & Register
            </button>
          </form>
        )}
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
