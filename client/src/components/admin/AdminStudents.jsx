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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Pagination,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Block,
  CheckCircle
} from '@mui/icons-material';
import { adminService } from '../../services/authService';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    profile: {
      firstName: '',
      lastName: '',
      phone: ''
    },
    studentData: {
      studentId: '',
      class: '',
      section: '',
      rollNumber: '',
      admissionDate: new Date().toISOString().split('T')[0],
      academic: {
        course: '',
        department: '',
        year: '',
        semester: ''
      },
      guardian: {
        name: '',
        phone: '',
        email: '',
        relation: ''
      }
    }
  });

  useEffect(() => {
    fetchStudents();
  }, [page]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm) {
        setPage(1);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStudents(page, 10, '');
      const studentsData = response.data?.data?.students || [];
      setAllStudents(studentsData);
      setStudents(studentsData);
      setTotalPages(response.data?.data?.totalPages || 1);
    } catch (err) {
      setError('Failed to load students');
      setStudents([]);
      setAllStudents([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter students based on search terms
  const filteredStudents = useMemo(() => {
    let filtered = allStudents;
    
    // Filter by Student ID if provided
    if (studentIdSearch.trim()) {
      const idTerm = studentIdSearch.toLowerCase();
      filtered = filtered.filter(student => 
        student.studentId?.toLowerCase().includes(idTerm)
      );
    }
    
    // Filter by general search term if provided
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(student => {
        const firstName = student.userId?.profile?.firstName?.toLowerCase() || '';
        const lastName = student.userId?.profile?.lastName?.toLowerCase() || '';
        const fullName = `${firstName} ${lastName}`.trim();
        const email = student.userId?.email?.toLowerCase() || '';
        const className = student.class?.toLowerCase() || '';
        const section = student.section?.toLowerCase() || '';
        const course = student.academic?.course?.toLowerCase() || '';
        
        return firstName.includes(term) ||
               lastName.includes(term) ||
               fullName.includes(term) ||
               email.includes(term) ||
               className.includes(term) ||
               section.includes(term) ||
               course.includes(term);
      });
    }
    
    return filtered;
  }, [allStudents, searchTerm, studentIdSearch]);

  // Handle search input changes
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);
  
  const handleStudentIdSearchChange = useCallback((event) => {
    setStudentIdSearch(event.target.value);
  }, []);

  const handleCreateStudent = async () => {
    // Basic validation
    if (!formData.email || !formData.password || !formData.profile.firstName || !formData.studentData.studentId) {
      setError('Please provide Email, Password, First Name and Student ID');
      return;
    }

    // Sanitize numeric fields before sending
    const sanitized = {
      ...formData,
      studentData: {
        ...formData.studentData,
        admissionDate: formData.studentData.admissionDate ? new Date(formData.studentData.admissionDate).toISOString() : new Date().toISOString(),
        academic: {
          ...formData.studentData.academic
        }
      }
    };

    console.log('Creating student with payload:', sanitized);

    try {
      const response = await adminService.createStudent(sanitized);
      console.log('Create student response:', response.data);
      setOpenDialog(false);
      resetForm();
      fetchStudents();
      setError('');
      alert(response.data?.message || 'Student created successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create student';
      setError(msg);
      console.error('Create student error response:', err.response?.data);
      console.error('Create student full error:', err);
    }
  };

  const handleViewStudent = (student) => {
    setSelectedStudent(student);
    setOpenDetailsDialog(true);
  };

  const handleStatusToggle = async (studentId, currentStatus) => {
    try {
      await adminService.updateUserStatus(studentId, !currentStatus);
      fetchStudents();
    } catch (err) {
      setError('Failed to update student status');
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
      studentData: {
        studentId: '',
        class: '',
        section: '',
        rollNumber: '',
        admissionDate: new Date().toISOString().split('T')[0],
        academic: {
          course: '',
          department: '',
          year: '',
          semester: ''
        },
        guardian: {
          name: '',
          phone: '',
          email: '',
          relation: ''
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

  // Update fields inside studentData.academic
  const handleAcademicChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      studentData: {
        ...prev.studentData,
        academic: {
          ...prev.studentData.academic,
          [field]: value
        }
      }
    }));
  };

  if (loading && students.length === 0) {
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
          Student Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpenDialog(true)}
        >
          Add Student
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <TextField
          placeholder="Search by Student ID..."
          value={studentIdSearch}
          onChange={handleStudentIdSearchChange}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 200 }}
          variant="outlined"
          size="small"
          label="Student ID Search"
        />
        <TextField
          placeholder="Search by name, email, class, or course..."
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
              <TableCell>Student ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student._id}>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>
                  {student.userId?.profile?.firstName} {student.userId?.profile?.lastName}
                </TableCell>
                <TableCell>{student.userId?.email}</TableCell>
                <TableCell>{student.class} - {student.section}</TableCell>
                <TableCell>{student.academic?.course}</TableCell>
                <TableCell>
                  <Chip
                    label={student.userId?.isActive ? 'Active' : 'Inactive'}
                    color={student.userId?.isActive ? 'success' : 'error'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleViewStudent(student)}
                  >
                    <Visibility />
                  </IconButton>
                  <IconButton size="small" color="secondary">
                    <Edit />
                  </IconButton>
                  <IconButton
                    size="small"
                    color={student.userId?.isActive ? 'error' : 'success'}
                    onClick={() => handleStatusToggle(student.userId._id, student.userId.isActive)}
                  >
                    {student.userId?.isActive ? <Block /> : <CheckCircle />}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredStudents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    {(searchTerm || studentIdSearch) ? 
                      `No students found matching the search criteria` : 
                      'No students found'
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

      {/* Add Student Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Student</DialogTitle>
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
                label="Student ID"
                fullWidth
                value={formData.studentData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value, 'studentData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Class"
                fullWidth
                value={formData.studentData.class}
                onChange={(e) => handleInputChange('class', e.target.value, 'studentData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Section"
                fullWidth
                value={formData.studentData.section}
                onChange={(e) => handleInputChange('section', e.target.value, 'studentData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Roll Number"
                fullWidth
                value={formData.studentData.rollNumber}
                onChange={(e) => handleInputChange('rollNumber', e.target.value, 'studentData')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course"
                fullWidth
                value={formData.studentData.academic.course}
                onChange={(e) => handleAcademicChange('course', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Department"
                fullWidth
                value={formData.studentData.academic.department}
                onChange={(e) => handleAcademicChange('department', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Year"
                fullWidth
                value={formData.studentData.academic.year}
                onChange={(e) => handleAcademicChange('year', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Semester"
                fullWidth
                value={formData.studentData.academic.semester}
                onChange={(e) => handleAcademicChange('semester', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateStudent} variant="contained">
            Create Student
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Student Details Dialog */}
      <Dialog open={openDetailsDialog} onClose={() => setOpenDetailsDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent>
          {selectedStudent && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                  Personal Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">First Name</Typography>
                <Typography>{selectedStudent.userId?.profile?.firstName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Last Name</Typography>
                <Typography>{selectedStudent.userId?.profile?.lastName}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Email</Typography>
                <Typography>{selectedStudent.userId?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                <Typography>{selectedStudent.userId?.profile?.phone}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
                  Academic Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Student ID</Typography>
                <Typography>{selectedStudent.studentId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Class</Typography>
                <Typography>{selectedStudent.class}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Section</Typography>
                <Typography>{selectedStudent.section}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Roll Number</Typography>
                <Typography>{selectedStudent.rollNumber}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Course</Typography>
                <Typography>{selectedStudent.academic?.course}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Department</Typography>
                <Typography>{selectedStudent.academic?.department}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Year</Typography>
                <Typography>{selectedStudent.academic?.year}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Semester</Typography>
                <Typography>{selectedStudent.academic?.semester}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
                  Guardian Information
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Guardian Name</Typography>
                <Typography>{selectedStudent.guardian?.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Guardian Phone</Typography>
                <Typography>{selectedStudent.guardian?.phone}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Guardian Email</Typography>
                <Typography>{selectedStudent.guardian?.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="textSecondary">Relation</Typography>
                <Typography>{selectedStudent.guardian?.relation}</Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 2, mb: 2, fontWeight: 'bold' }}>
                  Status
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="textSecondary">Account Status</Typography>
                <Chip
                  label={selectedStudent.userId?.isActive ? 'Active' : 'Inactive'}
                  color={selectedStudent.userId?.isActive ? 'success' : 'error'}
                  size="small"
                  sx={{ mt: 1 }}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDetailsDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudents;