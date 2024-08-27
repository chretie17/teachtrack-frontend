import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api';
import { TextField, Button, Typography, Container, Box, Paper } from '@mui/material';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleLogin = async (e) => {
    e.preventDefault();

    const credentials = {
      identifier,
      password,
    };

    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);

        // Store the token, user ID, and role in localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.id);

        // Redirect based on user role
        if (data.role === 'admin' || data.role === 'supervisor') {
          navigate('/dashboard');
        } else if (data.role === 'teacher') {
          navigate('/teachers-classes-schedule');
        } else {
          console.error('Unknown role:', data.role);
        }
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ padding: '20px', marginTop: '50px' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%', marginTop: '20px' }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="identifier"
              label="Email or Username"
              name="identifier"
              autoComplete="identifier"
              autoFocus
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ marginTop: '20px', marginBottom: '20px' }}
            >
              Login
            </Button>
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
