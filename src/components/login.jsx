// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../api';

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

        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        // Decode the token to get the user role
        const decodedToken = JSON.parse(atob(data.token.split('.')[1]));
        const userRole = decodedToken.role;

        // Store the role in localStorage
        localStorage.setItem('role', userRole);

        // Redirect based on user role
        if (userRole === 'admin' || userRole === 'supervisor') {
          navigate('/dashboard');
        } else if (userRole === 'teacher') {
          navigate('/teachers-classes-schedule');
        } else {
          console.error('Unknown role:', userRole);
        }
      } else {
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email or Username:</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
