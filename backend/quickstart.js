const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
require('dotenv').config();

const quickStart = async () => {
  try {
    console.log('🚀 Quick Start - Setting up ERP System...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear and recreate users
    await User.deleteMany({});
    await Student.deleteMany({});
    await Staff.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create users with proper password hashing
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
      console.log(`✅ Created ${user.role}: ${user.email}`);
    }

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

    console.log('✅ All profiles created successfully');
    console.log('\n🔐 Demo Credentials:');
    console.log('Student: student_demo@erp.com / student123');
    console.log('Staff: staff_demo@erp.com / staff123');
    console.log('Admin: admin_demo@erp.com / admin123');
    console.log('\n🌐 URLs:');
    console.log('Frontend: http://localhost:3000');
    console.log('Backend: http://localhost:5000');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

quickStart();