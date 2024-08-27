// src/components/Sidebar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login page
  };

  const menuItems = {
    admin: [
      { text: 'Dashboard', path: '/dashboard' },
      { text: 'Users', path: '/users' },
      { text: 'Classes Schedule', path: '/classes-schedule' },
      { text: 'Attendances', path: '/attendances' },
      { text: 'All Teachers', path: '/all-teachers' },
      { text: 'Reports', path: '/reports' },
    ],
    supervisor: [
      { text: 'All Teachers', path: '/all-teachers' },
      { text: 'Attendances', path: '/attendances' },
      { text: 'Classes Schedule', path: '/classes-schedule' },
    ],
    teacher: [
      { text: 'Classes Schedule', path: '/teachers-classes-schedule' },
      { text: 'Attendance', path: '/attendance' },
    ],
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box', backgroundColor: '#00000', color: '#fff' },
      }}
    >
      <List>
        {menuItems[role].map((item) => (
          <ListItem button component={Link} to={item.path} key={item.text}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        <Divider /> {/* Adds a line above the Logout button for separation */}
        {/* Add Logout Button */}
        <ListItem button onClick={handleLogout}>
          <ListItemText primary="Logout" style={{ color: '#ff1744' }} /> {/* Red color for emphasis */}
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
