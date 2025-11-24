import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Switch,
  FormControlLabel,
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
  Checkbox,
  FormGroup,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Alert,
  LinearProgress,
  Snackbar
} from '@mui/material';
import {
  Settings,
  Security,
  Backup,
  Add,
  Edit,
  Delete,
  Close,
  CloudDownload,
  CloudUpload,
  Restore,
  Person,
  AdminPanelSettings
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminSettings = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openRoleDialog, setOpenRoleDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [showBackupProgress, setShowBackupProgress] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [systemSettings, setSystemSettings] = useState({
    emailNotifications: true,
    smsAlerts: true,
    maintenanceMode: false,
    autoBackup: true,
    sessionTimeout: 30,
    maxLoginAttempts: 3
  });

  // Mock roles and permissions data
  const [roles, setRoles] = useState([
    {
      id: 1,
      name: 'Student',
      description: 'Student access with limited permissions',
      permissions: ['view_profile', 'view_marks', 'view_attendance', 'submit_homework'],
      userCount: 150
    },
    {
      id: 2,
      name: 'Staff',
      description: 'Teaching staff with classroom management',
      permissions: ['view_profile', 'manage_classes', 'mark_attendance', 'grade_assignments', 'view_students'],
      userCount: 25
    },
    {
      id: 3,
      name: 'HOD',
      description: 'Head of Department with departmental control',
      permissions: ['view_profile', 'manage_classes', 'mark_attendance', 'grade_assignments', 'view_students', 'manage_staff', 'view_reports'],
      userCount: 5
    },
    {
      id: 4,
      name: 'Principal',
      description: 'Principal with full academic control',
      permissions: ['view_profile', 'manage_classes', 'mark_attendance', 'grade_assignments', 'view_students', 'manage_staff', 'view_reports', 'manage_academics', 'approve_leaves'],
      userCount: 1
    },
    {
      id: 5,
      name: 'Accountant',
      description: 'Financial management and fee collection',
      permissions: ['view_profile', 'manage_fees', 'view_payments', 'generate_receipts', 'financial_reports'],
      userCount: 3
    }
  ]);

  const availablePermissions = [
    'view_profile', 'view_marks', 'view_attendance', 'submit_homework',
    'manage_classes', 'mark_attendance', 'grade_assignments', 'view_students',
    'manage_staff', 'view_reports', 'manage_academics', 'approve_leaves',
    'manage_fees', 'view_payments', 'generate_receipts', 'financial_reports'
  ];

  const handleSettingChange = (setting) => {
    setSystemSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setSnackbar({
      open: true,
      message: `${setting} ${systemSettings[setting] ? 'disabled' : 'enabled'}`,
      severity: 'success'
    });
  };

  const handleBackup = () => {
    setShowBackupProgress(true);
    setBackupProgress(0);
    
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setShowBackupProgress(false);
          setSnackbar({
            open: true,
            message: 'Database backup completed successfully',
            severity: 'success'
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleRestore = () => {
    setSnackbar({
      open: true,
      message: 'Database restore initiated',
      severity: 'info'
    });
  };

  const handleRoleEdit = (role) => {
    setSelectedRole(role);
    setOpenRoleDialog(true);
  };

  const handleRoleSave = () => {
    setOpenRoleDialog(false);
    setSnackbar({
      open: true,
      message: 'Role updated successfully',
      severity: 'success'
    });
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        System Settings
      </Typography>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Roles & Permissions" />
          <Tab label="System Settings" />
          <Tab label="Backup & Restore" />
        </Tabs>
      </Paper>

      {/* Roles & Permissions Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Manage Roles & Permissions</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => {
              setSelectedRole({ name: '', description: '', permissions: [] });
              setOpenRoleDialog(true);
            }}
          >
            Create Role
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Role Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Permissions</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <AdminPanelSettings sx={{ mr: 1 }} />
                      <Typography fontWeight="bold">{role.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Chip label={`${role.userCount} users`} size="small" />
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={0.5} flexWrap="wrap">
                      {role.permissions.slice(0, 3).map((perm) => (
                        <Chip key={perm} label={perm} size="small" variant="outlined" />
                      ))}
                      {role.permissions.length > 3 && (
                        <Chip label={`+${role.permissions.length - 3} more`} size="small" />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleRoleEdit(role)}>
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

      {/* System Settings Tab */}
      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  General Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText primary="Email Notifications" secondary="Send email alerts to users" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={systemSettings.emailNotifications}
                        onChange={() => handleSettingChange('emailNotifications')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="SMS Alerts" secondary="Send SMS notifications" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={systemSettings.smsAlerts}
                        onChange={() => handleSettingChange('smsAlerts')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Maintenance Mode" secondary="Put system in maintenance mode" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={systemSettings.maintenanceMode}
                        onChange={() => handleSettingChange('maintenanceMode')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText primary="Auto Backup" secondary="Automatic daily backups" />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={systemSettings.autoBackup}
                        onChange={() => handleSettingChange('autoBackup')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Security Settings
                </Typography>
                <Box mb={3}>
                  <TextField
                    label="Session Timeout (minutes)"
                    type="number"
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Max Login Attempts"
                    type="number"
                    value={systemSettings.maxLoginAttempts}
                    onChange={(e) => setSystemSettings(prev => ({ ...prev, maxLoginAttempts: e.target.value }))}
                    fullWidth
                    margin="normal"
                  />
                </Box>
                <Button variant="outlined" fullWidth>
                  Update Security Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Backup & Restore Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Backup
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Create a backup of your database to ensure data safety.
                </Typography>
                
                {showBackupProgress && (
                  <Box mb={2}>
                    <Typography variant="body2">Backup Progress: {backupProgress}%</Typography>
                    <LinearProgress variant="determinate" value={backupProgress} />
                  </Box>
                )}
                
                <Button
                  variant="contained"
                  startIcon={<Backup />}
                  onClick={handleBackup}
                  disabled={showBackupProgress}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Create Backup
                </Button>
                
                <Button
                  variant="outlined"
                  startIcon={<CloudDownload />}
                  fullWidth
                >
                  Download Latest Backup
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Database Restore
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  Restore your database from a previous backup file.
                </Typography>
                
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Warning: Restoring will overwrite current data!
                </Alert>
                
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                  Upload Backup File
                  <input type="file" hidden accept=".sql,.db" />
                </Button>
                
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<Restore />}
                  onClick={handleRestore}
                  fullWidth
                >
                  Restore Database
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Backup History
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Size</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>2024-01-20 10:30 AM</TableCell>
                        <TableCell>45.2 MB</TableCell>
                        <TableCell>Auto</TableCell>
                        <TableCell><Chip label="Success" color="success" size="small" /></TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<CloudDownload />}>Download</Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>2024-01-19 10:30 AM</TableCell>
                        <TableCell>44.8 MB</TableCell>
                        <TableCell>Manual</TableCell>
                        <TableCell><Chip label="Success" color="success" size="small" /></TableCell>
                        <TableCell>
                          <Button size="small" startIcon={<CloudDownload />}>Download</Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Role Edit Dialog */}
      <Dialog open={openRoleDialog} onClose={() => setOpenRoleDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {selectedRole?.id ? 'Edit Role' : 'Create Role'}
            <IconButton onClick={() => setOpenRoleDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedRole && (
            <Box>
              <TextField
                label="Role Name"
                value={selectedRole.name}
                onChange={(e) => setSelectedRole(prev => ({ ...prev, name: e.target.value }))}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Description"
                value={selectedRole.description}
                onChange={(e) => setSelectedRole(prev => ({ ...prev, description: e.target.value }))}
                fullWidth
                multiline
                rows={2}
                margin="normal"
              />
              
              <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>Permissions</Typography>
              <FormGroup>
                <Grid container>
                  {availablePermissions.map((permission) => (
                    <Grid item xs={12} sm={6} key={permission}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedRole.permissions?.includes(permission) || false}
                            onChange={(e) => {
                              const newPermissions = e.target.checked
                                ? [...(selectedRole.permissions || []), permission]
                                : (selectedRole.permissions || []).filter(p => p !== permission);
                              setSelectedRole(prev => ({ ...prev, permissions: newPermissions }));
                            }}
                          />
                        }
                        label={permission.replace('_', ' ').toUpperCase()}
                      />
                    </Grid>
                  ))}
                </Grid>
              </FormGroup>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRoleDialog(false)}>Cancel</Button>
          <Button onClick={handleRoleSave} variant="contained">
            {selectedRole?.id ? 'Update' : 'Create'} Role
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

export default AdminSettings;