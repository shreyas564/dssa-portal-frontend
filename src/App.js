import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import FacultyDashboard from './components/FacultyDashboard';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

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
        <Route path="/" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Faculty' ? <FacultyDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            <Login onLogin={handleLogin} />
          ) : (
            <div className="landing-container">
              <div className="landing-card">
                <h1>Welcome to DSSA Portal</h1>
                <p>Please choose an option to continue</p>
                <div className="landing-buttons">
                  <Link to="/login">
                    <button className="landing-button login">Login</button>
                  </Link>
                  <Link to="/register">
                    <button className="landing-button register">Register</button>
                  </Link>
                </div>
              </div>
            </div>
          )
        } />
        <Route path="/login" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Faculty' ? <FacultyDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            <Login onLogin={handleLogin} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/register" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Faculty' ? <FacultyDashboard user={user} onLogout={handleLogout} /> :
            user.role === 'Admin' ? <AdminDashboard user={user} onLogout={handleLogout} /> :
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegister={handleLogin} />
          )
        } />
        <Route path="/dashboard" element={
          user && user.role === 'Student' ? (
            <Dashboard user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/faculty-dashboard" element={
          user && user.role === 'Faculty' ? (
            <FacultyDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/admin-dashboard" element={
          user && user.role === 'Admin' ? (
            <AdminDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
      </Routes>
    </Router>
  );
}

export default App;
