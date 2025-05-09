import React, { useState, useEffect } from 'react';

function FacultyDashboard({ user, onLogout }) {
  const [marks, setMarks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetch-all-marks`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMarks(data);
        } else {
          setMessage(data.error || 'Failed to fetch marks.');
        }
      } catch (err) {
        setMessage('Error: Failed to fetch marks.');
      }
    };
    fetchMarks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10">
      <div className="max-w-5xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Faculty Dashboard</h2>
        <p className="text-gray-600 text-center mb-6">Welcome, {user.name} ({user.email})</p>
        <button
          onClick={onLogout}
          className="w-full md:w-auto py-3 px-6 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-md mb-8"
        >
          Logout
        </button>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Students' Marks</h3>
        {marks.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
              <thead>
                <tr>
                  <th className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-left">Name</th>
                  <th className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-left">Email</th>
                  <th className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-left">Course Name</th>
                  <th className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-left">Score</th>
                  <th className="p-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-left">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {marks.map((mark, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4 text-gray-700">{mark.name}</td>
                    <td className="p-4 text-gray-700">{mark.email}</td>
                    <td className="p-4 text-gray-700">{mark.courseName}</td>
                    <td className="p-4 text-gray-700">{mark.score}</td>
                    <td className="p-4 text-gray-700">{new Date(mark.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No marks available.</p>
        )}
        {message && (
          <p className={`mt-4 text-center ${message.includes('Error') || message.includes('failed') ? 'text-red-500' : 'text-green-500'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
