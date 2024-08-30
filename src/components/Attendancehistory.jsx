import React, { useState, useEffect } from 'react';
import apiService from '../Api';
import { 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody, 
  Typography, 
  Paper, 
  Container,
  Box,
  Chip,
  LinearProgress
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CalendarMonth, School, CheckCircle, Cancel } from '@mui/icons-material';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0, 68, 123, 0.1)',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: '#00447b',
  '& .MuiTableCell-head': {
    color: theme.palette.common.white,
    fontWeight: 'bold',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:hover': {
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

const ApprovalChip = styled(Chip)(({ theme, status }) => ({
  fontWeight: 'bold',
  ...(status === 'Approved' && {
    backgroundColor: '#e6f4ea',
    color: '#1e8e3e',
  }),
  ...(status === 'Pending' && {
    backgroundColor: '#fff8e1',
    color: '#f9a825',
  }),
  ...(status === 'Rejected' && {
    backgroundColor: '#fce8e6',
    color: '#d93025',
  }),
}));

const AttendanceHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const teacherId = localStorage.getItem('user_id');
      const response = await fetch(`${apiService.getBaseURL()}/api/attendance/history/teacher/${teacherId}`);
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching attendance history:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box my={4}>
        <Typography variant="h3" gutterBottom color="#00447b" fontWeight="bold">
          Attendance History
        </Typography>
        <StyledPaper elevation={3}>
          {loading ? (
            <LinearProgress />
          ) : (
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>Course Code</TableCell>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Approval Status</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {history.map((record) => (
                  <StyledTableRow key={record.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <School sx={{ color: '#00447b', mr: 1 }} />
                        {record.course_code}
                      </Box>
                    </TableCell>
                    <TableCell>{record.course_name}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <CalendarMonth sx={{ color: '#00447b', mr: 1 }} />
                        {new Date(record.attendance_date).toLocaleDateString()}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <StatusChip
                        label={record.status}
                        status={record.status}
                        icon={record.status === 'Present' ? <CheckCircle /> : <Cancel />}
                      />
                    </TableCell>
                    <TableCell>
                      <ApprovalChip
                        label={record.approval_status}
                        status={record.approval_status}
                      />
                    </TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </StyledPaper>
      </Box>
    </Container>
  );
};

export default AttendanceHistory;