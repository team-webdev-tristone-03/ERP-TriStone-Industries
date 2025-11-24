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
  Alert,
  Tooltip,
  FormHelperText
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility,
  Search,
  Block,
  CheckCircle,
  EditNote
} from '@mui/icons-material';
import { adminService, academicService } from '../../services/authService';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [studentIdSearch, setStudentIdSearch] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAccessDialog, setOpenAccessDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessData, setAccessData] = useState({
    canViewAttendance: true,
    canViewMarks: true,
    canViewFees: true,
    canViewTimetable: true,
    canViewHostel: true,
    canViewTransport: true,
    canViewLibrary: true,
    canViewAssignments: true,
    canViewGrades: true,
    canSubmitAssignments: true,
    canDownloadDocuments: true,
    portalAccessEnabled: true
  });
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
    fetchClasses();
  }, [page]);

  // Fetch classes from backend
  const fetchClasses = async () => {
    try {
      setLoadingClasses(true);
      console.log('Fetching classes...');
      const response = await academicService.getClasses();
      console.log('✅ Raw API response received:', response.data);
      
      // Backend returns { success: true, data: [classArray] }
      let classesList = [];
      
      if (response.data?.success && Array.isArray(response.data?.data)) {
        classesList = response.data.data;
      } else if (Array.isArray(response.data?.data)) {
        classesList = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Fallback if response structure is different
        classesList = response.data;
      }
      
      console.log('✅ Classes extracted:', classesList);
      console.log('   Total classes found:', classesList.length);
      
      if (classesList.length > 0) {
        classesList.forEach(cls => {
          console.log(`   ✓ ${cls.name} (ID: ${cls._id}, Sections: ${cls.sections?.join(', ') || 'N/A'})`);
        });
      } else {
        console.log('   ⚠️ No classes found in database');
      }
      
      setClasses(classesList);
    } catch (err) {
      console.error('❌ Failed to fetch classes:', err.message);
      console.error('   Status:', err.response?.status);
      console.error('   Data:', err.response?.data);
      setClasses([]);
      setError('Failed to load classes');
    } finally {
      setLoadingClasses(false);
    }
  };

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

    // Validate class is selected
    if (!formData.studentData.class) {
      setError('Please select a Class');
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

  const handleEditStudent = (student) => {
    setSelectedStudent(student);
    // Populate form with existing student data
    setFormData({
      email: student.userId?.email || '',
      password: '', // Don't pre-fill password for security
      profile: {
        firstName: student.userId?.profile?.firstName || '',
        lastName: student.userId?.profile?.lastName || '',
        phone: student.userId?.profile?.phone || ''
      },
      studentData: {
        studentId: student.studentId || '',
        class: student.class || '',
        section: student.section || '',
        rollNumber: student.rollNumber || '',
        admissionDate: student.admissionDate ? new Date(student.admissionDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        academic: {
          course: student.academic?.course || '',
          department: student.academic?.department || '',
          year: student.academic?.year || '',
          semester: student.academic?.semester || ''
        },
        guardian: {
          name: student.guardian?.name || '',
          phone: student.guardian?.phone || '',
          email: student.guardian?.email || '',
          relation: student.guardian?.relation || ''
        }
      }
    });
    setOpenEditDialog(true);
  };

  const handleDeleteStudent = (student) => {
    setStudentToDelete(student);
    setOpenDeleteDialog(true);
  };

  const handleEditAccess = (student) => {
    setSelectedStudent(student);
    setAccessData({
      canViewAttendance: student.access?.canViewAttendance ?? true,
      canViewMarks: student.access?.canViewMarks ?? true,
      canViewFees: student.access?.canViewFees ?? true,
      canViewTimetable: student.access?.canViewTimetable ?? true,
      canViewHostel: student.access?.canViewHostel ?? true,
      canViewTransport: student.access?.canViewTransport ?? true,
      canViewLibrary: student.access?.canViewLibrary ?? true,
      canViewAssignments: student.access?.canViewAssignments ?? true,
      canViewGrades: student.access?.canViewGrades ?? true,
      canSubmitAssignments: student.access?.canSubmitAssignments ?? true,
      canDownloadDocuments: student.access?.canDownloadDocuments ?? true,
      portalAccessEnabled: student.access?.portalAccessEnabled ?? true
    });
    setOpenAccessDialog(true);
  };

  const handleSaveAccess = async () => {
    if (!selectedStudent) return;

    try {
      setIsSubmitting(true);
      await adminService.updateStudentAccess(selectedStudent._id, accessData);
      setOpenAccessDialog(false);
      setSelectedStudent(null);
      fetchStudents();
      setError('');
      alert('Student access permissions updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update access permissions';
      setError(msg);
      console.error('Update access error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAccessToggle = (field) => {
    setAccessData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    
    try {
      setIsSubmitting(true);
      await adminService.deleteStudent(studentToDelete._id);
      setOpenDeleteDialog(false);
      setStudentToDelete(null);
      fetchStudents();
      setError('');
      alert('Student deleted successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to delete student';
      setError(msg);
      console.error('Delete student error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async () => {
    if (!selectedStudent) return;

    // Basic validation
    if (!formData.profile.firstName || !formData.studentData.studentId) {
      setError('Please provide First Name and Student ID');
      return;
    }

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

    console.log('Updating student with payload:', sanitized);

    try {
      setIsSubmitting(true);
      const response = await adminService.updateStudent(selectedStudent._id, sanitized);
      console.log('Update student response:', response.data);
      setOpenEditDialog(false);
      setSelectedStudent(null);
      fetchStudents();
      setError('');
      alert(response.data?.message || 'Student updated successfully');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update student';
      setError(msg);
      console.error('Update student error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusToggle = async (studentId, currentStatus) => {
    try {
      setIsSubmitting(true);
      await adminService.updateUserStatus(studentId, !currentStatus);
      fetchStudents();
      setError('');
    } catch (err) {
      setError('Failed to update student status');
      console.error(err);
    } finally {
      setIsSubmitting(false);
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

  // Update fields inside studentData.guardian
  const handleGuardianChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      studentData: {
        ...prev.studentData,
        guardian: {
          ...prev.studentData.guardian,
          [field]: value
        }
      }
    }));
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
        <Box display="flex" gap={1}>
          <Button
            variant="outlined"
            size="small"
            onClick={fetchClasses}
            disabled={loadingClasses}
          >
            Refresh Classes
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setOpenDialog(true);
              fetchClasses(); // Fetch classes when opening dialog
            }}
          >
            Add Student
          </Button>
        </Box>
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
                  <Tooltip title="View Details">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleViewStudent(student)}
                    >
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton 
                      size="small" 
                      color="secondary"
                      onClick={() => handleEditStudent(student)}
                    >
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit Access">
                    <IconButton 
                      size="small" 
                      color="info"
                      onClick={() => handleEditAccess(student)}
                    >
                      <EditNote />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={student.userId?.isActive ? 'Block Student' : 'Activate Student'}>
                    <IconButton
                      size="small"
                      color={student.userId?.isActive ? 'error' : 'success'}
                      onClick={() => handleStatusToggle(student.userId._id, student.userId.isActive)}
                      disabled={isSubmitting}
                    >
                      {student.userId?.isActive ? <Block /> : <CheckCircle />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDeleteStudent(student)}
                      disabled={isSubmitting}
                    >
                      <Delete />
                    </IconButton>
                  </Tooltip>
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
              <FormControl fullWidth error={!formData.studentData.class && openDialog}>
                <InputLabel>Class *</InputLabel>
                <Select
                  value={formData.studentData.class}
                  onChange={(e) => handleInputChange('class', e.target.value, 'studentData')}
                  label="Class *"
                  disabled={loadingClasses}
                >
                  {loadingClasses ? (
                    <MenuItem disabled value="">
                      Loading classes...
                    </MenuItem>
                  ) : classes.length === 0 ? (
                    <MenuItem disabled value="">
                      No classes available
                    </MenuItem>
                  ) : (
                    classes.map((cls) => (
                      <MenuItem key={cls._id || cls.id} value={cls.name}>
                        {cls.name} {cls.sections && cls.sections.length > 0 ? `(${cls.sections.join(', ')})` : ''}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {classes.length === 0 && !loadingClasses && (
                  <FormHelperText error>
                    No classes available. Please create classes in Admin → Academic Management first.
                  </FormHelperText>
                )}
                {!formData.studentData.class && openDialog && classes.length > 0 && (
                  <FormHelperText error>
                    Please select a class
                  </FormHelperText>
                )}
              </FormControl>
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
            
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Guardian Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Name"
                fullWidth
                value={formData.studentData.guardian.name}
                onChange={(e) => handleGuardianChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Phone"
                fullWidth
                value={formData.studentData.guardian.phone}
                onChange={(e) => handleGuardianChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Email"
                fullWidth
                value={formData.studentData.guardian.email}
                onChange={(e) => handleGuardianChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Relation to Student"
                fullWidth
                value={formData.studentData.guardian.relation}
                onChange={(e) => handleGuardianChange('relation', e.target.value)}
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

      {/* Edit Student Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Student</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
                label="Password (Leave empty to keep current)"
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
              <FormControl fullWidth error={!formData.studentData.class && openEditDialog}>
                <InputLabel>Class *</InputLabel>
                <Select
                  value={formData.studentData.class}
                  onChange={(e) => handleInputChange('class', e.target.value, 'studentData')}
                  label="Class *"
                  disabled={loadingClasses || classes.length === 0}
                >
                  {classes.length === 0 ? (
                    <MenuItem disabled value="">
                      No classes created. Create classes in Admin &gt; Academic &gt; Classes
                    </MenuItem>
                  ) : (
                    classes.map((cls) => (
                      <MenuItem key={cls._id} value={cls.name}>
                        {cls.name}
                      </MenuItem>
                    ))
                  )}
                </Select>
                {classes.length === 0 && (
                  <FormHelperText>
                    No classes available. Please create classes first.
                  </FormHelperText>
                )}
              </FormControl>
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

            <Grid item xs={12}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
                Guardian Information
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Name"
                fullWidth
                value={formData.studentData.guardian.name}
                onChange={(e) => handleGuardianChange('name', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Phone"
                fullWidth
                value={formData.studentData.guardian.phone}
                onChange={(e) => handleGuardianChange('phone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Guardian Email"
                fullWidth
                value={formData.studentData.guardian.email}
                onChange={(e) => handleGuardianChange('email', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Relation to Student"
                fullWidth
                value={formData.studentData.guardian.relation}
                onChange={(e) => handleGuardianChange('relation', e.target.value)}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleUpdateStudent} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Student'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete student <strong>{studentToDelete?.userId?.profile?.firstName} {studentToDelete?.userId?.profile?.lastName}</strong> ({studentToDelete?.studentId})?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={confirmDeleteStudent} color="error" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Access Dialog */}
      <Dialog open={openAccessDialog} onClose={() => setOpenAccessDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Edit Student Access - {selectedStudent?.userId?.profile?.firstName} {selectedStudent?.userId?.profile?.lastName}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Module Access Permissions
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Portal Access</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('portalAccessEnabled')}
                    color={accessData.portalAccessEnabled ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Attendance</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewAttendance')}
                    color={accessData.canViewAttendance ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Marks</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewMarks')}
                    color={accessData.canViewMarks ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Grades</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewGrades')}
                    color={accessData.canViewGrades ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Timetable</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewTimetable')}
                    color={accessData.canViewTimetable ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">Submit Assignments</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canSubmitAssignments')}
                    color={accessData.canSubmitAssignments ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Assignments</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewAssignments')}
                    color={accessData.canViewAssignments ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Fees</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewFees')}
                    color={accessData.canViewFees ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Hostel</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewHostel')}
                    color={accessData.canViewHostel ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Transport</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewTransport')}
                    color={accessData.canViewTransport ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">View Library</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canViewLibrary')}
                    color={accessData.canViewLibrary ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                  <Typography variant="body2">Download Documents</Typography>
                  <IconButton
                    size="small"
                    onClick={() => handleAccessToggle('canDownloadDocuments')}
                    color={accessData.canDownloadDocuments ? 'success' : 'error'}
                  >
                    <EditNote />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAccessDialog(false)} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSaveAccess} variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Permissions'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminStudents;