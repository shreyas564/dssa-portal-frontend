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

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL;

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setTimeout(() => navigate('/login'), 0); // Ensure navigation after state update
  };

  const fetchUsersByRole = async (role) => {
    try {
      const response = await axios.get(`${API_URL}/admin/users-by-role`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { role },
      });
      setUsers(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch users');
      setUsers([]);
    }
  };

  const fetchStudentYears = async () => {
    try {
      const response = await axios.get(`${API_URL}/admin/student-years`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setYears(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch years');
      setYears([]);
    }
  };

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
        setError('Failed to fetch divisions');
        setDivisions([]);
      }
    };
    fetchDivisions();
  }, [selectedYear]);

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
        setError('Failed to fetch roll numbers');
        setRollNos([]);
      }
    };
    fetchRollNos();
  }, [selectedYear, selectedDivision]);

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
      setError('Failed to fetch student details');
      setStudentData(null);
    }
  };

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

  const handleYearClick = (year) => {
    setSelectedYear(year);
    setDivisions([]);
    setRollNos([]);
    setSelectedDivision('');
    setSelectedRollNo('');
    setStudentData(null);
    setEditingUser(null);
  };

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${API_URL}/admin/users/${editingUser._id}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditingUser(null);

      if (selectedRole === 'Student') {
        const rollNoData = rollNos.find((r) => r.rollNo === selectedRollNo);
        if (rollNoData) {
          handleRollNoClick(rollNoData);
        }
      } else {
        fetchUsersByRole(selectedRole);
      }
      setError('');
    } catch (err) {
      setError('Failed to update user: ' + (err.response?.data?.error || 'Unknown error'));
    }
  };

  return (
    <div className="p-6">
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

      {/* The rest of your existing JSX remains unchanged */}

      {/* ... Keep your existing UI elements as before ... */}

    </div>
  );
};

export default AdminDashboard;
