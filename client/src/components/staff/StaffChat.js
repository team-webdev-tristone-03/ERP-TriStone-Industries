import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, List, ListItem, ListItemText, Avatar, Paper } from '@mui/material';
import { Chat, Send, Person } from '@mui/icons-material';

const StaffChat = () => {
  const [message, setMessage] = useState('');
  const contacts = [
    { name: 'Admin', status: 'online', lastMessage: 'Meeting at 3 PM' },
    { name: 'Math Department', status: 'active', lastMessage: 'New curriculum updates' },
    { name: 'Parent Group', status: 'offline', lastMessage: 'PTM scheduled' }
  ];

  const messages = [
    { sender: 'Admin', message: 'Staff meeting today at 3 PM', time: '2:00 PM', type: 'received' },
    { sender: 'You', message: 'I will be there', time: '2:01 PM', type: 'sent' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Staff Chat</Typography>
      
      <Grid container spacing={3} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Contacts</Typography>
              <List>
                {contacts.map((contact, index) => (
                  <ListItem key={index} button>
                    <Avatar sx={{ mr: 2 }}><Person /></Avatar>
                    <ListItemText primary={contact.name} secondary={contact.lastMessage} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Admin</Typography>
              
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {messages.map((msg, index) => (
                  <Box key={index} sx={{ display: 'flex', justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start', mb: 1 }}>
                    <Paper sx={{ p: 1, maxWidth: '70%', bgcolor: msg.type === 'sent' ? 'primary.main' : 'grey.100', color: msg.type === 'sent' ? 'white' : 'text.primary' }}>
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>{msg.time}</Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              
              <Box display="flex" gap={1}>
                <TextField fullWidth placeholder="Type a message..." value={message} onChange={(e) => setMessage(e.target.value)} />
                <Button variant="contained" startIcon={<Send />}>Send</Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffChat;