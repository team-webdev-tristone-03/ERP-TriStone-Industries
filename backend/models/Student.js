const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  class: String,
  section: String,
  rollNumber: String,
  admissionDate: Date,
  guardian: {
    name: String,
    phone: String,
    email: String,
    relation: String
  },
  academic: {
    year: String,
    semester: String,
    course: String,
    department: String
  },
  attendance: [{
    date: Date,
    status: {
      type: String,
      enum: ['present', 'absent', 'late']
    },
    subject: String
  }],
  marks: [{
    subject: String,
    examType: String,
    marks: Number,
    maxMarks: Number,
    date: Date
  }],
  fees: {
    totalAmount: Number,
    paidAmount: Number,
    dueAmount: Number,
    installments: [{
      amount: Number,
      dueDate: Date,
      status: String,
      paidDate: Date
    }]
  },
  hostel: {
    roomNumber: String,
    block: String,
    messSubscription: Boolean
  },
  transport: {
    busRoute: String,
    pickupPoint: String,
    fee: Number
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);