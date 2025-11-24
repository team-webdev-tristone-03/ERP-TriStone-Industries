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
  Avatar,
  IconButton,
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
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  Snackbar,
  InputAdornment
} from '@mui/material';
import {
  Work,
  Business,
  Add,
  Edit,
  Visibility,
  Delete,
  Close,
  Search,
  Person,
  CalendarToday,
  CheckCircle,
  Schedule,
  Phone,
  Email,
  LocationOn,
  AttachMoney,
  Group
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminPlacement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock companies data
  const companies = [
    {
      id: 1,
      name: 'Tech Solutions Inc.',
      industry: 'Technology',
      location: 'New York, NY',
      website: 'www.techsolutions.com',
      contact: {
        person: 'John Smith',
        email: 'john.smith@techsolutions.com',
        phone: '+1-555-0101'
      },
      jobOpenings: 3,
      status: 'active'
    },
    {
      id: 2,
      name: 'Global Finance Corp',
      industry: 'Finance',
      location: 'Chicago, IL',
      website: 'www.globalfinance.com',
      contact: {
        person: 'Sarah Johnson',
        email: 'sarah.j@globalfinance.com',
        phone: '+1-555-0102'
      },
      jobOpenings: 2,
      status: 'active'
    },
    {
      id: 3,
      name: 'Healthcare Plus',
      industry: 'Healthcare',
      location: 'Boston, MA',
      website: 'www.healthcareplus.com',
      contact: {
        person: 'Dr. Michael Brown',
        email: 'michael.brown@healthcareplus.com',
        phone: '+1-555-0103'
      },
      jobOpenings: 1,
      status: 'inactive'
    }
  ];

  // Mock interviews data
  const interviews = [
    {
      id: 1,
      student: {
        name: 'Alice Johnson',
        studentId: 'STU001',
        course: 'Computer Science',
        avatar: 'AJ'
      },
      company: 'Tech Solutions Inc.',
      position: 'Software Developer',
      date: '2024-01-25',
      time: '10:00 AM',
      type: 'Technical',
      status: 'scheduled',
      interviewer: 'John Smith'
    },
    {
      id: 2,
      student: {
        name: 'Bob Wilson',
        studentId: 'STU002',
        course: 'Business Administration',
        avatar: 'BW'
      },
      company: 'Global Finance Corp',
      position: 'Financial Analyst',
      date: '2024-01-26',
      time: '2:00 PM',
      type: 'HR Round',
      status: 'completed',
      interviewer: 'Sarah Johnson'
    },
    {
      id: 3,
      student: {
        name: 'Carol Davis',
        studentId: 'STU003',
        course: 'Nursing',
        avatar: 'CD'
      },
      company: 'Healthcare Plus',
      position: 'Registered Nurse',
      date: '2024-01-27',
      time: '11:00 AM',
      type: 'Final Round',
      status: 'scheduled',
      interviewer: 'Dr. Michael Brown'
    }
  ];

  // Mock selections data
  const selections = [
    {
      id: 1,
      student: {
        name: 'David Miller',
        studentId: 'STU004',
        course: 'Computer Science',
        avatar: 'DM'
      },
      company: 'Tech Solutions Inc.',
      position: 'Junior Developer',
      salary: '$65,000',
      joiningDate: '2024-02-15',
      status: 'selected'
    },
    {
      id: 2,
      student: {
        name: 'Emma Thompson',
        studentId: 'STU005',
        course: 'Finance',
        avatar: 'ET'
      },
      company: 'Global Finance Corp',
      position: 'Investment Analyst',
      salary: '$70,000',
      joiningDate: '2024-03-01',
      status: 'offer_pending'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'scheduled':
      case 'selected':
        return 'success';
      case 'completed':
      case 'offer_pending':
        return 'warning';
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleOpenDialog = (type, item = null) => {
    setDialogType(type);
    setSelectedItem(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `${dialogType} ${selectedItem ? 'updated' : 'created'} successfully`,
      severity: 'success'
    });
    handleCloseDialog();
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Placement Cell Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Business color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Companies</Typography>
                  <Typography variant="h4">{companies.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Interviews</Typography>
                  <Typography variant="h4">{interviews.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Selections</Typography>
                  <Typography variant="h4">{selections.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Work color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Job Openings</Typography>
                  <Typography variant="h4">{companies.reduce((sum, c) => sum + c.jobOpenings, 0)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Companies" />
          <Tab label="Interviews" />
          <Tab label="Selections" />
        </Tabs>
      </Paper>

      {/* Companies Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <TextField
            placeholder="Search companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
            sx={{ minWidth: 300 }}
          />
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('company')}
          >
            Add Company
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Job Openings</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{company.name.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {company.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {company.website}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{company.industry}</TableCell>
                  <TableCell>{company.location}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{company.contact.person}</Typography>
                    <Typography variant="caption" color="textSecondary">
                      {company.contact.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip label={`${company.jobOpenings} openings`} size="small" color="primary" />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={company.status.toUpperCase()}
                      color={getStatusColor(company.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog('company', company)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <Edit />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Interviews Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Interview Schedule</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('interview')}
          >
            Schedule Interview
          </Button>
        </Box>

        <List>
          {interviews.map((interview) => (
            <Paper key={interview.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{interview.student.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{interview.student.name}</Typography>
                      <Chip label={interview.type} size="small" color="primary" />
                      <Chip
                        label={interview.status.toUpperCase()}
                        color={getStatusColor(interview.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {interview.company} - {interview.position}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {new Date(interview.date).toLocaleDateString()} at {interview.time}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Interviewer: {interview.interviewer}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleOpenDialog('interview', interview)}>
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Selections Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>
          Student Selections
        </Typography>

        <List>
          {selections.map((selection) => (
            <Paper key={selection.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{selection.student.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{selection.student.name}</Typography>
                      <Chip
                        label={selection.status.replace('_', ' ').toUpperCase()}
                        color={getStatusColor(selection.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        {selection.company} - {selection.position}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        Salary: {selection.salary}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Joining Date: {new Date(selection.joiningDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleOpenDialog('selection', selection)}>
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Dialog for Add/Edit/View */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'company' ? 'Company Details' :
             dialogType === 'interview' ? 'Interview Details' : 'Selection Details'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogType === 'company' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Company Name" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Industry" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Location" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Website" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Contact Person" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Contact Email" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Contact Phone" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Job Openings" type="number" fullWidth margin="normal" />
              </Grid>
            </Grid>
          )}
          
          {dialogType === 'interview' && (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Student Name" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Company</InputLabel>
                  <Select>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.name}>
                        {company.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Position" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Interview Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Interview Time" type="time" fullWidth margin="normal" InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Interview Type</InputLabel>
                  <Select>
                    <MenuItem value="HR Round">HR Round</MenuItem>
                    <MenuItem value="Technical">Technical</MenuItem>
                    <MenuItem value="Final Round">Final Round</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPlacement;