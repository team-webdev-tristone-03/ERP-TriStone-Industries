const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
require('dotenv').config();

const createDemoUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    await Student.deleteMany({});
    await Staff.deleteMany({});

    // Create demo users
    const users = [
      {
        email: 'student_demo@erp.com',
        password: 'student123',
        role: 'student',
        profile: { firstName: 'John', lastName: 'Doe', phone: '1234567890' }
      },
      {
        email: 'staff_demo@erp.com',
        password: 'staff123',
        role: 'staff',
        profile: { firstName: 'Jane', lastName: 'Smith', phone: '0987654321' }
      },
      {
        email: 'admin_demo@erp.com',
        password: 'admin123',
        role: 'admin',
        profile: { firstName: 'Admin', lastName: 'User', phone: '5555555555' }
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log('✅ Demo users created successfully');

    // Create student profile
    const studentUser = createdUsers.find(user => user.role === 'student');
    await Student.create({
      userId: studentUser._id,
      studentId: 'STU001',
      class: '10th',
      section: 'A',
      rollNumber: '001'
    });

    // Create staff profile
    const staffUser = createdUsers.find(user => user.role === 'staff');
    await Staff.create({
      userId: staffUser._id,
      staffId: 'STF001',
      department: 'Mathematics',
      designation: 'Teacher'
    });

    console.log('✅ All demo data created');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

createDemoUsers();