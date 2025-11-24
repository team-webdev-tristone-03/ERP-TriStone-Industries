const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/hostelController');
const { auth } = require('../middleware/auth');

// Hostel routes
router.get('/hostels', auth, getHostels);
router.post('/hostels', auth, createHostel);
router.put('/hostels/:id', auth, updateHostel);
router.delete('/hostels/:id', auth, deleteHostel);

// Room routes
router.get('/rooms', auth, getRooms);
router.post('/rooms', auth, createRoom);
router.put('/rooms/:id', auth, updateRoom);
router.delete('/rooms/:id', auth, deleteRoom);

// Hostel allocation routes
router.get('/hostel-allocations', auth, getHostelAllocations);
router.post('/hostel-allocations', auth, createHostelAllocation);

// Transport routes
router.get('/transport', auth, getTransport);
router.post('/transport', auth, createTransport);
router.put('/transport/:id', auth, updateTransport);
router.delete('/transport/:id', auth, deleteTransport);

// Transport allocation routes
router.get('/transport-allocations', auth, getTransportAllocations);
router.post('/transport-allocations', auth, createTransportAllocation);

module.exports = router;