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
  ListItemText,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Person, 
  School, 
  Work, 
  Email, 
  Phone, 
  CalendarToday, 
  LocationOn,
  Edit,
  Badge,
  AccountBalance
} from '@mui/icons-material';
import { staffService } from '../../services/authService';

const StaffProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);

  // Jane Smith's complete profile data
  const janeSmithProfile = {
    staffId: 'STF001',
    userId: {
      email: 'jane.smith@erp.com',
      profile: {
        firstName: 'Jane',
        lastName: 'Smith',
        phone: '0987654321',
        dateOfBirth: '1985-06-15',
        address: '123 Main Street, City, State 12345',
        avatar: '/images/jane-smith.jpg'
      }
    },
    department: 'Mathematics',
    designation: 'Subject Teacher',
    joiningDate: '2019-08-15',
    qualification: 'M.Sc Mathematics, B.Ed',
    experience: 5,
    subjects: ['Mathematics', 'Algebra', 'Geometry', 'Trigonometry'],
    classes: [
      { class: '6th', section: 'B', subject: 'Mathematics' },
      { class: '7th', section: 'B', subject: 'Mathematics' },
      { class: '8th', section: 'B', subject: 'Mathematics' }
    ],
    salary: {
      basic: 45000,
      allowances: 8000,
      deductions: 3000
    },
    emergencyContact: {
      name: 'John Smith',
      relationship: 'Spouse',
      phone: '0987654322'
    },
    bankDetails: {
      accountNumber: '****1234',
      bankName: 'State Bank',
      ifscCode: 'SBIN0001234'
    }
  };

  useEffect(() => {
    // Use Jane Smith's data directly
    setProfile(janeSmithProfile);
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

  const { userId, subjects, classes, salary, emergencyContact, bankDetails } = profile || {};

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Staff Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={() => setEditOpen(true)}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Header Card */}
        <Grid item xs={12}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={3}>
                <Avatar
                  sx={{ width: 120, height: 120 }}
                  src={userId?.profile?.avatar}
                >
                  <Person fontSize="large" />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {userId?.profile?.firstName} {userId?.profile?.lastName}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    {profile?.designation} - {profile?.department}
                  </Typography>
                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Chip icon={<Badge />} label={`ID: ${profile?.staffId}`} />
                    <Chip icon={<CalendarToday />} label={`${profile?.experience} years experience`} />
                    <Chip 
                      icon={<CalendarToday />} 
                      label={`Joined: ${new Date(profile?.joiningDate).toLocaleDateString()}`} 
                    />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Person color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Personal Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Email sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography variant="body1">{userId?.email}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Phone sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Phone</Typography>
                      <Typography variant="body1">{userId?.profile?.phone}</Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <CalendarToday sx={{ mr: 2, color: 'text.secondary' }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Date of Birth</Typography>
                      <Typography variant="body1">
                        {new Date(userId?.profile?.dateOfBirth).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Box display="flex" alignItems="flex-start" mb={2}>
                    <LocationOn sx={{ mr: 2, color: 'text.secondary', mt: 0.5 }} />
                    <Box>
                      <Typography variant="body2" color="textSecondary">Address</Typography>
                      <Typography variant="body1">{userId?.profile?.address}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Academic Information */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <School color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Academic Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Qualification
                  </Typography>
                  <Typography variant="body1" mb={2}>
                    {profile?.qualification}
                  </Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Subjects Teaching
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {subjects?.map((subject, index) => (
                      <Chip
                        key={index}
                        label={subject}
                        color="secondary"
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Classes Assigned
                  </Typography>
                  <List dense>
                    {classes?.map((classItem, index) => (
                      <ListItem key={index} sx={{ px: 0 }}>
                        <ListItemText
                          primary={`${classItem.class}-${classItem.section}`}
                          secondary={classItem.subject}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Emergency Contact */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Phone color="error" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Emergency Contact</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body2" color="textSecondary">Name</Typography>
              <Typography variant="body1" mb={2}>{emergencyContact?.name}</Typography>
              
              <Typography variant="body2" color="textSecondary">Relationship</Typography>
              <Typography variant="body1" mb={2}>{emergencyContact?.relationship}</Typography>
              
              <Typography variant="body2" color="textSecondary">Phone</Typography>
              <Typography variant="body1">{emergencyContact?.phone}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Salary Information */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Work color="success" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Salary Information</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body2" color="textSecondary">Basic Salary</Typography>
              <Typography variant="h6" color="success.main" mb={2}>
                ₹{salary?.basic?.toLocaleString()}
              </Typography>
              
              <Typography variant="body2" color="textSecondary">Allowances</Typography>
              <Typography variant="body1" mb={2}>₹{salary?.allowances?.toLocaleString()}</Typography>
              
              <Typography variant="body2" color="textSecondary">Deductions</Typography>
              <Typography variant="body1" mb={2}>₹{salary?.deductions?.toLocaleString()}</Typography>
              
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="textSecondary">Net Salary</Typography>
              <Typography variant="h6" color="primary">
                ₹{(salary?.basic + salary?.allowances - salary?.deductions)?.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Bank Details */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <AccountBalance color="info" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Bank Details</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />
              
              <Typography variant="body2" color="textSecondary">Account Number</Typography>
              <Typography variant="body1" mb={2}>{bankDetails?.accountNumber}</Typography>
              
              <Typography variant="body2" color="textSecondary">Bank Name</Typography>
              <Typography variant="body1" mb={2}>{bankDetails?.bankName}</Typography>
              
              <Typography variant="body2" color="textSecondary">IFSC Code</Typography>
              <Typography variant="body1">{bankDetails?.ifscCode}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Contact administrator to update profile information.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffProfile;