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
  EventAvailable,
  Grade,
  Payment,
  Assignment
} from '@mui/icons-material';
import { studentService } from '../../services/authService';

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

const StudentDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await studentService.getDashboard();
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

  const { student, stats } = dashboardData || {};

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome back, {student?.userId?.profile?.firstName || 'Student'}!
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Attendance"
            value={stats?.todayAttendance || 0}
            icon={<EventAvailable fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Attendance"
            value={stats?.totalAttendance || 0}
            icon={<EventAvailable fontSize="large" />}
            color="info"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Fees"
            value={`₹${stats?.pendingFees || 0}`}
            icon={<Payment fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Recent Marks"
            value={stats?.recentMarks?.length || 0}
            icon={<Grade fontSize="large" />}
            color="primary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Marks
            </Typography>
            <List>
              {stats?.recentMarks?.length > 0 ? (
                stats.recentMarks.map((mark, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={mark.subject}
                      secondary={`${mark.marks}/${mark.maxMarks} - ${mark.examType}`}
                    />
                    <Chip
                      label={`${((mark.marks / mark.maxMarks) * 100).toFixed(1)}%`}
                      color={mark.marks / mark.maxMarks >= 0.6 ? 'success' : 'error'}
                      size="small"
                    />
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText primary="No recent marks available" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Info
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Student ID"
                  secondary={student?.studentId || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Class"
                  secondary={`${student?.class || 'N/A'} - ${student?.section || 'N/A'}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Course"
                  secondary={student?.academic?.course || 'N/A'}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Department"
                  secondary={student?.academic?.department || 'N/A'}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboardHome;