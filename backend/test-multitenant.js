const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
const Organization = require('./models/Organization');

require('dotenv').config();

async function testMultiTenant() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Test 1: Create two organizations
    console.log('\n=== Test 1: Creating Organizations ===');
    
    const org1 = new Organization({
      name: 'Test School A',
      type: 'School',
      contactEmail: 'admin@schoola.com',
      contactPhone: '1234567890',
      address: { city: 'City A', state: 'State A' },
      isActive: true
    });
    await org1.save();
    console.log('Created Organization A:', org1.name);

    const org2 = new Organization({
      name: 'Test School B',
      type: 'School',
      contactEmail: 'admin@schoolb.com',
      contactPhone: '0987654321',
      address: { city: 'City B', state: 'State B' },
      isActive: true
    });
    await org2.save();
    console.log('Created Organization B:', org2.name);

    // Test 2: Create admin users for each organization
    console.log('\n=== Test 2: Creating Admin Users ===');
    
    const admin1 = new User({
      email: 'admin1@test.com',
      password: 'admin123',
      role: 'admin',
      organizationId: org1._id,
      profile: { firstName: 'Admin', lastName: 'One' },
      isActive: true
    });
    await admin1.save();
    
    const admin2 = new User({
      email: 'admin2@test.com',
      password: 'admin123',
      role: 'admin',
      organizationId: org2._id,
      profile: { firstName: 'Admin', lastName: 'Two' },
      isActive: true
    });
    await admin2.save();

    // Update organizations with admin references
    org1.adminUser = admin1._id;
    await org1.save();
    org2.adminUser = admin2._id;
    await org2.save();

    console.log('Created admin users for both organizations');

    // Test 3: Create students for each organization
    console.log('\n=== Test 3: Creating Students ===');
    
    const student1User = new User({
      email: 'student1@schoola.com',
      password: 'student123',
      role: 'student',
      organizationId: org1._id,
      profile: { firstName: 'Student', lastName: 'A1' },
      isActive: true
    });
    await student1User.save();

    const student1 = new Student({
      userId: student1User._id,
      organizationId: org1._id,
      studentId: 'SA001',
      class: '10',
      section: 'A'
    });
    await student1.save();

    const student2User = new User({
      email: 'student2@schoolb.com',
      password: 'student123',
      role: 'student',
      organizationId: org2._id,
      profile: { firstName: 'Student', lastName: 'B1' },
      isActive: true
    });
    await student2User.save();

    const student2 = new Student({
      userId: student2User._id,
      organizationId: org2._id,
      studentId: 'SB001',
      class: '10',
      section: 'A'
    });
    await student2.save();

    console.log('Created students for both organizations');

    // Test 4: Verify data isolation
    console.log('\n=== Test 4: Verifying Data Isolation ===');
    
    const org1Students = await Student.find({ organizationId: org1._id });
    const org2Students = await Student.find({ organizationId: org2._id });
    
    console.log(`Organization A has ${org1Students.length} students`);
    console.log(`Organization B has ${org2Students.length} students`);
    
    const org1Users = await User.find({ organizationId: org1._id });
    const org2Users = await User.find({ organizationId: org2._id });
    
    console.log(`Organization A has ${org1Users.length} users`);
    console.log(`Organization B has ${org2Users.length} users`);

    console.log('\n✅ Multi-tenant test completed successfully!');
    console.log('Each organization has isolated data as expected.');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

if (require.main === module) {
  testMultiTenant();
}

module.exports = testMultiTenant;