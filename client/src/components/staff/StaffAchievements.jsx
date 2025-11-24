import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Button } from '@mui/material';
import { EmojiEvents, Star, TrendingUp } from '@mui/icons-material';

const StaffAchievements = () => {
  const achievements = [
    { student: 'John Doe', class: '10th A', achievement: 'Mathematics Olympiad - Gold', date: '2024-02-01', category: 'Academic' },
    { student: 'Jane Smith', class: '10th A', achievement: 'Science Fair - First Prize', date: '2024-01-28', category: 'Academic' },
    { student: 'Mike Johnson', class: '9th A', achievement: 'Basketball Championship', date: '2024-01-25', category: 'Sports' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Student Achievements</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <EmojiEvents color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Achievements</Typography>
                  <Typography variant="h4">{achievements.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Academic Awards</Typography>
                  <Typography variant="h4">{achievements.filter(a => a.category === 'Academic').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Sports Awards</Typography>
                  <Typography variant="h4">{achievements.filter(a => a.category === 'Sports').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Achievements</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Achievement</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Category</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {achievements.map((achievement, index) => (
                      <TableRow key={index}>
                        <TableCell>{achievement.student}</TableCell>
                        <TableCell>{achievement.class}</TableCell>
                        <TableCell>{achievement.achievement}</TableCell>
                        <TableCell>{achievement.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={achievement.category} 
                            color={achievement.category === 'Academic' ? 'primary' : 'success'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">
                            View Details
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

export default StaffAchievements;