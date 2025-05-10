import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [users, setUsers] = useState([]);
  const [years, setYears] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [rollNos, setRollNos] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedDivision, setSelectedDivision] = useState('');
  const [selectedRollNo, setSelectedRollNo] = useState('');
  const [studentData, setStudentData] = useState(null);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({});

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL || 'https://dssa-portal-backend.onrender.com';
  const navigate = useNavigate();

  // Handle logout (simplified to match Student Dashboard)
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Fetch users by role
  const fetchUsersByRole = async (role) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users-by-role`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { role },
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users: ' + (err.response?.data?.error || err.message));
      setUsers([]);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Fetch years for Students
  const fetchStudentYears = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/student-years`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYears(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch years: ' + (err.response?.data?.error || err.message));
      setYears([]);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Fetch divisions for a selected year
  useEffect(() => {
    if (!selectedYear) return;
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/student-divisions`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year: selectedYear },
        });
        setDivisions(response.data);
        setSelectedDivision('');
        setRollNos([]);
        setStudentData(null);
        setEditingUser(null);
        setError('');
      } catch (err) {
        setError('Failed to fetch divisions: ' + (err.response?.data?.error || err.message));
        setDivisions([]);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchDivisions();
  }, [selectedYear]);

  // Fetch roll numbers for a selected division
  useEffect(() => {
    if (!selectedYear || !selectedDivision) return;
    const fetchRollNos = async () => {
      try {
        const response = await axios.get(`${API_URL}/admin/student-roll-nos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year: selectedYear, division: selectedDivision },
        });
        setRollNos(response.data);
        setSelectedRollNo('');
        setStudentData(null);
        setEditingUser(null);
        setError('');
      } catch (err) {
        setError('Failed to fetch roll numbers: ' + (err.response?.data?.error || err.message));
        setRollNos([]);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };
    fetchRollNos();
  }, [selectedYear, selectedDivision]);

  // Fetch student details
  const handleRollNoClick = async (rollNoData) => {
    try {
      const response = await axios.get(`${API_URL}/admin/student-details`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: rollNoData.email },
      });
      setStudentData(response.data);
      setSelectedRollNo(rollNoData.rollNo);
      setEditingUser(null);
      setError('');
    } catch (err) {
      setError('Failed to fetch student details: ' + (err.response?.data?.error || err.message));
      setStudentData(null);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  // Handle role button click
  const handleRoleClick = (role) => {
    setSelectedRole(role);
    setUsers([]);
    setYears([]);
    setDivisions([]);
    setRollNos([]);
    setSelectedYear('');
    setSelectedDivision('');
    setSelectedRollNo('');
    setStudentData(null);
    setEditingUser(null);

    if (role === 'Student') {
      fetchStudentYears();
    } else {
      fetchUsersByRole(role);
    }
  };

  // Handle year button click
  const handleYearClick = (year) => {
    setSelectedYear(year);
    setDivisions([]);
    setRollNos([]);
    setSelectedDivision('');
    setSelectedRollNo('');
    setStudentData(null);
    setEditingUser(null);
  };

  // Start editing a user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      enrollmentId: user.enrollmentId || '',
      rollNo: user.rollNo || '',
      fullName: user.fullName || '',
      yearOfStudy: user.yearOfStudy || '',
      division: user.division || '',
      email: user.email || '',
      role: user.role || '',
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Submit updated user details
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_URL}/admin/users/${editingUser._id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEditingUser(null);

      // Refresh the data based on the role
      if (selectedRole === 'Student') {
        const rollNoData = rollNos.find((r) => r.rollNo === selectedRollNo);
        if (rollNoData) {
          handleRollNoClick(rollNoData); // Refresh student details
        }
      } else {
        fetchUsersByRole(selectedRole); // Refresh Admins/Faculty list
      }
      setError('');
    } catch (err) {
      setError('Failed to update user: ' + (err.response?.data?.error || 'Unknown error'));
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header with Title and Logout Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Role Buttons */}
      <div className="mb-4">
        <button
          onClick={() => handleRoleClick('Admin')}
          className={`mr-2 px-4 py-2 rounded ${selectedRole === 'Admin' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Admins
        </button>
        <button
          onClick={() => handleRoleClick('Faculty')}
          className={`mr-2 px-4 py-2 rounded ${selectedRole === 'Faculty' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Faculty
        </button>
        <button
          onClick={() => handleRoleClick('Student')}
          className={`px-4 py-2 rounded ${selectedRole === 'Student' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          Students
        </button>
      </div>

      {/* Display Admins or Faculty */}
      {(selectedRole === 'Admin' || selectedRole === 'Faculty') && users.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">{selectedRole}s</h3>
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Full Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Role</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border p-2">{user.fullName || 'N/A'}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                  <td className="border p-2">
                    <button
                      onClick={() => handleEditClick(user)}
                      className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Display Year Buttons for Students */}
      {selectedRole === 'Student' && years.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Select Year</h3>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => handleYearClick(year)}
              className={`mr-2 px-4 py-2 rounded ${selectedYear === year ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {year} Year
            </button>
          ))}
        </div>
      )}

      {/* Display Divisions */}
      {selectedYear && divisions.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Divisions in {selectedYear} Year</h3>
          <ul className="border rounded p-4">
            {divisions.map((division) => (
              <li
                key={division}
                onClick={() => setSelectedDivision(division)}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${selectedDivision === division ? 'bg-gray-300' : ''}`}
              >
                {division}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Roll Numbers */}
      {selectedDivision && rollNos.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Roll Numbers in Division {selectedDivision}</h3>
          <ul className="border rounded p-4">
            {rollNos.map((rollNoData) => (
              <li
                key={rollNoData.rollNo}
                onClick={() => handleRollNoClick(rollNoData)}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${selectedRollNo === rollNoData.rollNo ? 'bg-gray-300' : ''}`}
              >
                {rollNoData.rollNo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Student Details */}
      {studentData && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Student Details</h3>
          <p><strong>Full Name:</strong> {studentData.fullName}</p>
          <p><strong>Enrollment ID:</strong> {studentData.enrollmentId}</p>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Year of Study:</strong> {studentData.yearOfStudy}</p>
          <p><strong>Division:</strong> {studentData.division}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Role:</strong> {studentData.role}</p>
          <button
            onClick={() => handleEditClick(studentData)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Edit Student
          </button>
        </div>
      )}

      {/* Edit User Form */}
      {editingUser && (
        <div className="border rounded p-4 mb-4">
          <h3 className="text-xl font-semibold mb-2">Edit User</h3>
          <form onSubmit={handleUpdateSubmit}>
            <div className="mb-2">
              <label className="block">Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              />
            </div>
            {editingUser.role === 'Student' && (
              <>
                <div className="mb-2">
                  <label className="block">Enrollment ID:</label>
                  <input
                    type="text"
                    name="enrollmentId"
                    value={formData.enrollmentId}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="mb-2">
                  <label className="block">Roll No:</label>
                  <input
                    type="text"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
                <div className="mb-2">
                  <label className="block">Year of Study:</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  >
                    <option value="">Select Year</option>
                    <option value="First">First</option>
                    <option value="Second">Second</option>
                    <option value="Third">Third</option>
                    <option value="Fourth">Fourth</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block">Division:</label>
                  <input
                    type="text"
                    name="division"
                    value={formData.division}
                    onChange={handleInputChange}
                    className="w-full border rounded p-2"
                  />
                </div>
              </>
            )}
            <div className="mb-2">
              <label className="block">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block">Role:</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full border rounded p-2"
              >
                <option value="Admin">Admin</option>
                <option value="Faculty">Faculty</option>
                <option value="Student">Student</option>
              </select>
            </div>
            <div className="flex">
              <button
                type="submit"
                className="mr-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
