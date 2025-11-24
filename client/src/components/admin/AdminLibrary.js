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
  InputAdornment
} from '@mui/material';
import {
  LibraryBooks,
  Book,
  Assignment,
  Payment,
  Add,
  Edit,
  Delete,
  Search,
  Close,
  AssignmentReturn,
  Warning
} from '@mui/icons-material';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminLibrary = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Mock data
  const books = [
    { id: 1, title: 'Advanced Mathematics', author: 'Dr. John Smith', isbn: '978-0123456789', category: 'Mathematics', copies: 15, available: 12, location: 'A-101' },
    { id: 2, title: 'Physics Fundamentals', author: 'Prof. Jane Doe', isbn: '978-0987654321', category: 'Physics', copies: 20, available: 18, location: 'B-205' },
    { id: 3, title: 'Chemistry Basics', author: 'Dr. Mike Johnson', isbn: '978-0456789123', category: 'Chemistry', copies: 12, available: 10, location: 'C-301' }
  ];

  const issuedBooks = [
    { id: 1, book: 'Advanced Mathematics', student: 'John Doe', studentId: 'STU001', issueDate: '2024-01-15', dueDate: '2024-02-15', status: 'issued', fine: 0 },
    { id: 2, book: 'Physics Fundamentals', student: 'Jane Smith', studentId: 'STU002', issueDate: '2024-01-10', dueDate: '2024-02-10', status: 'overdue', fine: 50 },
    { id: 3, book: 'Chemistry Basics', student: 'Mike Wilson', studentId: 'STU003', issueDate: '2024-01-20', dueDate: '2024-02-20', status: 'returned', fine: 0 }
  ];

  const fines = [
    { id: 1, student: 'Jane Smith', studentId: 'STU002', book: 'Physics Fundamentals', overdueDays: 5, fineAmount: 50, status: 'pending' },
    { id: 2, student: 'Carol Davis', studentId: 'STU004', book: 'History of Science', overdueDays: 3, fineAmount: 30, status: 'paid' },
    { id: 3, student: 'David Brown', studentId: 'STU005', book: 'English Literature', overdueDays: 7, fineAmount: 70, status: 'pending' }
  ];

  const handleSave = () => {
    setSnackbar({
      open: true,
      message: `${dialogType} saved successfully`,
      severity: 'success'
    });
    setOpenDialog(false);
  };

  const handleIssueBook = () => {
    setSnackbar({
      open: true,
      message: 'Book issued successfully',
      severity: 'success'
    });
  };

  const handleReturnBook = (id) => {
    setSnackbar({
      open: true,
      message: 'Book returned successfully',
      severity: 'success'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'issued': return 'primary';
      case 'returned': return 'success';
      case 'overdue': return 'error';
      case 'paid': return 'success';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const totalBooks = books.reduce((sum, book) => sum + book.copies, 0);
  const availableBooks = books.reduce((sum, book) => sum + book.available, 0);
  const issuedCount = issuedBooks.filter(book => book.status === 'issued' || book.status === 'overdue').length;
  const totalFines = fines.filter(fine => fine.status === 'pending').reduce((sum, fine) => sum + fine.fineAmount, 0);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Library Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <LibraryBooks color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Books</Typography>
                  <Typography variant="h4">{totalBooks}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Book color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Available</Typography>
                  <Typography variant="h4">{availableBooks}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assignment color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Issued</Typography>
                  <Typography variant="h4">{issuedCount}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Payment color="error" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Pending Fines</Typography>
                  <Typography variant="h4">₹{totalFines}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <TextField
          placeholder="Search books, students, or ISBN..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            )
          }}
          sx={{ minWidth: 400 }}
        />
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => { setDialogType('book'); setOpenDialog(true); }}
        >
          Add Book
        </Button>
      </Box>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Books Catalog" />
          <Tab label="Issue/Return" />
          <Tab label="Fine System" />
        </Tabs>
      </Paper>

      {/* Books Catalog Tab */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>ISBN</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Total Copies</TableCell>
                <TableCell>Available</TableCell>
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
                  <TableCell>
                    <Chip label={book.category} size="small" color="primary" />
                  </TableCell>
                  <TableCell>{book.copies}</TableCell>
                  <TableCell>
                    <Chip 
                      label={book.available}
                      color={book.available > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{book.location}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
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

      {/* Issue/Return Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Issue/Return Management</Typography>
          <Button
            variant="contained"
            startIcon={<Assignment />}
            onClick={() => { setDialogType('issue'); setOpenDialog(true); }}
          >
            Issue Book
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                <TableCell>Book</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Fine</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {issuedBooks.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{issue.student.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="body2" fontWeight="bold">
                          {issue.student}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {issue.studentId}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>{issue.book}</TableCell>
                  <TableCell>{new Date(issue.issueDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(issue.dueDate).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={issue.status.toUpperCase()}
                      color={getStatusColor(issue.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {issue.fine > 0 ? (
                      <Chip label={`₹${issue.fine}`} color="error" size="small" />
                    ) : (
                      <Typography variant="body2">-</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {issue.status !== 'returned' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<AssignmentReturn />}
                        onClick={() => handleReturnBook(issue.id)}
                      >
                        Return
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Fine System Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Fine Management</Typography>

        <List>
          {fines.map((fine) => (
            <Paper key={fine.id} sx={{ mb: 2 }}>
              <ListItem>
                <Avatar sx={{ mr: 2 }}>
                  <Warning color={fine.status === 'pending' ? 'error' : 'success'} />
                </Avatar>
                <ListItemText
                  primary={
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="h6">{fine.student}</Typography>
                      <Chip
                        label={fine.status.toUpperCase()}
                        color={getStatusColor(fine.status)}
                        size="small"
                      />
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2">
                        Book: {fine.book}
                      </Typography>
                      <Typography variant="body2">
                        Overdue: {fine.overdueDays} days
                      </Typography>
                      <Typography variant="body2" color="error">
                        Fine Amount: ₹{fine.fineAmount}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Student ID: {fine.studentId}
                      </Typography>
                    </Box>
                  }
                />
                {fine.status === 'pending' && (
                  <Box>
                    <Button variant="contained" color="success" size="small">
                      Collect Fine
                    </Button>
                  </Box>
                )}
              </ListItem>
            </Paper>
          ))}
        </List>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            {dialogType === 'book' ? 'Add Book' : 'Issue Book'}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {dialogType === 'book' && (
            <Box>
              <TextField label="Title" fullWidth margin="normal" />
              <TextField label="Author" fullWidth margin="normal" />
              <TextField label="ISBN" fullWidth margin="normal" />
              <TextField label="Category" fullWidth margin="normal" />
              <TextField label="Number of Copies" type="number" fullWidth margin="normal" />
              <TextField label="Location" fullWidth margin="normal" />
            </Box>
          )}
          {dialogType === 'issue' && (
            <Box>
              <TextField label="Student ID" fullWidth margin="normal" />
              <TextField label="Student Name" fullWidth margin="normal" />
              <TextField label="Book Title" fullWidth margin="normal" />
              <TextField label="ISBN" fullWidth margin="normal" />
              <TextField 
                label="Issue Date" 
                type="date" 
                fullWidth 
                margin="normal" 
                InputLabelProps={{ shrink: true }}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              <TextField 
                label="Due Date" 
                type="date" 
                fullWidth 
                margin="normal" 
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">
            {dialogType === 'book' ? 'Add Book' : 'Issue Book'}
          </Button>
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

export default AdminLibrary;