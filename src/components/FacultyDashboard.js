import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacultyDashboard = () => {
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

  // Fetch years on component mount
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const response = await axios.get(`${API_URL}/faculty/years`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setYears(response.data);
      } catch (err) {
        setError('Failed to fetch years');
      }
    };
    fetchYears();
  }, []);

  // Fetch divisions when a year is selected
  useEffect(() => {
    if (!selectedYear) return;
    const fetchDivisions = async () => {
      try {
        const response = await axios.get(`${API_URL}/faculty/divisions`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year: selectedYear },
        });
        setDivisions(response.data);
        setSelectedDivision(''); // Reset division
        setRollNos([]); // Reset roll numbers
        setStudentData(null); // Reset student data
      } catch (err) {
        setError('Failed to fetch divisions');
      }
    };
    fetchDivisions();
  }, [selectedYear]);

  // Fetch roll numbers when a division is selected
  useEffect(() => {
    if (!selectedYear || !selectedDivision) return;
    const fetchRollNos = async () => {
      try {
        const response = await axios.get(`${API_URL}/faculty/roll-nos`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { year: selectedYear, division: selectedDivision },
        });
        setRollNos(response.data);
        setSelectedRollNo(''); // Reset roll number
        setStudentData(null); // Reset student data
      } catch (err) {
        setError('Failed to fetch roll numbers');
      }
    };
    fetchRollNos();
  }, [selectedYear, selectedDivision]);

  // Fetch student marks when a roll number is selected
  const handleRollNoClick = async (rollNoData) => {
    try {
      const response = await axios.get(`${API_URL}/faculty/student-marks`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { email: rollNoData.email },
      });
      setStudentData(response.data);
      setSelectedRollNo(rollNoData.rollNo);
    } catch (err) {
      setError('Failed to fetch student marks');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Faculty Dashboard</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Select Year */}
      <div className="mb-4">
        <label className="block text-lg font-medium mb-2">Select Year</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded p-2 w-full"
        >
          <option value="">-- Select Year --</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Select Division */}
      {selectedYear && (
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Select Division</label>
          <select
            value={selectedDivision}
            onChange={(e) => setSelectedDivision(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">-- Select Division --</option>
            {divisions.map((division) => (
              <option key={division} value={division}>
                {division}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display Roll Numbers */}
      {selectedDivision && rollNos.length > 0 && (
        <div className="mb-4">
          <label className="block text-lg font-medium mb-2">Roll Numbers</label>
          <ul className="border rounded p-4">
            {rollNos.map((rollNoData) => (
              <li
                key={rollNoData.rollNo}
                onClick={() => handleRollNoClick(rollNoData)}
                className={`cursor-pointer p-2 hover:bg-gray-200 ${
                  selectedRollNo === rollNoData.rollNo ? 'bg-gray-300' : ''
                }`}
              >
                {rollNoData.rollNo}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Student Marks */}
      {studentData && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Student Details</h3>
          <p><strong>Full Name:</strong> {studentData.fullName}</p>
          <p><strong>Enrollment ID:</strong> {studentData.enrollmentId}</p>
          <p><strong>Roll No:</strong> {studentData.rollNo}</p>
          <p><strong>Year of Study:</strong> {studentData.yearOfStudy}</p>
          <p><strong>Division:</strong> {studentData.division}</p>
          <p><strong>Email:</strong> {studentData.email}</p>
          <h4 className="text-lg font-medium mt-4 mb-2">Marks</h4>
          {studentData.marks.length > 0 ? (
            <table className="w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Course Name</th>
                  <th className="border p-2">Score</th>
                  <th className="border p-2">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {studentData.marks.map((mark, index) => (
                  <tr key={index}>
                    <td className="border p-2">{mark.courseName}</td>
                    <td className="border p-2">{mark.score}</td>
                    <td className="border p-2">{new Date(mark.timestamp).toLocaleString()}</td>
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
