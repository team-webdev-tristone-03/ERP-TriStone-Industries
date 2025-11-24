import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Avatar,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  PlayCircleOutline,
  PictureAsPdf,
  Slideshow,
  Download,
  Visibility,
  Announcement,
  School,
  DateRange,
  Person,
  Close
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const StudentClassroom = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [openVideoDialog, setOpenVideoDialog] = useState(false);

  // Mock data - replace with API calls
  const studyMaterials = [
    {
      id: 1,
      title: 'Mathematics - Algebra Basics',
      subject: 'Mathematics',
      type: 'pdf',
      size: '2.5 MB',
      uploadDate: '2024-01-15',
      teacher: 'Dr. Smith',
      description: 'Introduction to algebraic expressions and equations'
    },
    {
      id: 2,
      title: 'Physics - Motion and Forces',
      subject: 'Physics',
      type: 'ppt',
      size: '5.2 MB',
      uploadDate: '2024-01-14',
      teacher: 'Prof. Johnson',
      description: 'Understanding Newton\'s laws of motion'
    },
    {
      id: 3,
      title: 'Chemistry - Periodic Table',
      subject: 'Chemistry',
      type: 'pdf',
      size: '3.1 MB',
      uploadDate: '2024-01-13',
      teacher: 'Dr. Brown',
      description: 'Elements and their properties'
    }
  ];

  const videoLectures = [
    {
      id: 1,
      title: 'Introduction to Calculus',
      subject: 'Mathematics',
      duration: '45:30',
      teacher: 'Dr. Smith',
      uploadDate: '2024-01-15',
      thumbnail: '/api/placeholder/300/200',
      description: 'Basic concepts of differential calculus',
      views: 156
    },
    {
      id: 2,
      title: 'Organic Chemistry Fundamentals',
      subject: 'Chemistry',
      duration: '38:15',
      teacher: 'Dr. Brown',
      uploadDate: '2024-01-14',
      thumbnail: '/api/placeholder/300/200',
      description: 'Introduction to organic compounds',
      views: 89
    },
    {
      id: 3,
      title: 'World War II History',
      subject: 'History',
      duration: '52:20',
      teacher: 'Prof. Wilson',
      uploadDate: '2024-01-13',
      thumbnail: '/api/placeholder/300/200',
      description: 'Major events and consequences',
      views: 203
    }
  ];

  const announcements = [
    {
      id: 1,
      title: 'Mid-term Exam Schedule Released',
      content: 'The mid-term examination schedule has been published. Please check your timetable for exam dates and venues.',
      date: '2024-01-16',
      teacher: 'Academic Office',
      priority: 'high',
      subject: 'General'
    },
    {
      id: 2,
      title: 'New Study Materials Available',
      content: 'New study materials for Physics Chapter 5 have been uploaded to the digital classroom.',
      date: '2024-01-15',
      teacher: 'Prof. Johnson',
      priority: 'medium',
      subject: 'Physics'
    },
    {
      id: 3,
      title: 'Assignment Submission Reminder',
      content: 'Mathematics assignment is due tomorrow. Please submit your work before 5 PM.',
      date: '2024-01-14',
      teacher: 'Dr. Smith',
      priority: 'high',
      subject: 'Mathematics'
    }
  ];

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
    setOpenVideoDialog(true);
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <PictureAsPdf color="error" />;
      case 'ppt':
        return <Slideshow color="warning" />;
      default:
        return <School />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Digital Classroom
      </Typography>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="Study Materials" />
          <Tab label="Video Lectures" />
          <Tab label="Announcements" />
        </Tabs>
      </Paper>

      {/* Study Materials Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {studyMaterials.map((material) => (
            <Grid item xs={12} md={6} lg={4} key={material.id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    {getFileIcon(material.type)}
                    <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                      {material.title}
                    </Typography>
                  </Box>
                  <Chip 
                    label={material.subject} 
                    size="small" 
                    color="primary" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {material.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                      By {material.teacher}
                    </Typography>
                    <Typography variant="caption">
                      {material.size}
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" startIcon={<Visibility />}>
                    View
                  </Button>
                  <Button size="small" startIcon={<Download />}>
                    Download
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Video Lectures Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          {videoLectures.map((video) => (
            <Grid item xs={12} md={6} lg={4} key={video.id}>
              <Card>
                <Box 
                  sx={{ 
                    height: 200, 
                    bgcolor: 'grey.200', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleVideoPlay(video)}
                >
                  <PlayCircleOutline sx={{ fontSize: 60, color: 'primary.main' }} />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      bottom: 8, 
                      right: 8, 
                      bgcolor: 'rgba(0,0,0,0.7)', 
                      color: 'white', 
                      px: 1, 
                      borderRadius: 1 
                    }}
                  >
                    <Typography variant="caption">{video.duration}</Typography>
                  </Box>
                </Box>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {video.title}
                  </Typography>
                  <Chip 
                    label={video.subject} 
                    size="small" 
                    color="secondary" 
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2" color="textSecondary" paragraph>
                    {video.description}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="caption">
                      By {video.teacher}
                    </Typography>
                    <Typography variant="caption">
                      {video.views} views
                    </Typography>
                  </Box>
                  <Typography variant="caption" color="textSecondary">
                    {new Date(video.uploadDate).toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Announcements Tab */}
      <TabPanel value={tabValue} index={2}>
        <List>
          {announcements.map((announcement) => (
            <Paper key={announcement.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemIcon>
                  <Announcement color={getPriorityColor(announcement.priority)} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{announcement.title}</Typography>
                      <Chip 
                        label={announcement.priority.toUpperCase()} 
                        size="small" 
                        color={getPriorityColor(announcement.priority)}
                      />
                      <Chip 
                        label={announcement.subject} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                        {announcement.content}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <Person fontSize="small" />
                          <Typography variant="caption">{announcement.teacher}</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <DateRange fontSize="small" />
                          <Typography variant="caption">
                            {new Date(announcement.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Video Player Dialog */}
      <Dialog 
        open={openVideoDialog} 
        onClose={() => setOpenVideoDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              {selectedVideo?.title}
            </Typography>
            <IconButton onClick={() => setOpenVideoDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box 
            sx={{ 
              height: 400, 
              bgcolor: 'black', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              mb: 2
            }}
          >
            <Typography color="white">
              Video Player Placeholder - {selectedVideo?.title}
            </Typography>
          </Box>
          <Typography variant="body2" color="textSecondary">
            {selectedVideo?.description}
          </Typography>
          <Box display="flex" gap={2} mt={2}>
            <Chip label={selectedVideo?.subject} color="primary" />
            <Chip label={`Duration: ${selectedVideo?.duration}`} variant="outlined" />
            <Chip label={`${selectedVideo?.views} views`} variant="outlined" />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default StudentClassroom;