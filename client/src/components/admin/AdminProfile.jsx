import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Divider,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Business,
  Person,
  Email,
  Phone,
  LocationOn,
  Language,
  Edit,
  Save,
  Cancel
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const AdminProfile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [editData, setEditData] = useState({});

  const organizationTypes = [
    'School',
    'College',
    'Institute',
    'University',
    'Training Center',
    'Company',
    'Other'
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await adminService.getProfile();
      setProfileData(response.data);
      setEditData(response.data);
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditData({ ...profileData });
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditData({ ...profileData });
    setError('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await adminService.updateProfile(editData);
      setProfileData({ ...editData });
      setEditMode(false);
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setEditData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!profileData) {
    return (
      <Box>
        <Alert severity="error">No profile data available</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Organization Profile</Typography>
        {!editMode && (
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleEdit}
          >
            Edit Profile
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {/* Organization Information */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Business sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Organization Information
                </Typography>
              </Box>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Organization Name
                  </Typography>
                  <Typography variant="body1" fontWeight={500}>
                    {profileData.organization?.name || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Organization Type
                  </Typography>
                  <Chip 
                    label={profileData.organization?.type || 'N/A'} 
                    color="primary" 
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Registration Number
                  </Typography>
                  <Typography variant="body1">
                    {profileData.organization?.registrationNumber || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Email
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {profileData.organization?.contactEmail || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Contact Phone
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {profileData.organization?.contactPhone || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Website
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <Language sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                    <Typography variant="body1">
                      {profileData.organization?.website || 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Address
                  </Typography>
                  <Box display="flex" alignItems="flex-start">
                    <LocationOn sx={{ mr: 1, fontSize: 18, color: 'text.secondary', mt: 0.5 }} />
                    <Typography variant="body1">
                      {profileData.organization?.address ? (
                        <>
                          {profileData.organization.address.building && `${profileData.organization.address.building}, `}
                          {profileData.organization.address.street && `${profileData.organization.address.street}, `}
                          {profileData.organization.address.city && `${profileData.organization.address.city}, `}
                          {profileData.organization.address.state && `${profileData.organization.address.state} `}
                          {profileData.organization.address.pincode && `- ${profileData.organization.address.pincode}`}
                        </>
                      ) : 'N/A'}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Admin Information & Logo */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Person sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight={600}>
                  Administrator
                </Typography>
              </Box>

              <Box textAlign="center" mb={3}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem'
                  }}
                >
                  {profileData.admin?.fullName?.charAt(0) || 'A'}
                </Avatar>
                <Typography variant="h6" fontWeight={600}>
                  {profileData.admin?.fullName || 'Admin User'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Super Administrator
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Email
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {profileData.admin?.email || 'N/A'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Phone
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  {profileData.admin?.phone || 'N/A'}
                </Typography>

                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Created On
                </Typography>
                <Typography variant="body2">
                  {profileData.organization?.createdAt ? 
                    new Date(profileData.organization.createdAt).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Organization Logo */}
          {profileData.organization?.logo && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} mb={2}>
                  Organization Logo
                </Typography>
                <Box textAlign="center">
                  <img 
                    src={profileData.organization.logo} 
                    alt="Organization Logo"
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: 150, 
                      borderRadius: 8 
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={handleCancel} maxWidth="md" fullWidth>
        <DialogTitle>Edit Organization Profile</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Organization Name"
                value={editData.organization?.name || ''}
                onChange={(e) => handleInputChange('name', e.target.value, 'organization')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Organization Type</InputLabel>
                <Select
                  value={editData.organization?.type || ''}
                  onChange={(e) => handleInputChange('type', e.target.value, 'organization')}
                  label="Organization Type"
                >
                  {organizationTypes.map((type) => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Registration Number"
                value={editData.organization?.registrationNumber || ''}
                onChange={(e) => handleInputChange('registrationNumber', e.target.value, 'organization')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Email"
                value={editData.organization?.contactEmail || ''}
                onChange={(e) => handleInputChange('contactEmail', e.target.value, 'organization')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Contact Phone"
                value={editData.organization?.contactPhone || ''}
                onChange={(e) => handleInputChange('contactPhone', e.target.value, 'organization')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Website"
                value={editData.organization?.website || ''}
                onChange={(e) => handleInputChange('website', e.target.value, 'organization')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Building/Plot No."
                value={editData.organization?.address?.building || ''}
                onChange={(e) => handleInputChange('building', e.target.value, 'address')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                value={editData.organization?.address?.street || ''}
                onChange={(e) => handleInputChange('street', e.target.value, 'address')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="City"
                value={editData.organization?.address?.city || ''}
                onChange={(e) => handleInputChange('city', e.target.value, 'address')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="State"
                value={editData.organization?.address?.state || ''}
                onChange={(e) => handleInputChange('state', e.target.value, 'address')}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Pincode"
                value={editData.organization?.address?.pincode || ''}
                onChange={(e) => handleInputChange('pincode', e.target.value, 'address')}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            startIcon={<Save />}
            disabled={saving}
          >
            {saving ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProfile;