import React from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField } from '@mui/material';
import { LibraryBooks, Search, Add } from '@mui/icons-material';

const StaffLibrary = () => {
  const books = [
    { id: 1, title: 'Advanced Mathematics', author: 'John Smith', isbn: '978-123456789', status: 'available', location: 'A-101' },
    { id: 2, title: 'Physics Fundamentals', author: 'Jane Doe', isbn: '978-987654321', status: 'borrowed', location: 'B-205' }
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Library Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Search Books</Typography>
              <Box display="flex" gap={1}>
                <TextField placeholder="Search books..." size="small" fullWidth />
                <Button variant="contained" startIcon={<Search />}>Search</Button>
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
                  <Typography variant="h6">Total Books</Typography>
                  <Typography variant="h4">{books.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Book Inventory</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Author</TableCell>
                      <TableCell>ISBN</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Location</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {books.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell>{book.isbn}</TableCell>
                        <TableCell>{book.status}</TableCell>
                        <TableCell>{book.location}</TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small">Manage</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StaffLibrary;