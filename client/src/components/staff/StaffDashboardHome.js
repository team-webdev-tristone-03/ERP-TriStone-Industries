import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import {
  School,
  Approval,
  Assignment,
  People
} from '@mui/icons-material';
import { staffService } from '../../services/authService';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const StaffDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await staffService.getDashboard();
        setDashboardData(response.data);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
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

  const { staff, stats } = dashboardData || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {staff?.userId?.profile?.firstName || 'Staff'}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Classes"
            value={stats?.todayClasses || 0}
            icon={<School fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            icon={<Approval fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<People fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Assignments"
            value="12"
            icon={<Assignment fontSize="large" />}
            color="success"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Today's Classes
            </Typography>
            <List>
              {staff?.classes?.length > 0 ? (
                staff.classes.map((classItem, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={`${classItem.class} - ${classItem.section}`}
                      secondary={classItem.subject}
                    />
                    <Chip
                      label="Active"
                      color="success"
                      size="small"
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No classes assigned" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Staff Information
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Staff ID"
                  secondary={staff?.staffId || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Department"
                  secondary={staff?.department || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Designation"
                  secondary={staff?.designation || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Experience"
                  secondary={`${staff?.experience || 0} years`}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffDashboardHome;