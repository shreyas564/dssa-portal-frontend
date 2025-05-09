import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
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
        <Route path="/" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> : <FacultyDashboard user={user} onLogout={handleLogout} />
          ) : (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
              <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to DSSA Portal</h1>
                <p className="text-gray-600 mb-8">Please choose an option to continue</p>
                <div className="space-y-4">
                  <Link to="/login">
                    <button className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all shadow-md">
                      Login
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all shadow-md">
                      Register
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )
        } />
        <Route path="/login" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> : <FacultyDashboard user={user} onLogout={handleLogout} />
          ) : (
            <Login onLogin={handleLogin} />
          )
        } />
        <Route path="/register" element={
          user ? (
            user.role === 'Student' ? <Dashboard user={user} onLogout={handleLogout} /> : <FacultyDashboard user={user} onLogout={handleLogout} />
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
      </Routes>
    </Router>
  );
}

export default App;
