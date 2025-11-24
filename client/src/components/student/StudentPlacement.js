import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText, Button } from '@mui/material';
import { Work, Business, TrendingUp } from '@mui/icons-material';

const StudentPlacement = () => {
  const opportunities = [
    { id: 1, company: 'Tech Corp', position: 'Software Developer', package: '8 LPA', deadline: '2024-02-25', applied: false },
    { id: 2, company: 'Data Systems', position: 'Data Analyst', package: '6 LPA', deadline: '2024-02-20', applied: true },
    { id: 3, company: 'Innovation Labs', position: 'UI/UX Designer', package: '7 LPA', deadline: '2024-02-18', applied: false }
  ];

  const applications = [
    { company: 'Data Systems', position: 'Data Analyst', status: 'interview', date: '2024-02-15' },
    { company: 'Future Tech', position: 'Developer', status: 'selected', date: '2024-02-10' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Placement Cell</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Work color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Available Jobs</Typography>
                  <Typography variant="h4">{opportunities.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Applications</Typography>
                  <Typography variant="h4">{applications.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Success Rate</Typography>
                  <Typography variant="h4">75%</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Job Opportunities</Typography>
              <List>
                {opportunities.map((job) => (
                  <ListItem key={job.id} secondaryAction={
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={job.applied}
                    >
                      {job.applied ? 'Applied' : 'Apply'}
                    </Button>
                  }>
                    <ListItemText 
                      primary={`${job.position} at ${job.company}`}
                      secondary={`Package: ${job.package} | Deadline: ${job.deadline}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>My Applications</Typography>
              <List>
                {applications.map((app, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={`${app.position} at ${app.company}`}
                      secondary={`Applied: ${app.date}`}
                    />
                    <Chip 
                      label={app.status} 
                      color={app.status === 'selected' ? 'success' : 'primary'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentPlacement;