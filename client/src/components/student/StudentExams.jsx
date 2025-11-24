import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Grade, Schedule, Assignment } from '@mui/icons-material';

const StudentExams = () => {
  const [exams, setExams] = useState([
    { id: 1, subject: 'Mathematics', date: '2024-02-15', time: '10:00 AM', duration: '3 hours', status: 'upcoming', marks: null },
    { id: 2, subject: 'Physics', date: '2024-02-10', time: '2:00 PM', duration: '3 hours', status: 'completed', marks: 85 },
    { id: 3, subject: 'Chemistry', date: '2024-02-08', time: '10:00 AM', duration: '3 hours', status: 'completed', marks: 92 }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Exams & Results</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Grade color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Exams</Typography>
                  <Typography variant="h4">{exams.length}</Typography>
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
                  <Typography variant="h6">Upcoming</Typography>
                  <Typography variant="h4">{exams.filter(e => e.status === 'upcoming').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Completed</Typography>
                  <Typography variant="h4">{exams.filter(e => e.status === 'completed').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Exam Schedule & Results</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Subject</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Marks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {exams.map((exam) => (
                      <TableRow key={exam.id}>
                        <TableCell>{exam.subject}</TableCell>
                        <TableCell>{exam.date}</TableCell>
                        <TableCell>{exam.time}</TableCell>
                        <TableCell>{exam.duration}</TableCell>
                        <TableCell>
                          <Chip 
                            label={exam.status} 
                            color={exam.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{exam.marks || 'N/A'}</TableCell>
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

export default StudentExams;