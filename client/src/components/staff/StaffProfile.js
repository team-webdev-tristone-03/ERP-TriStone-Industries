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
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { Person, School, Work } from '@mui/icons-material';
import { staffService } from '../../services/authService';

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await staffService.getProfile();
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

  const { userId, subjects, classes, salary } = profile || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Staff Profile
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
                {profile?.staffId}
              </Typography>
              <Chip
                label={profile?.designation}
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
                        Department
                      </Typography>
                      <Typography variant="body1">
                        {profile?.department || 'Not assigned'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Joining Date
                      </Typography>
                      <Typography variant="body1">
                        {profile?.joiningDate 
                          ? new Date(profile.joiningDate).toLocaleDateString()
                          : 'Not provided'
                        }
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
                        Qualification
                      </Typography>
                      <Typography variant="body1">
                        {profile?.qualification || 'Not provided'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Experience
                      </Typography>
                      <Typography variant="body1">
                        {profile?.experience || 0} years
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        Subjects
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {subjects?.length > 0 ? (
                          subjects.map((subject, index) => (
                            <Chip
                              key={index}
                              label={subject}
                              color="secondary"
                              variant="outlined"
                              size="small"
                            />
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary">
                            No subjects assigned
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <School sx={{ mr: 1 }} />
                    <Typography variant="h6">Assigned Classes</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <List dense>
                    {classes?.length > 0 ? (
                      classes.map((classItem, index) => (
                        <ListItem key={index}>
                          <ListItemText
                            primary={`${classItem.class} - ${classItem.section}`}
                            secondary={classItem.subject}
                          />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="No classes assigned" />
                      </ListItem>
                    )}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Work sx={{ mr: 1 }} />
                    <Typography variant="h6">Salary Information</Typography>
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Basic Salary
                      </Typography>
                      <Typography variant="body1">
                        ₹{salary?.basic?.toLocaleString() || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Allowances
                      </Typography>
                      <Typography variant="body1">
                        ₹{salary?.allowances?.toLocaleString() || 0}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Deductions
                      </Typography>
                      <Typography variant="body1">
                        ₹{salary?.deductions?.toLocaleString() || 0}
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

export default StaffProfile;