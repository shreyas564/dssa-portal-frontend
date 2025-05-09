import React, { useState } from 'react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to DSSA Portal</h2>
        {!otpSent ? (
          <form onSubmit={handleSendOtp}>
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
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
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
              className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md"
            >
              Login
            </button>
          </form>
        )}
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
