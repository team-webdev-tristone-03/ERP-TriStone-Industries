import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText } from '@mui/material';
import { LocalHospital, Healing, Medication } from '@mui/icons-material';

const StudentMedical = () => {
  const medicalInfo = {
    bloodGroup: 'O+',
    allergies: ['Peanuts', 'Dust'],
    emergencyContact: '+1234567890',
    lastCheckup: '2024-01-15'
  };

  const records = [
    { date: '2024-02-01', type: 'Consultation', doctor: 'Dr. Smith', diagnosis: 'Common Cold', prescription: 'Rest and fluids' },
    { date: '2024-01-15', type: 'Checkup', doctor: 'Dr. Johnson', diagnosis: 'Routine Checkup', prescription: 'All normal' }
  ];

  const vaccinations = [
    { vaccine: 'COVID-19', date: '2023-12-01', status: 'completed' },
    { vaccine: 'Flu Shot', date: '2023-11-15', status: 'completed' },
    { vaccine: 'Hepatitis B', date: '2024-03-01', status: 'scheduled' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Medical Records</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Blood Group</Typography>
                <Typography variant="h6">{medicalInfo.bloodGroup}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Allergies</Typography>
                <Box>
                  {medicalInfo.allergies.map((allergy, index) => (
                    <Chip key={index} label={allergy} size="small" color="warning" sx={{ mr: 1 }} />
                  ))}
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Emergency Contact</Typography>
                <Typography variant="body1">{medicalInfo.emergencyContact}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="textSecondary">Last Checkup</Typography>
                <Typography variant="body1">{medicalInfo.lastCheckup}</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Vaccination Status</Typography>
              <List>
                {vaccinations.map((vaccination, index) => (
                  <ListItem key={index}>
                    <ListItemText 
                      primary={vaccination.vaccine}
                      secondary={vaccination.date}
                    />
                    <Chip 
                      label={vaccination.status} 
                      color={vaccination.status === 'completed' ? 'success' : 'warning'}
                      size="small"
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
              <Typography variant="h6" gutterBottom>Medical History</Typography>
              <List>
                {records.map((record, index) => (
                  <ListItem key={index}>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">{record.type}</Typography>
                        <Typography variant="body2" color="textSecondary">{record.date}</Typography>
                      </Box>
                      <Typography variant="body2">Doctor: {record.doctor}</Typography>
                      <Typography variant="body2">Diagnosis: {record.diagnosis}</Typography>
                      <Typography variant="body2">Prescription: {record.prescription}</Typography>
                    </Box>
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

export default StudentMedical;