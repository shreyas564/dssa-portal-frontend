import React, { useState, useEffect } from 'react';
import './Dashboard.css';

function FacultyDashboard({ user, onLogout }) {
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/fetch-all-students`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setStudents(data);
        } else {
          setMessage(data.error || 'Failed to fetch students.');
        }
      } catch (err) {
        setMessage('Error: Failed to fetch students.');
      }
    };
    fetchStudents();
  }, []);

  // Group students by Year of Study, then Division, then Roll No
  const groupedStudents = students.reduce((acc, student) => {
    const year = student.yearOfStudy || 'Unknown Year';
    const division = student.division || 'Unknown Division';
    const rollNo = student.rollNo || 'Unknown Roll No';

    if (!acc[year]) acc[year] = {};
    if (!acc[year][division]) acc[year][division] = {};
    if (!acc[year][division][rollNo]) acc[year][division][rollNo] = [];

    acc[year][division][rollNo].push(student);
    return acc;
  }, {});

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h2>Faculty Dashboard</h2>
        <p>Welcome, {user.name} ({user.email})</p>
        <button onClick={onLogout} className="logout-button">Logout</button>
        <h3>Student Hierarchy</h3>
        {Object.keys(groupedStudents).length > 0 ? (
          Object.keys(groupedStudents).map((year) => (
            <div key={year} className="hierarchy-section">
              <h4>Year: {year}</h4>
              {Object.keys(groupedStudents[year]).map((division) => (
                <div key={division} className="hierarchy-subsection">
                  <h5>Division: {division}</h5>
                  {Object.keys(groupedStudents[year][division]).map((rollNo) => (
                    <div key={rollNo} className="hierarchy-item">
                      <h6>Roll No: {rollNo}</h6>
                      <table>
                        <thead>
                          <tr>
                            <th>Enrollment ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Course Name</th>
                            <th>Score</th>
                            <th>Timestamp</th>
                          </tr>
                        </thead>
                        <tbody>
                          {groupedStudents[year][division][rollNo].map((student, index) =>
                            student.marks && student.marks.length > 0 ? (
                              student.marks.map((mark, markIndex) => (
                                <tr key={`${index}-${markIndex}`}>
                                  <td>{student.enrollmentId}</td>
                                  <td>{student.fullName}</td>
                                  <td>{student.email}</td>
                                  <td>{mark.courseName}</td>
                                  <td>{mark.score}</td>
                                  <td>{new Date(mark.timestamp).toLocaleString()}</td>
                                </tr>
                              ))
                            ) : (
                              <tr key={index}>
                                <td>{student.enrollmentId}</td>
                                <td>{student.fullName}</td>
                                <td>{student.email}</td>
                                <td colSpan="3">No marks available</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p>No students available.</p>
        )}
        {message && (
          <p className={message.includes('Error') || message.includes('failed') ? 'error' : 'success'}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default FacultyDashboard;
