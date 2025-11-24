const express = require('express');
const router = express.Router();
const {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getAcademicYear,
  createAcademicYear
} = require('../controllers/academicController');
const { auth } = require('../middleware/auth');

// Classes routes
router.get('/classes', auth, getClasses);
router.post('/classes', auth, createClass);
router.put('/classes/:id', auth, updateClass);
router.delete('/classes/:id', auth, deleteClass);

// Subjects routes
router.get('/subjects', auth, getSubjects);
router.post('/subjects', auth, createSubject);
router.put('/subjects/:id', auth, updateSubject);
router.delete('/subjects/:id', auth, deleteSubject);

// Timetable routes
router.get('/timetable', auth, getTimetable);
router.post('/timetable', auth, createTimetableSlot);
router.put('/timetable/:id', auth, updateTimetableSlot);
router.delete('/timetable/:id', auth, deleteTimetableSlot);

// Academic Year routes
router.get('/academic-year', auth, getAcademicYear);
router.post('/academic-year', auth, createAcademicYear);

module.exports = router;