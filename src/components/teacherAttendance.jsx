import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import apiService from '../Api'; // Import the ApiService class

const AUCA_LATITUDE = -1.9559213026121696;
const AUCA_LONGITUDE = 30.10413054430662;
const AUCA_RADIUS = 50;

const TeacherSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [status, setStatus] = useState('Present');
  const [geolocation, setGeolocation] = useState({ latitude: null, longitude: null });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'info' });

  useEffect(() => {
    fetchClasses();
    getGeolocation();
  }, []);

  const fetchClasses = async () => {
    try {
      const teacherId = localStorage.getItem('user_id');
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/teacher/${teacherId}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      showAlert('Failed to fetch classes. Please try again later.', 'error');
    }
  };

  const getGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeolocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          showAlert('You need to allow location access to mark attendance.', 'warning');
        }
      );
    } else {
      showAlert('Geolocation is not supported by this browser.', 'error');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRadians = (degrees) => degrees * (Math.PI / 180);
    const R = 6371;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const isWithinAucaCampus = (latitude, longitude) => {
    const distance = calculateDistance(latitude, longitude, AUCA_LATITUDE, AUCA_LONGITUDE);
    return distance <= AUCA_RADIUS;
  };

  const handleMarkAttendance = async () => {
    if (!geolocation.latitude || !geolocation.longitude) {
      showAlert('Location not available. Attendance cannot be recorded without location data.', 'error');
      return;
    }

    if (!isWithinAucaCampus(geolocation.latitude, geolocation.longitude)) {
      showAlert('You must be on the AUCA Gishushu campus to mark attendance.', 'warning');
      return;
    }

    try {
      // Ensure that the selectedClass matches one of the available class IDs
      const selectedClassDetails = classes.find((classItem) => classItem.id.toString() === selectedClass);
      
      if (!selectedClassDetails) {
        showAlert('Please select a valid class.', 'warning');
        return;
      }

      const currentTime = format(new Date(), 'HH:mm');
      const dayOfWeek = format(new Date(), 'EEEE');

      if (dayOfWeek !== selectedClassDetails.day_of_week || currentTime < selectedClassDetails.start_time || currentTime > selectedClassDetails.end_time) {
        showAlert(`You can only mark attendance during your class time: ${selectedClassDetails.start_time} - ${selectedClassDetails.end_time} on ${selectedClassDetails.day_of_week}`, 'warning');
        return;
      }

      const teacherId = localStorage.getItem('user_id');
      const today = new Date().toISOString().split('T')[0];

      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClass,
          teacher_id: teacherId,
          attendance_date: today,
          status: status,
          latitude: geolocation.latitude,
          longitude: geolocation.longitude,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showAlert('Attendance marked successfully! Awaiting supervisor approval.', 'success');
      } else {
        showAlert(data.error || 'Failed to mark attendance. Please try again later.', 'error');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      showAlert('Failed to mark attendance. Please try again later.', 'error');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'info' }), 6000);
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    marginBottom: '20px',
  };

  const buttonStyle = {
    backgroundColor: '#00447B',
    color: 'white',
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    width: '100%',
  };

  const selectStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const thStyle = {
    backgroundColor: '#00447B',
    color: 'white',
    padding: '10px',
    textAlign: 'left',
  };

  const tdStyle = {
    padding: '10px',
    borderBottom: '1px solid #ddd',
  };

  const alertStyle = (type) => ({
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px',
    backgroundColor: type === 'error' ? '#f8d7da' : type === 'warning' ? '#fff3cd' : '#d4edda',
    color: type === 'error' ? '#721c24' : type === 'warning' ? '#856404' : '#155724',
  });

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#00447B', fontSize: '32px', marginBottom: '20px' }}>My Class Schedule</h1>
      
      <div style={cardStyle}>
        <h2 style={{ color: '#00447B', fontSize: '24px', marginBottom: '15px' }}>Class Schedule</h2>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Course Code</th>
              <th style={thStyle}>Course Name</th>
              <th style={thStyle}>Day</th>
              <th style={thStyle}>Time</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classItem) => (
              <tr key={classItem.id}>
                <td style={tdStyle}>{classItem.course_code}</td>
                <td style={tdStyle}>{classItem.course_name}</td>
                <td style={tdStyle}>{classItem.day_of_week}</td>
                <td style={tdStyle}>{`${classItem.start_time} - ${classItem.end_time}`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={cardStyle}>
  <h2 style={{ color: '#00447B', fontSize: '24px', marginBottom: '15px' }}>Mark Attendance</h2>
  <select 
    style={selectStyle}
    value={selectedClass}
    onChange={(e) => setSelectedClass(e.target.value)}
  >
    <option value="">Select Class</option>
    {classes.map((classItem) => (
      <option key={classItem.id} value={classItem.id}>
        {classItem.course_name} ({classItem.course_code})
      </option>
    ))}
  </select>
  {/* Removed the "Absent" option */}
  <button style={buttonStyle} onClick={handleMarkAttendance}>
    Mark Attendance
  </button>
</div>

      {alert.show && (
        <div style={alertStyle(alert.type)}>
          {alert.message}
        </div>
      )}

      <div style={cardStyle}>
        <h2 style={{ color: '#00447B', fontSize: '24px', marginBottom: '15px' }}>Information</h2>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ marginBottom: '10px' }}>🌍 You must be on the AUCA Gishushu campus to mark attendance.</li>
          <li style={{ marginBottom: '10px' }}>📅 Attendance can only be marked on the scheduled day of your class.</li>
          <li style={{ marginBottom: '10px' }}>⏰ Attendance can only be marked during your scheduled class time.</li>
          <li style={{ marginBottom: '10px' }}>✅ Marked attendance is subject to supervisor approval.</li>
        </ul>
      </div>
    </div>
  );
};

export default TeacherSchedule;
