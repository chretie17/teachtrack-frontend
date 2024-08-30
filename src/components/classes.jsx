import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import { 
  Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, 
  DialogActions, DialogContent, DialogTitle, Table, TableHead, TableRow, 
  TableCell, TableBody, Typography, Paper, Container, Box, IconButton, 
  Tooltip, Fade
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete, School } from '@mui/icons-material';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 68, 123, 0.1)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#00447b',
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 68, 123, 0.05)',
  },
}));

const ActionButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(0, 0.5),
}));

const Classes = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, course_code: '', course_name: '', course_credit: '', semester: '', day_of_week: '', start_time: '', end_time: '', teacher_id: '' });
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/classes/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/classes`);
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const method = form.id ? 'PUT' : 'POST';
      const endpoint = form.id ? `${apiService.getBaseURL()}/api/classes/${form.id}` : `${apiService.getBaseURL()}/api/classes`;

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setOpen(false);
      fetchClasses();
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (classItem) => {
    setForm(classItem);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this class?')) {
      try {
        await fetch(`${apiService.getBaseURL()}/api/classes/${id}`, {
          method: 'DELETE',
        });
        fetchClasses();
      } catch (error) {
        console.error('Error deleting class:', error);
      }
    }
  };

  const handleClose = () => {
    setForm({ id: null, course_code: '', course_name: '', course_credit: '', semester: '', day_of_week: '', start_time: '', end_time: '', teacher_id: '' });
    setOpen(false);
  };

  return (
    <PageContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <HeaderBox>
          <Typography variant="h4" component="h1" color="#00447b">
            <School sx={{ mr: 1, verticalAlign: 'middle' }} />
            Classes Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{ backgroundColor: '#00447b' }}
          >
            Add Class
          </Button>
        </HeaderBox>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{form.id ? 'Edit Class' : 'Add Class'}</DialogTitle>
          <DialogContent>
            <TextField
              label="Course Code"
              value={form.course_code}
              onChange={(e) => setForm({ ...form, course_code: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Course Name"
              value={form.course_name}
              onChange={(e) => setForm({ ...form, course_name: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Course Credit"
              type="number"
              value={form.course_credit}
              onChange={(e) => setForm({ ...form, course_credit: e.target.value })}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Semester"
              value={form.semester}
              onChange={(e) => setForm({ ...form, semester: e.target.value })}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Day of the Week</InputLabel>
              <Select
                value={form.day_of_week}
                onChange={(e) => setForm({ ...form, day_of_week: e.target.value })}
                label="Day of the Week"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                  <MenuItem key={day} value={day}>{day}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Start Time"
              type="time"
              value={form.start_time}
              onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Time"
              type="time"
              value={form.end_time}
              onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Teacher</InputLabel>
              <Select
                value={form.teacher_id}
                onChange={(e) => setForm({ ...form, teacher_id: e.target.value })}
                label="Teacher"
              >
                {teachers.map(teacher => (
                  <MenuItem key={teacher.id} value={teacher.id}>
                    {teacher.username} ({teacher.email})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ backgroundColor: '#00447b' }}>Save</Button>
          </DialogActions>
        </Dialog>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Credit</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Day</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Teacher</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((classItem) => (
              <TableRow key={classItem.id}>
                <TableCell>{classItem.course_code}</TableCell>
                <TableCell>{classItem.course_name}</TableCell>
                <TableCell>{classItem.course_credit}</TableCell>
                <TableCell>{classItem.semester}</TableCell>
                <TableCell>{classItem.day_of_week}</TableCell>
                <TableCell>{`${classItem.start_time} - ${classItem.end_time}`}</TableCell>
                <TableCell>{classItem.teacher_name}</TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                    <IconButton onClick={() => handleEdit(classItem)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                    <IconButton onClick={() => handleDelete(classItem.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>
      </StyledPaper>
    </PageContainer>
  );
};

export default Classes;