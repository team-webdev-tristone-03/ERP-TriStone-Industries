import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Assignment, Add, Visibility } from '@mui/icons-material';

const StaffHomework = () => {
  const [open, setOpen] = useState(false);
  const [newHomework, setNewHomework] = useState({ title: '', description: '', class: '10th A', subject: 'Mathematics', dueDate: '' });
  
  const [assignments] = useState([
    { id: 1, title: 'Algebra Problems', class: '10th A', subject: 'Mathematics', dueDate: '2024-02-20', submitted: 25, total: 35, status: 'active' },
    { id: 2, title: 'Geometry Exercises', class: '10th B', subject: 'Mathematics', dueDate: '2024-02-18', submitted: 30, total: 32, status: 'active' },
    { id: 3, title: 'Trigonometry Quiz', class: '9th A', subject: 'Mathematics', dueDate: '2024-02-15', submitted: 38, total: 38, status: 'completed' }
  ]);

  const handleCreateHomework = () => {
    console.log('Creating homework:', newHomework);
    setOpen(false);
    setNewHomework({ title: '', description: '', class: '10th A', subject: 'Mathematics', dueDate: '' });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Homework Management</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Total Assignments</Typography>
                  <Typography variant="h4">{assignments.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Completed</Typography>
                  <Typography variant="h4">{assignments.filter(a => a.status === 'completed').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">Create New</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
                    Add Homework
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>All Assignments</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Subject</TableCell>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Submissions</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignments.map((assignment) => (
                      <TableRow key={assignment.id}>
                        <TableCell>{assignment.title}</TableCell>
                        <TableCell>{assignment.class}</TableCell>
                        <TableCell>{assignment.subject}</TableCell>
                        <TableCell>{assignment.dueDate}</TableCell>
                        <TableCell>{assignment.submitted}/{assignment.total}</TableCell>
                        <TableCell>
                          <Chip 
                            label={assignment.status} 
                            color={assignment.status === 'completed' ? 'success' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button variant="outlined" size="small" startIcon={<Visibility />}>
                            View
                          </Button>
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

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Homework</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                value={newHomework.title}
                onChange={(e) => setNewHomework({...newHomework, title: e.target.value})}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={newHomework.description}
                onChange={(e) => setNewHomework({...newHomework, description: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Class"
                value={newHomework.class}
                onChange={(e) => setNewHomework({...newHomework, class: e.target.value})}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Due Date"
                type="date"
                value={newHomework.dueDate}
                onChange={(e) => setNewHomework({...newHomework, dueDate: e.target.value})}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateHomework} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default StaffHomework;