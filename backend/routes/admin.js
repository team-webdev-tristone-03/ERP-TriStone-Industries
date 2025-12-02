const express = require('express');
const multer = require('multer');
const { auth } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});
const { 
  signup,
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

router.post('/signup', upload.single('logo'), signup);
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