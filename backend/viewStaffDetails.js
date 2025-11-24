const mongoose = require('mongoose');
const User = require('./models/User');
const Staff = require('./models/Staff');
require('dotenv').config();

const viewStaffDetails = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const staff = await Staff.find({}).populate('userId');
    
    console.log('=== DETAILED STAFF DATA ===\n');
    
    staff.forEach((s, index) => {
      console.log(`--- Staff ${index + 1} ---`);
      console.log(`Staff ID: ${s.staffId}`);
      console.log(`Name: ${s.userId?.profile?.firstName || 'N/A'} ${s.userId?.profile?.lastName || 'N/A'}`);
      console.log(`Email: ${s.userId?.email}`);
      console.log(`Phone: ${s.userId?.profile?.phone || 'N/A'}`);
      console.log(`Department: ${s.department}`);
      console.log(`Designation: ${s.designation}`);
      console.log(`Joining Date: ${s.joiningDate || 'N/A'}`);
      console.log(`Qualification: ${s.qualification || 'N/A'}`);
      console.log(`Experience: ${s.experience || 'N/A'} years`);
      console.log(`Subjects: ${s.subjects?.join(', ') || 'None'}`);
      console.log(`Classes Assigned:`);
      if (s.classes && s.classes.length > 0) {
        s.classes.forEach(cls => {
          console.log(`  - ${cls.class}-${cls.section}: ${cls.subject}`);
        });
      } else {
        console.log('  - None assigned');
      }
      console.log(`Active: ${s.userId?.isActive}`);
      console.log(`Last Login: ${s.userId?.lastLogin || 'Never'}`);
      console.log('---\n');
    });

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

viewStaffDetails();