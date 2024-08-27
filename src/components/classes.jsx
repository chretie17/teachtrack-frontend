import React, { useState, useEffect } from 'react';
import apiService from '../api';
import { Button, TextField, Select, MenuItem, InputLabel, FormControl, Dialog, DialogActions, DialogContent, DialogTitle, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

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
      console.log('Submitting form data:', form);
      const method = form.id ? 'PUT' : 'POST';
      const endpoint = form.id ? `${apiService.getBaseURL()}/api/classes/${form.id}` : `${apiService.getBaseURL()}/api/classes`;

      await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setOpen(false);
      fetchClasses(); // Refresh the classes list after adding/updating a class
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const handleEdit = (classItem) => {
    setForm(classItem);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/classes/${id}`, {
        method: 'DELETE',
      });
      fetchClasses(); // Refresh the classes list after deleting a class
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  const handleClose = () => {
    setForm({ id: null, course_code: '', course_name: '', course_credit: '', semester: '', day_of_week: '', start_time: '', end_time: '', teacher_id: '' });
    setOpen(false);
  };

  return (
    <div>
      <h1>Classes Management</h1>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>Add Class</Button>

      <Dialog open={open} onClose={handleClose}>
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
              <MenuItem value="Monday">Monday</MenuItem>
              <MenuItem value="Tuesday">Tuesday</MenuItem>
              <MenuItem value="Wednesday">Wednesday</MenuItem>
              <MenuItem value="Thursday">Thursday</MenuItem>
              <MenuItem value="Friday">Friday</MenuItem>
              <MenuItem value="Saturday">Saturday</MenuItem>
              <MenuItem value="Sunday">Sunday</MenuItem>
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
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Display the list of classes */}
      <h2>All Classes</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Course Code</TableCell>
            <TableCell>Course Name</TableCell>
            <TableCell>Course Credit</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Teacher</TableCell>
            <TableCell>Actions</TableCell>
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
              <TableCell>
                <Button onClick={() => handleEdit(classItem)}>Edit</Button>
                <Button onClick={() => handleDelete(classItem.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Classes;
