import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText } from '@mui/material';
import { Home, Person, Payment, Wifi } from '@mui/icons-material';

const StudentHostel = () => {
  const hostelInfo = {
    roomNumber: 'H-201',
    block: 'Block A',
    roommate: 'Alex Johnson',
    warden: 'Mrs. Sarah Wilson',
    fee: 8000,
    feeStatus: 'paid'
  };

  const facilities = ['WiFi', 'Laundry', 'Mess', 'Study Room', 'Recreation Room', 'Medical Room'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Hostel Information</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Room Details</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Room Number</Typography>
                <Typography variant="h6">{hostelInfo.roomNumber}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Block</Typography>
                <Typography variant="body1">{hostelInfo.block}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Roommate</Typography>
                <Typography variant="body1">{hostelInfo.roommate}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Warden</Typography>
                <Typography variant="body1">{hostelInfo.warden}</Typography>
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
                  <Typography variant="h4">₹{hostelInfo.fee}</Typography>
                  <Typography variant="body2">Monthly Fee</Typography>
                </Box>
              </Box>
              <Chip 
                label={hostelInfo.feeStatus === 'paid' ? 'Paid' : 'Pending'} 
                color={hostelInfo.feeStatus === 'paid' ? 'success' : 'error'}
              />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Facilities</Typography>
              <Grid container spacing={1}>
                {facilities.map((facility, index) => (
                  <Grid item key={index}>
                    <Chip label={facility} color="primary" variant="outlined" />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentHostel;