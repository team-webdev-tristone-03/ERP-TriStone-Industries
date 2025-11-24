import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Visibility,
  Search,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const AdminStaff = () => {
  const [staff, setStaff] = useState([]);
  const [allStaff, setAllStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [staffIdSearch, setStaffIdSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    staffData: {
      staffId: '',
      department: '',
      designation: '',
      joiningDate: new Date().toISOString().split('T')[0],
      qualification: '',
      experience: 0,
      subjects: [],
      salary: {
        basic: 0,
        allowances: 0,
        deductions: 0
      }
    }
  });

  useEffect(() => {
    fetchStaff();
  }, [page]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm || staffIdSearch) {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, staffIdSearch]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStaff(page, 10, '');
      const staffData = response.data?.data?.staff || [];
      setAllStaff(staffData);
      setStaff(staffData);
      setTotalPages(response.data?.data?.totalPages || 1);
    } catch (err) {
      setError('Failed to load staff');
      setStaff([]);
      setAllStaff([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter staff based on search terms
  const filteredStaff = useMemo(() => {
    let filtered = allStaff;
    
    // Filter by Staff ID if provided
    if (staffIdSearch.trim()) {
      const idTerm = staffIdSearch.toLowerCase();
      filtered = filtered.filter(staffMember => 
        staffMember.staffId?.toLowerCase().includes(idTerm)
      );
    }
    
    // Filter by general search term if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(staffMember => {
        const firstName = staffMember.userId?.profile?.firstName?.toLowerCase() || '';
        const lastName = staffMember.userId?.profile?.lastName?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const email = staffMember.userId?.email?.toLowerCase() || '';
        const department = staffMember.department?.toLowerCase() || '';
        const designation = staffMember.designation?.toLowerCase() || '';
        const qualification = staffMember.qualification?.toLowerCase() || '';
        
        return firstName.includes(term) ||
               lastName.includes(term) ||
               fullName.includes(term) ||
               email.includes(term) ||
               department.includes(term) ||
               designation.includes(term) ||
               qualification.includes(term);
      });
    }
    
    return filtered;
  }, [allStaff, searchTerm, staffIdSearch]);

  // Handle search input changes
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);
  
  const handleStaffIdSearchChange = useCallback((event) => {
    setStaffIdSearch(event.target.value);
  }, []);

  const handleCreateStaff = async () => {
    // Basic validation
    if (!formData.email || !formData.password || !formData.profile.firstName || !formData.staffData.staffId) {
      setError('Please provide Email, Password, First Name and Staff ID');
      return;
    }

    // Sanitize numeric fields before sending
    const sanitized = {
      ...formData,
      staffData: {
        ...formData.staffData,
        experience: formData.staffData.experience === '' ? undefined : Number(formData.staffData.experience) || 0,
        salary: {
          basic: Number(formData.staffData.salary.basic) || 0,
          allowances: Number(formData.staffData.salary.allowances) || 0,
          deductions: Number(formData.staffData.salary.deductions) || 0
        }
      }
    };

    console.log('Creating staff with payload:', sanitized);

    try {
      const response = await adminService.createStaff(sanitized);
      console.log('Create staff response:', response.data);
      setOpenDialog(false);
      resetForm();
      fetchStaff();
      setError('');
      alert(response.data?.message || 'Staff created successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create staff';
      setError(msg);
      console.error('Create staff error:', err.response || err);
    }
  };

  const handleStatusToggle = async (staffId, currentStatus) => {
    try {
      await adminService.updateUserStatus(staffId, !currentStatus);
      fetchStaff();
    } catch (err) {
      setError('Failed to update staff status');
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      profile: {
        firstName: '',
        lastName: '',
        phone: ''
      },
      staffData: {
        staffId: '',
        department: '',
        designation: '',
        joiningDate: new Date().toISOString().split('T')[0],
        qualification: '',
        experience: 0,
        subjects: [],
        salary: {
          basic: 0,
          allowances: 0,
          deductions: 0
        }
      }
    });
  };

  const handleInputChange = (field, value, nested = null) => {
    if (nested) {
      setFormData(prev => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Update salary fields inside staffData.salary
  const handleSalaryChange = (field, value) => {
    // allow empty string to let user clear input, otherwise convert to Number
    const parsed = value === '' ? '' : Number(String(value).replace(/[^0-9.]/g, ''));
    setFormData(prev => ({
      ...prev,
      staffData: {
        ...prev.staffData,
        salary: {
          ...prev.staffData.salary,
          [field]: parsed
        }
      }
    }));
  };

  if (loading && staff.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Staff Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Staff
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search by Staff ID..."
          value={staffIdSearch}
          onChange={handleStaffIdSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
          variant="outlined"
          size="small"
          label="Staff ID Search"
        />
        <TextField
          placeholder="Search by name, email, department, designation..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 300 }}
          variant="outlined"
          size="small"
          label="General Search"
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Staff ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Designation</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStaff.map((staffMember) => (
              <TableRow key={staffMember._id}>
                <TableCell>{staffMember.staffId}</TableCell>
                <TableCell>
                  {staffMember.userId?.profile?.firstName} {staffMember.userId?.profile?.lastName}
                </TableCell>
                <TableCell>{staffMember.userId?.email}</TableCell>
                <TableCell>{staffMember.department}</TableCell>
                <TableCell>{staffMember.designation}</TableCell>
                <TableCell>{staffMember.experience} years</TableCell>
                <TableCell>
                  <Chip
                    label={staffMember.userId?.isActive ? 'Active' : 'Inactive'}
                    color={staffMember.userId?.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" color="primary">
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={staffMember.userId?.isActive ? 'error' : 'success'}
                    onClick={() => handleStatusToggle(staffMember.userId._id, staffMember.userId.isActive)}
                  >
                    {staffMember.userId?.isActive ? <Block /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredStaff.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography color="textSecondary">
                    {(searchTerm || staffIdSearch) ? 
                      `No staff found matching the search criteria` : 
                      'No staff found'
                    }
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Add Staff Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Staff</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                fullWidth
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={formData.profile.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value, 'profile')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={formData.profile.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value, 'profile')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                fullWidth
                value={formData.profile.phone}
                onChange={(e) => handleInputChange('phone', e.target.value, 'profile')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Staff ID"
                fullWidth
                value={formData.staffData.staffId}
                onChange={(e) => handleInputChange('staffId', e.target.value, 'staffData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={formData.staffData.department}
                onChange={(e) => handleInputChange('department', e.target.value, 'staffData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Designation"
                fullWidth
                value={formData.staffData.designation}
                onChange={(e) => handleInputChange('designation', e.target.value, 'staffData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Qualification"
                fullWidth
                value={formData.staffData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value, 'staffData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Experience (years)"
                type="text"
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
                value={formData.staffData.experience ?? ''}
                onChange={(e) => handleInputChange('experience', e.target.value === '' ? '' : parseInt(e.target.value), 'staffData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Basic Salary"
                type="text"
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
                value={formData.staffData.salary.basic ?? ''}
                onChange={(e) => handleSalaryChange('basic', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Allowances"
                type="text"
                inputProps={{ inputMode: 'numeric' }}
                fullWidth
                value={formData.staffData.salary.allowances ?? ''}
                onChange={(e) => handleSalaryChange('allowances', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateStaff} variant="contained">
            Create Staff
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStaff;