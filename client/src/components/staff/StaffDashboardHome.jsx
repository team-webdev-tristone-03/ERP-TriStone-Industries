import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
  Divider,
  LinearProgress,
  Button,
  IconButton
} from '@mui/material';
import {
  School,
  Approval,
  Assignment,
  People,
  Schedule,
  TrendingUp,
  CalendarToday,
  AccessTime,
  CheckCircle,
  Chat,
  MoreVert
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { staffService } from '../../services/authService';

const StatCard = ({ title, value, icon, color = 'primary', onClick, subtitle }) => (
  <Card 
    sx={{ 
      cursor: onClick ? 'pointer' : 'default',
      height: '100%',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: 3
      }
    }} 
    onClick={onClick}
  >
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Box color={`${color}.main`}>
          {icon}
        </Box>
        <IconButton size="small">
          <MoreVert fontSize="small" />
        </IconButton>
      </Box>
      <Typography variant="h4" component="h2" fontWeight="bold" mb={0.5}>
        {value}
      </Typography>
      <Typography color="textSecondary" variant="body2" mb={1}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" color="success.main">
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const StaffDashboardHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Jane Smith's comprehensive data
  const janeSmithData = {
    staff: {
      staffId: 'STF001',
      userId: {
        profile: {
          firstName: 'Jane',
          lastName: 'Smith'
        }
      },
      department: 'Mathematics',
      designation: 'Subject Teacher',
      experience: 5,
      classes: [
        { class: '6th', section: 'B', subject: 'Mathematics', time: '09:00 AM', room: 'A101' },
        { class: '7th', section: 'B', subject: 'Mathematics', time: '11:00 AM', room: 'A102' },
        { class: '8th', section: 'B', subject: 'Mathematics', time: '02:00 PM', room: 'A103' }
      ]
    },
    stats: {
      todayClasses: 3,
      pendingApprovals: 2,
      totalStudents: 90,
      completedTasks: 8,
      attendanceRate: 94
    },
    todaySchedule: [
      { time: '09:00 AM', class: '6th-B', subject: 'Mathematics', room: 'A101', status: 'completed' },
      { time: '11:00 AM', class: '7th-B', subject: 'Mathematics', room: 'A102', status: 'ongoing' },
      { time: '02:00 PM', class: '8th-B', subject: 'Mathematics', room: 'A103', status: 'upcoming' }
    ],
    recentActivities: [
      { action: 'Graded assignments for 6th-B', time: '2 hours ago', type: 'grade' },
      { action: 'Updated lesson plan for Algebra', time: '4 hours ago', type: 'plan' },
      { action: 'Approved leave request', time: '1 day ago', type: 'approval' }
    ]
  };

  useEffect(() => {
    setDashboardData(janeSmithData);
    setLoading(false);
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

  const { staff, stats, todaySchedule, recentActivities } = dashboardData || {};

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Good morning, {staff?.userId?.profile?.firstName}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Today's Classes"
            value={stats?.todayClasses || 0}
            icon={<School fontSize="large" />}
            color="primary"
            onClick={() => navigate('/staff/timetable')}
            subtitle="+2 from yesterday"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Students"
            value={stats?.totalStudents || 0}
            icon={<People fontSize="large" />}
            color="info"
            onClick={() => navigate('/staff/classes')}
            subtitle="Across 3 classes"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pending Approvals"
            value={stats?.pendingApprovals || 0}
            icon={<Approval fontSize="large" />}
            color="warning"
            onClick={() => navigate('/staff/approvals')}
            subtitle="Requires attention"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Attendance Rate"
            value={`${stats?.attendanceRate || 0}%`}
            icon={<TrendingUp fontSize="large" />}
            color="success"
            subtitle="This week"
          />
        </Grid>

        {/* Today's Schedule */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Schedule color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Today's Schedule
                </Typography>
              </Box>
              <List>
                {todaySchedule?.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <Avatar 
                        sx={{ 
                          mr: 2, 
                          bgcolor: item.status === 'completed' ? 'success.main' : 
                                  item.status === 'ongoing' ? 'warning.main' : 'grey.300'
                        }}
                      >
                        {item.status === 'completed' ? <CheckCircle /> : 
                         item.status === 'ongoing' ? <AccessTime /> : <Schedule />}
                      </Avatar>
                      <ListItemText
                        primary={`${item.class} - ${item.subject}`}
                        secondary={`${item.time} • Room ${item.room}`}
                      />
                      <Chip 
                        label={item.status} 
                        size="small"
                        color={item.status === 'completed' ? 'success' : 
                               item.status === 'ongoing' ? 'warning' : 'default'}
                      />
                    </ListItem>
                    {index < todaySchedule.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<Assignment />}
                    onClick={() => navigate('/staff/assignments')}
                    sx={{ mb: 1 }}
                  >
                    Assignments
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<People />}
                    onClick={() => navigate('/staff/attendance')}
                    sx={{ mb: 1 }}
                  >
                    Attendance
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<School />}
                    onClick={() => navigate('/staff/marks')}
                    sx={{ mb: 1 }}
                  >
                    Grade Book
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button 
                    fullWidth 
                    variant="outlined" 
                    startIcon={<CalendarToday />}
                    onClick={() => navigate('/staff/timetable')}
                  >
                    Timetable
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Recent Activities
              </Typography>
              <List>
                {recentActivities?.map((activity, index) => (
                  <React.Fragment key={index}>
                    <ListItem>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {activity.type === 'grade' ? <Assignment /> : 
                         activity.type === 'plan' ? <Schedule /> : <Approval />}
                      </Avatar>
                      <ListItemText
                        primary={activity.action}
                        secondary={activity.time}
                      />
                    </ListItem>
                    {index < recentActivities.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Performance Overview */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={2}>
                Performance Overview
              </Typography>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Class Completion Rate
                </Typography>
                <LinearProgress variant="determinate" value={85} sx={{ mb: 1 }} />
                <Typography variant="caption">85% completed this week</Typography>
              </Box>
              <Box mb={2}>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Assignment Grading
                </Typography>
                <LinearProgress variant="determinate" value={92} color="success" sx={{ mb: 1 }} />
                <Typography variant="caption">92% assignments graded</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="textSecondary" mb={1}>
                  Student Engagement
                </Typography>
                <LinearProgress variant="determinate" value={78} color="warning" sx={{ mb: 1 }} />
                <Typography variant="caption">78% average participation</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Chat Button */}
      <Box
        position="fixed"
        bottom={24}
        right={24}
        zIndex={1000}
      >
        <IconButton 
          sx={{ 
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            '&:hover': {
              bgcolor: 'primary.dark'
            }
          }} 
          onClick={() => navigate('/staff/chat')}
        >
          <Chat />
        </IconButton>
      </Box>
    </Box>
  );
};

export default StaffDashboardHome;