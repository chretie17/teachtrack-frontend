import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../Api';
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Paper,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Visibility, VisibilityOff, School } from '@mui/icons-material';
import Auca from '../assets/auca.jpg';


const BackgroundContainer = styled('div')({
  backgroundImage: `url(${Auca})`, // Use backticks and interpolate the variable
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
    backgroundColor: 'rgba(0, 68, 123, 0.7)', // Overlay with our theme color
  }
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

const Logo = styled(School)(({ theme }) => ({
  fontSize: '4rem',
  color: '#00447b',
  marginBottom: theme.spacing(2),
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

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        console.log('Login successful:', data);
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
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error logging in:', error);
      // You might want to show an error message to the user here
    } finally {
      setLoading(false);
    }
  };

  return (
    <BackgroundContainer>
      <Container component="main" maxWidth="xs">
        <StyledPaper elevation={6}>
          <Logo />
          <Typography component="h1" variant="h4" sx={{ color: '#00447b', fontWeight: 'bold', mb: 3 }}>
            Welcome Back
          </Typography>
          <form onSubmit={handleLogin} style={{ width: '100%' }}>
            <StyledTextField
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
            <StyledTextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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