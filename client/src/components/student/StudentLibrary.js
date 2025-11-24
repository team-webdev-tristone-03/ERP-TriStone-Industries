import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Chip, List, ListItem, ListItemText, Button, TextField } from '@mui/material';
import { LibraryBooks, Search, BookmarkAdded } from '@mui/icons-material';

const StudentLibrary = () => {
  const borrowedBooks = [
    { id: 1, title: 'Physics Fundamentals', author: 'John Doe', issueDate: '2024-02-01', dueDate: '2024-02-15', status: 'active' },
    { id: 2, title: 'Mathematics Advanced', author: 'Jane Smith', issueDate: '2024-01-25', dueDate: '2024-02-08', status: 'overdue' }
  ];

  const availableBooks = [
    { id: 3, title: 'Chemistry Basics', author: 'Robert Brown', available: true },
    { id: 4, title: 'Biology Concepts', author: 'Sarah Wilson', available: true },
    { id: 5, title: 'History of Science', author: 'Mike Johnson', available: false }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Library</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Search Books</Typography>
              <Box display="flex" gap={1}>
                <TextField 
                  placeholder="Search by title or author" 
                  size="small" 
                  fullWidth
                />
                <Button variant="contained" startIcon={<Search />}>
                  Search
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LibraryBooks color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Books Borrowed</Typography>
                  <Typography variant="h4">{borrowedBooks.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Borrowed Books</Typography>
              <List>
                {borrowedBooks.map((book) => (
                  <ListItem key={book.id}>
                    <ListItemText 
                      primary={book.title}
                      secondary={`Author: ${book.author} | Due: ${book.dueDate}`}
                    />
                    <Chip 
                      label={book.status} 
                      color={book.status === 'overdue' ? 'error' : 'success'}
                      size="small"
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Available Books</Typography>
              <List>
                {availableBooks.map((book) => (
                  <ListItem key={book.id} secondaryAction={
                    <Button 
                      variant="contained" 
                      size="small"
                      disabled={!book.available}
                    >
                      {book.available ? 'Borrow' : 'Not Available'}
                    </Button>
                  }>
                    <ListItemText 
                      primary={book.title}
                      secondary={`Author: ${book.author}`}
                    />
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

export default StudentLibrary;