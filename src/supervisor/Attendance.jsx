import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import { 
  Table, TableHead, TableRow, TableCell, TableBody, Button, 
  Typography, Paper, Container, Box, IconButton, Tooltip, 
  Fade, Chip, LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle, Cancel, LibraryBooks, Person, Event, ThumbUp } from '@mui/icons-material';

const PageContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
  borderRadius: '15px',
  boxShadow: '0 8px 32px rgba(0, 68, 123, 0.1)',
}));

const HeaderBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledTable = styled(Table)(({ theme }) => ({
  '& .MuiTableCell-head': {
    backgroundColor: '#00447b',
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
  '& .MuiTableRow-root:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 68, 123, 0.05)',
  },
}));

const StatusChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  ...(status === 'Present' && {
    backgroundColor: '#e6f4ea',
    color: '#1e8e3e',
  }),
  ...(status === 'Absent' && {
    backgroundColor: '#fce8e6',
    color: '#d93025',
  }),
}));

const ApprovalChip = styled(Chip)(({ theme, approved }) => ({
  fontWeight: 'bold',
  ...(approved && {
    backgroundColor: '#e6f4ea',
    color: '#1e8e3e',
  }),
  ...(!approved && {
    backgroundColor: '#fff8e1',
    color: '#f9a825',
  }),
}));

const ApproveAttendance = () => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceRecords();
  }, []);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiService.getBaseURL()}/api/supervisor/attendance`);
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Error fetching attendance records:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/supervisor/attendance/approve/${id}`, {
        method: 'PUT',
      });
      fetchAttendanceRecords();
    } catch (error) {
      console.error('Error approving attendance:', error);
    }
  };

  return (
    <PageContainer maxWidth="lg">
      <StyledPaper elevation={3}>
        <HeaderBox>
          <Typography variant="h4" component="h1" color="#00447b">
            <ThumbUp sx={{ mr: 1, verticalAlign: 'middle' }} />
            Approve Attendance
          </Typography>
        </HeaderBox>

        {loading ? (
          <LinearProgress sx={{ my: 2 }} />
        ) : (
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Course</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Approval Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendanceRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <LibraryBooks sx={{ color: '#00447b', mr: 1 }} />
                      <Box>
                        <Typography variant="body1">{record.course_code}</Typography>
                        <Typography variant="body2" color="textSecondary">{record.course_name}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Person sx={{ color: '#00447b', mr: 1 }} />
                      {record.teacher_name}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Event sx={{ color: '#00447b', mr: 1 }} />
                      {new Date(record.attendance_date).toLocaleDateString()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <StatusChip
                      icon={record.status === 'Present' ? <CheckCircle /> : <Cancel />}
                      label={record.status}
                      status={record.status}
                    />
                  </TableCell>
                  <TableCell>
                    <ApprovalChip
                      icon={record.approved_by_supervisor ? <CheckCircle /> : <Cancel />}
                      label={record.approved_by_supervisor ? 'Approved' : 'Unapproved'}
                      approved={record.approved_by_supervisor}
                    />
                  </TableCell>
                  <TableCell align="center">
                    {!record.approved_by_supervisor && (
                      <Tooltip title="Approve" TransitionComponent={Fade} TransitionProps={{ timeout: 600 }}>
                        <IconButton onClick={() => handleApprove(record.id)} color="primary">
                          <ThumbUp />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </StyledTable>
        )}
      </StyledPaper>
    </PageContainer>
  );
};

export default ApproveAttendance;