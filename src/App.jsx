import React from 'react';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sidebar from './components/sidebar';
import Users from './components/Users';
import Classes from './components/classes';
import PrivateRoute from './route/ProtectedRoute'; // Import the PrivateRoute component
import TeacherSchedule from './components/teacherAttendance';
import SupervisorApproval from './components/SupervisorAttendance';
import AttendanceHistory from './components/Attendancehistory';
import ManageTeachers from './supervisor/teachers';
import ApproveAttendance from './supervisor/Attendance';
import Report from './components/reports';
import { CssBaseline } from '@mui/material';
import Navbar from './components/Navbar'; // Import the Navbar component
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

function Layout() {
  const role = localStorage.getItem('role') || 'teacher'; // Default to 'teacher' if role is not set
  const userName = localStorage.getItem('userName') || 'User'; // Assuming you have userName stored in localStorage

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <CssBaseline />
      <Navbar userName={userName} /> {/* Add the Navbar */}
      <div style={{ display: 'flex' }}>
        <Sidebar role={role} />
        <div style={{ flexGrow: 1, padding: '10px', marginLeft: '20px' }}>
          <Outlet /> {/* This will render the matched child route component */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Login />} />
          {/* Protected routes with the navbar and sidebar */}
          <Route
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Report />} />

            <Route path="/users" element={<Users />} />
            <Route path="/classes-schedule" element={<Classes />} />
            <Route path="/teachers-classes-schedule" element={<TeacherSchedule />} />
            <Route path="/supervisor-approval" element={<SupervisorApproval />} />
            <Route path="/attendance-history" element={<AttendanceHistory />} />
            <Route path="/manage-teachers" element={<ManageTeachers />} />
            <Route path="/approve-attendance" element={<ApproveAttendance />} />
            <Route path="/attendances" element={<div>Attendances</div>} /> {/* Placeholder */}
            <Route path="/all-teachers" element={<div>All Teachers</div>} /> {/* Placeholder */}
            <Route path="/reports" element={<div>Reports Page</div>} /> {/* Placeholder */}
          </Route>
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
