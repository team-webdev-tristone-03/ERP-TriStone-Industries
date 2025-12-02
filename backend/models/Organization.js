const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['School', 'College', 'Institute', 'University', 'Training Center', 'Company', 'Other']
  },
  registrationNumber: {
    type: String,
    trim: true
  },
  address: {
    building: String,
    street: String,
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    pincode: String
  },
  contactEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  logo: {
    type: String // URL or path to logo file
  },
  adminUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Organization', organizationSchema);