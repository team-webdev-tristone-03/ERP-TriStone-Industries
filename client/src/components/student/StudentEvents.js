import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText, Button } from '@mui/material';
import { Event, CalendarToday, LocationOn } from '@mui/icons-material';

const StudentEvents = () => {
  const events = [
    { id: 1, title: 'Annual Sports Day', date: '2024-02-20', time: '9:00 AM', location: 'Sports Ground', status: 'upcoming', registered: true },
    { id: 2, title: 'Science Exhibition', date: '2024-02-25', time: '10:00 AM', location: 'Main Hall', status: 'upcoming', registered: false },
    { id: 3, title: 'Cultural Fest', date: '2024-02-15', time: '6:00 PM', location: 'Auditorium', status: 'completed', registered: true }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Events & Activities</Typography>
      
      <Grid container spacing={3}>
        {events.map((event) => (
          <Grid item xs={12} md={6} key={event.id}>
            <Card>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                  <Typography variant="h6">{event.title}</Typography>
                  <Chip 
                    label={event.status} 
                    color={event.status === 'completed' ? 'success' : 'primary'}
                    size="small"
                  />
                </Box>
                
                <Box display="flex" alignItems="center" sx={{ mb: 1 }}>
                  <CalendarToday sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">{event.date} at {event.time}</Typography>
                </Box>
                
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <LocationOn sx={{ mr: 1, fontSize: 16 }} />
                  <Typography variant="body2">{event.location}</Typography>
                </Box>
                
                {event.status === 'upcoming' && (
                  <Button 
                    variant={event.registered ? "outlined" : "contained"} 
                    size="small"
                    disabled={event.registered}
                  >
                    {event.registered ? 'Registered' : 'Register'}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentEvents;