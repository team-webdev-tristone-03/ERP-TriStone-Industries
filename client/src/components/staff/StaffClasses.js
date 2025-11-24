import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { Class, People, Schedule } from '@mui/icons-material';

const StaffClasses = () => {
  const [classes] = useState([
    { id: 1, class: '10th', section: 'A', subject: 'Mathematics', students: 35, schedule: 'Mon, Wed, Fri - 9:00 AM' },
    { id: 2, class: '10th', section: 'B', subject: 'Mathematics', students: 32, schedule: 'Tue, Thu, Sat - 10:00 AM' },
    { id: 3, class: '9th', section: 'A', subject: 'Mathematics', students: 38, schedule: 'Mon, Wed, Fri - 11:00 AM' }
  ]);

  const [todayClasses] = useState([
    { class: '10th A', subject: 'Mathematics', time: '9:00 AM', status: 'upcoming' },
    { class: '9th A', subject: 'Mathematics', time: '11:00 AM', status: 'upcoming' }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Classes</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Class color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Classes</Typography>
                  <Typography variant="h4">{classes.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Students</Typography>
                  <Typography variant="h4">{classes.reduce((sum, cls) => sum + cls.students, 0)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Today's Classes</Typography>
                  <Typography variant="h4">{todayClasses.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Today's Schedule</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Class</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayClasses.map((cls, index) => (
                      <TableRow key={index}>
                        <TableCell>{cls.class}</TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>{cls.time}</TableCell>
                        <TableCell>
                          <Chip label={cls.status} color="primary" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">View Details</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>All Assigned Classes</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Class</TableCell>
                      <TableCell>Section</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Students</TableCell>
                      <TableCell>Schedule</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>{cls.class}</TableCell>
                        <TableCell>{cls.section}</TableCell>
                        <TableCell>{cls.subject}</TableCell>
                        <TableCell>{cls.students}</TableCell>
                        <TableCell>{cls.schedule}</TableCell>
                        <TableCell>
                          <Button variant="contained" size="small" sx={{ mr: 1 }}>
                            Manage
                          </Button>
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

export default StaffClasses;