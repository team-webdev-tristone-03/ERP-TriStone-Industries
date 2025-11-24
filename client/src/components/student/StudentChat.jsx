import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, TextField, Button, List, ListItem, ListItemText, Avatar, Paper } from '@mui/material';
import { Chat, Send, Person } from '@mui/icons-material';

const StudentChat = () => {
  const [message, setMessage] = useState('');
  const [messages] = useState([
    { id: 1, sender: 'Teacher', message: 'Good morning class!', time: '9:00 AM', type: 'received' },
    { id: 2, sender: 'You', message: 'Good morning sir!', time: '9:01 AM', type: 'sent' },
    { id: 3, sender: 'Teacher', message: 'Today we will discuss Chapter 5', time: '9:02 AM', type: 'received' }
  ]);

  const contacts = [
    { name: 'Math Teacher', status: 'online', lastMessage: 'Today we will discuss Chapter 5' },
    { name: 'Class Group', status: 'active', lastMessage: 'Assignment due tomorrow' },
    { name: 'Physics Teacher', status: 'offline', lastMessage: 'Lab session at 2 PM' }
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Chat</Typography>
      
      <Grid container spacing={3} sx={{ height: '70vh' }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Contacts</Typography>
              <List>
                {contacts.map((contact, index) => (
                  <ListItem key={index} button>
                    <Avatar sx={{ mr: 2 }}>
                      <Person />
                    </Avatar>
                    <ListItemText 
                      primary={contact.name}
                      secondary={contact.lastMessage}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="h6" gutterBottom>Math Teacher</Typography>
              
              <Box sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
                {messages.map((msg) => (
                  <Box 
                    key={msg.id} 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: msg.type === 'sent' ? 'flex-end' : 'flex-start',
                      mb: 1
                    }}
                  >
                    <Paper 
                      sx={{ 
                        p: 1, 
                        maxWidth: '70%',
                        bgcolor: msg.type === 'sent' ? 'primary.main' : 'grey.100',
                        color: msg.type === 'sent' ? 'white' : 'text.primary'
                      }}
                    >
                      <Typography variant="body2">{msg.message}</Typography>
                      <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        {msg.time}
                      </Typography>
                    </Paper>
                  </Box>
                ))}
              </Box>
              
              <Box display="flex" gap={1}>
                <TextField
                  fullWidth
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button 
                  variant="contained" 
                  onClick={handleSend}
                  startIcon={<Send />}
                >
                  Send
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentChat;