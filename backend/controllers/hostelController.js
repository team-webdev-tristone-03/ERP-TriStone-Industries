const { Hostel, Room, HostelAllocation, Transport, TransportAllocation } = require('../models/Hostel');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

// Hostels
const getHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostels',
      error: error.message
    });
  }
};

const createHostel = async (req, res) => {
  try {
    const { name, type, totalRooms, warden, wardenId, facilities } = req.body;
    
    const newHostel = new Hostel({
      name,
      type,
      totalRooms,
      warden,
      wardenId,
      facilities: Array.isArray(facilities) ? facilities : facilities?.split(',').map(f => f.trim()) || []
    });
    
    await newHostel.save();
    
    res.status(201).json({
      success: true,
      message: 'Hostel created successfully',
      data: newHostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create hostel',
      error: error.message
    });
  }
};

const updateHostel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, totalRooms, warden, wardenId, facilities } = req.body;
    
    const updatedHostel = await Hostel.findByIdAndUpdate(
      id,
      {
        name,
        type,
        totalRooms,
        warden,
        wardenId,
        facilities: Array.isArray(facilities) ? facilities : facilities?.split(',').map(f => f.trim()) || []
      },
      { new: true }
    );
    
    if (!updatedHostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hostel updated successfully',
      data: updatedHostel
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update hostel',
      error: error.message
    });
  }
};

const deleteHostel = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedHostel = await Hostel.findByIdAndDelete(id);
    
    if (!deletedHostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Hostel deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete hostel',
      error: error.message
    });
  }
};

// Rooms
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('hostelId', 'name').sort({ hostelName: 1, roomNumber: 1 });
    res.json({
      success: true,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rooms',
      error: error.message
    });
  }
};

const createRoom = async (req, res) => {
  try {
    const { roomNumber, hostelId, hostelName, capacity, type, floor, rent, facilities } = req.body;
    
    const newRoom = new Room({
      roomNumber,
      hostelId,
      hostelName,
      capacity,
      type,
      floor,
      rent,
      facilities: Array.isArray(facilities) ? facilities : facilities?.split(',').map(f => f.trim()) || []
    });
    
    await newRoom.save();
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: newRoom
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create room',
      error: error.message
    });
  }
};

const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { roomNumber, hostelId, hostelName, capacity, type, floor, rent, facilities } = req.body;
    
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      {
        roomNumber,
        hostelId,
        hostelName,
        capacity,
        type,
        floor,
        rent,
        facilities: Array.isArray(facilities) ? facilities : facilities?.split(',').map(f => f.trim()) || []
      },
      { new: true }
    );
    
    if (!updatedRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update room',
      error: error.message
    });
  }
};

const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedRoom = await Room.findByIdAndDelete(id);
    
    if (!deletedRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete room',
      error: error.message
    });
  }
};

// Hostel Allocations
const getHostelAllocations = async (req, res) => {
  try {
    const allocations = await HostelAllocation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: allocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hostel allocations',
      error: error.message
    });
  }
};

const createHostelAllocation = async (req, res) => {
  try {
    const { studentId, studentName, studentRollNumber, hostelId, hostelName, roomId, roomNumber, monthlyRent, securityDeposit } = req.body;
    
    // Validation
    if (!studentId || !studentName || !hostelId || !roomId || !monthlyRent) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentId, studentName, hostelId, roomId, monthlyRent'
      });
    }
    
    // Check if student already has hostel allocation
    const existingAllocation = await HostelAllocation.findOne({ 
      studentId, 
      isActive: true 
    });
    
    if (existingAllocation) {
      return res.status(400).json({
        success: false,
        message: 'Student already has an active hostel allocation'
      });
    }
    
    // Check room availability
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    if (room.occupied >= room.capacity) {
      return res.status(400).json({
        success: false,
        message: 'Room is at full capacity'
      });
    }
    
    const newAllocation = new HostelAllocation({
      studentId,
      studentName,
      studentRollNumber: studentRollNumber || '',
      hostelId,
      hostelName,
      roomId,
      roomNumber,
      monthlyRent: Number(monthlyRent),
      securityDeposit: Number(securityDeposit) || 0
    });
    
    await newAllocation.save();
    
    // Update room occupancy
    await Room.findByIdAndUpdate(roomId, { 
      $inc: { occupied: 1 },
      $set: { isAvailable: room.occupied + 1 < room.capacity }
    });
    
    // Update hostel occupancy
    await Hostel.findByIdAndUpdate(hostelId, { $inc: { occupiedRooms: 1 } });
    
    res.status(201).json({
      success: true,
      message: 'Hostel allocation created successfully',
      data: newAllocation
    });
  } catch (error) {
    console.error('Hostel allocation error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create hostel allocation',
      error: error.message
    });
  }
};

