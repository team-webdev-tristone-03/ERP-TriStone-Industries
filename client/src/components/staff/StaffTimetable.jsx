import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';
import { Schedule, Today, Class } from '@mui/icons-material';

const StaffTimetable = () => {
  const [timetable] = useState({
    Monday: [
      { time: '9:00-10:00', class: '10th A', subject: 'Mathematics', room: 'R-101' },
      { time: '11:00-12:00', class: '9th A', subject: 'Mathematics', room: 'R-102' },
      { time: '2:00-3:00', class: '10th B', subject: 'Mathematics', room: 'R-103' }
    ],
    Tuesday: [
      { time: '10:00-11:00', class: '10th A', subject: 'Mathematics', room: 'R-101' },
      { time: '12:00-1:00', class: '9th B', subject: 'Mathematics', room: 'R-104' }
    ],
    Wednesday: [
      { time: '9:00-10:00', class: '10th A', subject: 'Mathematics', room: 'R-101' },
      { time: '11:00-12:00', class: '9th A', subject: 'Mathematics', room: 'R-102' }
    ],
    Thursday: [
      { time: '10:00-11:00', class: '10th B', subject: 'Mathematics', room: 'R-103' },
      { time: '2:00-3:00', class: '9th B', subject: 'Mathematics', room: 'R-104' }
    ],
    Friday: [
      { time: '9:00-10:00', class: '10th A', subject: 'Mathematics', room: 'R-101' },
      { time: '11:00-12:00', class: '9th A', subject: 'Mathematics', room: 'R-102' },
      { time: '1:00-2:00', class: '10th B', subject: 'Mathematics', room: 'R-103' }
    ],
    Saturday: [
      { time: '10:00-11:00', class: '9th B', subject: 'Mathematics', room: 'R-104' }
    ]
  });

  const todaySchedule = timetable[new Date().toLocaleDateString('en-US', { weekday: 'long' })] || [];
  const totalClasses = Object.values(timetable).flat().length;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Timetable</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Weekly Classes</Typography>
                  <Typography variant="h4">{totalClasses}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Today color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Today's Classes</Typography>
                  <Typography variant="h4">{todaySchedule.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Class color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Different Classes</Typography>
                  <Typography variant="h4">4</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
              {todaySchedule.length > 0 ? (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Subject</TableCell>
                        <TableCell>Room</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todaySchedule.map((period, index) => (
                        <TableRow key={index}>
                          <TableCell>{period.time}</TableCell>
                          <TableCell>{period.class}</TableCell>
                          <TableCell>{period.subject}</TableCell>
                          <TableCell>{period.room}</TableCell>
                          <TableCell>
                            <Chip label="Scheduled" color="primary" size="small" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body1" color="textSecondary">No classes scheduled for today</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Weekly Timetable</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Day</TableCell>
                      <TableCell>Time Slots</TableCell>
                      <TableCell>Classes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(timetable).map(([day, periods]) => (
                      <TableRow key={day}>
                        <TableCell>{day}</TableCell>
                        <TableCell>
                          {periods.map((period, index) => (
                            <Chip key={index} label={period.time} size="small" sx={{ mr: 1, mb: 1 }} />
                          ))}
                        </TableCell>
                        <TableCell>
                          {periods.map((period, index) => (
                            <Box key={index} sx={{ mb: 1 }}>
                              <Typography variant="body2">
                                {period.class} - {period.subject} ({period.room})
                              </Typography>
                            </Box>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffTimetable;