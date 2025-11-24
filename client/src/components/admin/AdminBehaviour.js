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
  Alert,
  Snackbar,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  Psychology,
  TrendingUp,
  TrendingDown,
  Add,
  Edit,
  Visibility,
  Delete,
  Close,
  Search,
  Warning,
  CheckCircle,
  Person,
  CalendarToday,
  Gavel,
  Report,
  Star,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminBehaviour = () => {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock behaviour records data
  const behaviourRecords = [
    {
      id: 1,
      student: {
        name: 'John Doe',
        studentId: 'STU001',
        class: '10-A',
        avatar: 'JD'
      },
      type: 'positive',
      category: 'Academic Excellence',
      description: 'Consistently excellent performance in mathematics and helped classmates',
      reportedBy: 'Dr. Smith',
      date: '2024-01-15',
      severity: 'low',
      points: 10,
      status: 'recorded'
    },
    {
      id: 2,
      student: {
        name: 'Jane Smith',
        studentId: 'STU002',
        class: '11-B',
        avatar: 'JS'
      },
      type: 'negative',
      category: 'Misconduct',
      description: 'Disrupting class and not following instructions repeatedly',
      reportedBy: 'Prof. Johnson',
      date: '2024-01-14',
      severity: 'medium',
      points: -5,
      status: 'under_review'
    },
    {
      id: 3,
      student: {
        name: 'Mike Johnson',
        studentId: 'STU003',
        class: '12-A',
        avatar: 'MJ'
      },
      type: 'negative',
      category: 'Attendance',
      description: 'Frequent absences without proper justification',
      reportedBy: 'Class Teacher',
      date: '2024-01-13',
      severity: 'high',
      points: -10,
      status: 'action_taken'
    },
    {
      id: 4,
      student: {
        name: 'Sarah Wilson',
        studentId: 'STU004',
        class: '9-C',
        avatar: 'SW'
      },
      type: 'positive',
      category: 'Leadership',
      description: 'Organized successful charity drive and showed excellent leadership',
      reportedBy: 'Principal',
      date: '2024-01-12',
      severity: 'low',
      points: 15,
      status: 'recorded'
    }
  ];

  // Mock disciplinary actions data
  const disciplinaryActions = [
    {
      id: 1,
      student: {
        name: 'Mike Johnson',
        studentId: 'STU003',
        class: '12-A',
        avatar: 'MJ'
      },
      action: 'Warning Letter',
      reason: 'Frequent absences without justification',
      actionBy: 'Principal',
      date: '2024-01-16',
      severity: 'medium',
      status: 'active',
      followUpDate: '2024-02-16'
    },
    {
      id: 2,
      student: {
        name: 'David Brown',
        studentId: 'STU005',
        class: '11-A',
        avatar: 'DB'
      },
      action: 'Suspension',
      reason: 'Fighting with another student',
      actionBy: 'Disciplinary Committee',
      date: '2024-01-10',
      severity: 'high',
      status: 'completed',
      followUpDate: '2024-01-17'
    }
  ];

  const getTypeColor = (type) => {
    return type === 'positive' ? 'success' : 'error';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      default: return 'info';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'recorded':
      case 'completed': return 'success';
      case 'under_review': return 'warning';
      case 'action_taken':
      case 'active': return 'info';
      default: return 'default';
    }
  };

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
      message: `${dialogType} ${selectedRecord ? 'updated' : 'created'} successfully`,
      severity: 'success'
    });
    handleCloseDialog();
  };

  const positiveRecords = behaviourRecords.filter(r => r.type === 'positive');
  const negativeRecords = behaviourRecords.filter(r => r.type === 'negative');
  const totalPoints = behaviourRecords.reduce((sum, r) => sum + r.points, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Behaviour Monitoring & Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Psychology color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Records</Typography>
                  <Typography variant="h4">{behaviourRecords.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Positive Records</Typography>
                  <Typography variant="h4">{positiveRecords.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingDown color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Negative Records</Typography>
                  <Typography variant="h4">{negativeRecords.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Gavel color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Disciplinary Actions</Typography>
                  <Typography variant="h4">{disciplinaryActions.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search and Add Button */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search by student name or ID..."
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
          onClick={() => handleOpenDialog('behaviour')}
        >
          Record Behaviour
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Behaviour Records" />
          <Tab label="Disciplinary Actions" />
          <Tab label="Student Overview" />
        </Tabs>
      </Paper>

      {/* Behaviour Records Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Reported By</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Points</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {behaviourRecords.map((record) => (
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
                    <Chip
                      icon={record.type === 'positive' ? <ThumbUp /> : <ThumbDown />}
                      label={record.type.toUpperCase()}
                      color={getTypeColor(record.type)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{record.category}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ maxWidth: 200 }}>
                      {record.description}
                    </Typography>
                  </TableCell>
                  <TableCell>{record.reportedBy}</TableCell>
                  <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={record.points > 0 ? `+${record.points}` : record.points}
                      color={record.points > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status.replace('_', ' ').toUpperCase()}
                      color={getStatusColor(record.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary" onClick={() => handleOpenDialog('view', record)}>
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

      {/* Disciplinary Actions Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Disciplinary Actions</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog('disciplinary')}
          >
            Add Disciplinary Action
          </Button>
        </Box>

        <List>
          {disciplinaryActions.map((action) => (
            <Paper key={action.id} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar>{action.student.avatar}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{action.student.name}</Typography>
                      <Chip label={action.action} color="warning" size="small" />
                      <Chip
                        label={action.status.toUpperCase()}
                        color={getStatusColor(action.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Reason: {action.reason}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Action by: {action.actionBy} | Date: {new Date(action.date).toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary" display="block">
                        Follow-up: {new Date(action.followUpDate).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleOpenDialog('disciplinary', action)}>
                    <Visibility />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Student Overview Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          {/* Group students by their behaviour score */}
          {Array.from(new Set(behaviourRecords.map(r => r.student.studentId))).map((studentId) => {
            const studentRecords = behaviourRecords.filter(r => r.student.studentId === studentId);
            const student = studentRecords[0].student;
            const totalScore = studentRecords.reduce((sum, r) => sum + r.points, 0);
            const positiveCount = studentRecords.filter(r => r.type === 'positive').length;
            const negativeCount = studentRecords.filter(r => r.type === 'negative').length;
            
            return (
              <Grid item xs={12} md={6} key={studentId}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar sx={{ mr: 2, width: 56, height: 56 }}>{student.avatar}</Avatar>
                      <Box flexGrow={1}>
                        <Typography variant="h6">{student.name}</Typography>
                        <Typography color="textSecondary">
                          {student.studentId} - {student.class}
                        </Typography>
                      </Box>
                      <Chip
                        label={`Score: ${totalScore}`}
                        color={totalScore >= 0 ? 'success' : 'error'}
                      />
                    </Box>
                    
                    <Box mb={2}>
                      <Typography variant="body2" gutterBottom>
                        Behaviour Score Progress
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(Math.max((totalScore + 50) / 100 * 100, 0), 100)}
                        color={totalScore >= 0 ? 'success' : 'error'}
                      />
                    </Box>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="success.main">
                            {positiveCount}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Positive Records
                          </Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={6}>
                        <Box textAlign="center">
                          <Typography variant="h4" color="error.main">
                            {negativeCount}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Negative Records
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </TabPanel>

      {/* Dialog for Add/Edit/View */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'behaviour' ? 'Record Behaviour' :
             dialogType === 'disciplinary' ? 'Disciplinary Action' : 'Record Details'}
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="Student Name" fullWidth margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Student ID" fullWidth margin="normal" />
            </Grid>
            {dialogType === 'behaviour' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Behaviour Type</InputLabel>
                    <Select>
                      <MenuItem value="positive">Positive</MenuItem>
                      <MenuItem value="negative">Negative</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select>
                      <MenuItem value="Academic Excellence">Academic Excellence</MenuItem>
                      <MenuItem value="Leadership">Leadership</MenuItem>
                      <MenuItem value="Misconduct">Misconduct</MenuItem>
                      <MenuItem value="Attendance">Attendance</MenuItem>
                      <MenuItem value="Discipline">Discipline</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField label="Points" type="number" fullWidth margin="normal" />
                </Grid>
              </>
            )}
            {dialogType === 'disciplinary' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Action Type</InputLabel>
                    <Select>
                      <MenuItem value="Warning Letter">Warning Letter</MenuItem>
                      <MenuItem value="Suspension">Suspension</MenuItem>
                      <MenuItem value="Detention">Detention</MenuItem>
                      <MenuItem value="Parent Meeting">Parent Meeting</MenuItem>
                      <MenuItem value="Counseling">Counseling</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Severity</InputLabel>
                    <Select>
                      <MenuItem value="low">Low</MenuItem>
                      <MenuItem value="medium">Medium</MenuItem>
                      <MenuItem value="high">High</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Reason"
                    multiline
                    rows={3}
                    fullWidth
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Follow-up Date"
                    type="date"
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </>
            )}
          </Grid>
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

export default AdminBehaviour;