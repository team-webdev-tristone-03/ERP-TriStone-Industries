import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  TextField,
  Tabs,
  Tab
} from '@mui/material';
import { 
  CheckCircle, 
  Cancel, 
  AccessTime,
  School,
  Class,
  Schedule,
  Person,
  History
} from '@mui/icons-material';

const StaffAttendance = () => {
  const [tabValue, setTabValue] = useState(0);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [showStudents, setShowStudents] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Jane Smith's assigned classes only
  const assignedClasses = [
    { class: '6th', section: 'B' },
    { class: '7th', section: 'B' },
    { class: '8th', section: 'B' }
  ];

  const periods = ['1', '2', '3', '4', '5', '6'];

  const mockStudents = [
    { id: 1, name: 'John Smith', rollNumber: '001', fatherName: 'Robert Smith', motherName: 'Mary Smith', phone: '9876543210', status: null },
    { id: 2, name: 'Emma Johnson', rollNumber: '002', fatherName: 'David Johnson', motherName: 'Lisa Johnson', phone: '9876543211', status: null },
    { id: 3, name: 'Michael Brown', rollNumber: '003', fatherName: 'James Brown', motherName: 'Sarah Brown', phone: '9876543212', status: null },
    { id: 4, name: 'Sophia Davis', rollNumber: '004', fatherName: 'William Davis', motherName: 'Jennifer Davis', phone: '9876543213', status: null },
    { id: 5, name: 'Oliver Wilson', rollNumber: '005', fatherName: 'Thomas Wilson', motherName: 'Amanda Wilson', phone: '9876543214', status: null }
  ];

  const mockPreviousAttendance = [
    { id: 1, name: 'John Smith', rollNumber: '001', fatherName: 'Robert Smith', motherName: 'Mary Smith', phone: '9876543210', status: 'present' },
    { id: 2, name: 'Emma Johnson', rollNumber: '002', fatherName: 'David Johnson', motherName: 'Lisa Johnson', phone: '9876543211', status: 'absent' },
    { id: 3, name: 'Michael Brown', rollNumber: '003', fatherName: 'James Brown', motherName: 'Sarah Brown', phone: '9876543212', status: 'present' },
    { id: 4, name: 'Sophia Davis', rollNumber: '004', fatherName: 'William Davis', motherName: 'Jennifer Davis', phone: '9876543213', status: 'present' },
    { id: 5, name: 'Oliver Wilson', rollNumber: '005', fatherName: 'Thomas Wilson', motherName: 'Amanda Wilson', phone: '9876543214', status: 'absent' }
  ];

  const handleCheckIn = async () => {
    const now = new Date();
    setCheckInTime(now.toLocaleTimeString());
    
    const attendanceData = {
      staffId: 'STF001',
      date: now.toISOString().split('T')[0],
      checkIn: now.toISOString(),
      status: 'checked_in'
    };
    
    // MongoDB API call would go here
    console.log('MongoDB - Staff Check In:', attendanceData);
    setSnackbar({ open: true, message: 'Checked in successfully!', severity: 'success' });
  };

  const handleCheckOut = async () => {
    if (!checkInTime) {
      setSnackbar({ open: true, message: 'Please check in first!', severity: 'error' });
      return;
    }
    
    const now = new Date();
    setCheckOutTime(now.toLocaleTimeString());
    
    const attendanceData = {
      staffId: 'STF001',
      date: now.toISOString().split('T')[0],
      checkOut: now.toISOString(),
      status: 'checked_out'
    };
    
    // MongoDB API call would go here
    console.log('MongoDB - Staff Check Out:', attendanceData);
    setSnackbar({ open: true, message: 'Checked out successfully!', severity: 'success' });
  };

  const handleSubmit = () => {
    if (!selectedClass || !selectedSection || !selectedPeriod) {
      setSnackbar({ open: true, message: 'Please select class, section, and period!', severity: 'error' });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    const isToday = selectedDate === today;
    
    if (tabValue === 0) { // Mark Attendance
      setStudents(mockStudents.map(student => ({ ...student, status: null })));
      setViewMode(false);
    } else { // View Previous
      setStudents(mockPreviousAttendance);
      setViewMode(true);
    }
    
    setShowStudents(true);
    const message = tabValue === 0 
      ? `Students loaded for ${selectedClass}-${selectedSection} Period ${selectedPeriod}`
      : `Previous attendance loaded for ${selectedDate}`;
    setSnackbar({ open: true, message, severity: 'success' });
  };

  const markAttendance = (studentId, status) => {
    if (viewMode) return; // Prevent editing in view mode
    
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, status } : student
    ));

    // MongoDB API call for individual student attendance
    const attendanceRecord = {
      studentId,
      staffId: 'STF001',
      class: selectedClass,
      section: selectedSection,
      period: selectedPeriod,
      date: selectedDate,
      status,
      timestamp: new Date().toISOString()
    };
    
    console.log('MongoDB - Student Attendance:', attendanceRecord);
  };

  const saveAttendance = () => {
    if (viewMode) return;
    
    const attendanceData = {
      staffId: 'STF001',
      class: selectedClass,
      section: selectedSection,
      period: selectedPeriod,
      date: selectedDate,
      students: students.map(student => ({
        studentId: student.id,
        rollNumber: student.rollNumber,
        status: student.status || 'absent'
      })),
      timestamp: new Date().toISOString()
    };
    
    // MongoDB API call would go here
    console.log('MongoDB - Save All Attendance:', attendanceData);
    setSnackbar({ open: true, message: 'Attendance saved successfully!', severity: 'success' });
  };

  const getMaxDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Staff Attendance
      </Typography>

      {/* Quick Actions */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Quick Actions
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={handleCheckIn}
                  disabled={checkInTime}
                  sx={{ minWidth: 120 }}
                >
                  Check In
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={handleCheckOut}
                  disabled={!checkInTime || checkOutTime}
                  sx={{ minWidth: 120 }}
                >
                  Check Out
                </Button>
              </Box>
              
              {checkInTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <AccessTime color="success" />
                  <Typography variant="body2">Checked in at: {checkInTime}</Typography>
                </Box>
              )}
              
              {checkOutTime && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AccessTime color="error" />
                  <Typography variant="body2">Checked out at: {checkOutTime}</Typography>
                </Box>
              )}
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="body1" color="textSecondary">
                Today: {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs for Mark/View Attendance */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
            <Tab label="Mark Attendance" />
            <Tab label="View Previous Attendance" />
          </Tabs>

          {/* Date Selection for View Previous */}
          {tabValue === 1 && (
            <Box sx={{ mb: 3 }}>
              <TextField
                type="date"
                label="Select Date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                inputProps={{ max: getMaxDate() }}
                sx={{ mr: 2 }}
              />
            </Box>
          )}
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <School color="primary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" mb={2}>Class</Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Class</InputLabel>
                  <Select
                    value={selectedClass}
                    label="Select Class"
                    onChange={(e) => setSelectedClass(e.target.value)}
                  >
                    {assignedClasses.map((item, index) => (
                      <MenuItem key={index} value={item.class}>{item.class}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Class color="secondary" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" mb={2}>Section</Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Section</InputLabel>
                  <Select
                    value={selectedSection}
                    label="Select Section"
                    onChange={(e) => setSelectedSection(e.target.value)}
                  >
                    {assignedClasses
                      .filter(item => item.class === selectedClass)
                      .map((item, index) => (
                        <MenuItem key={index} value={item.section}>{item.section}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center' }}>
                <Schedule color="info" sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" mb={2}>Period</Typography>
                <FormControl fullWidth>
                  <InputLabel>Select Period</InputLabel>
                  <Select
                    value={selectedPeriod}
                    label="Select Period"
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                  >
                    {periods.map((period) => (
                      <MenuItem key={period} value={period}>Period {period}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={3}>
              <Card sx={{ p: 2, textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleSubmit}
                  sx={{ py: 2 }}
                >
                  {tabValue === 0 ? 'Load Students' : 'View Attendance'}
                </Button>
                {selectedClass && selectedSection && selectedPeriod && (
                  <Typography variant="body2" color="textSecondary" mt={1}>
                    {selectedClass}-{selectedSection} • Period {selectedPeriod}
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Students List */}
      {showStudents && (
        <Card>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">
                {viewMode ? 'Previous Attendance' : 'Mark Attendance'} - {selectedClass}-{selectedSection} (Period {selectedPeriod})
                {viewMode && <Chip label="View Only" color="info" size="small" sx={{ ml: 2 }} />}
              </Typography>
              {!viewMode && (
                <Button variant="contained" onClick={saveAttendance}>
                  Save Attendance
                </Button>
              )}
            </Box>
            
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Avatar</TableCell>
                    <TableCell>Roll No.</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Father's Name</TableCell>
                    <TableCell>Mother's Name</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Status</TableCell>
                    {!viewMode && <TableCell>Action</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Avatar>
                          <Person />
                        </Avatar>
                      </TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.fatherName}</TableCell>
                      <TableCell>{student.motherName}</TableCell>
                      <TableCell>{student.phone}</TableCell>
                      <TableCell>
                        {student.status && (
                          <Chip
                            label={student.status}
                            color={student.status === 'present' ? 'success' : 'error'}
                            size="small"
                          />
                        )}
                      </TableCell>
                      {!viewMode && (
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                              variant={student.status === 'present' ? 'contained' : 'outlined'}
                              color="success"
                              size="small"
                              onClick={() => markAttendance(student.id, 'present')}
                            >
                              Present
                            </Button>
                            <Button
                              variant={student.status === 'absent' ? 'contained' : 'outlined'}
                              color="error"
                              size="small"
                              onClick={() => markAttendance(student.id, 'absent')}
                            >
                              Absent
                            </Button>
                          </Box>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StaffAttendance;