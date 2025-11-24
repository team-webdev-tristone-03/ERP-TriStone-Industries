const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test finding admin user
    const user = await User.findOne({ email: 'admin_demo@erp.com', role: 'admin' });
    console.log('Admin user found:', !!user);
    
    if (user) {
      console.log('Admin email:', user.email);
      console.log('Admin role:', user.role);
      
      // Test password comparison
      const isMatch = await user.comparePassword('admin123');
      console.log('Password match:', isMatch);
    } else {
      console.log('Creating admin user...');
      const adminUser = new User({
        email: 'admin_demo@erp.com',
        password: 'admin123',
        role: 'admin',
        profile: { firstName: 'Admin', lastName: 'User', phone: '5555555555' }
      });
      await adminUser.save();
      console.log('Admin user created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAdminLogin();