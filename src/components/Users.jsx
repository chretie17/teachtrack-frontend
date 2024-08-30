import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import { 
  Button, Table, TableBody, TableCell, TableHead, TableRow, TextField, 
  Dialog, DialogActions, DialogContent, DialogTitle, Select, MenuItem, 
  InputLabel, FormControl, Typography, Paper, Container, Box, IconButton, 
  Tooltip, Fade, Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Add, Edit, Delete, Person, PersonAdd, SupervisorAccount, AdminPanelSettings } from '@mui/icons-material';

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

const RoleChip = styled(Chip)(({ theme, role }) => ({
  fontWeight: 'bold',
  ...(role === 'teacher' && {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  }),
  ...(role === 'supervisor' && {
    backgroundColor: '#fff8e1',
    color: '#f57f17',
  }),
  ...(role === 'admin' && {
    backgroundColor: '#e3f2fd',
    color: '#1565c0',
  }),
}));

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, username: '', email: '', role: '', password: '' });
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/users`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (form.id) {
        const updatedForm = { ...form };
        if (!updatedForm.password) {
          delete updatedForm.password;
        }
        await fetch(`${apiService.getBaseURL()}/api/users/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedForm),
        });
      } else {
        await fetch(`${apiService.getBaseURL()}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      }
      setOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user) => {
    setForm({ ...user, password: '' });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`${apiService.getBaseURL()}/api/users/${id}`, {
          method: 'DELETE',
        });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleClose = () => {
    setForm({ id: null, username: '', email: '', role: '', password: '' });
    setOpen(false);
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher': return <Person />;
      case 'supervisor': return <SupervisorAccount />;
      case 'admin': return <AdminPanelSettings />;
      default: return <Person />;
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <HeaderBox>
          <Typography variant="h4" component="h1" color="#00447b">
            <PersonAdd sx={{ mr: 1, verticalAlign: 'middle' }} />
            Users Management
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            sx={{ backgroundColor: '#00447b' }}
          >
            Add User
          </Button>
        </HeaderBox>

        <StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <RoleChip
                    icon={getRoleIcon(user.role)}
                    label={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    role={user.role}
                  />
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Edit" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                    <IconButton onClick={() => handleEdit(user)} color="primary">
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                    <IconButton onClick={() => handleDelete(user.id)} color="error">
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </StyledTable>

        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <DialogTitle>{form.id ? 'Edit User' : 'Add User'}</DialogTitle>
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="teacher">Teacher</MenuItem>
                <MenuItem value="supervisor">Supervisor</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            </FormControl>
            {!form.id && (
              <TextField
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                fullWidth
                margin="normal"
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">Cancel</Button>
            <Button onClick={handleSubmit} color="primary" variant="contained" sx={{ backgroundColor: '#00447b' }}>Save</Button>
          </DialogActions>
        </Dialog>
      </StyledPaper>
    </PageContainer>
  );
};

export default Users;