// Transport
const getTransport = async (req, res) => {
  try {
    const transport = await Transport.find().sort({ routeName: 1 });
    res.json({
      success: true,
      data: transport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport',
      error: error.message
    });
  }
};

const createTransport = async (req, res) => {
  try {
    const { routeName, routeNumber, vehicleNumber, vehicleType, capacity, driver, driverPhone, conductor, conductorPhone, stops, monthlyFee } = req.body;
    
    const newTransport = new Transport({
      routeName,
      routeNumber,
      vehicleNumber,
      vehicleType,
      capacity,
      driver,
      driverPhone,
      conductor,
      conductorPhone,
      stops: Array.isArray(stops) ? stops : [],
      monthlyFee
    });
    
    await newTransport.save();
    
    res.status(201).json({
      success: true,
      message: 'Transport route created successfully',
      data: newTransport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create transport route',
      error: error.message
    });
  }
};

const updateTransport = async (req, res) => {
  try {
    const { id } = req.params;
    const { routeName, routeNumber, vehicleNumber, vehicleType, capacity, driver, driverPhone, conductor, conductorPhone, stops, monthlyFee } = req.body;
    
    const updatedTransport = await Transport.findByIdAndUpdate(
      id,
      {
        routeName,
        routeNumber,
        vehicleNumber,
        vehicleType,
        capacity,
        driver,
        driverPhone,
        conductor,
        conductorPhone,
        stops: Array.isArray(stops) ? stops : [],
        monthlyFee
      },
      { new: true }
    );
    
    if (!updatedTransport) {
      return res.status(404).json({
        success: false,
        message: 'Transport route not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transport route updated successfully',
      data: updatedTransport
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update transport route',
      error: error.message
    });
  }
};

const deleteTransport = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedTransport = await Transport.findByIdAndDelete(id);
    
    if (!deletedTransport) {
      return res.status(404).json({
        success: false,
        message: 'Transport route not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Transport route deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete transport route',
      error: error.message
    });
  }
};

// Transport Allocations
const getTransportAllocations = async (req, res) => {
  try {
    const allocations = await TransportAllocation.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: allocations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transport allocations',
      error: error.message
    });
  }
};

const createTransportAllocation = async (req, res) => {
  try {
    const { studentId, studentName, studentRollNumber, routeId, routeName, stopName, monthlyFee } = req.body;
    
    const newAllocation = new TransportAllocation({
      studentId,
      studentName,
      studentRollNumber,
      routeId,
      routeName,
      stopName,
      monthlyFee
    });
    
    await newAllocation.save();
    
    // Update transport occupancy
    await Transport.findByIdAndUpdate(routeId, { $inc: { occupied: 1 } });
    
    res.status(201).json({
      success: true,
      message: 'Transport allocation created successfully',
      data: newAllocation
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create transport allocation',
      error: error.message
    });
  }
};

module.exports = {
  getHostels,
  createHostel,
  updateHostel,
  deleteHostel,
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostelAllocations,
  createHostelAllocation,
  getTransport,
  createTransport,
  updateTransport,
  deleteTransport,
  getTransportAllocations,
  createTransportAllocation
};