const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  getDashboard, 
  getStudents, 
  getStaff, 
  createStudent, 
  createStaff, 
  updateUserStatus,
  getEvents,
  createEvent
} = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/students', auth, getStudents);
router.post('/students', auth, createStudent);
router.get('/events', auth, getEvents);
router.post('/events', auth, createEvent);
router.get('/staff', auth, getStaff);
router.post('/staff', auth, createStaff);
router.put('/users/:id/status', auth, updateUserStatus);

module.exports = router;