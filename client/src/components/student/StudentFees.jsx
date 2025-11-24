import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  LinearProgress
} from '@mui/material';
import { Payment, Receipt } from '@mui/icons-material';
import { studentService } from '../../services/authService';

const StudentFees = () => {
  const [fees, setFees] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const response = await studentService.getFees();
        setFees(response.data);
      } catch (err) {
        setError('Failed to load fees data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'success';
      case 'pending':
        return 'warning';
      case 'overdue':
        return 'error';
      default:
        return 'default';
    }
  };

  const handlePayment = (installmentId) => {
    // Mock payment handler
    alert(`Payment initiated for installment ${installmentId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const paymentProgress = fees?.totalAmount > 0 
    ? (fees.paidAmount / fees.totalAmount * 100).toFixed(1)
    : 0;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fees & Payment
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Fees
              </Typography>
              <Typography variant="h4">
                ₹{fees?.totalAmount?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Paid Amount
              </Typography>
              <Typography variant="h4" color="success.main">
                ₹{fees?.paidAmount?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Due Amount
              </Typography>
              <Typography variant="h4" color="error.main">
                ₹{fees?.dueAmount?.toLocaleString() || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Payment Progress
              </Typography>
              <Typography variant="h4">
                {paymentProgress}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={paymentProgress}
                color={paymentProgress >= 75 ? 'success' : 'warning'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Fee Installments
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Installment</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fees?.installments?.length > 0 ? (
                  fees.installments.map((installment, index) => (
                    <TableRow key={index}>
                      <TableCell>Installment {index + 1}</TableCell>
                      <TableCell>₹{installment.amount?.toLocaleString()}</TableCell>
                      <TableCell>
                        {new Date(installment.dueDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={installment.status?.toUpperCase() || 'PENDING'}
                          color={getStatusColor(installment.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {installment.paidDate 
                          ? new Date(installment.paidDate).toLocaleDateString()
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        {installment.status !== 'paid' ? (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<Payment />}
                            onClick={() => handlePayment(index)}
                          >
                            Pay Now
                          </Button>
                        ) : (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Receipt />}
                            onClick={() => alert('Receipt downloaded')}
                          >
                            Receipt
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No installment records found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment Methods
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button variant="outlined" startIcon={<Payment />}>
                  Credit/Debit Card
                </Button>
                <Button variant="outlined" startIcon={<Payment />}>
                  Net Banking
                </Button>
                <Button variant="outlined" startIcon={<Payment />}>
                  UPI Payment
                </Button>
                <Button variant="outlined" startIcon={<Payment />}>
                  Bank Transfer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Payment History
              </Typography>
              <Typography variant="body2" color="textSecondary">
                View all your payment transactions and download receipts.
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                startIcon={<Receipt />}
              >
                View Payment History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentFees;