import React, { useState } from 'react';
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
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Grade,
  Schedule,
  Approval,
  Publish,
  Add,
  Edit,
  Visibility,
  Close,
  CheckCircle
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminExams = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  const examSchedule = [
    { id: 1, exam: 'Mid Term', subject: 'Mathematics', class: '10-A', date: '2024-02-15', time: '09:00-12:00', status: 'scheduled' },
    { id: 2, exam: 'Mid Term', subject: 'Physics', class: '11-A', date: '2024-02-16', time: '09:00-12:00', status: 'completed' },
    { id: 3, exam: 'Final Term', subject: 'Chemistry', class: '12-A', date: '2024-03-20', time: '09:00-12:00', status: 'scheduled' }
  ];

  const gradeSetup = [
    { grade: 'A+', minMarks: 90, maxMarks: 100, gpa: 4.0 },
    { grade: 'A', minMarks: 80, maxMarks: 89, gpa: 3.7 },
    { grade: 'B+', minMarks: 70, maxMarks: 79, gpa: 3.3 },
    { grade: 'B', minMarks: 60, maxMarks: 69, gpa: 3.0 },
    { grade: 'C', minMarks: 50, maxMarks: 59, gpa: 2.0 },
    { grade: 'F', minMarks: 0, maxMarks: 49, gpa: 0.0 }
  ];

  const staffMarks = [
    { id: 1, teacher: 'Dr. Smith', subject: 'Mathematics', class: '10-A', submitted: true, approved: false, students: 35 },
    { id: 2, teacher: 'Prof. Johnson', subject: 'Physics', class: '11-A', submitted: true, approved: true, students: 30 },
    { id: 3, teacher: 'Dr. Brown', subject: 'Chemistry', class: '12-A', submitted: false, approved: false, students: 28 }
  ];

  const results = [
    { id: 1, exam: 'Mid Term', class: '10-A', totalStudents: 35, published: true, publishDate: '2024-01-20' },
    { id: 2, exam: 'Mid Term', class: '11-A', totalStudents: 30, published: false, publishDate: null },
    { id: 3, exam: 'Final Term', class: '12-A', totalStudents: 28, published: false, publishDate: null }
  ];

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `${dialogType} saved successfully`,
      severity: 'success'
    });
    setOpenDialog(false);
  };

  const handleApproveMarks = (id) => {
    setSnackbar({
      open: true,
      message: 'Marks approved successfully',
      severity: 'success'
    });
  };

  const handlePublishResult = (id) => {
    setSnackbar({
      open: true,
      message: 'Results published successfully',
      severity: 'success'
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Exam & Marks Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Scheduled Exams</Typography>
                  <Typography variant="h4">{examSchedule.filter(e => e.status === 'scheduled').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Grade color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Grade Levels</Typography>
                  <Typography variant="h4">{gradeSetup.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Approval color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Pending Approvals</Typography>
                  <Typography variant="h4">{staffMarks.filter(m => m.submitted && !m.approved).length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Publish color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Published Results</Typography>
                  <Typography variant="h4">{results.filter(r => r.published).length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Exam Schedule" />
          <Tab label="Grade Setup" />
          <Tab label="Staff Marks Approval" />
          <Tab label="Publish Results" />
        </Tabs>
      </Paper>

      {/* Exam Schedule Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Exam Schedule</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('exam'); setOpenDialog(true); }}
          >
            Schedule Exam
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Exam</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {examSchedule.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.exam}</TableCell>
                  <TableCell>{exam.subject}</TableCell>
                  <TableCell>{exam.class}</TableCell>
                  <TableCell>{new Date(exam.date).toLocaleDateString()}</TableCell>
                  <TableCell>{exam.time}</TableCell>
                  <TableCell>
                    <Chip
                      label={exam.status.toUpperCase()}
                      color={exam.status === 'completed' ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Grade Setup Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Grade Configuration</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('grade'); setOpenDialog(true); }}
          >
            Add Grade
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Grade</TableCell>
                <TableCell>Min Marks</TableCell>
                <TableCell>Max Marks</TableCell>
                <TableCell>GPA</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gradeSetup.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Chip label={grade.grade} color="primary" />
                  </TableCell>
                  <TableCell>{grade.minMarks}</TableCell>
                  <TableCell>{grade.maxMarks}</TableCell>
                  <TableCell>{grade.gpa}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Staff Marks Approval Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Staff Marks Approval</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Teacher</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Students</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Approved</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffMarks.map((mark) => (
                <TableRow key={mark.id}>
                  <TableCell>{mark.teacher}</TableCell>
                  <TableCell>{mark.subject}</TableCell>
                  <TableCell>{mark.class}</TableCell>
                  <TableCell>{mark.students}</TableCell>
                  <TableCell>
                    <Chip
                      label={mark.submitted ? 'Yes' : 'No'}
                      color={mark.submitted ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={mark.approved ? 'Yes' : 'No'}
                      color={mark.approved ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {mark.submitted && !mark.approved && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircle />}
                        onClick={() => handleApproveMarks(mark.id)}
                      >
                        Approve
                      </Button>
                    )}
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Publish Results Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Publish Results</Typography>

        <List>
          {results.map((result) => (
            <Paper key={result.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary={`${result.exam} - ${result.class}`}
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Total Students: {result.totalStudents}
                      </Typography>
                      {result.published && (
                        <Typography variant="caption" color="success.main">
                          Published on: {new Date(result.publishDate).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  }
                />
                <Box>
                  {result.published ? (
                    <Chip label="Published" color="success" />
                  ) : (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<Publish />}
                      onClick={() => handlePublishResult(result.id)}
                    >
                      Publish
                    </Button>
                  )}
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'exam' ? 'Schedule Exam' : 'Add Grade'}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogType === 'exam' && (
            <Box>
              <TextField label="Exam Name" fullWidth margin="normal" />
              <TextField label="Subject" fullWidth margin="normal" />
              <TextField label="Class" fullWidth margin="normal" />
              <TextField label="Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField label="Start Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              <TextField label="End Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
            </Box>
          )}
          {dialogType === 'grade' && (
            <Box>
              <TextField label="Grade" fullWidth margin="normal" />
              <TextField label="Min Marks" type="number" fullWidth margin="normal" />
              <TextField label="Max Marks" type="number" fullWidth margin="normal" />
              <TextField label="GPA" type="number" step="0.1" fullWidth margin="normal" />
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

export default AdminExams;