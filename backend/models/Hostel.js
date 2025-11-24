const mongoose = require('mongoose');

const hostelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Boys', 'Girls', 'Mixed']
  },
  totalRooms: {
    type: Number,
    required: true
  },
  occupiedRooms: {
    type: Number,
    default: 0
  },
  warden: {
    type: String,
    required: true
  },
  wardenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  facilities: [{
    type: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  hostelName: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    default: 2
  },
  occupied: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    required: true,
    enum: ['Single', 'Double', 'Triple', 'Quad']
  },
  floor: {
    type: Number,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  facilities: [{
    type: String
  }],
  isAvailable: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const allocationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentRollNumber: {
    type: String,
    required: true
  },
  hostelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hostel',
    required: true
  },
  hostelName: {
    type: String,
    required: true
  },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  roomNumber: {
    type: String,
    required: true
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  checkInDate: {
    type: Date
  },
  checkOutDate: {
    type: Date
  },
  monthlyRent: {
    type: Number,
    required: true
  },
  securityDeposit: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Allocated', 'CheckedIn', 'CheckedOut', 'Vacated'],
    default: 'Allocated'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const transportSchema = new mongoose.Schema({
  routeName: {
    type: String,
    required: true,
    unique: true
  },
  routeNumber: {
    type: String,
    required: true,
    unique: true
  },
  vehicleNumber: {
    type: String,
    required: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Bus', 'Van', 'Mini Bus']
  },
  capacity: {
    type: Number,
    required: true
  },
  occupied: {
    type: Number,
    default: 0
  },
  driver: {
    type: String,
    required: true
  },
  driverPhone: {
    type: String,
    required: true
  },
  conductor: {
    type: String
  },
  conductorPhone: {
    type: String
  },
  stops: [{
    stopName: String,
    time: String,
    fare: Number
  }],
  monthlyFee: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const transportAllocationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  studentName: {
    type: String,
    required: true
  },
  studentRollNumber: {
    type: String,
    required: true
  },
  routeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transport',
    required: true
  },
  routeName: {
    type: String,
    required: true
  },
  stopName: {
    type: String,
    required: true
  },
  monthlyFee: {
    type: Number,
    required: true
  },
  allocationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'Suspended', 'Cancelled'],
    default: 'Active'
  }
}, {
  timestamps: true
});

const Hostel = mongoose.model('Hostel', hostelSchema);
const Room = mongoose.model('Room', roomSchema);
const HostelAllocation = mongoose.model('HostelAllocation', allocationSchema);
const Transport = mongoose.model('Transport', transportSchema);
const TransportAllocation = mongoose.model('TransportAllocation', transportAllocationSchema);

module.exports = {
  Hostel,
  Room,
  HostelAllocation,
  Transport,
  TransportAllocation
};