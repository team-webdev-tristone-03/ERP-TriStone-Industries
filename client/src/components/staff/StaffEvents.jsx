import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, List, ListItem, ListItemText, Chip } from '@mui/material';
import { Event, Add, CalendarToday } from '@mui/icons-material';

const StaffEvents = () => {
  const events = [
    { id: 1, title: 'Parent-Teacher Meeting', date: '2024-02-20', time: '10:00 AM', type: 'Meeting', status: 'upcoming' },
    { id: 2, title: 'Science Exhibition', date: '2024-02-25', time: '9:00 AM', type: 'Academic', status: 'upcoming' },
    { id: 3, title: 'Sports Day', date: '2024-02-15', time: '8:00 AM', type: 'Sports', status: 'completed' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Events</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Event color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Events</Typography>
                  <Typography variant="h4">{events.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Upcoming</Typography>
                  <Typography variant="h4">{events.filter(e => e.status === 'upcoming').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Button variant="contained" startIcon={<Add />} fullWidth>
                Create Event
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>All Events</Typography>
              <List>
                {events.map((event) => (
                  <ListItem key={event.id} secondaryAction={
                    <Chip 
                      label={event.status} 
                      color={event.status === 'completed' ? 'success' : 'primary'}
                      size="small"
                    />
                  }>
                    <ListItemText 
                      primary={event.title}
                      secondary={`${event.date} at ${event.time} | ${event.type}`}
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

export default StaffEvents;