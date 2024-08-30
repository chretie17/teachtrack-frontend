import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import { Button, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

const SupervisorApproval = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchUnapprovedAttendance();
  }, []);

  const fetchUnapprovedAttendance = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/unapproved`);
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error fetching unapproved attendance:', error);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/attendance/approve/${id}`, {
        method: 'PUT',
      });
      fetchUnapprovedAttendance(); // Refresh the list after approving
    } catch (error) {
      console.error('Error approving attendance:', error);
    }
  };

  return (
    <div>
      <h1>Unapproved Attendance Records</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell>Teacher</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.course_name}</TableCell>
              <TableCell>{record.teacher_name}</TableCell>
              <TableCell>{record.attendance_date}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>
                <Button variant="contained" color="primary" onClick={() => handleApprove(record.id)}>
                  Approve
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupervisorApproval;
