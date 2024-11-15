import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  styled
} from '@mui/material';
import {
  Dashboard,
  People,
  Schedule,
  School,
  Assessment,
  ExitToApp
} from '@mui/icons-material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import logo from '../assets/logo.png';
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    background: 'linear-gradient(145deg, #00447B 0%, #003366 100%)',
    color: '#fff',
    borderRight: 'none',
    boxShadow: '0 4px 20px 0 rgba(0,0,0,0.12)',
  },
}));

const Logo = styled(Box)({
  height: 100,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& img': {
    height: 70,
    transition: 'transform 0.3s ease-in-out, filter 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.1)',
      filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
    },
  },
});

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: '8px 16px',
  borderRadius: '12px',
  transition: 'all 0.3s',
  '&:hover': {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: 'translateX(5px)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  ...(active && {
    backgroundColor: 'rgba(255,255,255,0.25)',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-16px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '70%',
      width: '4px',
      backgroundColor: '#fff',
      borderRadius: '0 4px 4px 0',
    },
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)({
  color: '#fff',
  minWidth: '42px',
});

const StyledListItemText = styled(ListItemText)({
  '& .MuiListItemText-primary': {
    fontSize: '0.95rem',
    fontWeight: 500,
    letterSpacing: '0.5px',
    color: '#fff', // Set text color to white
  },
});

const Sidebar = ({ role, userName }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/'); // Redirect to login page
  };

  const menuItems = {
    admin: [
      { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
      { text: 'Users', path: '/users', icon: <People /> },
      { text: 'Classes Schedule', path: '/classes-schedule', icon: <Schedule /> },
      { text: 'Attendances', path: '/approve-attendance', icon: <AssignmentIcon /> },
      { text: 'All Teachers', path: '/manage-teachers', icon: <School /> },
      { text: 'Reports', path: '/reports', icon: <Assessment /> },
      { text: 'All Absence', path: '/allabsence', icon: <Schedule /> },

    ],
    supervisor: [
      { text: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
      { text: 'All Lectures', path: '/manage-teachers', icon: <School /> },
      { text: 'Attendances', path: '/approve-attendance', icon: <AssignmentIcon /> },
      { text: 'Classes Schedule', path: '/classes-schedule', icon: <Schedule /> },
      { text: 'All Absence', path: '/allabsence', icon: <Schedule /> },

    ],
    teacher: [
      { text: 'Classes Schedule', path: '/teachers-classes-schedule', icon: <Schedule /> },
      { text: 'Attendance History', path: '/attendance-history', icon: <AssignmentIcon /> },
      { text: 'Absent??', path: '/absence', icon: <AssignmentIcon /> },

    ],
  };

  return (
    <StyledDrawer variant="permanent">
      <Logo>
        <img src={logo} alt="Logo" />
      </Logo>
      <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, letterSpacing: 1.5, textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
  {role === 'admin' ? 'HOD' : role.toUpperCase()}
</Typography>

        <Typography variant="body2" sx={{ mb: 2, opacity: 0.9, fontWeight: 300, letterSpacing: 0.5 }}>
          Welcome, {userName}
        </Typography>
      </Box>
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 2, boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
      <List sx={{ pt: 2 }}>
        {menuItems[role].map((item) => (
          <StyledListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            active={location.pathname === item.path ? 1 : 0}
          >
            <StyledListItemIcon>{item.icon}</StyledListItemIcon>
            <StyledListItemText primary={item.text} />
          </StyledListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mx: 2, boxShadow: '0 -1px 2px rgba(0,0,0,0.1)' }} />
      
    </StyledDrawer>
  );
};

export default Sidebar;
