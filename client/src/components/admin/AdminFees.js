import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Snackbar,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  Payment,
  Receipt,
  Schedule,
  TrendingUp,
  Add,
  Edit,
  Visibility,
  Download,
  Close,
  Print,
  Warning
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminFees = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  const feeStructure = [
    { id: 1, class: '10th Grade', tuitionFee: 15000, labFee: 2000, libraryFee: 500, examFee: 1000, total: 18500 },
    { id: 2, class: '11th Grade', tuitionFee: 18000, labFee: 2500, libraryFee: 500, examFee: 1200, total: 22200 },
    { id: 3, class: '12th Grade', tuitionFee: 20000, labFee: 3000, libraryFee: 500, examFee: 1500, total: 25000 }
  ];

  const installments = [
    { id: 1, student: 'John Doe', studentId: 'STU001', class: '10-A', installment: 1, amount: 6167, dueDate: '2024-04-15', status: 'paid', paidDate: '2024-04-10' },
    { id: 2, student: 'Jane Smith', studentId: 'STU002', class: '11-B', installment: 2, amount: 7400, dueDate: '2024-07-15', status: 'pending', paidDate: null },
    { id: 3, student: 'Mike Johnson', studentId: 'STU003', class: '12-A', installment: 1, amount: 8333, dueDate: '2024-04-15', status: 'overdue', paidDate: null }
  ];

  const paymentHistory = [
    { id: 1, student: 'John Doe', studentId: 'STU001', amount: 6167, paymentDate: '2024-04-10', method: 'Online', receiptNo: 'RCP001', status: 'completed' },
    { id: 2, student: 'Sarah Wilson', studentId: 'STU004', amount: 7400, paymentDate: '2024-04-08', method: 'Cash', receiptNo: 'RCP002', status: 'completed' },
    { id: 3, student: 'David Brown', studentId: 'STU005', amount: 8333, paymentDate: '2024-04-05', method: 'Cheque', receiptNo: 'RCP003', status: 'completed' }
  ];

  const receipts = [
    { id: 1, receiptNo: 'RCP001', student: 'John Doe', amount: 6167, date: '2024-04-10', status: 'generated' },
    { id: 2, receiptNo: 'RCP002', student: 'Sarah Wilson', amount: 7400, date: '2024-04-08', status: 'generated' },
    { id: 3, receiptNo: 'RCP003', student: 'David Brown', amount: 8333, date: '2024-04-05', status: 'generated' }
  ];

  const dueReports = [
    { student: 'Jane Smith', studentId: 'STU002', class: '11-B', totalDue: 14800, overdueDays: 0, lastPayment: '2024-01-15' },
    { student: 'Mike Johnson', studentId: 'STU003', class: '12-A', totalDue: 16667, overdueDays: 15, lastPayment: '2024-01-10' },
    { student: 'Carol Davis', studentId: 'STU006', class: '10-C', totalDue: 12333, overdueDays: 5, lastPayment: '2024-02-20' }
  ];

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `${dialogType} saved successfully`,
      severity: 'success'
    });
    setOpenDialog(false);
  };

  const handleGenerateReceipt = (paymentId) => {
    setSnackbar({
      open: true,
      message: 'Receipt generated successfully',
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
      case 'completed':
      case 'generated':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const totalCollected = paymentHistory.reduce((sum, payment) => sum + payment.amount, 0);
  const totalPending = installments.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount, 0);
  const totalOverdue = installments.filter(i => i.status === 'overdue').reduce((sum, i) => sum + i.amount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fees Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Collected</Typography>
                  <Typography variant="h4">₹{totalCollected.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Schedule color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Pending</Typography>
                  <Typography variant="h4">₹{totalPending.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Warning color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Overdue</Typography>
                  <Typography variant="h4">₹{totalOverdue.toLocaleString()}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Receipt color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Receipts</Typography>
                  <Typography variant="h4">{receipts.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Fee Structure" />
          <Tab label="Installments" />
          <Tab label="Payment History" />
          <Tab label="Receipts" />
          <Tab label="Due Reports" />
        </Tabs>
      </Paper>

      {/* Fee Structure Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Fee Structure</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('feeStructure'); setOpenDialog(true); }}
          >
            Add Fee Structure
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Class</TableCell>
                <TableCell>Tuition Fee</TableCell>
                <TableCell>Lab Fee</TableCell>
                <TableCell>Library Fee</TableCell>
                <TableCell>Exam Fee</TableCell>
                <TableCell>Total</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feeStructure.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.class}</TableCell>
                  <TableCell>₹{fee.tuitionFee.toLocaleString()}</TableCell>
                  <TableCell>₹{fee.labFee.toLocaleString()}</TableCell>
                  <TableCell>₹{fee.libraryFee.toLocaleString()}</TableCell>
                  <TableCell>₹{fee.examFee.toLocaleString()}</TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      ₹{fee.total.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Installments Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Installment Management</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Installment</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{installment.student.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {installment.student}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {installment.studentId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{installment.class}</TableCell>
                  <TableCell>
                    <Chip label={`Installment ${installment.installment}`} size="small" />
                  </TableCell>
                  <TableCell>₹{installment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(installment.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={installment.status.toUpperCase()}
                      color={getStatusColor(installment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small" color="secondary">
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Payment History Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Payment History</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Method</TableCell>
                <TableCell>Receipt No</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{payment.student.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {payment.student}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {payment.studentId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                  <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip label={payment.method} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>{payment.receiptNo}</TableCell>
                  <TableCell>
                    <Chip
                      label={payment.status.toUpperCase()}
                      color={getStatusColor(payment.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Visibility />
                    </IconButton>
                    <Button
                      size="small"
                      startIcon={<Receipt />}
                      onClick={() => handleGenerateReceipt(payment.id)}
                    >
                      Receipt
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Receipts Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Receipt Generation</Typography>

        <List>
          {receipts.map((receipt) => (
            <Paper key={receipt.id} sx={{ mb: 2 }}>
              <ListItem>
                <Avatar sx={{ mr: 2 }}>
                  <Receipt />
                </Avatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{receipt.receiptNo}</Typography>
                      <Chip
                        label={receipt.status.toUpperCase()}
                        color={getStatusColor(receipt.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Student: {receipt.student}
                      </Typography>
                      <Typography variant="body2">
                        Amount: ₹{receipt.amount.toLocaleString()}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Date: {new Date(receipt.date).toLocaleDateString()}
                      </Typography>
                    </Box>
                  }
                />
                <Box>
                  <IconButton color="primary">
                    <Download />
                  </IconButton>
                  <IconButton color="secondary">
                    <Print />
                  </IconButton>
                </Box>
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Due Reports Tab */}
      <TabPanel value={tabValue} index={4}>
        <Typography variant="h6" gutterBottom>Due Reports</Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Total Due</TableCell>
                <TableCell>Overdue Days</TableCell>
                <TableCell>Last Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dueReports.map((report, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{report.student.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {report.student}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {report.studentId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{report.class}</TableCell>
                  <TableCell>
                    <Typography variant="h6" color="error">
                      ₹{report.totalDue.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {report.overdueDays > 0 ? (
                      <Chip label={`${report.overdueDays} days`} color="error" size="small" />
                    ) : (
                      <Chip label="On time" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>{new Date(report.lastPayment).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button size="small" variant="outlined" color="primary">
                      Send Reminder
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add Fee Structure
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Class</InputLabel>
                <Select>
                  <MenuItem value="9th Grade">9th Grade</MenuItem>
                  <MenuItem value="10th Grade">10th Grade</MenuItem>
                  <MenuItem value="11th Grade">11th Grade</MenuItem>
                  <MenuItem value="12th Grade">12th Grade</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tuition Fee" type="number" fullWidth margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Lab Fee" type="number" fullWidth margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Library Fee" type="number" fullWidth margin="normal" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Exam Fee" type="number" fullWidth margin="normal" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminFees;