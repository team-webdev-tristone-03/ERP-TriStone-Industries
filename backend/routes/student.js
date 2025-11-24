const express = require('express');
const { auth } = require('../middleware/auth');
const { getDashboard, getProfile } = require('../controllers/studentController');
const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/profile', auth, getProfile);

router.get('/attendance', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = {
      overall: { present: 85, total: 100, percentage: 85 },
      subjectWise: [
        { subject: 'Mathematics', present: 18, total: 20, percentage: 90 },
        { subject: 'Physics', present: 16, total: 20, percentage: 80 }
      ]
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/marks', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = {
      subjects: [
        { subject: 'Mathematics', marks: 85, maxMarks: 100, grade: 'A' },
        { subject: 'Physics', marks: 78, maxMarks: 100, grade: 'B+' }
      ]
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/fees', auth, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = {
      pending: [{ type: 'Tuition Fee', amount: 5000, dueDate: '2024-02-20' }],
      paid: [{ type: 'Admission Fee', amount: 2000, paidDate: '2024-01-15' }]
    };
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;