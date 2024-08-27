// src/components/ManageTeachers.jsx
import React, { useState, useEffect } from 'react';
import apiService from '../api';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, username: '', email: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        // Update teacher
        await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Create teacher (add more logic if you need to allow adding new teachers)
      }
      setOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleEdit = (teacher) => {
    setForm(teacher);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${id}`, {
        method: 'DELETE',
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleClose = () => {
    setForm({ id: null, username: '', email: '' });
    setOpen(false);
  };

  return (
    <div>
      <h1>Manage Teachers</h1>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Username</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teachers.map((teacher) => (
            <TableRow key={teacher.id}>
              <TableCell>{teacher.username}</TableCell>
              <TableCell>{teacher.email}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(teacher)}>Edit</Button>
                <Button onClick={() => handleDelete(teacher.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{form.id ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Cancel</Button>
          <Button onClick={handleSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageTeachers;
