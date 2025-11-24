import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Tabs,
  Tab,
  Switch,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
  Divider,
  FormControlLabel
} from '@mui/material';
import {
  Chat,
  Group,
  Message,
  Send,
  Block,
  CheckCircle,
  Visibility,
  Delete,
  Close,
  Campaign,
  History,
  Settings as SettingsIcon
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminChat = () => {
  const [tabValue, setTabValue] = useState(0);
  const [chatSettings, setChatSettings] = useState({
    globalChatEnabled: true,
    studentChatEnabled: true,
    staffChatEnabled: true,
    groupChatEnabled: true,
    fileSharing: true,
    moderationEnabled: true
  });
  const [broadcastDialog, setBroadcastDialog] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastTarget, setBroadcastTarget] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock chat data
  const chatRooms = [
    {
      id: 1,
      name: 'General Discussion',
      type: 'public',
      members: 156,
      messages: 1250,
      lastActivity: '2024-01-20 14:30',
      status: 'active'
    },
    {
      id: 2,
      name: 'Class 10-A',
      type: 'class',
      members: 35,
      messages: 450,
      lastActivity: '2024-01-20 13:15',
      status: 'active'
    },
    {
      id: 3,
      name: 'Staff Room',
      type: 'staff',
      members: 25,
      messages: 320,
      lastActivity: '2024-01-20 12:45',
      status: 'active'
    },
    {
      id: 4,
      name: 'Mathematics Department',
      type: 'department',
      members: 8,
      messages: 180,
      lastActivity: '2024-01-20 11:20',
      status: 'disabled'
    }
  ];

  const chatLogs = [
    {
      id: 1,
      user: 'John Doe (Student)',
      room: 'Class 10-A',
      message: 'Can someone help me with the math homework?',
      timestamp: '2024-01-20 14:25:30',
      type: 'message'
    },
    {
      id: 2,
      user: 'Dr. Smith (Staff)',
      room: 'Class 10-A',
      message: 'I can help you with that. What specific problem are you having trouble with?',
      timestamp: '2024-01-20 14:26:15',
      type: 'message'
    },
    {
      id: 3,
      user: 'Admin',
      room: 'General Discussion',
      message: 'System maintenance scheduled for tonight at 11 PM',
      timestamp: '2024-01-20 14:20:00',
      type: 'broadcast'
    },
    {
      id: 4,
      user: 'Jane Smith (Student)',
      room: 'General Discussion',
      message: 'Thanks for the update!',
      timestamp: '2024-01-20 14:21:30',
      type: 'message'
    },
    {
      id: 5,
      user: 'System',
      room: 'Staff Room',
      message: 'User Mike Johnson has been temporarily blocked for inappropriate content',
      timestamp: '2024-01-20 13:45:00',
      type: 'moderation'
    }
  ];

  const handleSettingChange = (setting) => {
    setChatSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
    setSnackbar({
      open: true,
      message: `${setting} ${chatSettings[setting] ? 'disabled' : 'enabled'}`,
      severity: 'success'
    });
  };

  const handleBroadcast = () => {
    if (!broadcastMessage.trim()) return;
    
    setSnackbar({
      open: true,
      message: `Broadcast message sent to ${broadcastTarget}`,
      severity: 'success'
    });
    setBroadcastDialog(false);
    setBroadcastMessage('');
  };

  const toggleRoomStatus = (roomId) => {
    setSnackbar({
      open: true,
      message: 'Chat room status updated',
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error';
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'broadcast': return 'warning';
      case 'moderation': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Chat Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Chat color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Active Chats</Typography>
                  <Typography variant="h4">{chatRooms.filter(r => r.status === 'active').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Group color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Members</Typography>
                  <Typography variant="h4">{chatRooms.reduce((sum, room) => sum + room.members, 0)}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Message color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Messages Today</Typography>
                  <Typography variant="h4">285</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Campaign color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Broadcasts</Typography>
                  <Typography variant="h4">12</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Chat Settings" />
          <Tab label="Chat Rooms" />
          <Tab label="Broadcast" />
          <Tab label="Chat Logs" />
        </Tabs>
      </Paper>

      {/* Chat Settings Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Chat Controls
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="Global Chat" 
                      secondary="Enable/disable all chat functionality" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.globalChatEnabled}
                        onChange={() => handleSettingChange('globalChatEnabled')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Student Chat" 
                      secondary="Allow students to participate in chats" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.studentChatEnabled}
                        onChange={() => handleSettingChange('studentChatEnabled')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Staff Chat" 
                      secondary="Allow staff to use chat features" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.staffChatEnabled}
                        onChange={() => handleSettingChange('staffChatEnabled')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Group Chat" 
                      secondary="Enable group chat functionality" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.groupChatEnabled}
                        onChange={() => handleSettingChange('groupChatEnabled')}
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
                  Advanced Settings
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText 
                      primary="File Sharing" 
                      secondary="Allow users to share files in chat" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.fileSharing}
                        onChange={() => handleSettingChange('fileSharing')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="Content Moderation" 
                      secondary="Enable automatic content filtering" 
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={chatSettings.moderationEnabled}
                        onChange={() => handleSettingChange('moderationEnabled')}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>
                
                <Divider sx={{ my: 2 }} />
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  startIcon={<SettingsIcon />}
                >
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Chat Rooms Tab */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Members</TableCell>
                <TableCell>Messages</TableCell>
                <TableCell>Last Activity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chatRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Chat sx={{ mr: 1 }} />
                      <Typography fontWeight="bold">{room.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={room.type} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{room.members}</TableCell>
                  <TableCell>{room.messages}</TableCell>
                  <TableCell>{new Date(room.lastActivity).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={room.status.toUpperCase()}
                      color={getStatusColor(room.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton 
                      size="small" 
                      color={room.status === 'active' ? 'error' : 'success'}
                      onClick={() => toggleRoomStatus(room.id)}
                    >
                      {room.status === 'active' ? <Block /> : <CheckCircle />}
                    </IconButton>
                    <IconButton size="small" color="primary">
                      <Visibility />
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

      {/* Broadcast Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Send Broadcast Message
                </Typography>
                
                <FormControl fullWidth margin="normal">
                  <InputLabel>Target Audience</InputLabel>
                  <Select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                  >
                    <MenuItem value="all">All Users</MenuItem>
                    <MenuItem value="students">Students Only</MenuItem>
                    <MenuItem value="staff">Staff Only</MenuItem>
                    <MenuItem value="class">Specific Class</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  label="Broadcast Message"
                  multiline
                  rows={4}
                  fullWidth
                  margin="normal"
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Enter your broadcast message here..."
                />
                
                <Button
                  variant="contained"
                  startIcon={<Send />}
                  onClick={handleBroadcast}
                  disabled={!broadcastMessage.trim()}
                  sx={{ mt: 2 }}
                >
                  Send Broadcast
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recent Broadcasts
                </Typography>
                <List>
                  <ListItem>
                    <ListItemText
                      primary="System Maintenance"
                      secondary="Sent to All Users - 2 hours ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Exam Schedule Update"
                      secondary="Sent to Students - 1 day ago"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Staff Meeting Reminder"
                      secondary="Sent to Staff - 2 days ago"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Chat Logs Tab */}
      <TabPanel value={tabValue} index={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Chat Activity Logs
            </Typography>
            
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Message</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {chatLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
                            {log.user.charAt(0)}
                          </Avatar>
                          <Typography variant="body2">{log.user}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{log.room}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ maxWidth: 300 }}>
                          {log.message}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.type.toUpperCase()}
                          color={getTypeColor(log.type)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption">
                          {new Date(log.timestamp).toLocaleString()}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

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

export default AdminChat;