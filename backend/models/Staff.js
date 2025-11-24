const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staffId: {
    type: String,
    required: true,
    unique: true
  },
  department: String,
  designation: String,
  joiningDate: Date,
  qualification: String,
  experience: Number,
  subjects: [String],
  classes: [{
    class: String,
    section: String,
    subject: String
  }],
  salary: {
    basic: Number,
    allowances: Number,
    deductions: Number
  },
  attendance: [{
    date: Date,
    checkIn: Date,
    checkOut: Date,
    status: String
  }],
  leaves: [{
    type: String,
    startDate: Date,
    endDate: Date,
    reason: String,
    status: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);