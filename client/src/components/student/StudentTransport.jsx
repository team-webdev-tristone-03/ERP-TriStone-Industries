import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText, Button } from '@mui/material';
import { DirectionsBus, LocationOn, Schedule, Payment } from '@mui/icons-material';

const StudentTransport = () => {
  const [transportInfo] = useState({
    busNumber: 'BUS-101',
    route: 'Route A - City Center',
    driverName: 'John Smith',
    driverPhone: '+1234567890',
    pickupTime: '7:30 AM',
    dropTime: '4:00 PM',
    fee: 1200,
    feeStatus: 'paid'
  });

  const [schedule] = useState([
    { stop: 'Main Gate', time: '7:30 AM', type: 'pickup' },
    { stop: 'City Center', time: '7:45 AM', type: 'pickup' },
    { stop: 'School', time: '8:00 AM', type: 'arrival' },
    { stop: 'School', time: '4:00 PM', type: 'departure' },
    { stop: 'City Center', time: '4:15 PM', type: 'drop' },
    { stop: 'Main Gate', time: '4:30 PM', type: 'drop' }
  ]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Transport</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Bus Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Bus Number</Typography>
                <Typography variant="h6">{transportInfo.busNumber}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Route</Typography>
                <Typography variant="body1">{transportInfo.route}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Driver</Typography>
                <Typography variant="body1">{transportInfo.driverName}</Typography>
                <Typography variant="body2">{transportInfo.driverPhone}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Fee Information</Typography>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Payment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h4">₹{transportInfo.fee}</Typography>
                  <Typography variant="body2">Monthly Fee</Typography>
                </Box>
              </Box>
              <Chip 
                label={transportInfo.feeStatus === 'paid' ? 'Paid' : 'Pending'} 
                color={transportInfo.feeStatus === 'paid' ? 'success' : 'error'}
              />
              {transportInfo.feeStatus === 'pending' && (
                <Button variant="contained" sx={{ mt: 2, display: 'block' }}>
                  Pay Now
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Daily Schedule</Typography>
              <List>
                {schedule.map((item, index) => (
                  <ListItem key={index}>
                    <LocationOn color="primary" sx={{ mr: 2 }} />
                    <ListItemText 
                      primary={item.stop}
                      secondary={`${item.time} - ${item.type}`}
                    />
                    <Chip 
                      label={item.type} 
                      size="small"
                      color={item.type === 'pickup' ? 'primary' : item.type === 'drop' ? 'secondary' : 'success'}
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

export default StudentTransport;