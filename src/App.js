import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import FacultyDashboard from './components/FacultyDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch(`${process.env.REACT_APP_API_URL}/verify-token`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            localStorage.removeItem('token');
          } else {
            setUser(data);
          }
        })
        .catch(err => {
          console.error('Error verifying token:', err);
          localStorage.removeItem('token');
        });
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user ? (
            user.role === 'Student' ? <Navigate to="/dashboard" /> : <Navigate to="/faculty-dashboard" />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/dashboard" element={
          user && user.role === 'Student' ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/faculty-dashboard" element={
          user && user.role === 'Faculty' ? (
            <FacultyDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
