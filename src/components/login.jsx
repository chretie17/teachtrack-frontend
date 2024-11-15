import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../Api';
import {
  TextField,
  Button,
  Typography,
  Container,
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import Auca from '../assets/auca.jpg';

const BackgroundContainer = styled('div')({
  backgroundImage: `url(${Auca})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 68, 123, 0.7)', // Overlay color
  },
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 68, 123, 0.3)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  position: 'relative',
  zIndex: 1,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#00447b',
  color: 'white',
  '&:hover': {
    backgroundColor: '#003366',
  },
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1.5, 0),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: '#00447b',
    },
    '&:hover fieldset': {
      borderColor: '#00447b',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#00447b',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#00447b',
  },
}));

const Login = () => {
  const [users, setUsers] = useState([]);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch users from the backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiService.getBaseURL()}/api/auth/users`);
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.id);

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={6}>
          <School style={{ fontSize: '4rem', color: '#00447b', marginBottom: '1rem' }} />
          <Typography component="h1" variant="h4" sx={{ color: '#00447b', fontWeight: 'bold', mb: 3 }}>
            Welcome Back
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="identifier-label">Username</InputLabel>
              <Select
                labelId="identifier-label"
                id="identifier"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              >
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.username}>
                    {user.username}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <StyledButton
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </StyledButton>
          </form>
        </StyledPaper>
      </Container>
    </BackgroundContainer>
  );
};

export default Login;
