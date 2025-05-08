import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [marks, setMarks] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Verify token and get user info
    axios
      .get('https://dssa-portal-backend.onrender.com/verify-token', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setUser(response.data);
        // Fetch marks
        axios
          .get('https://dssa-portal-backend.onrender.com/fetch-marks', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => setMarks(response.data))
          .catch((error) => setMessage('Failed to fetch marks'));
      })
      .catch((error) => {
        setMessage('Session expired. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    chrome.storage.local.remove('jwtToken');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Welcome, {user?.name || 'User'} ({user?.role || 'N/A'})
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        <h3 className="text-xl font-semibold mb-4">Your Marks</h3>
        {message && <p className="text-red-500 mb-4">{message}</p>}
        {marks.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="p-2 border">Course Name</th>
                <th className="p-2 border">Score</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, index) => (
                <tr key={index} className="even:bg-gray-50">
                  <td className="p-2 border">{mark.courseName}</td>
                  <td className="p-2 border">{mark.score}</td>
                  <td className="p-2 border">{mark.name}</td>
                  <td className="p-2 border">{new Date(mark.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No marks available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;