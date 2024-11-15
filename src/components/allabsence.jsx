import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Typography, Container } from '@mui/material';
import apiService from '../Api';

const SupervisorDashboard = () => {
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch pending absence requests
  useEffect(() => {
    const fetchAbsences = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiService.getBaseURL()}/api/absences/pending`);
        const data = await response.json();
        setAbsences(data);
      } catch (error) {
        console.error('Error fetching absence requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsences();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/absences/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update absence status');
      }

      // Update UI
      setAbsences((prev) => prev.filter((absence) => absence.id !== id));
      alert(`Absence request ${status.toLowerCase()} successfully`);
    } catch (error) {
      console.error('Error updating absence status:', error);
      alert('Error updating absence status');
    }
  };

  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Pending Absence Requests
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : absences.length === 0 ? (
        <Typography>No pending absence requests</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Absence Date</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {absences.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.teacher_name}</TableCell>
                  <TableCell>{absence.course_name}</TableCell>
                  <TableCell>{absence.absence_date}</TableCell>
                  <TableCell>{absence.reason}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleUpdateStatus(absence.id, 'Approved')}
                      style={{ marginRight: '10px' }}
                    >
                      Approve
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleUpdateStatus(absence.id, 'Rejected')}
                    >
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default SupervisorDashboard;
