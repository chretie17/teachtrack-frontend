import React, { useState, useEffect } from 'react';
import axios from 'axios';
import apiService from '../api';
import { Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const ApproveAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/supervisor/attendance`);
      const data = await response.json();

      const recordsWithAddresses = await Promise.all(
        data.map(async (record) => {
          if (record.latitude && record.longitude) {
            const address = await fetchAddress(record.latitude, record.longitude);
            return { ...record, address };
          }
          return record;
        })
      );

      setAttendanceRecords(recordsWithAddresses);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    }
  };

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          latlng: `${latitude},${longitude}`,
          key: GOOGLE_API_KEY,
        },
      });
      const results = response.data.results;
      return results.length ? results[0].formatted_address : 'Unknown location';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Error fetching location';
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/supervisor/attendance/approve/${id}`, {
        method: 'PUT',
      });
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error approving attendance:', error);
    }
  };

  return (
    <div>
      <h1>Approve Attendance</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Teacher Name</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Approval Status</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {attendanceRecords.map((record) => (
            <TableRow key={record.id}>
              <TableCell>{record.course_code}</TableCell>
              <TableCell>{record.course_name}</TableCell>
              <TableCell>{record.teacher_name}</TableCell>
              <TableCell>{record.attendance_date}</TableCell>
              <TableCell>{record.status}</TableCell>
              <TableCell>{record.approved_by_supervisor ? 'Approved' : 'Unapproved'}</TableCell>
              <TableCell>{record.address || 'N/A'}</TableCell>
              <TableCell>
                {!record.approved_by_supervisor && (
                  <Button onClick={() => handleApprove(record.id)}>Approve</Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ApproveAttendance;
