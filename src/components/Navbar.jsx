import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Menu, MenuItem, Avatar, Badge, styled, Button } from '@mui/material';
import { Search, Notifications, Brightness4, Brightness7, ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
  background: 'linear-gradient(145deg, #00447B 0%, #003366 100%)',
  color: '#fff',
  boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
});

const Navbar = ({ userName, userAvatar }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // For dark mode toggle
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString()); // Live clock state

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

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // Implement your dark mode logic here
  };

  // Update clock every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <StyledAppBar position="static">
      <Toolbar>
        {/* User Avatar */}
        <IconButton color="inherit" onClick={handleMenu}>
          <Avatar alt={userName} src={userAvatar} />
        </IconButton>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>Settings</MenuItem>
        </Menu>

        {/* Live Clock in the Center */}
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', letterSpacing: 1.5 }}>
            {currentTime}
          </Typography>
        </Box>

        {/* Placeholder for Notifications */}
        <IconButton color="inherit">
          <Badge badgeContent={0} color="error"> {/* Set to 0 initially, update as needed */}
            <Notifications />
          </Badge>
        </IconButton>

        {/* Logout Button */}
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
  );
};

export default Navbar;
