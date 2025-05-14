import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyDashboard = ({ onLogout }) => {
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

  // Fetch years
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${API_URL}/faculty/years`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setYears(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch years');
        setYears([]);
      }
    };
    fetchYears();
  }, []);

  // Fetch divisions for a selected year
useEffect(() => {
  if (!selectedYear) return;
  console.log('Fetching divisions for year:', selectedYear);
  const fetchDivisions = async () => {
    try {
      const response = await axios.get(`${API_URL}/faculty/divisions`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { year: selectedYear },
      });
      console.log('Divisions received:', response.data);
      setDivisions(response.data);
      setSelectedDivision('');
      setRollNos([]);
      setStudentData(null);
      setError('');
    } catch (err) {
      console.error('Error fetching divisions:', err);
      setError('Failed to fetch divisions');
      setDivisions([]);
    }
  };
  fetchDivisions();
}, [selectedYear]);

  // Fetch roll numbers for a selected division
  useEffect(() => {
    if (!selectedYear || !selectedDivision) return;
    const fetchRollNos = async () => {
      try {
        const response = await axios.get(`${API_URL}/faculty/roll-nos`, {
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

  // Fetch student details and marks
  const handleRollNoClick = async (rollNoData) => {
    try {
      const response = await axios.get(`${API_URL}/faculty/student-marks`, {
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

  return (
    <div className="p-6">
      {/* Header with Title and Logout Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Faculty Dashboard</h2>
        <button
          onClick={onLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Year Buttons */}
      {years.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Select Year</h3>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`mr-2 px-4 py-2 rounded ${selectedYear === year ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {year} Year
            </button>
          ))}
        </div>
      )}

{divisions.map((division) => (
  <li
    key={division}
    onClick={() => setSelectedDivision(division)}
    className={`cursor-pointer p-2 hover:bg-gray-200 ${selectedDivision === division ? 'bg-gray-300' : ''}`}
  >
    {division}
  </li>
))}


      {/* Roll Numbers */}
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

      {/* Student Details and Marks */}
      {studentData && (
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Student Details</h3>
          <p><strong>Full Name:</strong> {studentData.fullName}</p>
          <p><strong>Enrollment ID:</strong> {studentData.enrollmentId}</p>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Year of Study:</strong> {studentData.yearOfStudy}</p>
          <p><strong>Division:</strong> {studentData.division}</p>
          <p><strong>Email:</strong> {studentData.email}</p>

          <h4 className="text-lg font-semibold mt-4 mb-2">Marks</h4>
          {studentData.marks && studentData.marks.length > 0 ? (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Course Name</th>
                  <th className="border p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {studentData.marks.map((mark, index) => (
                  <tr key={index}>
                    <td className="border p-2">{mark.courseName}</td>
                    <td className="border p-2">{mark.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No marks available for this student.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FacultyDashboard;
