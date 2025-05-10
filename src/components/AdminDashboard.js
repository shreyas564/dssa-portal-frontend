import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  const token = localStorage.getItem('token');
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch users by role when a role is selected
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

  // Fetch years when "Students" role is selected
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

  // Fetch divisions when a year is selected
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
        setError('');
      } catch (err) {
        setError('Failed to fetch divisions');
        setDivisions([]);
      }
    };
    fetchDivisions();
  }, [selectedYear]);

  // Fetch roll numbers when a division is selected
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
        setError('');
      } catch (err) {
        setError('Failed to fetch roll numbers');
        setRollNos([]);
      }
    };
    fetchRollNos();
  }, [selectedYear, selectedDivision]);

  // Fetch student details when a roll number is selected
  const handleRollNoClick = async (rollNoData) => {
    try {
      const response = await axios.get(`${API_URL}/admin/student-details`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: rollNoData.email },
      });
      setStudentData(response.data);
      setSelectedRollNo(rollNoData.rollNo);
      setError('');
    } catch (err) {
      setError('Failed to fetch student details');
      setStudentData(null);
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
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
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
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td className="border p-2">{user.fullName || 'N/A'}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
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
        <div>
          <h3 className="text-xl font-semibold mb-2">Student Details</h3>
          <p><strong>Full Name:</strong> {studentData.fullName}</p>
          <p><strong>Enrollment ID:</strong> {studentData.enrollmentId}</p>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Year of Study:</strong> {studentData.yearOfStudy}</p>
          <p><strong>Division:</strong> {studentData.division}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <p><strong>Role:</strong> {studentData.role}</p>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
