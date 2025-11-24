import React, { useState, useEffect } from 'react';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress
} from '@mui/material';
import {
  Home,
  DirectionsBus,
  Hotel,
  Person,
  Add,
  Edit,
  Delete,
  Close,
  Search
} from '@mui/icons-material';
import { adminService, hostelService } from '../../services/authService';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

const AdminHostel = () => {
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [staff, setStaff] = useState([]);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [hostelAllocations, setHostelAllocations] = useState([]);
  const [transport, setTransport] = useState([]);
  const [transportAllocations, setTransportAllocations] = useState([]);
  const [searchTerms, setSearchTerms] = useState({
    hostels: '',
    rooms: '',
    transport: '',
    allocations: ''
  });
  const [formData, setFormData] = useState({
    // Hostel fields
    hostelName: '',
    hostelType: '',
    totalRooms: '',
    warden: '',
    facilities: '',
    // Room fields
    roomNumber: '',
    selectedHostel: '',
    capacity: '',
    roomType: '',
    floor: '',
    rent: '',
    roomFacilities: '',
    // Transport fields
    routeName: '',
    routeNumber: '',
    vehicleNumber: '',
    vehicleType: '',
    transportCapacity: '',
    driver: '',
    driverPhone: '',
    conductor: '',
    conductorPhone: '',
    monthlyFee: '',
    // Allocation fields
    selectedStudent: '',
    selectedRoom: '',
    selectedRoute: '',
    stopName: '',
    monthlyRent: '',
    securityDeposit: '',
    editingId: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [studentsRes, staffRes, hostelsRes, roomsRes, hostelAllocRes, transportRes, transportAllocRes] = await Promise.all([
        adminService.getStudents(1, 1000, ''),
        adminService.getStaff(1, 1000, ''),
        hostelService.getHostels().catch(() => ({ data: { data: [] } })),
        hostelService.getRooms().catch(() => ({ data: { data: [] } })),
        hostelService.getHostelAllocations().catch(() => ({ data: { data: [] } })),
        hostelService.getTransport().catch(() => ({ data: { data: [] } })),
        hostelService.getTransportAllocations().catch(() => ({ data: { data: [] } }))
      ]);
      
      setStudents(studentsRes.data?.data?.students || []);
      setStaff(staffRes.data?.data?.staff || []);
      setHostels(hostelsRes.data?.data || []);
      setRooms(roomsRes.data?.data || []);
      setHostelAllocations(hostelAllocRes.data?.data || []);
      setTransport(transportRes.data?.data || []);
      setTransportAllocations(transportAllocRes.data?.data || []);
      
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load data',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSearchChange = (tab, value) => {
    setSearchTerms(prev => ({ ...prev, [tab]: value }));
  };

  const handleSave = async () => {
    try {
      if (dialogType === 'hostel') {
        const hostelData = {
          name: formData.hostelName,
          type: formData.hostelType,
          totalRooms: parseInt(formData.totalRooms),
          warden: formData.warden,
          facilities: formData.facilities.split(',').map(f => f.trim())
        };
        
        if (formData.editingId) {
          await hostelService.updateHostel(formData.editingId, hostelData);
        } else {
          await hostelService.createHostel(hostelData);
        }
      } else if (dialogType === 'room') {
        const roomData = {
          roomNumber: formData.roomNumber,
          hostelId: formData.selectedHostel,
          hostelName: hostels.find(h => h._id === formData.selectedHostel)?.name || '',
          capacity: parseInt(formData.capacity),
          type: formData.roomType,
          floor: parseInt(formData.floor),
          rent: parseFloat(formData.rent),
          facilities: formData.roomFacilities.split(',').map(f => f.trim())
        };
        
        if (formData.editingId) {
          await hostelService.updateRoom(formData.editingId, roomData);
        } else {
          await hostelService.createRoom(roomData);
        }
      } else if (dialogType === 'transport') {
        const transportData = {
          routeName: formData.routeName,
          routeNumber: formData.routeNumber,
          vehicleNumber: formData.vehicleNumber,
          vehicleType: formData.vehicleType,
          capacity: parseInt(formData.transportCapacity),
          driver: formData.driver,
          driverPhone: formData.driverPhone,
          conductor: formData.conductor,
          conductorPhone: formData.conductorPhone,
          monthlyFee: parseFloat(formData.monthlyFee),
          stops: []
        };
        
        if (formData.editingId) {
          await hostelService.updateTransport(formData.editingId, transportData);
        } else {
          await hostelService.createTransport(transportData);
        }
      } else if (dialogType === 'hostelAllocation') {
        // Validation
        if (!formData.selectedStudent || !formData.selectedRoom || !formData.monthlyRent || !formData.securityDeposit) {
          setSnackbar({
            open: true,
            message: 'Please fill all required fields',
            severity: 'error'
          });
          return;
        }
        
        const student = students.find(s => s._id === formData.selectedStudent);
        const room = rooms.find(r => r._id === formData.selectedRoom);
        const hostel = hostels.find(h => h._id === room?.hostelId);
        
        if (!student || !room || !hostel) {
          setSnackbar({
            open: true,
            message: 'Invalid student, room, or hostel selection',
            severity: 'error'
          });
          return;
        }
        
        const allocationData = {
          studentId: formData.selectedStudent,
          studentName: `${student.userId?.profile?.firstName || ''} ${student.userId?.profile?.lastName || ''}`.trim(),
          studentRollNumber: student.studentId || '',
          hostelId: hostel._id,
          hostelName: hostel.name,
          roomId: formData.selectedRoom,
          roomNumber: room.roomNumber,
          monthlyRent: parseFloat(formData.monthlyRent) || 0,
          securityDeposit: parseFloat(formData.securityDeposit) || 0
        };
        
        console.log('Hostel allocation data:', allocationData);
        await hostelService.createHostelAllocation(allocationData);
      } else if (dialogType === 'transportAllocation') {
        const student = students.find(s => s._id === formData.selectedStudent);
        const route = transport.find(t => t._id === formData.selectedRoute);
        
        const allocationData = {
          studentId: formData.selectedStudent,
          studentName: `${student?.userId?.profile?.firstName} ${student?.userId?.profile?.lastName}`,
          studentRollNumber: student?.studentId,
          routeId: formData.selectedRoute,
          routeName: route?.routeName,
          stopName: formData.stopName,
          monthlyFee: parseFloat(formData.monthlyFee)
        };
        
        await hostelService.createTransportAllocation(allocationData);
      }
      
      await fetchData();
      
      setSnackbar({
        open: true,
        message: `${dialogType} saved successfully`,
        severity: 'success'
      });
      
      setOpenDialog(false);
      resetForm();
    } catch (error) {
      console.error('Save error:', error);
      const errorMessage = error.response?.data?.message || error.message || `Failed to save ${dialogType}`;
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    }
  };

  const handleDelete = async (type, id) => {
    try {
      if (type === 'hostel') {
        await hostelService.deleteHostel(id);
      } else if (type === 'room') {
        await hostelService.deleteRoom(id);
      } else if (type === 'transport') {
        await hostelService.deleteTransport(id);
      }
      
      await fetchData();
      
      setSnackbar({
        open: true,
        message: `${type} deleted successfully`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to delete ${type}`,
        severity: 'error'
      });
    }
  };

  const resetForm = () => {
    setFormData({
      hostelName: '',
      hostelType: '',
      totalRooms: '',
      warden: '',
      facilities: '',
      roomNumber: '',
      selectedHostel: '',
      capacity: '',
      roomType: '',
      floor: '',
      rent: '',
      roomFacilities: '',
      routeName: '',
      routeNumber: '',
      vehicleNumber: '',
      vehicleType: '',
      transportCapacity: '',
      driver: '',
      driverPhone: '',
      conductor: '',
      conductorPhone: '',
      monthlyFee: '',
      selectedStudent: '',
      selectedRoom: '',
      selectedRoute: '',
      stopName: '',
      monthlyRent: '',
      securityDeposit: '',
      editingId: null
    });
  };

  // Filter functions
  const filteredHostels = hostels.filter(hostel => 
    hostel.name.toLowerCase().includes(searchTerms.hostels.toLowerCase()) ||
    hostel.type.toLowerCase().includes(searchTerms.hostels.toLowerCase()) ||
    hostel.warden.toLowerCase().includes(searchTerms.hostels.toLowerCase())
  );

  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerms.rooms.toLowerCase()) ||
    room.hostelName.toLowerCase().includes(searchTerms.rooms.toLowerCase()) ||
    room.type.toLowerCase().includes(searchTerms.rooms.toLowerCase())
  );

  const filteredTransport = transport.filter(route => 
    route.routeName.toLowerCase().includes(searchTerms.transport.toLowerCase()) ||
    route.routeNumber.toLowerCase().includes(searchTerms.transport.toLowerCase()) ||
    route.vehicleNumber.toLowerCase().includes(searchTerms.transport.toLowerCase()) ||
    route.driver.toLowerCase().includes(searchTerms.transport.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Hostel & Transport Management
      </Typography>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Home color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Hostels</Typography>
                  <Typography variant="h4">{hostels.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Hotel color="success" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Rooms</Typography>
                  <Typography variant="h4">{rooms.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <DirectionsBus color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Transport Routes</Typography>
                  <Typography variant="h4">{transport.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="info" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography variant="h6">Total Allocations</Typography>
                  <Typography variant="h4">{hostelAllocations.length + transportAllocations.length}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%', mb: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} centered>
          <Tab label="Hostels" />
          <Tab label="Rooms" />
          <Tab label="Transport" />
          <Tab label="Allocations" />
        </Tabs>
      </Paper>

      {/* Hostels Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Hostel Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('hostel'); setOpenDialog(true); }}
          >
            Add Hostel
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search hostels by name, type, or warden..."
            value={searchTerms.hostels}
            onChange={(e) => handleSearchChange('hostels', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 400 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Hostel Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Total Rooms</TableCell>
                <TableCell>Occupied</TableCell>
                <TableCell>Warden</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredHostels.map((hostel) => (
                <TableRow key={hostel._id}>
                  <TableCell>{hostel.name}</TableCell>
                  <TableCell>
                    <Chip label={hostel.type} color="primary" size="small" />
                  </TableCell>
                  <TableCell>{hostel.totalRooms}</TableCell>
                  <TableCell>{hostel.occupiedRooms}</TableCell>
                  <TableCell>{hostel.warden}</TableCell>
                  <TableCell>
                    <Chip 
                      label={hostel.isActive ? 'Active' : 'Inactive'} 
                      color={hostel.isActive ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('hostel', hostel._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredHostels.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.hostels ? `No hostels found matching "${searchTerms.hostels}"` : 'No hostels found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Rooms Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Room Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('room'); setOpenDialog(true); }}
          >
            Add Room
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search rooms by number, hostel, or type..."
            value={searchTerms.rooms}
            onChange={(e) => handleSearchChange('rooms', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 400 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Hostel</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Floor</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Occupied</TableCell>
                <TableCell>Rent</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room._id}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.hostelName}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell>{room.occupied}</TableCell>
                  <TableCell>₹{room.rent}</TableCell>
                  <TableCell>
                    <Chip 
                      label={room.isAvailable ? 'Available' : 'Full'} 
                      color={room.isAvailable ? 'success' : 'error'} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('room', room._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRooms.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.rooms ? `No rooms found matching "${searchTerms.rooms}"` : 'No rooms found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Transport Tab */}
      <TabPanel value={tabValue} index={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Transport Management</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => { setDialogType('transport'); setOpenDialog(true); }}
          >
            Add Route
          </Button>
        </Box>
        
        <Box mb={3}>
          <TextField
            placeholder="Search transport by route, vehicle, or driver..."
            value={searchTerms.transport}
            onChange={(e) => handleSearchChange('transport', e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            sx={{ minWidth: 400 }}
            variant="outlined"
            size="small"
          />
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Route Name</TableCell>
                <TableCell>Route Number</TableCell>
                <TableCell>Vehicle</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Occupied</TableCell>
                <TableCell>Driver</TableCell>
                <TableCell>Monthly Fee</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransport.map((route) => (
                <TableRow key={route._id}>
                  <TableCell>{route.routeName}</TableCell>
                  <TableCell>{route.routeNumber}</TableCell>
                  <TableCell>{route.vehicleNumber}</TableCell>
                  <TableCell>{route.vehicleType}</TableCell>
                  <TableCell>{route.capacity}</TableCell>
                  <TableCell>{route.occupied}</TableCell>
                  <TableCell>{route.driver}</TableCell>
                  <TableCell>₹{route.monthlyFee}</TableCell>
                  <TableCell>
                    <IconButton size="small" color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => handleDelete('transport', route._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filteredTransport.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography color="textSecondary">
                      {searchTerms.transport ? `No transport routes found matching "${searchTerms.transport}"` : 'No transport routes found'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Allocations Tab */}
      <TabPanel value={tabValue} index={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6">Student Allocations</Typography>
          <Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => { setDialogType('hostelAllocation'); setOpenDialog(true); }}
              sx={{ mr: 1 }}
            >
              Allocate Hostel
            </Button>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => { setDialogType('transportAllocation'); setOpenDialog(true); }}
            >
              Allocate Transport
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Hostel Allocations</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Hostel</TableCell>
                    <TableCell>Room</TableCell>
                    <TableCell>Rent</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {hostelAllocations.map((allocation) => (
                    <TableRow key={allocation._id}>
                      <TableCell>{allocation.studentName}</TableCell>
                      <TableCell>{allocation.hostelName}</TableCell>
                      <TableCell>{allocation.roomNumber}</TableCell>
                      <TableCell>₹{allocation.monthlyRent}</TableCell>
                      <TableCell>
                        <Chip label={allocation.status} color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {hostelAllocations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="textSecondary">No hostel allocations found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>Transport Allocations</Typography>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Route</TableCell>
                    <TableCell>Stop</TableCell>
                    <TableCell>Fee</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transportAllocations.map((allocation) => (
                    <TableRow key={allocation._id}>
                      <TableCell>{allocation.studentName}</TableCell>
                      <TableCell>{allocation.routeName}</TableCell>
                      <TableCell>{allocation.stopName}</TableCell>
                      <TableCell>₹{allocation.monthlyFee}</TableCell>
                      <TableCell>
                        <Chip label={allocation.status} color="success" size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                  {transportAllocations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="textSecondary">No transport allocations found</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </TabPanel>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Add {dialogType}
            <IconButton onClick={() => setOpenDialog(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            {dialogType === 'hostel' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Hostel Name"
                    fullWidth
                    value={formData.hostelName}
                    onChange={(e) => handleInputChange('hostelName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={formData.hostelType}
                      onChange={(e) => handleInputChange('hostelType', e.target.value)}
                    >
                      <MenuItem value="Boys">Boys</MenuItem>
                      <MenuItem value="Girls">Girls</MenuItem>
                      <MenuItem value="Mixed">Mixed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Rooms"
                    type="number"
                    fullWidth
                    value={formData.totalRooms}
                    onChange={(e) => handleInputChange('totalRooms', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Warden</InputLabel>
                    <Select
                      value={formData.warden}
                      onChange={(e) => handleInputChange('warden', e.target.value)}
                    >
                      {staff.map((staffMember) => (
                        <MenuItem key={staffMember._id} value={`${staffMember.userId?.profile?.firstName} ${staffMember.userId?.profile?.lastName}`}>
                          {staffMember.userId?.profile?.firstName} {staffMember.userId?.profile?.lastName}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Facilities (comma separated)"
                    fullWidth
                    value={formData.facilities}
                    onChange={(e) => handleInputChange('facilities', e.target.value)}
                    placeholder="WiFi, Laundry, Mess, Security"
                  />
                </Grid>
              </>
            )}

            {dialogType === 'room' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Room Number"
                    fullWidth
                    value={formData.roomNumber}
                    onChange={(e) => handleInputChange('roomNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Hostel</InputLabel>
                    <Select
                      value={formData.selectedHostel}
                      onChange={(e) => handleInputChange('selectedHostel', e.target.value)}
                    >
                      {hostels.map((hostel) => (
                        <MenuItem key={hostel._id} value={hostel._id}>
                          {hostel.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Capacity"
                    type="number"
                    fullWidth
                    value={formData.capacity}
                    onChange={(e) => handleInputChange('capacity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Room Type</InputLabel>
                    <Select
                      value={formData.roomType}
                      onChange={(e) => handleInputChange('roomType', e.target.value)}
                    >
                      <MenuItem value="Single">Single</MenuItem>
                      <MenuItem value="Double">Double</MenuItem>
                      <MenuItem value="Triple">Triple</MenuItem>
                      <MenuItem value="Quad">Quad</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Floor"
                    type="number"
                    fullWidth
                    value={formData.floor}
                    onChange={(e) => handleInputChange('floor', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monthly Rent"
                    type="number"
                    fullWidth
                    value={formData.rent}
                    onChange={(e) => handleInputChange('rent', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Room Facilities (comma separated)"
                    fullWidth
                    value={formData.roomFacilities}
                    onChange={(e) => handleInputChange('roomFacilities', e.target.value)}
                    placeholder="AC, Attached Bathroom, Balcony"
                  />
                </Grid>
              </>
            )}

            {dialogType === 'transport' && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Route Name"
                    fullWidth
                    value={formData.routeName}
                    onChange={(e) => handleInputChange('routeName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Route Number"
                    fullWidth
                    value={formData.routeNumber}
                    onChange={(e) => handleInputChange('routeNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vehicle Number"
                    fullWidth
                    value={formData.vehicleNumber}
                    onChange={(e) => handleInputChange('vehicleNumber', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Vehicle Type</InputLabel>
                    <Select
                      value={formData.vehicleType}
                      onChange={(e) => handleInputChange('vehicleType', e.target.value)}
                    >
                      <MenuItem value="Bus">Bus</MenuItem>
                      <MenuItem value="Van">Van</MenuItem>
                      <MenuItem value="Mini Bus">Mini Bus</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Capacity"
                    type="number"
                    fullWidth
                    value={formData.transportCapacity}
                    onChange={(e) => handleInputChange('transportCapacity', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monthly Fee"
                    type="number"
                    fullWidth
                    value={formData.monthlyFee}
                    onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Driver Name"
                    fullWidth
                    value={formData.driver}
                    onChange={(e) => handleInputChange('driver', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Driver Phone"
                    fullWidth
                    value={formData.driverPhone}
                    onChange={(e) => handleInputChange('driverPhone', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Conductor Name"
                    fullWidth
                    value={formData.conductor}
                    onChange={(e) => handleInputChange('conductor', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Conductor Phone"
                    fullWidth
                    value={formData.conductorPhone}
                    onChange={(e) => handleInputChange('conductorPhone', e.target.value)}
                  />
                </Grid>
              </>
            )}

            {dialogType === 'hostelAllocation' && (
              <>
                <Grid item xs={12}>
                  <Typography variant="body2" color="textSecondary">
                    Students: {students.length}, Rooms: {rooms.length}, Available Rooms: {rooms.filter(room => (room.occupied || 0) < room.capacity).length}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select
                      value={formData.selectedStudent}
                      onChange={(e) => handleInputChange('selectedStudent', e.target.value)}
                    >
                      {students.length === 0 ? (
                        <MenuItem disabled>No students available</MenuItem>
                      ) : (
                        students.map((student) => (
                          <MenuItem key={student._id} value={student._id}>
                            {student.userId?.profile?.firstName} {student.userId?.profile?.lastName} ({student.studentId})
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Room</InputLabel>
                    <Select
                      value={formData.selectedRoom}
                      onChange={(e) => {
                        const selectedRoom = rooms.find(r => r._id === e.target.value);
                        handleInputChange('selectedRoom', e.target.value);
                        if (selectedRoom) {
                          handleInputChange('monthlyRent', selectedRoom.rent);
                        }
                      }}
                    >
                      {rooms.length === 0 ? (
                        <MenuItem disabled>No rooms available - Create rooms first</MenuItem>
                      ) : rooms.filter(room => (room.occupied || 0) < room.capacity).length === 0 ? (
                        <MenuItem disabled>All rooms are full</MenuItem>
                      ) : (
                        rooms.filter(room => (room.occupied || 0) < room.capacity).map((room) => (
                          <MenuItem key={room._id} value={room._id}>
                            {room.hostelName} - Room {room.roomNumber} ({room.capacity - (room.occupied || 0)} available) - ₹{room.rent}
                          </MenuItem>
                        ))
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monthly Rent"
                    type="number"
                    fullWidth
                    value={formData.monthlyRent}
                    onChange={(e) => handleInputChange('monthlyRent', e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Security Deposit"
                    type="number"
                    fullWidth
                    value={formData.securityDeposit}
                    onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                    required
                  />
                </Grid>
              </>
            )}

            {dialogType === 'transportAllocation' && (
              <>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Student</InputLabel>
                    <Select
                      value={formData.selectedStudent}
                      onChange={(e) => handleInputChange('selectedStudent', e.target.value)}
                    >
                      {students.map((student) => (
                        <MenuItem key={student._id} value={student._id}>
                          {student.userId?.profile?.firstName} {student.userId?.profile?.lastName} ({student.studentId})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Route</InputLabel>
                    <Select
                      value={formData.selectedRoute}
                      onChange={(e) => handleInputChange('selectedRoute', e.target.value)}
                    >
                      {transport.map((route) => (
                        <MenuItem key={route._id} value={route._id}>
                          {route.routeName} - {route.routeNumber} (₹{route.monthlyFee})
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Stop Name"
                    fullWidth
                    value={formData.stopName}
                    onChange={(e) => handleInputChange('stopName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Monthly Fee"
                    type="number"
                    fullWidth
                    value={formData.monthlyFee}
                    onChange={(e) => handleInputChange('monthlyFee', e.target.value)}
                  />
                </Grid>
              </>
            )}
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

export default AdminHostel;