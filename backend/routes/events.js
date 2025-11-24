const express = require('express');
const router = express.Router();
const {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  updateEventStatus
} = require('../controllers/eventController');
const { auth } = require('../middleware/auth');

// Event routes
router.get('/', auth, getEvents);
router.post('/', auth, createEvent);
router.get('/:id', auth, getEventById);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);
router.patch('/:id/status', auth, updateEventStatus);

module.exports = router;