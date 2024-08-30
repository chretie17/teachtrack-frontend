import React, { useState, useEffect } from 'react';
import { FaChalkboardTeacher, FaUserCheck, FaClipboardList } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import styled from "styled-components";
import scrollreveal from "scrollreveal";

// Import necessary Material-UI components
import {
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import apiService from '../api'; // Import your configured axios instance

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalTeachers: 0,
    totalClasses: 0,
    totalAttendanceRecords: 0,
    approvedAttendance: 0,
    unapprovedAttendance: 0,
    attendanceTrends: [],
    latestAttendanceRecords: [],
    attendanceByClass: [],
  });

  useEffect(() => {
    const sr = scrollreveal({
      origin: "bottom",
      distance: "100px",
      duration: 2000,
      reset: false,
    });
    sr.reveal(`.nav, .rowOne, .rowTwo`, {
      opacity: 0,
      interval: 100,
    });

    // Fetch data from the backend
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/admin/dashboard`);
      const data = await response.json();
      console.log('Fetched Dashboard Data:', data); // Debugging: Log the fetched data
      setDashboardData({
        totalTeachers: data.total_teachers,
        totalClasses: data.total_classes,
        totalAttendanceRecords: data.total_attendance_records,
        approvedAttendance: data.approval_status_distribution.approved,
        unapprovedAttendance: data.approval_status_distribution.unapproved,
        attendanceTrends: data.attendance_over_time || [],
        latestAttendanceRecords: data.latest_attendance_records || [],
        attendanceByClass: data.attendance_by_class || [],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <Section className="nav">
      <TopRow>
        <Card>
          <CardHeader>
            <CardTitle>Total Teachers</CardTitle>
            <CardIcon>
              <FaChalkboardTeacher />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <CardValue>{dashboardData.totalTeachers}</CardValue>
            <CardDescription>Teachers Registered</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Classes</CardTitle>
            <CardIcon>
              <FaClipboardList />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <CardValue>{dashboardData.totalClasses}</CardValue>
            <CardDescription>Number of Classes</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Attendance Records</CardTitle>
            <CardIcon>
              <FaUserCheck />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <CardValue>{dashboardData.totalAttendanceRecords}</CardValue>
            <CardDescription>Attendance Records Logged</CardDescription>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Unapproved Attendance</CardTitle>
            <CardIcon>
              <MdPendingActions />
            </CardIcon>
          </CardHeader>
          <CardContent>
            <CardValue>{dashboardData.unapprovedAttendance}</CardValue>
            <CardDescription>Pending Approval</CardDescription>
          </CardContent>
        </Card>
      </TopRow>
      <Grid>
        <div className="rowOne">
          <AttendanceTrends data={dashboardData.attendanceTrends} />
          <AttendanceByClass data={dashboardData.attendanceByClass} />
        </div>
        <div className="rowThree">
          <LatestAttendanceRecords data={dashboardData.latestAttendanceRecords} />
        </div>
      </Grid>
    </Section>
  );
};

function AttendanceTrends({ data }) {
  return (
    <InventoryWrapper>
      <InventoryItem>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="approved" stroke="#00447b" />
                  <Line type="monotone" dataKey="unapproved" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </InventoryItem>
    </InventoryWrapper>
  );
}

function AttendanceByClass({ data }) {
  return (
    <InventoryWrapper>
      <InventoryItem>
        <Card>
          <CardHeader>
            <CardTitle>Attendance by Class</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer>
              <ResponsiveContainer width="95%" height={250}>
                <BarChart
                  data={data}
                  layout="horizontal"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="class_name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="attendance_count" fill="#00447b" barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </InventoryItem>
    </InventoryWrapper>
  );
}

function LatestAttendanceRecords({ data }) {
  return (
    <InventoryWrapper>
      <InventoryItem>
        <Card>
          <CardHeader>
            <CardTitle>Latest Attendance Records</CardTitle>
          </CardHeader>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Teacher Name</TableCell>
                    <TableCell>Class</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Approval Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data && data.length > 0 ? (
                    data.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.teacher_name}</TableCell>
                        <TableCell>{record.course_name}</TableCell>
                        <TableCell>{record.attendance_date}</TableCell>
                        <TableCell>{record.status}</TableCell>
                        <TableCell>{record.approved_by_supervisor ? 'Approved' : 'Unapproved'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No records available
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </InventoryItem>
    </InventoryWrapper>
  );
}

// Styled Components
const Section = styled.section`
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 2rem;
  margin-top: 2rem;

  .rowOne {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  .rowTwo, .rowThree {
    display: flex;
    justify-content: center;
  }

  .rowTwo {
    gap: 2rem;
    margin-bottom: 0;
  }

  .rowThree {
    margin-top: 0;
  }
`;

const TopRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  width: 100%;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h4`
  color: #00447b; /* Updated color */
  font-weight: bold;
`;

const CardIcon = styled.div`
  color: #00447b; /* Updated color */
  font-size: 2rem;
`;

const CardContent = styled.div`
  margin-top: 1rem;
`;

const CardValue = styled.h2`
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
`;

const CardDescription = styled.p`
  color: #8c8c8c;
  font-size: 0.875rem;
`;

const InventoryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InventoryItem = styled.div`
  background-color: #ffffff;
  padding: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #00447b; /* Updated hover color */
    color: #fff;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 300px;
`;

export default AdminDashboard;
