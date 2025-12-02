const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Organization = require('./models/Organization');
const Event = require('./models/Event');
const { Class, Subject, Timetable, AcademicYear } = require('./models/Academic');

require('dotenv').config();

async function migrateData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all existing organizations
    const organizations = await Organization.find();
    
    if (organizations.length === 0) {
      console.log('No organizations found. Migration not needed.');
      return;
    }

    for (const org of organizations) {
      console.log(`Processing organization: ${org.name}`);
      
      // Update admin user with organizationId
      if (org.adminUser) {
        await User.findByIdAndUpdate(org.adminUser, { organizationId: org._id });
        console.log(`Updated admin user for ${org.name}`);
      }

      // Update all users without organizationId to belong to first organization (demo data)
      if (organizations.indexOf(org) === 0) {
        await User.updateMany(
          { organizationId: { $exists: false }, role: { $ne: 'admin' } },
          { organizationId: org._id }
        );
        
        await Student.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await Staff.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await Event.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await Class.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await Subject.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await Timetable.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        await AcademicYear.updateMany(
          { organizationId: { $exists: false } },
          { organizationId: org._id }
        );
        
        console.log(`Assigned existing demo data to ${org.name}`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  migrateData();
}

module.exports = migrateData;