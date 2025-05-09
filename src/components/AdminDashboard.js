import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ user, onLogout }) {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setUsers(data);
        } else {
          setMessage(data.error || 'Failed to fetch users.');
        }
      } catch (err) {
        setMessage('Error: Failed to fetch users.');
      }
    };
    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      enrollmentId: user.enrollmentId || '',
      rollNo: user.rollNo || '',
      fullName: user.fullName || '',
      yearOfStudy: user.yearOfStudy || '',
      division: user.division || '',
      email: user.email || '',
      role: user.role || 'Student',
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.map((u) => (u._id === editingUser._id ? { ...u, ...editForm } : u)));
        setEditingUser(null);
        setMessage('User updated successfully.');
      } else {
        setMessage(data.error || 'Failed to update user.');
      }
    } catch (err) {
      setMessage('Error: Failed to update user.');
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.REACT_APP_API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setMessage('User deleted successfully.');
      } else {
        setMessage(data.error || 'Failed to delete user.');
      }
    } catch (err) {
      setMessage('Error: Failed to delete user.');
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-card">
        <h2>Admin Dashboard</h2>
        <p>Welcome, {user.name} ({user.email})</p>
        <button onClick={onLogout} className="logout-button">Logout</button>
        <h3>Manage Users</h3>
        {users.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Enrollment ID</th>
                <th>Roll No</th>
                <th>Full Name</th>
                <th>Year</th>
                <th>Division</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>{u.enrollmentId || '-'}</td>
                  <td>{u.rollNo || '-'}</td>
                  <td>{u.fullName || '-'}</td>
                  <td>{u.yearOfStudy || '-'}</td>
                  <td>{u.division || '-'}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => handleEdit(u)} className="action-button edit">Edit</button>
                    <button onClick={() => handleDelete(u._id)} className="action-button delete">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users available.</p>
        )}
        {editingUser && (
          <div className="edit-form">
            <h4>Edit User: {editingUser.email}</h4>
            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Enrollment ID:</label>
                <input
                  type="text"
                  value={editForm.enrollmentId}
                  onChange={(e) => setEditForm({ ...editForm, enrollmentId: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Roll No:</label>
                <input
                  type="text"
                  value={editForm.rollNo}
                  onChange={(e) => setEditForm({ ...editForm, rollNo: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Year of Study:</label>
                <select
                  value={editForm.yearOfStudy}
                  onChange={(e) => setEditForm({ ...editForm, yearOfStudy: e.target.value })}
                >
                  <option value="">Select Year</option>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                  <option value="Fourth">Fourth</option>
                </select>
              </div>
              <div className="form-group">
                <label>Division:</label>
                <input
                  type="text"
                  value={editForm.division}
                  onChange={(e) => setEditForm({ ...editForm, division: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  required
                >
                  <option value="Student">Student</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <button type="submit" className="action-button save">Save</button>
              <button onClick={() => setEditingUser(null)} className="action-button cancel">Cancel</button>
            </form>
          </div>
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

export default AdminDashboard;