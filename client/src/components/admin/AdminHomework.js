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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Snackbar,
  Avatar
} from '@mui/material';
import {
  Assignment,
  CloudUpload,
  Announcement,
  Visibility,
  Add,
  Edit,
  Delete,
  Close,
  AttachFile,
  Download
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminHomework = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  const homeworkList = [
    {
      id: 1,
      title: 'Algebra Problem Set 5',
      subject: 'Mathematics',
      class: '10-A',
      teacher: 'Dr. Smith',
      assignedDate: '2024-01-15',
      dueDate: '2024-01-22',
      submissions: 28,
      totalStudents: 35,
      status: 'active'
    },
    {
      id: 2,
      title: 'Physics Lab Report',
      subject: 'Physics',
      class: '11-A',
      teacher: 'Prof. Johnson',
      assignedDate: '2024-01-14',
      dueDate: '2024-01-21',
      submissions: 25,
      totalStudents: 30,
      status: 'active'
    },
    {
      id: 3,
      title: 'Chemistry Equations',
      subject: 'Chemistry',
      class: '12-A',
      teacher: 'Dr. Brown',
      assignedDate: '2024-01-10',
      dueDate: '2024-01-18',
      submissions: 28,
      totalStudents: 28,
      status: 'completed'
    }
  ];

  const instituteMaterials = [
    {
      id: 1,
      title: 'Academic Calendar 2024',
      type: 'PDF',
      uploadDate: '2024-01-01',
      uploadedBy: 'Admin',
      size: '2.5 MB',
      downloads: 150
    },
    {
      id: 2,
      title: 'Student Handbook',
      type: 'PDF',
      uploadDate: '2024-01-05',
      uploadedBy: 'Principal',
      size: '5.2 MB',
      downloads: 89
    },
    {
      id: 3,
      title: 'Code of Conduct',
      type: 'DOC',
      uploadDate: '2024-01-08',
      uploadedBy: 'Admin',
      size: '1.8 MB',
      downloads: 67
    }
  ];

  const notices = [
    {
      id: 1,
      title: 'Mid-term Exam Schedule',
      content: 'The mid-term examinations will commence from February 15th, 2024.',
      postedBy: 'Academic Office',
      postedDate: '2024-01-16',
      priority: 'high',
      targetAudience: 'All Students'
    },
    {
      id: 2,
      title: 'Library Timings Update',
      content: 'Library will remain open till 8 PM from next week onwards.',
      postedBy: 'Librarian',
      postedDate: '2024-01-15',
      priority: 'medium',
      targetAudience: 'All Students'
    },
    {
      id: 3,
      title: 'Sports Day Registration',
      content: 'Registration for annual sports day is now open. Last date: January 25th.',
      postedBy: 'Sports Department',
      postedDate: '2024-01-14',
      priority: 'low',
      targetAudience: 'All Students'
    }
  ];

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `${dialogType} saved successfully`,
      severity: 'success'
    });
    setOpenDialog(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  const getFileIcon = (type) => {
    return type === 'PDF' ? '📄' : '📝';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Homework & Digital Classroom Control
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Active Homework</Typography>
                  <Typography variant="h4">{homeworkList.filter(h => h.status === 'active').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CloudUpload color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Institute Materials</Typography>
                  <Typography variant="h4">{instituteMaterials.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Announcement color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Active Notices</Typography>
                  <Typography variant="h4">{notices.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Download color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Downloads</Typography>
                  <Typography variant="h4">{instituteMaterials.reduce((sum, m) => sum + m.downloads, 0)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Monitor Homework" />
          <Tab label="Institute Materials" />
          <Tab label="Notice Posting" />
        </Tabs>
      </Paper>

      {/* Monitor Homework Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Homework Monitoring</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Teacher</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Submissions</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {homeworkList.map((homework) => (
                <TableRow key={homework.id}>
                  <TableCell>{homework.title}</TableCell>
                  <TableCell>{homework.subject}</TableCell>
                  <TableCell>{homework.class}</TableCell>
                  <TableCell>{homework.teacher}</TableCell>
                  <TableCell>{new Date(homework.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip 
                      label={`${homework.submissions}/${homework.totalStudents}`}
                      color={homework.submissions === homework.totalStudents ? 'success' : 'warning'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={homework.status.toUpperCase()}
                      color={homework.status === 'completed' ? 'success' : 'primary'}
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
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Institute Materials Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Institute Materials</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('material'); setOpenDialog(true); }}
          >
            Upload Material
          </Button>
        </Box>

        <Grid container spacing={3}>
          {instituteMaterials.map((material) => (
            <Grid item xs={12} md={6} lg={4} key={material.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h4" sx={{ mr: 2 }}>
                      {getFileIcon(material.type)}
                    </Typography>
                    <Box flexGrow={1}>
                      <Typography variant="h6">{material.title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {material.type} • {material.size}
                      </Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Uploaded by: {material.uploadedBy}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Date: {new Date(material.uploadDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2" color="primary">
                    Downloads: {material.downloads}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, pt: 0 }}>
                  <Button size="small" startIcon={<Download />} sx={{ mr: 1 }}>
                    Download
                  </Button>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Notice Posting Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Notice Board</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('notice'); setOpenDialog(true); }}
          >
            Post Notice
          </Button>
        </Box>

        <List>
          {notices.map((notice) => (
            <Paper key={notice.id} sx={{ mb: 2 }}>
              <ListItem>
                <Avatar sx={{ mr: 2 }}>
                  <Announcement />
                </Avatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{notice.title}</Typography>
                      <Chip
                        label={notice.priority.toUpperCase()}
                        color={getPriorityColor(notice.priority)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {notice.content}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                        Posted by: {notice.postedBy} | Date: {new Date(notice.postedDate).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Target: {notice.targetAudience}
                      </Typography>
                    </Box>
                  }
                />
                <Box>
                  <IconButton size="small" color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error">
                    <Delete />
                  </IconButton>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'material' ? 'Upload Material' : 'Post Notice'}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogType === 'material' && (
            <Box>
              <TextField label="Title" fullWidth margin="normal" />
              <TextField label="Description" multiline rows={3} fullWidth margin="normal" />
              <Button
                variant="outlined"
                component="label"
                startIcon={<AttachFile />}
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Choose File
                <input type="file" hidden />
              </Button>
            </Box>
          )}
          {dialogType === 'notice' && (
            <Box>
              <TextField label="Notice Title" fullWidth margin="normal" />
              <TextField label="Content" multiline rows={4} fullWidth margin="normal" />
              <TextField
                select
                label="Priority"
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </TextField>
              <TextField
                select
                label="Target Audience"
                fullWidth
                margin="normal"
                SelectProps={{ native: true }}
              >
                <option value="All Students">All Students</option>
                <option value="All Staff">All Staff</option>
                <option value="Parents">Parents</option>
                <option value="Everyone">Everyone</option>
              </TextField>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {dialogType === 'material' ? 'Upload' : 'Post'}
          </Button>
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

export default AdminHomework;