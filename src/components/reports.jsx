import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, TextField, Paper, Box } from '@mui/material';
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
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
  backgroundColor: themeColors.secondary,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
  padding: theme.spacing(1, 3),
  borderRadius: theme.spacing(5),
  fontWeight: 'bold',
  textTransform: 'none',
}));

const StyledTable = styled('table')(({ theme }) => ({
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  '& th, & td': {
    padding: theme.spacing(2),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& th': {
    backgroundColor: themeColors.primary,
    color: 'white',
    fontWeight: 'bold',
  },
  '& tr:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 68, 123, 0.05)',
  },
  '& tr:hover': {
    backgroundColor: 'rgba(0, 68, 123, 0.1)',
  },
}));

const ReportPage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportData, setReportData] = useState([]);
  const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
  const [customReportData, setCustomReportData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch overall report data and teacher performance data on component mount
  useEffect(() => {
    fetchOverallReportData();
    fetchTeacherPerformanceData();
  }, []);

  const fetchOverallReportData = async () => {
    console.log('Fetching overall report data...');

    try {
      setLoading(true);
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/attendance-summary`);
      console.log('Fetched overall data:', response.data);
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching overall report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeacherPerformanceData = async () => {
    console.log('Fetching teacher performance data...');

    try {
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/teacher-performance`);
      console.log('Fetched teacher performance data:', response.data);
      setTeacherPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching teacher performance data:', error);
    }
  };

  const fetchCustomReportData = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      console.warn('Date range is not fully selected:', dateRange);
      return;
    }

    console.log('Fetching custom report data...');

    try {
      const response = await axios.post(`${apiService.getBaseURL()}/api/reports/custom`, {
        reportType: 'attendance', // Replace with the appropriate report type
        startDate: dateRange[0]?.format('YYYY-MM-DD'),
        endDate: dateRange[1]?.format('YYYY-MM-DD'),
      });
      console.log('Fetched custom report data:', response.data);
      setCustomReportData(response.data);
    } catch (error) {
      console.error('Error fetching custom report data:', error);
    }
  };

  const fetchReportDataByDate = async () => {
    if (!dateRange[0] || !dateRange[1]) {
      console.warn('Date range is not fully selected:', dateRange);
      return;
    }

    console.log('Fetching report data with date range:', dateRange);

    try {
      setLoading(true);
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/attendance-summary`, {
        params: {
          startDate: dateRange[0]?.format('YYYY-MM-DD'),
          endDate: dateRange[1]?.format('YYYY-MM-DD'),
        },
      });

      console.log('Fetched data for date range:', response.data); 
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data for date range:', error);
    } finally {
      setLoading(false);
    }

    // Fetch custom report data for the selected date range
    fetchCustomReportData();
  };

  const generatePDF = () => {
    console.log('Generating PDF...');
    const doc = new jsPDF();

    // Add logo as watermark
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.addImage(logo, 'PNG', pageWidth / 2 - 40, pageHeight / 2 - 40, 80, 80, '', 'NONE', 45);

    // Add title
    doc.setFontSize(24);
    doc.setTextColor(themeColors.primary);
    doc.text('AUCA Report', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setTextColor('#333333');

    // Attendance Summary Table
    autoTable(doc, {
      startY: 40,
      head: [['Date', 'Approved', 'Unapproved']],
      body: reportData.map(row => [row.date, row.approved, row.unapproved]),
      theme: 'striped',
      headStyles: { fillColor: themeColors.primary, textColor: 'white', fontStyle: 'bold' },
      bodyStyles: { textColor: '#333333' },
      alternateRowStyles: { fillColor: '#f8f8f8' },
      margin: { top: 10 },
    });

    // Check if there's space left on the page for the next table
    let finalY = doc.lastAutoTable.finalY;
    if (finalY > 250) { 
      doc.addPage();
      finalY = 20; 
    }

    // Teacher Performance Table
    autoTable(doc, {
      startY: finalY + 10, 
      head: [['Teacher Name', 'Total Classes', 'Total Attendance', 'Approved Attendance']],
      body: teacherPerformanceData.map(row => [
        row.teacher_name, 
        row.total_classes, 
        row.total_attendance, 
        row.approved_attendance
      ]),
      theme: 'grid',
      headStyles: { fillColor: themeColors.primary, textColor: 'white', fontStyle: 'bold' },
      margin: { top: 10 },
    });

    // Add another page if needed
    finalY = doc.lastAutoTable.finalY;
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }

    // Custom Report Table (Full report without date range)
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Date', 'Approved', 'Unapproved']],
      body: customReportData.map(row => [row.date, row.approved, row.unapproved]),
      theme: 'grid',
      headStyles: { fillColor: themeColors.primary, textColor: 'white', fontStyle: 'bold' },
    });

    // Add footer for page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor('#666666');
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save PDF
    doc.save('comprehensive-report.pdf');
  };

   return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, color: themeColors.primary, fontWeight: 'bold' }}>
        Report Generation
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
                color="primary"
                onClick={fetchReportDataByDate}
                disabled={loading || !dateRange[0] || !dateRange[1]}
              >
                Fetch Report Data
              </StyledButton>
              <StyledButton
                variant="outlined"
                color="secondary"
                onClick={generatePDF}
                disabled={reportData.length === 0 && teacherPerformanceData.length === 0 && customReportData.length === 0}
              >
                Download PDF
              </StyledButton>
            </Grid>
          </Grid>
        </LocalizationProvider>
      </StyledPaper>

      <Box sx={{ mt: 4 }}>
        {Array.isArray(reportData) && reportData.length > 0 && (
          <StyledPaper elevation={3} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: themeColors.primary, fontWeight: 'bold' }}>
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
          <StyledPaper elevation={3} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: themeColors.primary, fontWeight: 'bold' }}>
              Teacher Performance
            </Typography>
            <StyledTable>
              <thead>
                <tr>
                  <th>Teacher Name</th>
                  <th>Total Classes</th>
                  <th>Total Attendance</th>
                  <th>Approved Attendance</th>
                </tr>
              </thead>
              <tbody>
                {teacherPerformanceData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.teacher_name}</td>
                    <td>{row.total_classes}</td>
                    <td>{row.total_attendance}</td>
                    <td>{row.approved_attendance}</td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          </StyledPaper>
        )}

        {Array.isArray(customReportData) && customReportData.length > 0 && (
          <StyledPaper elevation={3} sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, color: themeColors.primary, fontWeight: 'bold' }}>
              Custom Report
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
                {customReportData.map((row, index) => (
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

        {!Array.isArray(reportData) && reportData.length === 0 && 
         !Array.isArray(teacherPerformanceData) && teacherPerformanceData.length === 0 && 
         !Array.isArray(customReportData) && customReportData.length === 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="body1" sx={{ color: themeColors.primary }}>
              No data available for the selected date range.
            </Typography>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default ReportPage;
