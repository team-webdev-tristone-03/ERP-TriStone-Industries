import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Grid,
  Chip
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const StudentLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password, 'student');
    
    if (result.success) {
      navigate('/student/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const useDemoCredentials = () => {
    setFormData({
      email: 'student_demo@erp.com',
      password: 'student123'
    });
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <School sx={{ mr: 1, fontSize: 40, color: 'primary.main' }} />
            <Typography component="h1" variant="h4">
              Student Portal
            </Typography>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Chip 
              label="Demo: student_demo@erp.com / student123" 
              color="info" 
              variant="outlined"
              onClick={useDemoCredentials}
              sx={{ cursor: 'pointer', mb: 1 }}
            />
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link to="/forgot-password" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Forgot password?
                  </Typography>
                </Link>
              </Grid>
              <Grid item>
                <Link to="/staff/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Staff Login
                  </Typography>
                </Link>
              </Grid>
            </Grid>
            <Grid container sx={{ mt: 2 }}>
              <Grid item xs={6}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    ← Back to Home
                  </Typography>
                </Link>
              </Grid>
              <Grid item xs={6} sx={{ textAlign: 'right' }}>
                <Link to="/admin/login" style={{ textDecoration: 'none' }}>
                  <Typography variant="body2" color="primary">
                    Admin Login
                  </Typography>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default StudentLogin;