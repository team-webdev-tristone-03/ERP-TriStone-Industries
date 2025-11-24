import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, TextField, Rating, List, ListItem, ListItemText } from '@mui/material';
import { Feedback, Send, Star } from '@mui/icons-material';

const StudentFeedback = () => {
  const [newFeedback, setNewFeedback] = useState({ subject: '', message: '', rating: 0 });
  
  const feedbackHistory = [
    { id: 1, subject: 'Mathematics Class', message: 'Great teaching method', rating: 5, date: '2024-02-01', status: 'reviewed' },
    { id: 2, subject: 'Cafeteria Service', message: 'Food quality can be improved', rating: 3, date: '2024-01-28', status: 'pending' }
  ];

  const handleSubmit = () => {
    console.log('Feedback submitted:', newFeedback);
    setNewFeedback({ subject: '', message: '', rating: 0 });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Feedback</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Submit Feedback</Typography>
              <TextField
                fullWidth
                label="Subject"
                value={newFeedback.subject}
                onChange={(e) => setNewFeedback({...newFeedback, subject: e.target.value})}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Message"
                value={newFeedback.message}
                onChange={(e) => setNewFeedback({...newFeedback, message: e.target.value})}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Rating</Typography>
                <Rating
                  value={newFeedback.rating}
                  onChange={(event, newValue) => setNewFeedback({...newFeedback, rating: newValue})}
                />
              </Box>
              <Button 
                variant="contained" 
                startIcon={<Send />}
                onClick={handleSubmit}
                disabled={!newFeedback.subject || !newFeedback.message}
              >
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Feedback color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Feedback Submitted</Typography>
                  <Typography variant="h4">{feedbackHistory.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Feedback History</Typography>
              <List>
                {feedbackHistory.map((feedback) => (
                  <ListItem key={feedback.id}>
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">{feedback.subject}</Typography>
                        <Typography variant="body2" color="textSecondary">{feedback.date}</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>{feedback.message}</Typography>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Rating value={feedback.rating} readOnly size="small" />
                        <Typography variant="body2" color={feedback.status === 'reviewed' ? 'success.main' : 'warning.main'}>
                          {feedback.status}
                        </Typography>
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentFeedback;