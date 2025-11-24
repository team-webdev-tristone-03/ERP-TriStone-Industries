import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  School,
  Class,
  Subject,
  CalendarToday,
  Schedule,
  Add,
  Edit,
  Delete,
  Close,
  Search
} from '@mui/icons-material';
import { adminService, academicService } from '../../services/authService';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminAcademic = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [formData, setFormData] = useState({
    className: '',
    sections: '',
    subjectName: '',
    subjectCode: '',
    selectedClass: '',
    teacher: '',
    day: '',
    time: ''
  });
  const [searchTerms, setSearchTerms] = useState({
    classes: '',
    subjects: '',
    timetable: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, staffRes, classesRes, subjectsRes, timetableRes] = await Promise.all([
        adminService.getStudents(1, 1000, ''),
        adminService.getStaff(1, 1000, ''),
        academicService.getClasses().catch(() => ({ data: { data: [] } })),
        academicService.getSubjects().catch(() => ({ data: { data: [] } })),
        academicService.getTimetable().catch(() => ({ data: { data: [] } }))
      ]);
      
      const studentsData = studentsRes.data?.data?.students || [];
      const staffData = staffRes.data?.data?.staff || [];
      const dbClasses = classesRes.data?.data || [];
      const dbSubjects = subjectsRes.data?.data || [];
      const dbTimetable = timetableRes.data?.data || [];
      
      setStudents(studentsData);
      setStaff(staffData);
      
      // Use DB data if available, otherwise generate from student/staff data
      if (dbClasses.length > 0) {
        setClasses(dbClasses.map(cls => ({
          id: cls._id,
          name: cls.name,
          sections: cls.sections,
          students: cls.students
        })));
      } else {
        // Generate classes from student data
        const classMap = {};
        studentsData.forEach(student => {
          const classKey = student.class;
          if (classKey) {
            if (!classMap[classKey]) {
              classMap[classKey] = { sections: new Set(), students: 0 };
            }
            classMap[classKey].sections.add(student.section);
            classMap[classKey].students++;
          }
        });
        
        const generatedClasses = Object.entries(classMap).map(([className, data]) => ({
          name: className,
          sections: Array.from(data.sections),
          students: data.students
        }));
        
        setClasses(generatedClasses);
      }
      
      if (dbSubjects.length > 0) {
        setSubjects(dbSubjects.map(subj => ({
          id: subj._id,
          name: subj.name,
          code: subj.code,
          class: subj.class,
          teacher: subj.teacher
        })));
      } else {
        setSubjects([]);
      }
      
      if (dbTimetable.length > 0) {
        setTimetable(dbTimetable.map(slot => ({
          id: slot._id,
          class: slot.class,
          subject: slot.subject,
          teacher: slot.teacher,
          day: slot.day,
          time: slot.time
        })));
      } else {
        setTimetable([]);
      }
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const academicYear = {
    current: '2024-2025',
    startDate: '2024-06-01',
    endDate: '2025-05-31',
    terms: [
      { name: 'Term 1', start: '2024-06-01', end: '2024-10-31' },
      { name: 'Term 2', start: '2024-11-01', end: '2025-03-31' },
      { name: 'Term 3', start: '2025-04-01', end: '2025-05-31' }
    ]
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (tab, value) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };

  // Filter functions
  const filteredClasses = classes.filter(cls => 
    cls.name.toLowerCase().includes(searchTerms.classes.toLowerCase()) ||
    cls.sections.some(section => section.toLowerCase().includes(searchTerms.classes.toLowerCase()))
  );

  const filteredSubjects = subjects.filter(subject => 
    subject.name.toLowerCase().includes(searchTerms.subjects.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerms.subjects.toLowerCase()) ||
    subject.class.toLowerCase().includes(searchTerms.subjects.toLowerCase()) ||
    subject.teacher.toLowerCase().includes(searchTerms.subjects.toLowerCase())
  );

  const filteredTimetable = timetable.filter(slot => 
    slot.class.toLowerCase().includes(searchTerms.timetable.toLowerCase()) ||
    slot.subject.toLowerCase().includes(searchTerms.timetable.toLowerCase()) ||
    slot.teacher.toLowerCase().includes(searchTerms.timetable.toLowerCase()) ||
    slot.day.toLowerCase().includes(searchTerms.timetable.toLowerCase())
  );

  const handleSave = async () => {
    try {
      if (dialogType === 'class') {
        const classData = {
          name: formData.className,
          sections: formData.sections.split(',').map(s => s.trim()).filter(s => s)
        };
        
        // Validate input
        if (!classData.name.trim()) {
          setSnackbar({
            open: true,
            message: 'Please enter a class name',
            severity: 'error'
          });
          return;
        }
        
        if (classData.sections.length === 0) {
          setSnackbar({
            open: true,
            message: 'Please enter at least one section',
            severity: 'error'
          });
          return;
        }
        
        if (formData.editingId) {
          await academicService.updateClass(formData.editingId, classData);
        } else {
          await academicService.createClass(classData);
        }
      } else if (dialogType === 'subject') {
        const subjectData = {
          name: formData.subjectName,
          code: formData.subjectCode,
          class: formData.selectedClass,
          teacher: formData.teacher
        };
        
        if (!subjectData.name.trim() || !subjectData.code.trim() || !subjectData.class || !subjectData.teacher) {
          setSnackbar({
            open: true,
            message: 'Please fill all required fields',
            severity: 'error'
          });
          return;
        }
        
        if (formData.editingId) {
          await academicService.updateSubject(formData.editingId, subjectData);
        } else {
          await academicService.createSubject(subjectData);
        }
      } else if (dialogType === 'timetable') {
        const timetableData = {
          class: formData.selectedClass,
          subject: formData.subjectName,
          teacher: formData.teacher,
          day: formData.day,
          time: formData.time
        };
        
        if (!timetableData.class || !timetableData.subject || !timetableData.teacher || !timetableData.day || !timetableData.time) {
          setSnackbar({
            open: true,
            message: 'Please fill all required fields',
            severity: 'error'
          });
          return;
        }
        
        if (formData.editingId) {
          await academicService.updateTimetableSlot(formData.editingId, timetableData);
        } else {
          await academicService.createTimetableSlot(timetableData);
        }
      }
      
      // Refresh data
      await fetchData();
      
      setSnackbar({
        open: true,
        message: `${dialogType.charAt(0).toUpperCase() + dialogType.slice(1)} saved successfully`,
        severity: 'success'
      });
      
      setOpenDialog(false);
      setFormData({
        className: '',
        sections: '',
        subjectName: '',
        subjectCode: '',
        selectedClass: '',
        teacher: '',
        day: '',
        time: '',
        editingId: null
      });
    } catch (error) {
      console.error('Save error:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || `Failed to save ${dialogType}`,
        severity: 'error'
      });
    }
  };

  const handleEdit = (type, item) => {
    setDialogType(type);
    if (type === 'class') {
      setFormData({
        ...formData,
        className: item.name,
        sections: item.sections.join(', '),
        editingId: item.id
      });
    } else if (type === 'subject') {
      setFormData({
        ...formData,
        subjectName: item.name,
        subjectCode: item.code,
        selectedClass: item.class,
        teacher: item.teacher,
        editingId: item.id
      });
    }
    setOpenDialog(true);
  };



  const handleDelete = async (type, id) => {
    try {
      if (type === 'class') {
        await academicService.deleteClass(id);
      } else if (type === 'subject') {
        await academicService.deleteSubject(id);
      } else if (type === 'timetable') {
        await academicService.deleteTimetableSlot(id);
      }
      
      // Refresh data
      await fetchData();
      
      setSnackbar({
        open: true,
        message: `${type} deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to delete ${type}`,
        severity: 'error'
      });
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Academic Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <School color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Classes</Typography>
                  <Typography variant="h4">{classes.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Subject color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Subjects</Typography>
                  <Typography variant="h4">{subjects.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Academic Year</Typography>
                  <Typography variant="h6">{academicYear.current}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Timetable Slots</Typography>
                  <Typography variant="h4">{timetable.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Classes & Sections" />
          <Tab label="Subjects" />
          <Tab label="Academic Year" />
          <Tab label="Timetable" />
        </Tabs>
      </Paper>

      {/* Classes & Sections Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Class Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('class'); setOpenDialog(true); }}
          >
            Add Class
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search classes by name or section..."
            value={searchTerms.classes}
            onChange={(e) => handleSearchChange('classes', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 300 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class Name</TableCell>
                <TableCell>Sections</TableCell>
                <TableCell>Total Students</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClasses.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell>{cls.name}</TableCell>
                  <TableCell>
                    {cls.sections.map((section) => (
                      <Chip key={section} label={section} size="small" sx={{ mr: 0.5 }} />
                    ))}
                  </TableCell>
                  <TableCell>{cls.students}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit('class', cls)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('class', cls.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredClasses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.classes ? `No classes found matching "${searchTerms.classes}"` : 'No classes found. Add students to generate classes automatically.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Subjects Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Subject Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('subject'); setOpenDialog(true); }}
          >
            Add Subject
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search subjects by name, code, class, or teacher..."
            value={searchTerms.subjects}
            onChange={(e) => handleSearchChange('subjects', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 400 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject Name</TableCell>
                <TableCell>Subject Code</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredSubjects.map((subject) => (
                <TableRow key={subject.id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.code}</TableCell>
                  <TableCell>{subject.class}</TableCell>
                  <TableCell>{subject.teacher}</TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => handleEdit('subject', subject)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('subject', subject.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSubjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.subjects ? `No subjects found matching "${searchTerms.subjects}"` : 'No subjects found. Add staff to generate subjects automatically.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Academic Year Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Current Academic Year</Typography>
                <Typography variant="h4" color="primary">{academicYear.current}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {new Date(academicYear.startDate).toLocaleDateString()} - {new Date(academicYear.endDate).toLocaleDateString()}
                </Typography>
                <Button 
                  variant="outlined" 
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setSnackbar({
                      open: true,
                      message: 'Academic year settings updated',
                      severity: 'success'
                    });
                  }}
                >
                  Edit Academic Year
                </Button>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>Terms</Typography>
                <List>
                  {academicYear.terms.map((term, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={term.name}
                        secondary={`${new Date(term.start).toLocaleDateString()} - ${new Date(term.end).toLocaleDateString()}`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Timetable Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Timetable Generator</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('timetable'); setOpenDialog(true); }}
          >
            Add Schedule
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search timetable by class, subject, teacher, or day..."
            value={searchTerms.timetable}
            onChange={(e) => handleSearchChange('timetable', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 400 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTimetable.map((slot) => (
                <TableRow key={slot.id}>
                  <TableCell>{slot.class}</TableCell>
                  <TableCell>{slot.subject}</TableCell>
                  <TableCell>{slot.teacher}</TableCell>
                  <TableCell>{slot.day}</TableCell>
                  <TableCell>{slot.time}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('timetable', slot.id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTimetable.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.timetable ? `No timetable entries found matching "${searchTerms.timetable}"` : 'No timetable entries found.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add {dialogType}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogType === 'class' && (
            <Box>
              <TextField 
                label="Class Name" 
                fullWidth 
                margin="normal"
                value={formData.className}
                onChange={(e) => handleInputChange('className', e.target.value)}
              />
              <TextField 
                label="Sections (comma separated)" 
                fullWidth 
                margin="normal" 
                placeholder="A, B, C"
                value={formData.sections}
                onChange={(e) => handleInputChange('sections', e.target.value)}
              />
            </Box>
          )}
          {dialogType === 'subject' && (
            <Box>
              <TextField 
                label="Subject Name" 
                fullWidth 
                margin="normal"
                value={formData.subjectName}
                onChange={(e) => handleInputChange('subjectName', e.target.value)}
              />
              <TextField 
                label="Subject Code" 
                fullWidth 
                margin="normal"
                value={formData.subjectCode}
                onChange={(e) => handleInputChange('subjectCode', e.target.value)}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.selectedClass}
                  onChange={(e) => handleInputChange('selectedClass', e.target.value)}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.name}>{cls.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                >
                  {staff.map((staffMember) => (
                    <MenuItem key={staffMember._id} value={`${staffMember.userId?.profile?.firstName} ${staffMember.userId?.profile?.lastName}`}>
                      {staffMember.userId?.profile?.firstName} {staffMember.userId?.profile?.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
          {dialogType === 'timetable' && (
            <Box>
              <FormControl fullWidth margin="normal">
                <InputLabel>Class</InputLabel>
                <Select
                  value={formData.selectedClass}
                  onChange={(e) => handleInputChange('selectedClass', e.target.value)}
                >
                  {classes.map((cls) => 
                    cls.sections.map(section => (
                      <MenuItem key={`${cls.id}-${section}`} value={`${cls.name}-${section}`}>
                        {cls.name}-{section}
                      </MenuItem>
                    ))
                  )}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Subject</InputLabel>
                <Select
                  value={formData.subjectName}
                  onChange={(e) => handleInputChange('subjectName', e.target.value)}
                >
                  {subjects.map((subject) => (
                    <MenuItem key={subject.id} value={subject.name}>{subject.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Teacher</InputLabel>
                <Select
                  value={formData.teacher}
                  onChange={(e) => handleInputChange('teacher', e.target.value)}
                >
                  {staff.map((staffMember) => (
                    <MenuItem key={staffMember._id} value={`${staffMember.userId?.profile?.firstName} ${staffMember.userId?.profile?.lastName}`}>
                      {staffMember.userId?.profile?.firstName} {staffMember.userId?.profile?.lastName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth margin="normal">
                <InputLabel>Day</InputLabel>
                <Select
                  value={formData.day}
                  onChange={(e) => handleInputChange('day', e.target.value)}
                >
                  <MenuItem value="Monday">Monday</MenuItem>
                  <MenuItem value="Tuesday">Tuesday</MenuItem>
                  <MenuItem value="Wednesday">Wednesday</MenuItem>
                  <MenuItem value="Thursday">Thursday</MenuItem>
                  <MenuItem value="Friday">Friday</MenuItem>
                </Select>
              </FormControl>
              <TextField 
                label="Time" 
                fullWidth 
                margin="normal" 
                placeholder="09:00-10:00"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminAcademic;