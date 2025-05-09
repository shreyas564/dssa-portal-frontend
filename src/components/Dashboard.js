import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function Dashboard({ user, onLogout }) {
  const [marks, setMarks] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetch-marks`, {
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
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>
      <p>Welcome, {user.name} ({user.email})</p>
      <button onClick={onLogout} className="logout-button">Logout</button>
      <h3>Your Marks</h3>
      {marks.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Score</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {marks.map((mark, index) => (
              <tr key={index}>
                <td>{mark.courseName}</td>
                <td>{mark.score}</td>
                <td>{new Date(mark.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No marks submitted yet.</p>
      )}
      {message && <p className={message.startsWith('Error') ? 'error' : ''}>{message}</p>}
    </div>
  );
}

export default Dashboard;
