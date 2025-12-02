import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import {
  School,
  Person,
  AdminPanelSettings,
  DarkMode,
  LightMode
} from '@mui/icons-material';
import { useTheme } from '../contexts/ThemeContext';

const HomePage = () => {
  const navigate = useNavigate();
  const { isDarkMode, toggleTheme } = useTheme();

  const loginOptions = [
    {
      title: 'Student Portal',
      description: 'Access your dashboard, marks, attendance, fees, and more',
      icon: <School sx={{ fontSize: 60, color: '#3B86D1' }} />,
      path: '/student/login',
      color: 'primary'
    },
    {
      title: 'Staff Portal',
      description: 'Manage classes, mark attendance, add grades, and track student progress',
      icon: <Person sx={{ fontSize: 60, color: '#38CE3C' }} />,
      path: '/staff/login',
      color: 'success'
    },
    {
      title: 'Admin Portal',
      description: 'Complete system management, user administration, and analytics',
      icon: <AdminPanelSettings sx={{ fontSize: 60, color: '#844FC1' }} />,
      path: '/admin/login',
      color: 'secondary'
    }
  ];

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ERP System
          </Typography>
          <IconButton
            color="inherit"
            onClick={toggleTheme}
          >
            {isDarkMode ? <LightMode /> : <DarkMode />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ py: 8 }}>
        {/* Header */}
        <Paper elevation={3} sx={{ p: 4, mb: 6, textAlign: 'center', background: 'linear-gradient(135deg, #3B86D1 0%, #844FC1 100%)' }}>
          <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
            ERP System
          </Typography>
          <Typography variant="h5" sx={{ color: 'white', opacity: 0.9 }}>
            Educational Resource Planning & Management System
          </Typography>
        </Paper>

        {/* Login Options */}
        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          Choose Your Portal
        </Typography>

        <Grid container spacing={4}>
          {loginOptions.map((option, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center', p: 4 }}>
                  <Box sx={{ mb: 3 }}>
                    {option.icon}
                  </Box>
                  
                  <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {option.title}
                  </Typography>
                  
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {option.description}
                  </Typography>
                  
                  <Button
                    variant="contained"
                    color={option.color}
                    size="large"
                    fullWidth
                    onClick={() => navigate(option.path)}
                    sx={{ 
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Login as {option.title.split(' ')[0]}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Demo Credentials */}
        <Paper elevation={2} sx={{ mt: 6, p: 3, backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom align="center">
            Demo Credentials
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="subtitle2" color="primary" fontWeight="bold">
                  Student Demo
                </Typography>
                <Typography variant="body2">
                  Email: student_demo@erp.com<br />
                  Password: student123
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="subtitle2" color="success.main" fontWeight="bold">
                  Staff Demo
                </Typography>
                <Typography variant="body2">
                  Email: staff_demo@erp.com<br />
                  Password: staff123
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box textAlign="center">
                <Typography variant="subtitle2" color="warning.main" fontWeight="bold">
                  Admin Demo
                </Typography>
                <Typography variant="body2">
                  Email: admin_demo@erp.com<br />
                  Password: admin123
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => navigate('/admin/signup')}
                  sx={{ mt: 1, textTransform: 'none' }}
                >
                  Create New Organization
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;