const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventTime: {
    type: String,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Technical', 'Cultural', 'Sports', 'Academic', 'General'],
    required: true
  },
  posterImage: {
    type: String
  },
  registrationRequired: {
    type: Boolean,
    default: false
  },
  registrationLimit: {
    type: Number,
    default: 0
  },
  registeredCount: {
    type: Number,
    default: 0
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String
  },
  rules: {
    type: String
  },
  instructions: {
    type: String
  },
  status: {
    type: String,
    enum: ['Upcoming', 'Ongoing', 'Completed', 'Cancelled'],
    default: 'Upcoming'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Auto-update status based on date
eventSchema.pre('save', function(next) {
  const now = new Date();
  const eventDate = new Date(this.eventDate);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());
  
  if (eventDay > today) {
    this.status = 'Upcoming';
  } else if (eventDay.getTime() === today.getTime()) {
    this.status = 'Ongoing';
  } else {
    this.status = 'Completed';
  }
  
  next();
});

module.exports = mongoose.model('Event', eventSchema);