import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  EventAvailable,
  Person,
  Group,
  CheckCircle,
  Cancel,
  Schedule,
  CalendarToday,
  Approval,
  Search
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminAttendance = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [attendanceStatus, setAttendanceStatus] = useState('present');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsRes, staffRes] = await Promise.all([
        adminService.getStudents(1, 100, ''),
        adminService.getStaff(1, 100, '')
      ]);
      
      setStudents(studentsRes.data?.data?.students || []);
      setStaff(staffRes.data?.data?.staff || []);
      
      // Generate attendance data for today
      generateTodayAttendance(studentsRes.data?.data?.students || [], staffRes.data?.data?.staff || []);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateTodayAttendance = (studentsData, staffData) => {
    const today = new Date().toISOString().split('T')[0];
    const attendanceData = [];
    
    // Generate student attendance
    studentsData.forEach((student, index) => {
      const statuses = ['present', 'absent', 'late'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      attendanceData.push({
        id: `student_${student._id}`,
        type: 'student',
        person: {
          id: student.studentId,
          name: `${student.userId?.profile?.firstName || ''} ${student.userId?.profile?.lastName || ''}`.trim(),
          class: `${student.class}-${student.section}`,
          email: student.userId?.email
        },
        date: today,
        status: randomStatus,
        timeIn: randomStatus !== 'absent' ? (randomStatus === 'late' ? '09:15 AM' : '08:30 AM') : null,
        timeOut: randomStatus !== 'absent' ? '03:30 PM' : null
      });
    });
    
    // Generate staff attendance
    staffData.forEach((staffMember, index) => {
      const statuses = ['present', 'absent', 'on_leave'];
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      
      attendanceData.push({
        id: `staff_${staffMember._id}`,
        type: 'staff',
        person: {
          id: staffMember.staffId,
          name: `${staffMember.userId?.profile?.firstName || ''} ${staffMember.userId?.profile?.lastName || ''}`.trim(),
          department: staffMember.department,
          designation: staffMember.designation,
          email: staffMember.userId?.email
        },
        date: today,
        status: randomStatus,
        timeIn: randomStatus === 'present' ? '08:00 AM' : null,
        timeOut: randomStatus === 'present' ? '04:00 PM' : null,
        workingHours: randomStatus === 'present' ? 8 : 0
      });
    });
    
    setAttendance(attendanceData);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return 'success';
      case 'absent': return 'error';
      case 'late': return 'warning';
      case 'on_leave': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return <CheckCircle />;
      case 'absent': return <Cancel />;
      case 'late': return <Schedule />;
      case 'on_leave': return <EventAvailable />;
      default: return <EventAvailable />;
    }
  };

  const handleMarkAttendance = (person) => {
    setSelectedPerson(person);
    setAttendanceStatus(person.status);
    setOpenDialog(true);
  };

  const handleSaveAttendance = () => {
    // Update attendance in state
    setAttendance(prev => prev.map(record => 
      record.id === selectedPerson.id 
        ? { ...record, status: attendanceStatus, timeIn: attendanceStatus !== 'absent' ? '08:30 AM' : null }
        : record
    ));
    setOpenDialog(false);
    setSelectedPerson(null);
  };

  const studentAttendance = attendance.filter(a => a.type === 'student');
  const staffAttendance = attendance.filter(a => a.type === 'staff');
  
  const totalStudents = studentAttendance.length;
  const presentStudents = studentAttendance.filter(s => s.status === 'present').length;
  const totalStaff = staffAttendance.length;
  const presentStaff = staffAttendance.filter(s => s.status === 'present').length;

  const filteredStudentAttendance = studentAttendance.filter(record => 
    record.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.person.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredStaffAttendance = staffAttendance.filter(record => 
    record.person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.person.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Attendance Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Group color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Student Attendance</Typography>
                  <Typography variant="h4">{presentStudents}/{totalStudents}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {totalStudents > 0 ? ((presentStudents/totalStudents) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Staff Attendance</Typography>
                  <Typography variant="h4">{presentStaff}/{totalStaff}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {totalStaff > 0 ? ((presentStaff/totalStaff) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Approval color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Records</Typography>
                  <Typography variant="h4">{attendance.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Today's Date</Typography>
                  <Typography variant="h6">{new Date().toLocaleDateString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Date Selector and Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} gap={2}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          placeholder="Search by name or ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 300 }}
        />
      </Box>

      {/* Tabs */}
      <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
        <Tab label="Student Attendance" />
        <Tab label="Staff Attendance" />
      </Tabs>

      {/* Student Attendance Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Time Out</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudentAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.person.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {record.person.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {record.person.name}
                    </Box>
                  </TableCell>
                  <TableCell>{record.person.class}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                      icon={getStatusIcon(record.status)}
                    />
                  </TableCell>
                  <TableCell>{record.timeIn || '-'}</TableCell>
                  <TableCell>{record.timeOut || '-'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleMarkAttendance(record)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStudentAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      No student attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Staff Attendance Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Staff ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time In</TableCell>
                <TableCell>Time Out</TableCell>
                <TableCell>Working Hours</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStaffAttendance.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.person.id}</TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2, bgcolor: 'secondary.main' }}>
                        {record.person.name.split(' ').map(n => n[0]).join('')}
                      </Avatar>
                      {record.person.name}
                    </Box>
                  </TableCell>
                  <TableCell>{record.person.department}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status)}
                      size="small"
                      icon={getStatusIcon(record.status)}
                    />
                  </TableCell>
                  <TableCell>{record.timeIn || '-'}</TableCell>
                  <TableCell>{record.timeOut || '-'}</TableCell>
                  <TableCell>{record.workingHours || 0} hrs</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleMarkAttendance(record)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredStaffAttendance.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography color="textSecondary">
                      No staff attendance records found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Edit Attendance Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Attendance</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {selectedPerson?.person?.name} ({selectedPerson?.person?.id})
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="present">Present</MenuItem>
                <MenuItem value="absent">Absent</MenuItem>
                <MenuItem value="late">Late</MenuItem>
                {selectedPerson?.type === 'staff' && (
                  <MenuItem value="on_leave">On Leave</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveAttendance} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminAttendance;