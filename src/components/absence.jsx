import React, { useState, useEffect } from 'react';
import { TextField, Button, MenuItem, Select, FormControl, InputLabel, Typography, Container, Paper, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiService from '../Api';

const SubmitAbsence = () => {
  const [classes, setClasses] = useState([]);
  const [classId, setClassId] = useState('');
  const [absenceDate, setAbsenceDate] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch the teacher ID from localStorage
  const teacherId = localStorage.getItem('user_id');

  useEffect(() => {
    // Redirect to login if no teacher ID is found
    if (!teacherId) {
      navigate('/login');
    }

    // Fetch available classes for the teacher
    const fetchClasses = async () => {
      try {
        const response = await fetch(`${apiService.getBaseURL()}/api/attendance/teacher/${teacherId}`);
        const data = await response.json();
        setClasses(data);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, [teacherId, navigate]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/absences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          class_id: classId,
          absence_date: absenceDate,
          reason,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit absence request');
      }

      alert('Absence request submitted successfully');
      setClassId('');
      setAbsenceDate('');
      setReason('');
    } catch (error) {
      console.error('Error submitting absence request:', error);
      alert('Error submitting absence request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Submit Absence
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>Class</InputLabel>
          <Select
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>
                {cls.course_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          margin="normal"
          type="date"
          label="Absence Date"
          value={absenceDate}
          onChange={(e) => setAbsenceDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
        </Button>
      </Paper>
    </Container>
  );
};

export default SubmitAbsence;
