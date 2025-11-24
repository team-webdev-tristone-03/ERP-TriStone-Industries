import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
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
  Button,
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
  InputAdornment,
  DatePicker
} from '@mui/material';
import {
  LocalHospital,
  Healing,
  Medication,
  Add,
  Edit,
  Visibility,
  Delete,
  Close,
  Search,
  Warning,
  CheckCircle,
  Person,
  Phone,
  Email,
  CalendarToday,
  WarningAmber,
  Vaccines,
  MonitorHeart
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminMedical = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock medical records data
  const medicalRecords = [
    {
      id: 1,
      student: {
        name: 'John Doe',
        studentId: 'STU001',
        class: '10-A',
        avatar: 'JD'
      },
      bloodGroup: 'O+',
      allergies: ['Peanuts', 'Dust'],
      chronicConditions: ['Asthma'],
      emergencyContact: {
        name: 'Jane Doe',
        relation: 'Mother',
        phone: '+1-234-567-8901',
        email: 'jane.doe@email.com'
      },
      lastCheckup: '2024-01-15',
      vaccinations: [
        { name: 'COVID-19', date: '2023-12-01', nextDue: '2024-06-01' },
        { name: 'Hepatitis B', date: '2023-08-15', nextDue: '2024-08-15' }
      ],
      medicalHistory: [
        { date: '2024-01-15', condition: 'Regular Checkup', doctor: 'Dr. Smith', notes: 'All vitals normal' },
        { date: '2023-11-20', condition: 'Fever', doctor: 'Dr. Johnson', notes: 'Prescribed rest and medication' }
      ]
    },
    {
      id: 2,
      student: {
        name: 'Jane Smith',
        studentId: 'STU002',
        class: '11-B',
        avatar: 'JS'
      },
      bloodGroup: 'A+',
      allergies: ['Shellfish'],
      chronicConditions: [],
      emergencyContact: {
        name: 'Robert Smith',
        relation: 'Father',
        phone: '+1-234-567-8902',
        email: 'robert.smith@email.com'
      },
      lastCheckup: '2024-01-10',
      vaccinations: [
        { name: 'COVID-19', date: '2023-11-15', nextDue: '2024-05-15' },
        { name: 'Flu Shot', date: '2023-10-01', nextDue: '2024-10-01' }
      ],
      medicalHistory: [
        { date: '2024-01-10', condition: 'Annual Physical', doctor: 'Dr. Brown', notes: 'Healthy, no concerns' }
      ]
    },
    {
      id: 3,
      student: {
        name: 'Mike Johnson',
        studentId: 'STU003',
        class: '12-A',
        avatar: 'MJ'
      },
      bloodGroup: 'B-',
      allergies: [],
      chronicConditions: ['Diabetes Type 1'],
      emergencyContact: {
        name: 'Sarah Johnson',
        relation: 'Mother',
        phone: '+1-234-567-8903',
        email: 'sarah.johnson@email.com'
      },
      lastCheckup: '2024-01-08',
      vaccinations: [
        { name: 'COVID-19', date: '2023-12-20', nextDue: '2024-06-20' }
      ],
      medicalHistory: [
        { date: '2024-01-08', condition: 'Diabetes Monitoring', doctor: 'Dr. Wilson', notes: 'Blood sugar levels stable' },
        { date: '2023-12-15', condition: 'Insulin Adjustment', doctor: 'Dr. Wilson', notes: 'Dosage modified' }
      ]
    }
  ];

  const upcomingVaccinations = [
    { student: 'John Doe', vaccine: 'COVID-19 Booster', dueDate: '2024-06-01', priority: 'high' },
    { student: 'Jane Smith', vaccine: 'Flu Shot', dueDate: '2024-10-01', priority: 'medium' },
    { student: 'Mike Johnson', vaccine: 'Hepatitis A', dueDate: '2024-03-15', priority: 'low' }
  ];

  const recentCheckups = [
    { student: 'John Doe', date: '2024-01-15', doctor: 'Dr. Smith', status: 'completed' },
    { student: 'Jane Smith', date: '2024-01-10', doctor: 'Dr. Brown', status: 'completed' },
    { student: 'Mike Johnson', date: '2024-01-08', doctor: 'Dr. Wilson', status: 'completed' }
  ];

  const filteredRecords = medicalRecords.filter(record =>
    record.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (type, record = null) => {
    setDialogType(type);
    setSelectedRecord(record);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedRecord(null);
  };

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `Medical record ${selectedRecord ? 'updated' : 'created'} successfully`,
      severity: 'success'
    });
    handleCloseDialog();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Medical Records Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LocalHospital color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Records</Typography>
                  <Typography variant="h4">{medicalRecords.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Healing color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Recent Checkups</Typography>
                  <Typography variant="h4">{recentCheckups.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Vaccines color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Due Vaccinations</Typography>
                  <Typography variant="h4">{upcomingVaccinations.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <WarningAmber color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Chronic Cases</Typography>
                  <Typography variant="h4">
                    {medicalRecords.filter(r => r.chronicConditions.length > 0).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by name, student ID, or blood group..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog('add')}
        >
          Add Medical Record
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Medical Records" />
          <Tab label="Upcoming Vaccinations" />
          <Tab label="Recent Checkups" />
          <Tab label="Emergency Contacts" />
        </Tabs>
      </Paper>

      {/* Medical Records Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Blood Group</TableCell>
                <TableCell>Allergies</TableCell>
                <TableCell>Chronic Conditions</TableCell>
                <TableCell>Last Checkup</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{record.student.avatar}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {record.student.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {record.student.studentId} - {record.student.class}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={record.bloodGroup} color="primary" size="small" />
                  </TableCell>
                  <TableCell>
                    {record.allergies.length > 0 ? (
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {record.allergies.map((allergy, index) => (
                          <Chip key={index} label={allergy} size="small" color="warning" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">None</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {record.chronicConditions.length > 0 ? (
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {record.chronicConditions.map((condition, index) => (
                          <Chip key={index} label={condition} size="small" color="error" />
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">None</Typography>
                    )}
                  </TableCell>
                  <TableCell>{new Date(record.lastCheckup).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog('view', record)}>
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={() => handleOpenDialog('edit', record)}>
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

      {/* Upcoming Vaccinations Tab */}
      <TabPanel value={tabValue} index={1}>
        <List>
          {upcomingVaccinations.map((vaccination, index) => (
            <Paper key={index} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <Vaccines />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{vaccination.student}</Typography>
                      <Chip 
                        label={vaccination.priority.toUpperCase()} 
                        color={getPriorityColor(vaccination.priority)} 
                        size="small" 
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Vaccine: {vaccination.vaccine}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Due Date: {new Date(vaccination.dueDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button size="small" variant="outlined">
                    Schedule
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Recent Checkups Tab */}
      <TabPanel value={tabValue} index={2}>
        <List>
          {recentCheckups.map((checkup, index) => (
            <Paper key={index} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <MonitorHeart />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{checkup.student}</Typography>
                      <Chip label={checkup.status.toUpperCase()} color="success" size="small" />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Doctor: {checkup.doctor}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Date: {new Date(checkup.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <Button size="small" variant="outlined">
                    View Report
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Emergency Contacts Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          {medicalRecords.map((record) => (
            <Grid item xs={12} md={6} key={record.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {record.student.name} ({record.student.studentId})
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box display="flex" alignItems="center" mb={1}>
                    <Person sx={{ mr: 1 }} />
                    <Typography variant="body2">
                      {record.emergencyContact.name} ({record.emergencyContact.relation})
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Phone sx={{ mr: 1 }} />
                    <Typography variant="body2">{record.emergencyContact.phone}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1 }} />
                    <Typography variant="body2">{record.emergencyContact.email}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      {/* Medical Record Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'add' ? 'Add Medical Record' : 
             dialogType === 'edit' ? 'Edit Medical Record' : 'Medical Record Details'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRecord && dialogType === 'view' ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>Student Information</Typography>
                <Typography>Name: {selectedRecord.student.name}</Typography>
                <Typography>Student ID: {selectedRecord.student.studentId}</Typography>
                <Typography>Class: {selectedRecord.student.class}</Typography>
                <Typography>Blood Group: {selectedRecord.bloodGroup}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Medical Information</Typography>
                <Typography>Allergies: {selectedRecord.allergies.join(', ') || 'None'}</Typography>
                <Typography>Chronic Conditions: {selectedRecord.chronicConditions.join(', ') || 'None'}</Typography>
                <Typography>Last Checkup: {new Date(selectedRecord.lastCheckup).toLocaleDateString()}</Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Emergency Contact</Typography>
                <Typography>Name: {selectedRecord.emergencyContact.name}</Typography>
                <Typography>Relation: {selectedRecord.emergencyContact.relation}</Typography>
                <Typography>Phone: {selectedRecord.emergencyContact.phone}</Typography>
                <Typography>Email: {selectedRecord.emergencyContact.email}</Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="Student Name" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Student ID" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Blood Group</InputLabel>
                  <Select>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Class" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Allergies (comma separated)" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Chronic Conditions (comma separated)" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Emergency Contact Name" fullWidth margin="normal" />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Emergency Contact Phone" fullWidth margin="normal" />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          {dialogType !== 'view' && (
            <Button onClick={handleSave} variant="contained">
              {dialogType === 'add' ? 'Add' : 'Update'} Record
            </Button>
          )}
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

export default AdminMedical;