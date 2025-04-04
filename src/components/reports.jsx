import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, TextField, Paper, Box, CircularProgress, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput } from '@mui/material';
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
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  '& tr:nth-of-type(even)': {
    backgroundColor: 'rgba(0, 68, 123, 0.05)',
  },
  '& tr:hover': {
    backgroundColor: 'rgba(0, 68, 123, 0.1)',
    transition: 'background-color 0.3s ease-in-out',
  },
}));

const TableContainer = styled(Box)({
  maxHeight: '400px',
  overflowY: 'auto',
  marginBottom: '24px',
  boxShadow: 'inset 0 -10px 10px -10px rgba(0,0,0,0.1)',
  borderRadius: '4px',
});

const FilterChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  backgroundColor: themeColors.primary,
  color: 'white',
  fontWeight: 'bold',
  '&:hover': {
    backgroundColor: 'rgba(0, 68, 123, 0.8)',
  },
}));

const ReportPage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportData, setReportData] = useState([]);
  const [teacherPerformanceData, setTeacherPerformanceData] = useState([]);
  const [customReportData, setCustomReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filters
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  
  // Lists for filters
  const [teachersList, setTeachersList] = useState([]);
  const [lessonsList, setLessonsList] = useState([]);

  useEffect(() => {
    fetchOverallReportData();
    fetchTeacherPerformanceData();
  }, []);

  useEffect(() => {
    if (teacherPerformanceData.length > 0) {
      // Extract unique teachers and lessons for filter dropdowns
      const teachers = [...new Set(teacherPerformanceData.map(item => item.teacher_name))];
      const lessons = [...new Set(teacherPerformanceData.map(item => item.lesson_name))];
      
      setTeachersList(teachers);
      setLessonsList(lessons);
    }
  }, [teacherPerformanceData]);

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
      setLoading(true);
      const response = await axios.get(`${apiService.getBaseURL()}/api/reports/teacher-performance`);
      setTeacherPerformanceData(response.data);
    } catch (error) {
      console.error('Error fetching teacher performance data:', error);
    } finally {
      setLoading(false);
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
        teacher: selectedTeacher || undefined,
        lesson: selectedLesson || undefined,
        status: attendanceStatus || undefined,
      });
      setCustomReportData(response.data);
    } catch (error) {
      console.error('Error fetching custom report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (filterType, value) => {
    // Add filter to active filters
    if (value && !activeFilters.some(f => f.type === filterType && f.value === value)) {
      setActiveFilters([...activeFilters, { type: filterType, value }]);
    }
  };

  const removeFilter = (filterType, value) => {
    setActiveFilters(activeFilters.filter(f => !(f.type === filterType && f.value === value)));
  };

  const clearAllFilters = () => {
    setSelectedTeacher('');
    setSelectedLesson('');
    setAttendanceStatus('');
    setActiveFilters([]);
    setDateRange([null, null]);
  };

  // Filter the data based on active filters
  const getFilteredTeacherData = () => {
    return teacherPerformanceData.filter(item => {
      let matchesTeacher = true;
      let matchesLesson = true;
      let matchesStatus = true;

      // Check each active filter
      for (const filter of activeFilters) {
        if (filter.type === 'teacher' && item.teacher_name !== filter.value) {
          matchesTeacher = false;
        }
        if (filter.type === 'lesson' && item.lesson_name !== filter.value) {
          matchesLesson = false;
        }
        if (filter.type === 'status' && item.attendance_status !== filter.value) {
          matchesStatus = false;
        }
      }

      return matchesTeacher && matchesLesson && matchesStatus;
    });
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

    // Add filters applied
    if (activeFilters.length > 0) {
      doc.setFontSize(12);
      doc.setTextColor('#333333');
      doc.text('Filters Applied:', 14, 55);
      let yPos = 60;
      
      activeFilters.forEach((filter, index) => {
        doc.text(`${filter.type.charAt(0).toUpperCase() + filter.type.slice(1)}: ${filter.value}`, 20, yPos + (index * 5));
      });
      
      if (dateRange[0] && dateRange[1]) {
        doc.text(`Date Range: ${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}`, 
          20, yPos + (activeFilters.length * 5));
      }
    }

    // Add table
    autoTable(doc, {
      startY: activeFilters.length > 0 ? 70 + (activeFilters.length * 5) : 60,
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

  const generateTeacherReportPDF = () => {
    if (!selectedTeacher) {
      alert('Please select a teacher first');
      return;
    }

    const teacherData = teacherPerformanceData.filter(item => item.teacher_name === selectedTeacher);
    
    if (teacherData.length === 0) {
      alert('No data available for selected teacher');
      return;
    }

    generatePDF(`${selectedTeacher} Performance Report`, teacherData, ['Teacher Name', 'Lesson Name', 'Class Date', 'Attendance Status', 'Recommendation']);
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

  const generateFilteredReportPDF = () => {
    const filteredData = getFilteredTeacherData();
    
    if (filteredData.length === 0) {
      alert('No data available for selected filters');
      return;
    }

    let title = 'Filtered Teacher Report';
    if (activeFilters.some(f => f.type === 'teacher')) {
      const teacherFilter = activeFilters.find(f => f.type === 'teacher');
      title = `${teacherFilter.value} Performance Report`;
    }

    generatePDF(title, filteredData, ['Teacher Name', 'Lesson Name', 'Class Date', 'Attendance Status', 'Recommendation']);
  };

  const generateCustomReportPDF = () => {
    if (customReportData.length === 0) {
      alert('No custom report data available');
      return;
    }
    
    generatePDF('AUCA Custom Report', customReportData, ['Teacher Name', 'Lesson Name', 'Class Date', 'Attendance Status', 'Insights']);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" sx={{ mb: 4, color: themeColors.primary, fontWeight: 'bold', textAlign: 'center' }}>
        AUCA Report Generation
      </Typography>
      
      {/* Filters Section */}
      <StyledPaper elevation={3}>
        <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
          Filters & Report Settings
        </Typography>
        
        <Grid container spacing={3}>
          {/* Teacher Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="teacher-select-label">Teacher</InputLabel>
              <Select
                labelId="teacher-select-label"
                value={selectedTeacher}
                onChange={(e) => setSelectedTeacher(e.target.value)}
                label="Teacher"
              >
                <MenuItem value="">
                  <em>All Teachers</em>
                </MenuItem>
                {teachersList.map((teacher) => (
                  <MenuItem key={teacher} value={teacher}>{teacher}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Lesson Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="lesson-select-label">Lesson</InputLabel>
              <Select
                labelId="lesson-select-label"
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                label="Lesson"
              >
                <MenuItem value="">
                  <em>All Lessons</em>
                </MenuItem>
                {lessonsList.map((lesson) => (
                  <MenuItem key={lesson} value={lesson}>{lesson}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {/* Attendance Status Filter */}
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel id="status-select-label">Attendance Status</InputLabel>
              <Select
                labelId="status-select-label"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                label="Attendance Status"
              >
                <MenuItem value="">
                  <em>All Statuses</em>
                </MenuItem>
                <MenuItem value="Present">Present</MenuItem>
                <MenuItem value="Absent">Absent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          {/* Date Range Filters */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: themeColors.primary }}>
              Date Range
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Start Date"
                    value={dateRange[0]}
                    onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="End Date"
                    value={dateRange[1]}
                    onChange={(newValue) => setDateRange([dateRange[0], newValue])}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Grid>
          
          {/* Active Filters */}
          <Grid item xs={12}>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Active Filters:</Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {activeFilters.length === 0 && (
                  <Typography variant="body2" color="text.secondary">No active filters</Typography>
                )}
                
                {activeFilters.map((filter, index) => (
                  <FilterChip
                    key={index}
                    label={`${filter.type}: ${filter.value}`}
                    onDelete={() => removeFilter(filter.type, filter.value)}
                  />
                ))}
                
                {dateRange[0] && dateRange[1] && (
                  <FilterChip
                    label={`Date: ${dateRange[0].format('YYYY-MM-DD')} to ${dateRange[1].format('YYYY-MM-DD')}`}
                    onDelete={() => setDateRange([null, null])}
                  />
                )}
                
                {(activeFilters.length > 0 || (dateRange[0] && dateRange[1])) && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={clearAllFilters}
                    sx={{ ml: 1 }}
                  >
                    Clear All
                  </Button>
                )}
              </Box>
            </Box>
          </Grid>
          
          {/* Filter Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              <StyledButton
                variant="contained"
                sx={{ backgroundColor: themeColors.primary }}
                onClick={() => {
                  if (selectedTeacher) applyFilter('teacher', selectedTeacher);
                  if (selectedLesson) applyFilter('lesson', selectedLesson);
                  if (attendanceStatus) applyFilter('status', attendanceStatus);
                }}
              >
                Apply Filters
              </StyledButton>
              
              <StyledButton
                variant="contained"
                sx={{ backgroundColor: themeColors.primary }}
                onClick={fetchCustomReportData}
                disabled={loading || !dateRange[0] || !dateRange[1]}
              >
                {loading ? <CircularProgress size={24} /> : 'Fetch Custom Report'}
              </StyledButton>
              
              <StyledButton
                variant="outlined"
                sx={{ color: themeColors.primary, borderColor: themeColors.primary }}
                onClick={generateFilteredReportPDF}
                disabled={activeFilters.length === 0}
              >
                Download Filtered Report
              </StyledButton>
              
              <StyledButton
                variant="outlined"
                sx={{ color: themeColors.primary, borderColor: themeColors.primary }}
                onClick={generateTeacherReportPDF}
                disabled={!selectedTeacher}
              >
                Download Teacher Report
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
            </Box>
          </Grid>
        </Grid>
      </StyledPaper>
  
      {/* Display Data Tables */}
      <Box sx={{ mt: 4 }}>
        {Array.isArray(reportData) && reportData.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Attendance Summary
            </Typography>
            <TableContainer>
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
            </TableContainer>
          </StyledPaper>
        )}
  
        {activeFilters.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Filtered Teacher Performance
            </Typography>
            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Lesson Name</th>
                    <th>Class Date</th>
                    <th>Attendance Status</th>
                    <th>Reason</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>
                <tbody>
                  {getFilteredTeacherData().map((row, index) => (
                    <tr key={index}>
                      <td>{row.teacher_name}</td>
                      <td>{row.lesson_name}</td>
                      <td>{row.class_date}</td>
                      <td>{row.attendance_status}</td>
                      <td>{row.attendance_status === 'Absent' ? row.absence_reason || 'Not specified' : '-'}</td>
                      <td>{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableContainer>
            {getFilteredTeacherData().length === 0 && (
              <Typography variant="body1" sx={{ textAlign: 'center', py: 4 }}>
                No data matches your filter criteria
              </Typography>
            )}
          </StyledPaper>
        )}
  
        {Array.isArray(teacherPerformanceData) && teacherPerformanceData.length > 0 && activeFilters.length === 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Teacher Performance
            </Typography>
            <TableContainer>
              <StyledTable>
                <thead>
                  <tr>
                    <th>Teacher Name</th>
                    <th>Lesson Name</th>
                    <th>Class Date</th>
                    <th>Attendance Status</th>
                    <th>Reason</th>
                    <th>Recommendation</th>
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
                      <td>{row.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </StyledTable>
            </TableContainer>
          </StyledPaper>
        )}
  
        {Array.isArray(customReportData) && customReportData.length > 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="h5" sx={{ mb: 3, color: themeColors.primary, fontWeight: 'bold' }}>
              Custom Report
            </Typography>
            <TableContainer>
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
            </TableContainer>
          </StyledPaper>
        )}
  
        {!Array.isArray(reportData) && reportData.length === 0 &&
         !Array.isArray(teacherPerformanceData) && teacherPerformanceData.length === 0 &&
         !Array.isArray(customReportData) && customReportData.length === 0 && (
          <StyledPaper elevation={3}>
            <Typography variant="body1" sx={{ color: themeColors.primary, textAlign: 'center', py: 4 }}>
              No data available for the selected criteria. Please adjust your filters and try again.
            </Typography>
          </StyledPaper>
        )}
      </Box>
    </Container>
  );
};

export default ReportPage;