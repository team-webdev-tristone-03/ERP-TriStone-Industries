import React, { useState } from 'react';
import { Card, CardContent, Typography, Grid, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip } from '@mui/material';
import { Approval, CheckCircle, Cancel } from '@mui/icons-material';

const StaffApprovals = () => {
  const [pendingApprovals, setPendingApprovals] = useState([
    { id: 1, type: 'Leave Request', student: 'John Doe', class: '10th A', reason: 'Medical appointment', date: '2024-02-15', status: 'pending' },
    { id: 2, type: 'Assignment Extension', student: 'Jane Smith', class: '10th A', reason: 'Family emergency', date: '2024-02-14', status: 'pending' },
    { id: 3, type: 'Exam Re-evaluation', student: 'Mike Johnson', class: '9th A', reason: 'Calculation error', date: '2024-02-13', status: 'pending' }
  ]);

  const [processedApprovals] = useState([
    { id: 4, type: 'Leave Request', student: 'Sarah Wilson', class: '10th B', reason: 'Sports competition', date: '2024-02-10', status: 'approved' },
    { id: 5, type: 'Assignment Extension', student: 'Tom Brown', class: '9th A', reason: 'Technical issues', date: '2024-02-09', status: 'rejected' }
  ]);

  const handleApproval = (id, action) => {
    setPendingApprovals(prev => 
      prev.map(item => 
        item.id === id ? { ...item, status: action } : item
      )
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Approvals</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Approval color="warning" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Pending Approvals</Typography>
                  <Typography variant="h4">{pendingApprovals.filter(a => a.status === 'pending').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <CheckCircle color="success" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Approved</Typography>
                  <Typography variant="h4">{processedApprovals.filter(a => a.status === 'approved').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Cancel color="error" sx={{ mr: 2 }} />
                <Box>
                  <Typography variant="h6">Rejected</Typography>
                  <Typography variant="h4">{processedApprovals.filter(a => a.status === 'rejected').length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Pending Approvals</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pendingApprovals.filter(approval => approval.status === 'pending').map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>{approval.type}</TableCell>
                        <TableCell>{approval.student}</TableCell>
                        <TableCell>{approval.class}</TableCell>
                        <TableCell>{approval.reason}</TableCell>
                        <TableCell>{approval.date}</TableCell>
                        <TableCell>
                          <Chip label={approval.status} color="warning" size="small" />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="contained" 
                            color="success" 
                            size="small" 
                            sx={{ mr: 1 }}
                            onClick={() => handleApproval(approval.id, 'approved')}
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="contained" 
                            color="error" 
                            size="small"
                            onClick={() => handleApproval(approval.id, 'rejected')}
                          >
                            Reject
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
        
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Recent Decisions</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Type</TableCell>
                      <TableCell>Student</TableCell>
                      <TableCell>Class</TableCell>
                      <TableCell>Reason</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {processedApprovals.map((approval) => (
                      <TableRow key={approval.id}>
                        <TableCell>{approval.type}</TableCell>
                        <TableCell>{approval.student}</TableCell>
                        <TableCell>{approval.class}</TableCell>
                        <TableCell>{approval.reason}</TableCell>
                        <TableCell>{approval.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={approval.status} 
                            color={approval.status === 'approved' ? 'success' : 'error'} 
                            size="small" 
                          />
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

export default StaffApprovals;