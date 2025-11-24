import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import { Psychology, TrendingUp, TrendingDown } from '@mui/icons-material';

const StaffBehaviour = () => {
  const behaviorRecords = [
    { student: 'John Doe', class: '10th A', behavior: 'Excellent participation', type: 'positive', date: '2024-02-15', points: 5 },
    { student: 'Jane Smith', class: '10th A', behavior: 'Disruptive in class', type: 'negative', date: '2024-02-14', points: -2 },
    { student: 'Mike Johnson', class: '9th A', behavior: 'Helped classmate', type: 'positive', date: '2024-02-13', points: 3 }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Behavior Tracking</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Psychology color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Records</Typography>
                  <Typography variant="h4">{behaviorRecords.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Positive</Typography>
                  <Typography variant="h4">{behaviorRecords.filter(r => r.type === 'positive').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Negative</Typography>
                  <Typography variant="h4">{behaviorRecords.filter(r => r.type === 'negative').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Behavior Records</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Behavior</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {behaviorRecords.map((record, index) => (
                      <TableRow key={index}>
                        <TableCell>{record.student}</TableCell>
                        <TableCell>{record.class}</TableCell>
                        <TableCell>{record.behavior}</TableCell>
                        <TableCell>
                          <Chip 
                            label={record.type} 
                            color={record.type === 'positive' ? 'success' : 'error'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{record.date}</TableCell>
                        <TableCell>{record.points}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">Edit</Button>
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

export default StaffBehaviour;