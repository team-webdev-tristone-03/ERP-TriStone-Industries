import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  LinearProgress,
  Paper,
  IconButton
} from '@mui/material';
import {
  ArrowForward,
  ArrowBack,
  CloudUpload,
  Visibility,
  VisibilityOff
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const AdminSignup = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  
  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const [formData, setFormData] = useState({
    // Organization Information
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    building: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    
    // Administrator Information
    adminFullName: '',
    adminEmail: '',
    adminPhone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const organizationTypes = [
    'School',
    'College',
    'Institute',
    'University',
    'Training Center',
    'Company',
    'Other'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Logo file size should be less than 5MB');
        return;
      }
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Organization validation
    if (!formData.organizationName.trim()) newErrors.organizationName = 'Organization name is required';
    if (!formData.organizationType) newErrors.organizationType = 'Organization type is required';
    if (!formData.contactEmail.trim()) newErrors.contactEmail = 'Contact email is required';
    if (!formData.contactPhone.trim()) newErrors.contactPhone = 'Contact phone is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';

    // Admin validation
    if (!formData.adminFullName.trim()) newErrors.adminFullName = 'Admin full name is required';
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required';
    if (!formData.adminPhone.trim()) newErrors.adminPhone = 'Admin phone is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    if (formData.adminEmail && !emailRegex.test(formData.adminEmail)) {
      newErrors.adminEmail = 'Invalid email format';
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone.replace(/\D/g, ''))) {
      newErrors.contactPhone = 'Phone number must be 10 digits';
    }
    if (formData.adminPhone && !phoneRegex.test(formData.adminPhone.replace(/\D/g, ''))) {
      newErrors.adminPhone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const signupData = new FormData();
      
      // Organization data
      signupData.append('organizationName', formData.organizationName);
      signupData.append('organizationType', formData.organizationType);
      signupData.append('registrationNumber', formData.registrationNumber);
      signupData.append('address', JSON.stringify({
        building: formData.building,
        street: formData.street,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }));
      signupData.append('contactEmail', formData.contactEmail);
      signupData.append('contactPhone', formData.contactPhone);
      signupData.append('website', formData.website);
      
      // Admin data
      signupData.append('adminFullName', formData.adminFullName);
      signupData.append('adminEmail', formData.adminEmail);
      signupData.append('adminPhone', formData.adminPhone);
      signupData.append('password', formData.password);
      
      // Logo file
      if (logoFile) {
        signupData.append('logo', logoFile);
      }

      await adminService.signup(signupData);
      
      navigate('/admin/login', { 
        state: { 
          message: 'Organization created successfully! Please login with your admin credentials.' 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create organization. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, textAlign: 'center' }}>
              Organization Information
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              Tell us about your organization to get started
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Organization Name"
                  value={formData.organizationName}
                  onChange={(e) => handleInputChange('organizationName', e.target.value)}
                  error={!!errors.organizationName}
                  helperText={errors.organizationName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.organizationType}>
                  <InputLabel>Organization Type</InputLabel>
                  <Select
                    value={formData.organizationType}
                    onChange={(e) => handleInputChange('organizationType', e.target.value)}
                    label="Organization Type"
                    sx={{ borderRadius: 2 }}
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
                  label="Registration/License Number"
                  value={formData.registrationNumber}
                  onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Building/Plot No."
                  value={formData.building}
                  onChange={(e) => handleInputChange('building', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Street Address"
                  value={formData.street}
                  onChange={(e) => handleInputChange('street', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  error={!!errors.city}
                  helperText={errors.city}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  error={!!errors.state}
                  helperText={errors.state}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Pincode"
                  value={formData.pincode}
                  onChange={(e) => handleInputChange('pincode', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  error={!!errors.contactEmail}
                  helperText={errors.contactEmail}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contact Phone"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  error={!!errors.contactPhone}
                  helperText={errors.contactPhone}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Website (Optional)"
                  value={formData.website}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ 
                  border: '2px dashed #e2e8f0', 
                  borderRadius: 2, 
                  p: 3, 
                  textAlign: 'center',
                  bgcolor: '#f8fafc'
                }}>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="logo-upload"
                    type="file"
                    onChange={handleLogoUpload}
                  />
                  <label htmlFor="logo-upload">
                    <Button
                      variant="outlined"
                      component="span"
                      startIcon={<CloudUpload />}
                      sx={{ borderRadius: 2 }}
                    >
                      Upload Logo (Optional)
                    </Button>
                  </label>
                  {logoPreview && (
                    <Box sx={{ mt: 2 }}>
                      <img src={logoPreview} alt="Logo Preview" style={{ maxHeight: 80, borderRadius: 8 }} />
                    </Box>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, textAlign: 'center' }}>
              Administrator Details
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              Create your admin account to manage the system
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Admin Full Name"
                  value={formData.adminFullName}
                  onChange={(e) => handleInputChange('adminFullName', e.target.value)}
                  error={!!errors.adminFullName}
                  helperText={errors.adminFullName}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admin Email"
                  type="email"
                  value={formData.adminEmail}
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  error={!!errors.adminEmail}
                  helperText={errors.adminEmail}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Admin Phone"
                  value={formData.adminPhone}
                  onChange={(e) => handleInputChange('adminPhone', e.target.value)}
                  error={!!errors.adminPhone}
                  helperText={errors.adminPhone}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={!!errors.password}
                  helperText={errors.password}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm Password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    )
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 3:
        return (
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#1e293b', mb: 1, textAlign: 'center' }}>
              Review & Confirm
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
              Please review your information before creating your organization
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Organization Details</Typography>
                  <Typography><strong>Name:</strong> {formData.organizationName}</Typography>
                  <Typography><strong>Type:</strong> {formData.organizationType}</Typography>
                  <Typography><strong>Email:</strong> {formData.contactEmail}</Typography>
                  <Typography><strong>Phone:</strong> {formData.contactPhone}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: '#f8fafc' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Administrator Details</Typography>
                  <Typography><strong>Name:</strong> {formData.adminFullName}</Typography>
                  <Typography><strong>Email:</strong> {formData.adminEmail}</Typography>
                  <Typography><strong>Phone:</strong> {formData.adminPhone}</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex',
      bgcolor: '#ffffff'
    }}>
      {/* Left Side - Form */}
      <Box sx={{ 
        flex: { xs: 1, md: 1 },
        maxWidth: { md: '50%' },
        display: 'flex', 
        flexDirection: 'column',
        p: { xs: 3, md: 6 },
        bgcolor: '#ffffff'
      }}>
        {/* Step Indicator */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Step {currentStep} of {totalSteps}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={progress} 
            sx={{ 
              height: 4, 
              borderRadius: 2,
              bgcolor: '#f1f5f9',
              '& .MuiLinearProgress-bar': {
                borderRadius: 2,
                background: 'linear-gradient(135deg, #3B86D1 0%, #844FC1 100%)'
              }
            }} 
          />
        </Box>

        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <IconButton 
            onClick={() => navigate('/')}
            sx={{ 
              p: 1,
              border: '1px solid #e2e8f0',
              borderRadius: 2,
              '&:hover': { bgcolor: '#f8fafc' }
            }}
          >
            <ArrowBack />
          </IconButton>
        </Box>

        {/* Form Card */}
        <Card sx={{ 
          flex: 1,
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          borderRadius: 3,
          border: '1px solid #f1f5f9'
        }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  startIcon={<ArrowBack />}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    visibility: currentStep === 1 ? 'hidden' : 'visible'
                  }}
                >
                  Previous
                </Button>
                
                {currentStep < totalSteps ? (
                  <Button
                    variant="contained"
                    onClick={nextStep}
                    endIcon={<ArrowForward />}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #3B86D1 0%, #844FC1 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E6BA8 0%, #6B3F9A 100%)'
                      }
                    }}
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      borderRadius: 2,
                      px: 3,
                      py: 1.5,
                      textTransform: 'none',
                      fontWeight: 600,
                      background: 'linear-gradient(135deg, #3B86D1 0%, #844FC1 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #2E6BA8 0%, #6B3F9A 100%)'
                      }
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : 'Create Organization'}
                  </Button>
                )}
              </Box>

              {currentStep === 1 && (
                <Box sx={{ textAlign: 'center', mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Button 
                      variant="text" 
                      onClick={() => navigate('/admin/login')}
                      sx={{ textTransform: 'none', fontWeight: 600, p: 0 }}
                    >
                      Sign In
                    </Button>
                  </Typography>
                </Box>
              )}
            </form>
          </CardContent>
        </Card>
      </Box>

      {/* Right Side - Image */}
      <Box sx={{ 
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, rgba(59, 134, 209, 0.8) 0%, rgba(132, 79, 193, 0.8) 100%), url("https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        p: 6
      }}>
        <Card sx={{
          maxWidth: 400,
          textAlign: 'center',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 3,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: '#1e293b' }}>
              Welcome to ERP System
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', lineHeight: 1.6 }}>
              Streamline your organization's operations with our comprehensive management platform. Join thousands of institutions already using our system.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default AdminSignup;