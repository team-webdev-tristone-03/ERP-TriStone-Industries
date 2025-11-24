import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  LinearProgress,
  Divider,
  Avatar,
  Paper,
  IconButton,
  Tabs,
  Tab
} from '@mui/material';
import {
  Assignment,
  Schedule,
  Upload,
  CheckCircle,
  Warning,
  Error,
  Feedback,
  AttachFile,
  Download,
  Visibility,
  Close,
  Person,
  CalendarToday
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const StudentHomework = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadText, setUploadText] = useState('');

  // Mock homework data
  const homeworkList = [
    {
      id: 1,
      title: 'Algebra Problem Set 5',
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      assignedDate: '2024-01-10',
      dueDate: '2024-01-20',
      description: 'Solve problems 1-15 from Chapter 5. Show all working steps.',
      status: 'pending',
      maxMarks: 20,
      attachments: ['algebra_problems.pdf'],
      submission: null,
      feedback: null
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      teacher: 'Prof. Johnson',
      assignedDate: '2024-01-08',
      dueDate: '2024-01-18',
      description: 'Write a detailed report on the pendulum experiment conducted in class.',
      status: 'submitted',
      maxMarks: 25,
      attachments: ['lab_guidelines.pdf'],
      submission: {
        submittedDate: '2024-01-17',
        files: ['physics_report.docx'],
        text: 'Please find my lab report attached.'
      },
      feedback: {
        marks: 22,
        comments: 'Good analysis but could improve on conclusion section.',
        feedbackDate: '2024-01-19'
      }
    },
    {
      id: 3,
      title: 'Essay on World War II',
      subject: 'History',
      teacher: 'Prof. Wilson',
      assignedDate: '2024-01-12',
      dueDate: '2024-01-16',
      description: 'Write a 1000-word essay on the causes and effects of World War II.',
      status: 'overdue',
      maxMarks: 30,
      attachments: [],
      submission: null,
      feedback: null
    },
    {
      id: 4,
      title: 'Chemical Equations Practice',
      subject: 'Chemistry',
      teacher: 'Dr. Brown',
      assignedDate: '2024-01-14',
      dueDate: '2024-01-25',
      description: 'Balance the chemical equations provided in the worksheet.',
      status: 'pending',
      maxMarks: 15,
      attachments: ['equations_worksheet.pdf'],
      submission: null,
      feedback: null
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted':
        return 'success';
      case 'overdue':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle />;
      case 'overdue':
        return <Error />;
      case 'pending':
        return <Warning />;
      default:
        return <Assignment />;
    }
  };

  const getDaysUntilDue = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleUploadClick = (homework) => {
    setSelectedHomework(homework);
    setOpenUploadDialog(true);
  };

  const handleFileUpload = (event) => {
    setUploadFile(event.target.files[0]);
  };

  const handleSubmitHomework = () => {
    // Mock submission logic
    console.log('Submitting homework:', {
      homeworkId: selectedHomework.id,
      file: uploadFile,
      text: uploadText
    });
    setOpenUploadDialog(false);
    setUploadFile(null);
    setUploadText('');
    // In real app, update homework status and refresh data
  };

  const pendingHomework = homeworkList.filter(hw => hw.status === 'pending' || hw.status === 'overdue');
  const submittedHomework = homeworkList.filter(hw => hw.status === 'submitted');

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Homework
      </Typography>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label={`Pending (${pendingHomework.length})`} />
          <Tab label={`Submitted (${submittedHomework.length})`} />
        </Tabs>
      </Paper>

      {/* Pending Homework Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {pendingHomework.map((homework) => {
            const daysLeft = getDaysUntilDue(homework.dueDate);
            return (
              <Grid item xs={12} md={6} key={homework.id}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                      <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        {homework.title}
                      </Typography>
                      <Chip
                        icon={getStatusIcon(homework.status)}
                        label={homework.status.toUpperCase()}
                        color={getStatusColor(homework.status)}
                        size="small"
                      />
                    </Box>

                    <Chip label={homework.subject} color="primary" size="small" sx={{ mb: 2 }} />

                    <Typography variant="body2" color="textSecondary" paragraph>
                      {homework.description}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Person fontSize="small" />
                      <Typography variant="caption">{homework.teacher}</Typography>
                    </Box>

                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <CalendarToday fontSize="small" />
                      <Typography variant="caption">
                        Due: {new Date(homework.dueDate).toLocaleDateString()}
                      </Typography>
                      {daysLeft >= 0 ? (
                        <Chip 
                          label={`${daysLeft} days left`} 
                          size="small" 
                          color={daysLeft <= 2 ? 'error' : 'info'}
                        />
                      ) : (
                        <Chip label={`${Math.abs(daysLeft)} days overdue`} size="small" color="error" />
                      )}
                    </Box>

                    <Typography variant="caption" color="textSecondary">
                      Max Marks: {homework.maxMarks}
                    </Typography>

                    {homework.attachments.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="caption" color="textSecondary">
                          Attachments:
                        </Typography>
                        {homework.attachments.map((file, index) => (
                          <Box key={index} display="flex" alignItems="center" gap={1}>
                            <AttachFile fontSize="small" />
                            <Typography variant="caption">{file}</Typography>
                            <IconButton size="small">
                              <Download fontSize="small" />
                            </IconButton>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      variant="contained" 
                      startIcon={<Upload />}
                      onClick={() => handleUploadClick(homework)}
                    >
                      Submit Answer
                    </Button>
                    <Button size="small" startIcon={<Visibility />}>
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      {/* Submitted Homework Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {submittedHomework.map((homework) => (
            <Grid item xs={12} md={6} key={homework.id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                      {homework.title}
                    </Typography>
                    <Chip
                      icon={<CheckCircle />}
                      label="SUBMITTED"
                      color="success"
                      size="small"
                    />
                  </Box>

                  <Chip label={homework.subject} color="primary" size="small" sx={{ mb: 2 }} />

                  <Typography variant="body2" color="textSecondary" paragraph>
                    {homework.description}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Person fontSize="small" />
                    <Typography variant="caption">{homework.teacher}</Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <CalendarToday fontSize="small" />
                    <Typography variant="caption">
                      Submitted: {new Date(homework.submission.submittedDate).toLocaleDateString()}
                    </Typography>
                  </Box>

                  {homework.feedback && (
                    <Paper sx={{ p: 2, mt: 2, bgcolor: 'grey.50' }}>
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Teacher Feedback
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="bold">
                          Marks: {homework.feedback.marks}/{homework.maxMarks}
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={(homework.feedback.marks / homework.maxMarks) * 100}
                          sx={{ width: 100 }}
                        />
                      </Box>
                      <Typography variant="body2" color="textSecondary">
                        {homework.feedback.comments}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Feedback Date: {new Date(homework.feedback.feedbackDate).toLocaleDateString()}
                      </Typography>
                    </Paper>
                  )}

                  {!homework.feedback && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Waiting for teacher feedback
                    </Alert>
                  )}
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Visibility />}>
                    View Submission
                  </Button>
                  {homework.feedback && (
                    <Button size="small" startIcon={<Feedback />}>
                      View Feedback
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Submit Homework: {selectedHomework?.title}
            <IconButton onClick={() => setOpenUploadDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Upload File (Optional)
            </Typography>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              fullWidth
              sx={{ mb: 2 }}
            >
              Choose File
              <input
                type="file"
                hidden
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
              />
            </Button>
            {uploadFile && (
              <Typography variant="body2" color="primary">
                Selected: {uploadFile.name}
              </Typography>
            )}

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
              Additional Comments
            </Typography>
            <TextField
              multiline
              rows={4}
              fullWidth
              placeholder="Add any comments or notes about your submission..."
              value={uploadText}
              onChange={(e) => setUploadText(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleSubmitHomework} 
            variant="contained"
            disabled={!uploadFile && !uploadText.trim()}
          >
            Submit Homework
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StudentHomework;