import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import { Person, School, Schedule, Class } from '@mui/icons-material';
import axios from 'axios';

const StaffDetails = ({ staffId }) => {
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStaffDetails();
  }, [staffId]);

  const fetchStaffDetails = async () => {
    try {
      const response = await axios.get(`/api/staff/${staffId}/details`);
      setStaffData(response.data.data);
    } catch (error) {
      setError('Failed to fetch staff details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Staff Details
      </Typography>

      <Grid container spacing={3}>
        {/* Personal Details */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Personal Information</Typography>
              </Box>
              <Typography variant="body1"><strong>Name:</strong> {staffData.name}</Typography>
              <Typography variant="body1"><strong>Staff ID:</strong> {staffData.staffId}</Typography>
              <Typography variant="body1"><strong>Department:</strong> {staffData.department}</Typography>
              <Typography variant="body1"><strong>Role:</strong> {staffData.designation}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Subjects & Classes */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <School sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Teaching Details</Typography>
              </Box>
              
              <Typography variant="subtitle2" gutterBottom>Subjects Handled:</Typography>
              <Box mb={2}>
                {staffData.subjects?.map((subject, index) => (
                  <Chip key={index} label={subject} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>

              <Typography variant="subtitle2" gutterBottom>Classes Handled:</Typography>
              <Box>
                {staffData.classes?.map((classInfo, index) => (
                  <Chip 
                    key={index} 
                    label={`${classInfo.class}-${classInfo.section} (${classInfo.subject})`}
                    variant="outlined"
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Timetable */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Weekly Timetable</Typography>
              </Box>

              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Day</strong></TableCell>
                      <TableCell><strong>Schedule</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {days.map((day) => (
                      <TableRow key={day}>
                        <TableCell>
                          <Typography variant="subtitle2">{day}</Typography>
                        </TableCell>
                        <TableCell>
                          {staffData.timetable[day] ? (
                            <Box>
                              {staffData.timetable[day].map((slot, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                  <Chip
                                    size="small"
                                    label={`${slot.time} - ${slot.subject} (${slot.class})`}
                                    sx={{ mr: 1 }}
                                  />
                                </Box>
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No classes scheduled
                            </Typography>
                          )}
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

export default StaffDetails;