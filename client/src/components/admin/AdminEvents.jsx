import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
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
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  FormControlLabel,
  Switch
} from '@mui/material';
import {
  Event,
  Add,
  Edit,
  Delete,
  Close,
  Search,
  CalendarToday,
  LocationOn,
  Person
} from '@mui/icons-material';
import { eventService } from '../../services/authService';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventTime: '',
    venue: '',
    category: '',
    posterImage: '',
    registrationRequired: false,
    registrationLimit: '',
    contactPersonName: '',
    contactPersonPhone: '',
    contactPersonEmail: '',
    rules: '',
    instructions: ''
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventService.getEvents();
      setEvents(response.data?.data || []);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      // Validation
      if (!formData.title || !formData.description || !formData.eventDate || !formData.eventTime || !formData.venue || !formData.category) {
        setSnackbar({
          open: true,
          message: 'Please fill all required fields',
          severity: 'error'
        });
        return;
      }

      const eventData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        eventDate: formData.eventDate,
        eventTime: formData.eventTime,
        venue: formData.venue.trim(),
        category: formData.category,
        posterImage: formData.posterImage.trim(),
        registrationRequired: formData.registrationRequired,
        registrationLimit: formData.registrationRequired ? parseInt(formData.registrationLimit) || 0 : 0,
        contactPerson: {
          name: formData.contactPersonName.trim(),
          phone: formData.contactPersonPhone.trim(),
          email: formData.contactPersonEmail.trim()
        },
        rules: formData.rules.trim(),
        instructions: formData.instructions.trim()
      };

      console.log('Saving event data:', eventData);

      if (editingEvent) {
        await eventService.updateEvent(editingEvent._id, eventData);
        setSnackbar({
          open: true,
          message: 'Event updated successfully',
          severity: 'success'
        });
      } else {
        await eventService.createEvent(eventData);
        setSnackbar({
          open: true,
          message: 'Event created successfully',
          severity: 'success'
        });
      }

      await fetchEvents();
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Save event error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save event';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().split('T')[0] : '',
      eventTime: event.eventTime,
      venue: event.venue,
      category: event.category,
      posterImage: event.posterImage || '',
      registrationRequired: event.registrationRequired,
      registrationLimit: event.registrationLimit || '',
      contactPersonName: event.contactPerson?.name || '',
      contactPersonPhone: event.contactPerson?.phone || '',
      contactPersonEmail: event.contactPerson?.email || '',
      rules: event.rules || '',
      instructions: event.instructions || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await eventService.deleteEvent(id);
      await fetchEvents();
      setSnackbar({
        open: true,
        message: 'Event deleted successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to delete event',
        severity: 'error'
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await eventService.updateEventStatus(id, newStatus);
      await fetchEvents();
      setSnackbar({
        open: true,
        message: 'Event status updated successfully',
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to update event status',
        severity: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      eventTime: '',
      venue: '',
      category: '',
      posterImage: '',
      registrationRequired: false,
      registrationLimit: '',
      contactPersonName: '',
      contactPersonPhone: '',
      contactPersonEmail: '',
      rules: '',
      instructions: ''
    });
    setEditingEvent(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Upcoming': return 'primary';
      case 'Ongoing': return 'success';
      case 'Completed': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Technical': return 'info';
      case 'Cultural': return 'secondary';
      case 'Sports': return 'success';
      case 'Academic': return 'primary';
      case 'General': return 'default';
      default: return 'default';
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const upcomingEvents = events.filter(e => e.status === 'Upcoming').length;
  const ongoingEvents = events.filter(e => e.status === 'Ongoing').length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;

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
        Event Management
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Event color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Events</Typography>
                  <Typography variant="h4">{events.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CalendarToday color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Upcoming</Typography>
                  <Typography variant="h4">{upcomingEvents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocationOn color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Ongoing</Typography>
                  <Typography variant="h4">{ongoingEvents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="default" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Completed</Typography>
                  <Typography variant="h4">{completedEvents}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Header with Add Button and Search */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search events by title, venue, or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{ minWidth: 400 }}
          variant="outlined"
          size="small"
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            resetForm();
            setOpenDialog(true);
          }}
        >
          Create Event
        </Button>
      </Box>

      {/* Events Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Venue</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Registration</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event._id}>
                <TableCell>
                  <Typography variant="subtitle2">{event.title}</Typography>
                  <Typography variant="caption" color="textSecondary">
                    {event.description?.substring(0, 50)}...
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(event.eventDate).toLocaleDateString()}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {event.eventTime}
                  </Typography>
                </TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>
                  <Chip 
                    label={event.category} 
                    color={getCategoryColor(event.category)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 100 }}>
                    <Select
                      value={event.status}
                      onChange={(e) => handleStatusChange(event._id, e.target.value)}
                    >
                      <MenuItem value="Upcoming">Upcoming</MenuItem>
                      <MenuItem value="Ongoing">Ongoing</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Cancelled">Cancelled</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  {event.registrationRequired ? (
                    <Typography variant="caption">
                      {event.registeredCount || 0}/{event.registrationLimit}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="textSecondary">
                      No Registration
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={() => handleEdit(event)}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={() => handleDelete(event._id)}
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredEvents.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    {searchTerm ? `No events found matching "${searchTerm}"` : 'No events found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create/Edit Event Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                label="Event Title"
                fullWidth
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Event Description"
                fullWidth
                multiline
                rows={3}
                required
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Event Date"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.eventDate}
                onChange={(e) => handleInputChange('eventDate', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Event Time"
                type="time"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.eventTime}
                onChange={(e) => handleInputChange('eventTime', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Venue"
                fullWidth
                required
                value={formData.venue}
                onChange={(e) => handleInputChange('venue', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <MenuItem value="Technical">Technical</MenuItem>
                  <MenuItem value="Cultural">Cultural</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Academic">Academic</MenuItem>
                  <MenuItem value="General">General</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Poster Image URL"
                fullWidth
                value={formData.posterImage}
                onChange={(e) => handleInputChange('posterImage', e.target.value)}
                placeholder="https://example.com/poster.jpg"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.registrationRequired}
                    onChange={(e) => handleInputChange('registrationRequired', e.target.checked)}
                  />
                }
                label="Registration Required"
              />
            </Grid>
            {formData.registrationRequired && (
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Registration Limit"
                  type="number"
                  fullWidth
                  value={formData.registrationLimit}
                  onChange={(e) => handleInputChange('registrationLimit', e.target.value)}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact Person Name"
                fullWidth
                value={formData.contactPersonName}
                onChange={(e) => handleInputChange('contactPersonName', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact Phone"
                fullWidth
                value={formData.contactPersonPhone}
                onChange={(e) => handleInputChange('contactPersonPhone', e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Contact Email"
                type="email"
                fullWidth
                value={formData.contactPersonEmail}
                onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Event Rules"
                fullWidth
                multiline
                rows={3}
                value={formData.rules}
                onChange={(e) => handleInputChange('rules', e.target.value)}
                placeholder="Enter event rules and regulations..."
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Instructions"
                fullWidth
                multiline
                rows={3}
                value={formData.instructions}
                onChange={(e) => handleInputChange('instructions', e.target.value)}
                placeholder="Enter event instructions for participants..."
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {editingEvent ? 'Update Event' : 'Create Event'}
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

export default AdminEvents;