const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  sections: [{
    type: String,
    required: true
  }],
  students: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const subjectSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  code: {
    type: String,
    required: true,
    unique: true
  },
  class: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  }
}, {
  timestamps: true
});

const timetableSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  class: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  teacher: {
    type: String,
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  day: {
    type: String,
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  time: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const academicYearSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },
  year: {
    type: String,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  terms: [{
    name: String,
    start: Date,
    end: Date
  }],
  isActive: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Class = mongoose.model('Class', classSchema);
const Subject = mongoose.model('Subject', subjectSchema);
const Timetable = mongoose.model('Timetable', timetableSchema);
const AcademicYear = mongoose.model('AcademicYear', academicYearSchema);

module.exports = {
  Class,
  Subject,
  Timetable,
  AcademicYear
};