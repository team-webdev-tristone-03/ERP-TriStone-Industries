const Event = require('../models/Event');

// Get all events
const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ organizationId: req.organizationId }).sort({ eventDate: 1 });
    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
};

// Create new event
const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      eventDate,
      eventTime,
      venue,
      category,
      posterImage,
      registrationRequired,
      registrationLimit,
      contactPerson,
      rules,
      instructions
    } = req.body;

    // Validation
    if (!title || !description || !eventDate || !eventTime || !venue || !category) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: title, description, eventDate, eventTime, venue, category'
      });
    }

    const newEvent = new Event({
      organizationId: req.organizationId,
      title,
      description,
      eventDate: new Date(eventDate),
      eventTime,
      venue,
      category,
      posterImage: posterImage || '',
      registrationRequired: Boolean(registrationRequired),
      registrationLimit: registrationRequired ? Number(registrationLimit) || 0 : 0,
      contactPerson: contactPerson || {},
      rules: rules || '',
      instructions: instructions || ''
    });

    await newEvent.save();

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: newEvent
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
};

// Update event
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      eventDate,
      eventTime,
      venue,
      category,
      posterImage,
      registrationRequired,
      registrationLimit,
      contactPerson,
      rules,
      instructions,
      status
    } = req.body;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, organizationId: req.organizationId },
      {
        title,
        description,
        eventDate,
        eventTime,
        venue,
        category,
        posterImage,
        registrationRequired,
        registrationLimit: registrationRequired ? registrationLimit : 0,
        contactPerson,
        rules,
        instructions,
        status
      },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedEvent = await Event.findOneAndDelete({ _id: id, organizationId: req.organizationId });

    if (!deletedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
};

// Get event by ID
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findOne({ _id: id, organizationId: req.organizationId });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
};

// Update event status
const updateEventStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, organizationId: req.organizationId },
      { status },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update event status',
      error: error.message
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventById,
  updateEventStatus
};