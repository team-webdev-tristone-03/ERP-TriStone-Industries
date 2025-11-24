import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, List, ListItem, ListItemText } from '@mui/material';
import { Assessment, Download, Visibility } from '@mui/icons-material';

const StaffReports = () => {
  const reports = [
    { name: 'Class Performance Report', description: 'Overall class performance analysis', type: 'Academic', date: '2024-02-15' },
    { name: 'Attendance Summary', description: 'Monthly attendance report', type: 'Attendance', date: '2024-02-10' },
    { name: 'Assignment Progress', description: 'Homework completion status', type: 'Homework', date: '2024-02-08' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Reports</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Available Reports</Typography>
                  <Typography variant="h4">{reports.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Generate Reports</Typography>
              <List>
                {reports.map((report, index) => (
                  <ListItem key={index} secondaryAction={
                    <Box>
                      <Button variant="outlined" size="small" startIcon={<Visibility />} sx={{ mr: 1 }}>
                        View
                      </Button>
                      <Button variant="contained" size="small" startIcon={<Download />}>
                        Download
                      </Button>
                    </Box>
                  }>
                    <ListItemText 
                      primary={report.name}
                      secondary={`${report.description} | ${report.type} | ${report.date}`}
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

export default StaffReports;