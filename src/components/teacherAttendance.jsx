import React, { useState, useEffect } from 'react';
import apiService from '../api';
import { Button, Table, TableHead, TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const TeacherSchedule = () => {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [status, setStatus] = useState('Present');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const teacherId = localStorage.getItem('user_id'); // Assuming teacher's ID is stored in localStorage
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/teacher/${teacherId}`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleMarkAttendance = async () => {
    try {
      const teacherId = localStorage.getItem('user_id'); // Assuming teacher's ID is stored in localStorage
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      await fetch(`${apiService.getBaseURL()}/api/attendance/mark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          class_id: selectedClass,
          teacher_id: teacherId,
          attendance_date: today,
          status: status,
        }),
      });
      alert('Attendance marked successfully! Awaiting supervisor approval.');
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
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
    </div>
  );
};

export default TeacherSchedule;
