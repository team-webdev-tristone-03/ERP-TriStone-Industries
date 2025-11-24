const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
require('dotenv').config();

const viewDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // View all users
    const users = await User.find({});
    console.log('=== USERS ===');
    users.forEach(user => {
      console.log(`${user.email} | ${user.role} | Active: ${user.isActive}`);
    });

    // View students
    const students = await Student.find({}).populate('userId');
    console.log('\n=== STUDENTS ===');
    students.forEach(student => {
      console.log(`${student.studentId} | ${student.class}-${student.section} | Roll: ${student.rollNumber}`);
    });

    // View staff
    const staff = await Staff.find({}).populate('userId');
    console.log('\n=== STAFF ===');
    staff.forEach(s => {
      console.log(`${s.staffId} | ${s.department} | ${s.designation}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

viewDatabase();