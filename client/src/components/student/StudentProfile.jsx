import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  Divider,
  Chip
} from '@mui/material';
import { Person, School, People } from '@mui/icons-material';
import { studentService } from '../../services/authService';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await studentService.getProfile();
        setProfile(response.data);
      } catch (err) {
        setError('Failed to load profile data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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

  const { userId, academic, guardian } = profile || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Avatar
                sx={{ width: 100, height: 100, mx: 'auto', mb: 2 }}
                src={userId?.profile?.avatar}
              >
                <Person fontSize="large" />
              </Avatar>
              <Typography variant="h5" gutterBottom>
                {userId?.profile?.firstName} {userId?.profile?.lastName}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {profile?.studentId}
              </Typography>
              <Chip
                label={`${profile?.class} - ${profile?.section}`}
                color="primary"
                variant="outlined"
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Person sx={{ mr: 1 }} />
                    <Typography variant="h6">Personal Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {userId?.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {userId?.profile?.phone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Date of Birth
                      </Typography>
                      <Typography variant="body1">
                        {userId?.profile?.dateOfBirth 
                          ? new Date(userId.profile.dateOfBirth).toLocaleDateString()
                          : 'Not provided'
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Roll Number
                      </Typography>
                      <Typography variant="body1">
                        {profile?.rollNumber || 'Not assigned'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 1 }} />
                    <Typography variant="h6">Academic Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Course
                      </Typography>
                      <Typography variant="body1">
                        {academic?.course || 'Not assigned'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Department
                      </Typography>
                      <Typography variant="body1">
                        {academic?.department || 'Not assigned'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Academic Year
                      </Typography>
                      <Typography variant="body1">
                        {academic?.year || 'Not assigned'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Semester
                      </Typography>
                      <Typography variant="body1">
                        {academic?.semester || 'Not assigned'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <People sx={{ mr: 1 }} />
                    <Typography variant="h6">Guardian Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Name
                      </Typography>
                      <Typography variant="body1">
                        {guardian?.name || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Relation
                      </Typography>
                      <Typography variant="body1">
                        {guardian?.relation || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {guardian?.phone || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {guardian?.email || 'Not provided'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentProfile;