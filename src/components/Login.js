import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/send-otp`, {
        email: formData.email,
      });
      setMessage('OTP sent to your email');
      setStep('otp');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, {
        email: formData.email,
        otp: formData.otp,
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      chrome.storage.local.set({ jwtToken: token }, () => {
        console.log('JWT token stored in chrome.storage');
      });
      setMessage('Login successful');
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login (Student)</h2>
        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Email"
                required
                aria-label="Email"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">OTP</label>
              <input
                type="text"
                value={formData.otp}
                onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                className="w-full p-2 border rounded"
                placeholder="Enter OTP"
                required
                aria-label="OTP"
                inputMode="numeric"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={handleEmailSubmit}
              className="mt-2 text-blue-500 hover:underline"
            >
              Resend OTP
            </button>
          </form>
        )}
        {message && (
          <p
            className={`mt-4 text-center ${
              message.includes('successful') ? 'text-green-500' : 'text-red-500'
            }`}
          >
            {message}
          </p>
        )}
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <a href="/register" className="text-blue-500 hover:underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;
