import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import Users from './components/Users';
import Classes from './components/classes';
import PrivateRoute from './route/ProtectedRoute'; // Import the PrivateRoute component
import TeacherSchedule from './components/teacherAttendance';
import SupervisorApproval from './components/SupervisorAttendance';
import { CssBaseline } from '@mui/material';

function Layout() {
  const role = localStorage.getItem('role') || 'teacher'; // Default to 'teacher' if role is not set

  return (
    <div style={{ display: 'flex' }}>
      <CssBaseline />
      <Sidebar role={role} />
      <div style={{ flexGrow: 1, padding: '10px', marginLeft: '20px' }}>
        <Outlet /> {/* This will render the matched child route component */}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        {/* Protected routes with the sidebar */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/classes-schedule" element={<Classes />} />
          <Route path="/teachers-classes-schedule" element={<TeacherSchedule />} />
          <Route path="/supervisor-approval" element={<SupervisorApproval />} />
          <Route path="/attendances" element={<div>Attendances</div>} /> {/* Placeholder */}
          <Route path="/all-teachers" element={<div>All Teachers</div>} /> {/* Placeholder */}
          <Route path="/reports" element={<div>Reports Page</div>} /> {/* Placeholder */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
