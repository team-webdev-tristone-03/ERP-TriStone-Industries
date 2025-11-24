const express = require('express');
const { auth } = require('../middleware/auth');
const { getDashboard, getProfile, getStaffDetails } = require('../controllers/staffController');
const router = express.Router();

router.get('/dashboard', auth, getDashboard);
router.get('/profile', auth, getProfile);
router.get('/:id/details', getStaffDetails);

router.get('/classes', auth, async (req, res) => {
  try {
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Access denied' });
    }
    const data = [
      { class: '10-A', subject: 'Mathematics', students: 30 },
      { class: '10-B', subject: 'Mathematics', students: 28 }
    ];
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;