const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test finding user
    const user = await User.findOne({ email: 'student_demo@erp.com', role: 'student' });
    console.log('User found:', !!user);
    
    if (user) {
      console.log('User email:', user.email);
      console.log('User role:', user.role);
      
      // Test password comparison
      const isMatch = await user.comparePassword('student123');
      console.log('Password match:', isMatch);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();