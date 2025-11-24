const express = require('express');
const { auth } = require('../middleware/auth');
const { 
  getDashboard, 
  getStudents, 
  getStaff, 
  createStudent, 
  createStaff, 
  updateUserStatus,
  updateStudent,
  updateStudentAccess,
  deleteStudent,
  getEvents,
  createEvent
} = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/students', auth, getStudents);
router.post('/students', auth, createStudent);
router.put('/students/:id', auth, updateStudent);
router.put('/students/:id/access', auth, updateStudentAccess);
router.delete('/students/:id', auth, deleteStudent);
router.get('/events', auth, getEvents);
router.post('/events', auth, createEvent);
router.get('/staff', auth, getStaff);
router.post('/staff', auth, createStaff);
router.put('/users/:id/status', auth, updateUserStatus);

module.exports = router;