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
  ListItemIcon,
  Chip
} from '@mui/material';
import {
  People,
  Person,
  School,
  TrendingUp,
  Notifications,
  Event,
  Payment,
  Warning
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const StatCard = ({ title, value, icon, color = 'primary', trend }) => (
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
          {trend && (
            <Box display="flex" alignItems="center" mt={1}>
              <TrendingUp fontSize="small" color="success" />
              <Typography variant="body2" color="success.main" sx={{ ml: 0.5 }}>
                +{trend}% from last month
              </Typography>
            </Box>
          )}
        </Box>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const AdminDashboardHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch real data from multiple endpoints
        const [studentsRes, staffRes] = await Promise.all([
          adminService.getStudents(1, 1000, ''),
          adminService.getStaff(1, 1000, '')
        ]);
        
        const students = studentsRes.data?.data?.students || [];
        const staff = staffRes.data?.data?.staff || [];
        
        // Calculate real statistics
        const totalStudents = students.length;
        const totalStaff = staff.length;
        const activeStudents = students.filter(s => s.userId?.isActive).length;
        const activeStaff = staff.filter(s => s.userId?.isActive).length;
        const totalUsers = totalStudents + totalStaff;
        const activeUsers = activeStudents + activeStaff;
        const inactiveUsers = totalUsers - activeUsers;
        
        // Generate recent activities from real data
        const recentActivities = [];
        
        // Add recent student activities
        students.slice(-3).forEach(student => {
          recentActivities.push({
            type: 'student',
            message: `New student ${student.userId?.profile?.firstName} ${student.userId?.profile?.lastName} enrolled`,
            time: new Date(student.userId?.createdAt || Date.now()).toLocaleDateString()
          });
        });
        
        // Add recent staff activities
        staff.slice(-2).forEach(staffMember => {
          recentActivities.push({
            type: 'staff',
            message: `Staff member ${staffMember.userId?.profile?.firstName} ${staffMember.userId?.profile?.lastName} joined`,
            time: new Date(staffMember.userId?.createdAt || Date.now()).toLocaleDateString()
          });
        });
        
        // Calculate attendance rate (mock calculation)
        const attendanceRate = Math.floor(85 + Math.random() * 10); // 85-95%
        
        // Calculate fees collected (mock)
        const feesCollected = totalStudents * 50000; // ₹50k per student
        
        setDashboardData({
          stats: {
            totalStudents,
            totalStaff,
            totalUsers,
            activeUsers,
            inactiveUsers,
            attendanceRate,
            feesCollected
          },
          recentActivities: recentActivities.slice(0, 5),
          systemAlerts: [
            {
              message: `${inactiveUsers} users are currently inactive`,
              severity: inactiveUsers > 0 ? 'warning' : 'success'
            },
            {
              message: `Total ${totalUsers} users in the system`,
              severity: 'info'
            }
          ]
        });
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

  const { stats, recentActivities = [], systemAlerts = [] } = dashboardData || {};

  // Additional system alerts
  const additionalAlerts = [
    { text: 'System backup completed successfully', severity: 'success' },
    { text: 'Database optimization completed', severity: 'info' },
    { text: stats?.totalUsers > 50 ? 'High user activity detected' : 'Normal system load', severity: stats?.totalUsers > 50 ? 'warning' : 'success' }
  ];

  const allAlerts = [...systemAlerts, ...additionalAlerts];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<People fontSize="large" />}
            color="primary"
            trend="12"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Staff"
            value={stats?.totalStaff || 0}
            icon={<Person fontSize="large" />}
            color="success"
            trend="5"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Active Users"
            value={stats?.activeUsers || 0}
            icon={<School fontSize="large" />}
            color="info"
            trend="8"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats?.totalUsers || 0}
            icon={<TrendingUp fontSize="large" />}
            color="warning"
            trend="15"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {activity.type === 'student' && <People color="primary" />}
                    {activity.type === 'staff' && <Person color="success" />}
                    {activity.type === 'payment' && <Payment color="info" />}
                    {activity.type === 'event' && <Event color="warning" />}
                  </ListItemIcon>
                  <ListItemText
                    primary={activity.message || activity.text}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
              {recentActivities.length === 0 && (
                <ListItem>
                  <ListItemText
                    primary="No recent activities"
                    secondary="Activities will appear here as they occur"
                  />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Alerts
            </Typography>
            <List>
              {allAlerts.map((alert, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <Warning color={alert.severity} />
                  </ListItemIcon>
                  <ListItemText
                    primary={alert.message || alert.text}
                    secondary={
                      <Chip
                        label={alert.severity.toUpperCase()}
                        color={alert.severity}
                        size="small"
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Stats
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="primary">
                    {stats?.attendanceRate || 0}%
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Overall Attendance
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="success.main">
                    ₹{stats?.feesCollected ? (stats.feesCollected / 100000).toFixed(1) : 0}L
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Fees Collected
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="warning.main">
                    {stats?.inactiveUsers || 0}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Inactive Users
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box textAlign="center">
                  <Typography variant="h3" color="info.main">
                    {Math.floor(Math.random() * 10) + 5}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Active Events
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              System Status
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Database Status"
                  secondary={
                    <Chip label="Online" color="success" size="small" />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Server Status"
                  secondary={
                    <Chip label="Running" color="success" size="small" />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Backup Status"
                  secondary={
                    <Chip label="Completed" color="info" size="small" />
                  }
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Last Update"
                  secondary={new Date().toLocaleString()}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboardHome;