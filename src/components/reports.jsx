import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, TextField, Paper, Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import apiService from '../Api';
import logo from '../assets/logo.png';

// Define theme colors
const themeColors = {
  primary: '#00447b',
  secondary: '#f5f5f5',
  accent: '#ffd700',
};

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: '0 8px 32px rgba(0, 68, 123, 0.1)',
  backgroundColor: '#ffffff',
  marginBottom: theme.spacing(4),
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 12px 48px rgba(0, 68, 123, 0.2)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1.5, 4),
  borderRadius: theme.spacing(5),
  fontWeight: 'bold',
  textTransform: 'none',
  transition: 'all 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px rgba(0, 68, 123, 0.2)',
  },
}));

const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  '& th, & td': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
    textAlign: 'left',
  },
  '& th': {
    backgroundColor: themeColors.primary,
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  '& tr:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 68, 123, 0.05)',
  },
  '& tr:hover': {
    backgroundColor: 'rgba(0, 68, 123, 0.1)',
    transition: 'background-color 0.3s ease-in-out',
  },
}));

const ReportPage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportData, setReportData] = useState([]);
  const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
  const [customReportData, setCustomReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOverallReportData();
    fetchTeacherPerformanceData();
  }, []);

  const fetchOverallReportData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/attendance-summary`);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching overall report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherPerformanceData = async () => {
    try {
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/teacher-performance`);
      setTeacherPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching teacher performance data:', error);
    }
  };

  const fetchCustomReportData = async () => {
    if (!dateRange[0] || !dateRange[1]) return;

    try {
      setLoading(true);
      const response = await axios.post(`${apiService.getBaseURL()}/api/reports/custom`, {
        reportType: 'teacherPerformance',
        startDate: dateRange[0]?.format('YYYY-MM-DD'),
        endDate: dateRange[1]?.format('YYYY-MM-DD'),
      });
      setCustomReportData(response.data);
    } catch (error) {
      console.error('Error fetching custom report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = (title, data, columns) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 40);

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(themeColors.primary);
    doc.text(title, pageWidth / 2, 40, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor('#666666');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 15, 20, { align: 'right' });

    // Add table
    autoTable(doc, {
      startY: 60,
      head: [columns],
      body: data.map(row => columns.map(col => row[col.toLowerCase().replace(/ /g, '_')])),
      theme: 'grid',
      headStyles: {
        fillColor: themeColors.primary,
        textColor: 'white',
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: '#333333',
      },
      alternateRowStyles: {
        fillColor: '#f8f8f8',
      },
      margin: { top: 60 },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor('#666666');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Add watermark
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.setFontSize(60);
    doc.setTextColor(themeColors.primary);
    doc.text('AUCA REPORT', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45,
    });

    doc.save(`${title.toLowerCase().replace(/ /g, '-')}.pdf`);
  };

  const generateOverallReportPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add logo
    doc.addImage(logo, 'PNG', 10, 10, 40, 40);

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(themeColors.primary);
    doc.text('AUCA Overall Report', pageWidth / 2, 40, { align: 'center' });

    // Add date
    doc.setFontSize(12);
    doc.setTextColor('#666666');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth - 15, 20, { align: 'right' });

    let yOffset = 60;

    // Attendance Summary Table
    doc.setFontSize(16);
    doc.setTextColor(themeColors.primary);
    doc.text('Attendance Summary', 14, yOffset);
    yOffset += 10;

    autoTable(doc, {
      startY: yOffset,
      head: [['Date', 'Approved', 'Unapproved']],
      body: reportData.map(row => [row.date, row.approved, row.unapproved]),
      theme: 'grid',
      headStyles: {
        fillColor: themeColors.primary,
        textColor: 'white',
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: '#333333',
      },
      alternateRowStyles: {
        fillColor: '#f8f8f8',
      },
      margin: { top: yOffset },
    });

    yOffset = doc.lastAutoTable.finalY + 20;

    // Teacher Performance Table
    doc.setFontSize(16);
    doc.setTextColor(themeColors.primary);
    doc.text('Teacher Performance', 14, yOffset);
    yOffset += 10;

    autoTable(doc, {
      startY: yOffset,
      head: [['Teacher Name', 'Lesson Name', 'Class Date', 'Attendance Status', 'Recommendation']],
      body: teacherPerformanceData.map(row => [
        row.teacher_name,
        row.lesson_name,
        row.class_date,
        row.attendance_status,
        row.recommendation
      ]),
      theme: 'grid',
      headStyles: {
        fillColor: themeColors.primary,
        textColor: 'white',
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: '#333333',
      },
      alternateRowStyles: {
        fillColor: '#f8f8f8',
      },
      margin: { top: yOffset },
    });

    // Add footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor('#666666');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Add watermark
    doc.setGState(new doc.GState({ opacity: 0.2 }));
    doc.setFontSize(60);
    doc.setTextColor(themeColors.primary);
    doc.text('AUCA REPORT', pageWidth / 2, pageHeight / 2, {
      align: 'center',
      angle: 45,
    });

    doc.save('auca-overall-report.pdf');
  };

  const generateCustomReportPDF = () => {
    generatePDF('AUCA Custom Report', customReportData, ['Teacher Name', 'Lesson Name', 'Class Date', 'Attendance Status', 'Insights']);
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, color: themeColors.primary, fontWeight: 'bold', textAlign: 'center' }}>
        AUCA Report Generation
      </Typography>
      <StyledPaper elevation={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={dateRange[0]}
                onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
              <Box sx={{ my: 2 }} />
              <DatePicker
                label="End Date"
                value={dateRange[1]}
                onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <StyledButton
                variant="contained"
                sx={{ backgroundColor: themeColors.primary }}
                onClick={fetchCustomReportData}
                disabled={loading || !dateRange[0] || !dateRange[1]}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Custom Report Data'}
              </StyledButton>
              <StyledButton
                variant="outlined"
                sx={{ color: themeColors.primary, borderColor: themeColors.primary }}
                onClick={generateCustomReportPDF}
                disabled={customReportData.length === 0}
              >
                Download Custom Report
              </StyledButton>
              <StyledButton
                variant="contained"
                sx={{ backgroundColor: themeColors.primary }}
                onClick={generateOverallReportPDF}
                disabled={reportData.length === 0 && teacherPerformanceData.length === 0}
              >
                Download Overall Report
              </StyledButton>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </StyledPaper>
  
      {/* Display Data Tables */}
      <Box sx={{ mt: 4 }}>
        {Array.isArray(reportData) && reportData.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Attendance Summary
            </Typography>
            <StyledTable>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Approved</th>
                  <th>Unapproved</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.approved}</td>
                    <td>{row.unapproved}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </StyledPaper>
        )}
  
        {Array.isArray(teacherPerformanceData) && teacherPerformanceData.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Teacher Performance
            </Typography>
            <StyledTable>
  <thead>
    <tr>
      <th>Teacher Name</th>
      <th>Lesson Name</th>
      <th>Class Date</th>
      <th>Attendance Status</th>
      <th>Reason</th>
    </tr>
  </thead>
  <tbody>
    {teacherPerformanceData.map((row, index) => (
      <tr key={index}>
        <td>{row.teacher_name}</td>
        <td>{row.lesson_name}</td>
        <td>{row.class_date}</td>
        <td>{row.attendance_status}</td>
        <td>{row.attendance_status === 'Absent' ? row.absence_reason || 'Not specified' : '-'}</td>
      </tr>
    ))}
  </tbody>
</StyledTable>
          </StyledPaper>
        )}
  
        {Array.isArray(customReportData) && customReportData.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Custom Report
            </Typography>
            <StyledTable>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Lesson Name</th>
                  <th>Class Date</th>
                  <th>Attendance Status</th>
                  <th>Insights</th>
                </tr>
              </thead>
              <tbody>
                {customReportData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.teacher_name}</td>
                    <td>{row.lesson_name}</td>
                    <td>{row.class_date}</td>
                    <td>{row.attendance_status}</td>
                    <td>{row.insights}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </StyledPaper>
        )}
  
        {!Array.isArray(reportData) && reportData.length === 0 &&
         !Array.isArray(teacherPerformanceData) && teacherPerformanceData.length === 0 &&
         !Array.isArray(customReportData) && customReportData.length === 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="body1" sx={{ color: themeColors.primary, textAlign: 'center' }}>
              No data available for the selected date range. Please adjust your selection and try again.
            </Typography>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
}

export default ReportPage;