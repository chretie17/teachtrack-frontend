import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, Badge, styled, Button } from '@mui/material';
import { Notifications, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../Api'; // Import the ApiService

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(145deg, #00447B 0%, #003366 100%)',
  color: '#fff',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
});

const Navbar = ({ userName, userAvatar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  const [unapprovedCount, setUnapprovedCount] = useState(0);

  // Get user role from localStorage
  const userRole = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login page
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Show notification popup
  const showNotification = (count) => {
    if (count > 0) {
      toast.info(`You have ${count} attendance records waiting for approval.`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // Fetch unapproved attendance count for supervisors
  const fetchUnapprovedCount = async () => {
    try {
      const response = await axios.get(`${apiService.getBaseURL()}/api/attendance/unapproved-attendance-count`);
      const count = response.data.unapprovedCount || 0; // Default to 0 if no count is found
      setUnapprovedCount(count);
      showNotification(count); // Show notification when count is updated
    } catch (error) {
      console.error('Error fetching unapproved attendance count:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    // Only fetch count and show notification if the user is a supervisor
    if (userRole === 'supervisor') {
      fetchUnapprovedCount(); // Initial fetch

      // Set up an interval to fetch count and show notification every 5 seconds
      const notificationIntervalId = setInterval(() => {
        fetchUnapprovedCount();
      }, 5000);

      return () => {
        clearInterval(notificationIntervalId); // Clear notification interval on component unmount
        clearInterval(intervalId); // Clear time interval on component unmount
      };
    }

    return () => clearInterval(intervalId); // Clear time interval on component unmount
  }, [userRole]);

  return (
    <>
      <StyledAppBar position="static">
        <Toolbar>
          <IconButton color="inherit" onClick={handleMenu}>
            <Avatar alt={userName} src={userAvatar} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
          </Menu>

          <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}>
              {currentTime}
            </Typography>
          </Box>

          {/* Display notification badge only if the user role is supervisor */}
          {userRole === 'supervisor' && (
            <IconButton color="inherit">
              <Badge badgeContent={unapprovedCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>
          )}

          <Button
            color="inherit"
            startIcon={<ExitToApp />}
            onClick={handleLogout}
            sx={{
              marginLeft: 2,
              color: '#fff',
              backgroundColor: 'rgba(255,23,68,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,23,68,0.3)',
              },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </StyledAppBar>
      <ToastContainer />
    </>
  );
};

export default Navbar;
