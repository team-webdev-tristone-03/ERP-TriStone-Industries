const express = require('express');
const { auth } = require('../middleware/auth');
const { login, getMe } = require('../controllers/authController');
const router = express.Router();

router.post('/login', login);
router.get('/me', auth, getMe);

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Please provide email address' });
    }
    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;