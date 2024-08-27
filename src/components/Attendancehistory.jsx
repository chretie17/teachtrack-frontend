// src/components/AttendanceHistory.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../api';
import { Table, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material';

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      const teacherId = localStorage.getItem('user_id'); // Assuming teacher's ID is stored in localStorage
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/history/teacher/${teacherId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Attendance History</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Approval Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {history.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.course_code}</TableCell>
              <TableCell>{record.course_name}</TableCell>
              <TableCell>{record.attendance_date}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.approval_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AttendanceHistory;
