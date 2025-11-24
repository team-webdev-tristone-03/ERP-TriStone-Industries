import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  Rating,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import {
  Feedback,
  Star,
  RateReview,
  Search,
  Person,
  CalendarToday,
  Visibility,
  Close
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminFeedback = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Mock feedback data
  const feedbackData = [
    {
      id: 1,
      student: {
        name: 'John Doe',
        studentId: 'STU001',
        class: '10-A',
        email: 'john.doe@student.com'
      },
      category: 'Teaching Quality',
      subject: 'Mathematics',
      teacher: 'Dr. Smith',
      rating: 5,
      feedback: 'Excellent teaching methods. Dr. Smith explains complex concepts very clearly and makes mathematics interesting.',
      date: '2024-01-15',
      status: 'reviewed'
    },
    {
      id: 2,
      student: {
        name: 'Jane Smith',
        studentId: 'STU002',
        class: '10-B',
        email: 'jane.smith@student.com'
      },
      category: 'Infrastructure',
      subject: 'General',
      teacher: 'N/A',
      rating: 3,
      feedback: 'The library needs more books and better seating arrangements. Also, the WiFi connection is often slow.',
      date: '2024-01-14',
      status: 'pending'
    },
    {
      id: 3,
      student: {
        name: 'Mike Johnson',
        studentId: 'STU003',
        class: '11-A',
        email: 'mike.johnson@student.com'
      },
      category: 'Food Service',
      subject: 'Cafeteria',
      teacher: 'N/A',
      rating: 4,
      feedback: 'Food quality is good but variety could be improved. Prices are reasonable for students.',
      date: '2024-01-13',
      status: 'reviewed'
    },
    {
      id: 4,
      student: {
        name: 'Sarah Wilson',
        studentId: 'STU004',
        class: '12-A',
        email: 'sarah.wilson@student.com'
      },
      category: 'Teaching Quality',
      subject: 'Physics',
      teacher: 'Prof. Johnson',
      rating: 5,
      feedback: 'Prof. Johnson makes physics experiments very engaging. The lab sessions are well organized.',
      date: '2024-01-12',
      status: 'reviewed'
    },
    {
      id: 5,
      student: {
        name: 'David Brown',
        studentId: 'STU005',
        class: '9-C',
        email: 'david.brown@student.com'
      },
      category: 'Administration',
      subject: 'General',
      teacher: 'N/A',
      rating: 2,
      feedback: 'The admission process was confusing and took too long. Staff could be more helpful.',
      date: '2024-01-11',
      status: 'pending'
    }
  ];

  const getStatusColor = (status) => {
    return status === 'reviewed' ? 'success' : 'warning';
  };

  const getRatingColor = (rating) => {
    if (rating >= 4) return 'success';
    if (rating >= 3) return 'warning';
    return 'error';
  };

  const filteredFeedback = feedbackData.filter(feedback =>
    feedback.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feedback.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingFeedback = filteredFeedback.filter(f => f.status === 'pending');
  const reviewedFeedback = filteredFeedback.filter(f => f.status === 'reviewed');

  const handleViewFeedback = (feedback) => {
    setSelectedFeedback(feedback);
    setOpenDialog(true);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Student Feedback Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Feedback color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Feedback</Typography>
                  <Typography variant="h4">{feedbackData.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Star color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Avg Rating</Typography>
                  <Typography variant="h4">
                    {(feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length).toFixed(1)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <RateReview color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Reviewed</Typography>
                  <Typography variant="h4">{reviewedFeedback.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <RateReview color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">{pendingFeedback.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search */}
      <TextField
        placeholder="Search feedback by student name, category, or subject..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          )
        }}
        sx={{ mb: 3, minWidth: 400 }}
      />

      {/* Tabs */}
      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label={`All Feedback (${filteredFeedback.length})`} />
          <Tab label={`Pending (${pendingFeedback.length})`} />
          <Tab label={`Reviewed (${reviewedFeedback.length})`} />
        </Tabs>
      </Paper>

      {/* All Feedback Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Subject/Teacher</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFeedback.map((feedback) => (
                <TableRow key={feedback.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>
                        {feedback.student.name.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {feedback.student.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {feedback.student.studentId} - {feedback.student.class}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{feedback.category}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{feedback.subject}</Typography>
                    {feedback.teacher !== 'N/A' && (
                      <Typography variant="caption" color="textSecondary">
                        {feedback.teacher}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Rating value={feedback.rating} readOnly size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        ({feedback.rating})
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{new Date(feedback.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={feedback.status.toUpperCase()}
                      color={getStatusColor(feedback.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleViewFeedback(feedback)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Pending Feedback Tab */}
      <TabPanel value={tabValue} index={1}>
        <List>
          {pendingFeedback.map((feedback) => (
            <Paper key={feedback.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{feedback.student.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{feedback.student.name}</Typography>
                      <Chip label={feedback.category} size="small" color="primary" />
                      <Rating value={feedback.rating} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.feedback}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {feedback.student.studentId} - {feedback.student.class} | {new Date(feedback.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton onClick={() => handleViewFeedback(feedback)}>
                  <Visibility />
                </IconButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Reviewed Feedback Tab */}
      <TabPanel value={tabValue} index={2}>
        <List>
          {reviewedFeedback.map((feedback) => (
            <Paper key={feedback.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{feedback.student.name.charAt(0)}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{feedback.student.name}</Typography>
                      <Chip label={feedback.category} size="small" color="success" />
                      <Rating value={feedback.rating} readOnly size="small" />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {feedback.feedback}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {feedback.student.studentId} - {feedback.student.class} | {new Date(feedback.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <IconButton onClick={() => handleViewFeedback(feedback)}>
                  <Visibility />
                </IconButton>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Feedback Detail Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Feedback Details
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedFeedback && (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Student Information</Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ mr: 2, width: 56, height: 56 }}>
                    {selectedFeedback.student.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{selectedFeedback.student.name}</Typography>
                    <Typography color="textSecondary">
                      {selectedFeedback.student.studentId} - Class {selectedFeedback.student.class}
                    </Typography>
                    <Typography color="textSecondary">
                      {selectedFeedback.student.email}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" gutterBottom>Feedback Details</Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                    <Typography>{selectedFeedback.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Subject</Typography>
                    <Typography>{selectedFeedback.subject}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Teacher</Typography>
                    <Typography>{selectedFeedback.teacher}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Rating</Typography>
                    <Box display="flex" alignItems="center">
                      <Rating value={selectedFeedback.rating} readOnly />
                      <Typography sx={{ ml: 1 }}>({selectedFeedback.rating}/5)</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">Feedback Content</Typography>
                    <Paper sx={{ p: 2, mt: 1, bgcolor: 'grey.50' }}>
                      <Typography>{selectedFeedback.feedback}</Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Date Submitted</Typography>
                    <Typography>{new Date(selectedFeedback.date).toLocaleDateString()}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="textSecondary">Status</Typography>
                    <Chip
                      label={selectedFeedback.status.toUpperCase()}
                      color={getStatusColor(selectedFeedback.status)}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
          {selectedFeedback?.status === 'pending' && (
            <Button variant="contained" color="primary">
              Mark as Reviewed
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminFeedback;