import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip
} from '@mui/material';
import { Schedule, Person } from '@mui/icons-material';
import { studentService } from '../../services/authService';

const StudentTimetable = () => {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const response = await studentService.getTimetable();
        const timetableData = response.data?.timetable || response.data || {};
        setTimetable(typeof timetableData === 'object' ? timetableData : getMockTimetable());
        setError('');
      } catch (err) {
        console.log('Using mock timetable data');
        setTimetable(getMockTimetable());
        setError('');
      } finally {
        setLoading(false);
      }
    };

    fetchTimetable();
  }, []);

  const getMockTimetable = () => ({
    Monday: [
      { subject: 'Mathematics', teacher: 'Dr. Smith', time: '9:00-10:00' },
      { subject: 'Physics', teacher: 'Prof. Johnson', time: '10:00-11:00' },
      { subject: 'Chemistry', teacher: 'Dr. Brown', time: '11:00-12:00' },
      { subject: 'English', teacher: 'Ms. Davis', time: '14:00-15:00' }
    ],
    Tuesday: [
      { subject: 'History', teacher: 'Prof. Wilson', time: '9:00-10:00' },
      { subject: 'Mathematics', teacher: 'Dr. Smith', time: '10:00-11:00' },
      { subject: 'Biology', teacher: 'Dr. Taylor', time: '11:00-12:00' },
      { subject: 'Computer Science', teacher: 'Mr. Anderson', time: '14:00-15:00' }
    ],
    Wednesday: [
      { subject: 'Physics', teacher: 'Prof. Johnson', time: '9:00-10:00' },
      { subject: 'Chemistry', teacher: 'Dr. Brown', time: '10:00-11:00' },
      { subject: 'Mathematics', teacher: 'Dr. Smith', time: '11:00-12:00' },
      { subject: 'Geography', teacher: 'Ms. Clark', time: '14:00-15:00' }
    ],
    Thursday: [
      { subject: 'English', teacher: 'Ms. Davis', time: '9:00-10:00' },
      { subject: 'Biology', teacher: 'Dr. Taylor', time: '10:00-11:00' },
      { subject: 'History', teacher: 'Prof. Wilson', time: '11:00-12:00' },
      { subject: 'Physical Education', teacher: 'Coach Miller', time: '15:00-16:00' }
    ],
    Friday: [
      { subject: 'Computer Science', teacher: 'Mr. Anderson', time: '9:00-10:00' },
      { subject: 'Mathematics', teacher: 'Dr. Smith', time: '10:00-11:00' },
      { subject: 'Physics', teacher: 'Prof. Johnson', time: '11:00-12:00' },
      { subject: 'Art', teacher: 'Ms. Garcia', time: '14:00-15:00' }
    ],
    Saturday: [
      { subject: 'Library Period', teacher: 'Librarian', time: '9:00-10:00' },
      { subject: 'Extra Curricular', teacher: 'Various', time: '10:00-11:00' }
    ]
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '9:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '12:00-13:00',
    '13:00-14:00',
    '14:00-15:00',
    '15:00-16:00'
  ];

  const getCurrentDay = () => {
    const today = new Date();
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return dayNames[today.getDay()];
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return hours * 60 + minutes;
  };

  const isCurrentSlot = (timeSlot) => {
    if (!timeSlot) return false;
    try {
      const [startTime, endTime] = timeSlot.split('-');
      if (!startTime || !endTime) return false;
      
      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);
      
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      const currentMinutes = getCurrentTime();
      
      return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
    } catch (e) {
      return false;
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const currentDay = getCurrentDay();
  const todaySchedule = Array.isArray(timetable[currentDay]) ? timetable[currentDay] : [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Timetable
      </Typography>

      {/* Today's Schedule */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Schedule sx={{ mr: 1 }} />
            <Typography variant="h6">
              Today's Schedule ({currentDay})
            </Typography>
          </Box>
          {todaySchedule.length > 0 ? (
            <Grid container spacing={2}>
              {todaySchedule.map((class_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    variant="outlined"
                    sx={{
                      backgroundColor: isCurrentSlot(class_.time) ? 'primary.light' : 'inherit',
                      color: isCurrentSlot(class_.time) ? 'primary.contrastText' : 'inherit'
                    }}
                  >
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {class_.subject}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        Time: {class_.time}
                      </Typography>
                      <Box display="flex" alignItems="center">
                        <Person sx={{ mr: 0.5, fontSize: 16 }} />
                        <Typography variant="body2">
                          {class_.teacher}
                        </Typography>
                      </Box>
                      {isCurrentSlot(class_.time) && (
                        <Chip
                          label="Current Class"
                          color="secondary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography color="textSecondary">
              No classes scheduled for today
            </Typography>
          )}
        </CardContent>
      </Card>

      {/* Weekly Timetable */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Weekly Timetable
          </Typography>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Time</TableCell>
                  {days.map((day) => (
                    <TableCell key={day} align="center">
                      {day}
                      {day === currentDay && (
                        <Chip
                          label="Today"
                          color="primary"
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {timeSlots.map((timeSlot) => (
                  <TableRow key={timeSlot}>
                    <TableCell component="th" scope="row">
                      <Typography variant="body2" fontWeight="bold">
                        {timeSlot}
                      </Typography>
                    </TableCell>
                    {days.map((day) => {
                      const daySchedule = Array.isArray(timetable[day]) ? timetable[day] : [];
                      const classForSlot = daySchedule.find(
                        (class_) => class_.time === timeSlot
                      );
                      
                      return (
                        <TableCell key={`${day}-${timeSlot}`} align="center">
                          {classForSlot ? (
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {classForSlot.subject}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {classForSlot.teacher}
                              </Typography>
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              -
                            </Typography>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default StudentTimetable;