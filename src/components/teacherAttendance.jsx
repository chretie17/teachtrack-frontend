import React, { useState, useEffect } from 'react';
import apiService from '../api';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel, Snackbar } from '@mui/material';
import { format } from 'date-fns';

const AUCA_LATITUDE = 1.9706; 
const AUCA_LONGITUDE = 30.1044; 
const AUCA_RADIUS = 0.15; 

const TeacherSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [status, setStatus] = useState('Present');
  const [geolocation, setGeolocation] = useState({ latitude: null, longitude: null });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchClasses();
    getGeolocation(); // Capture geolocation on component mount
  }, []);

  const fetchClasses = async () => {
    try {
      const teacherId = localStorage.getItem('user_id');
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/teacher/${teacherId}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
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
          setSnackbarMessage('You need to allow location access to mark attendance.');
          setSnackbarOpen(true);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setSnackbarMessage('Geolocation is not supported by this browser.');
      setSnackbarOpen(true);
    }
  };

  const isWithinAucaCampus = (latitude, longitude) => {
    const distance = Math.sqrt(
      Math.pow(latitude - AUCA_LATITUDE, 2) + Math.pow(longitude - AUCA_LONGITUDE, 2)
    );
    return distance <= AUCA_RADIUS;
  };

  const handleMarkAttendance = async () => {
    // Check if geolocation is available and within AUCA campus
    if (!geolocation.latitude || !geolocation.longitude) {
      setSnackbarMessage('Location not available. Attendance cannot be recorded without location data.');
      setSnackbarOpen(true);
      return;
    }

    if (!isWithinAucaCampus(geolocation.latitude, geolocation.longitude)) {
      setSnackbarMessage('You must be on the AUCA Gishushu campus to mark attendance.');
      setSnackbarOpen(true);
      return;
    }

    try {
      const selectedClassDetails = classes.find((classItem) => classItem.id === selectedClass);
      
      if (!selectedClassDetails) {
        setSnackbarMessage('Please select a valid class.');
        setSnackbarOpen(true);
        return;
      }

      const currentTime = format(new Date(), 'HH:mm'); // Get current time in HH:mm format
      const dayOfWeek = format(new Date(), 'EEEE'); // Get the current day of the week

      if (dayOfWeek !== selectedClassDetails.day_of_week || currentTime < selectedClassDetails.start_time || currentTime > selectedClassDetails.end_time) {
        setSnackbarMessage(`You can only mark attendance during your class time: ${selectedClassDetails.start_time} - ${selectedClassDetails.end_time} on ${selectedClassDetails.day_of_week}`);
        setSnackbarOpen(true);
        return;
      }

      const teacherId = localStorage.getItem('user_id');
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

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
        setSnackbarMessage('Attendance marked successfully! Awaiting supervisor approval.');
      } else {
        setSnackbarMessage(data.error || 'Failed to mark attendance. Please try again later.');
      }
      
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error marking attendance:', error);
      setSnackbarMessage('Failed to mark attendance. Please try again later.');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <h1>My Class Schedule</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Time</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {classes.map((classItem) => (
            <TableRow key={classItem.id}>
              <TableCell>{classItem.course_code}</TableCell>
              <TableCell>{classItem.course_name}</TableCell>
              <TableCell>{classItem.day_of_week}</TableCell>
              <TableCell>{`${classItem.start_time} - ${classItem.end_time}`}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2>Mark Attendance</h2>
      <FormControl fullWidth margin="normal">
        <InputLabel>Class</InputLabel>
        <Select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          label="Class"
        >
          {classes.map((classItem) => (
            <MenuItem key={classItem.id} value={classItem.id}>
              {classItem.course_name} ({classItem.course_code})
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl fullWidth margin="normal">
        <InputLabel>Status</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          label="Status"
        >
          <MenuItem value="Present">Present</MenuItem>
          <MenuItem value="Absent">Absent</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleMarkAttendance}>
        Mark Attendance
      </Button>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />
    </div>
  );
};

export default TeacherSchedule;
