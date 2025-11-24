const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
const Staff = require('./models/Staff');
require('dotenv').config();

const indianNames = {
  male: ['Arjun', 'Rahul', 'Amit', 'Vikram', 'Suresh', 'Rajesh', 'Anil', 'Deepak', 'Kiran', 'Manoj', 'Ravi', 'Sanjay', 'Vinod', 'Ashok', 'Prakash', 'Ramesh', 'Santosh', 'Dinesh', 'Mahesh', 'Naresh'],
  female: ['Priya', 'Sunita', 'Kavita', 'Meera', 'Anjali', 'Pooja', 'Neha', 'Rekha', 'Shanti', 'Lakshmi', 'Radha', 'Geeta', 'Sita', 'Maya', 'Usha', 'Nisha', 'Ritu', 'Seema', 'Kiran', 'Asha']
};

const surnames = ['Sharma', 'Patel', 'Singh', 'Kumar', 'Gupta', 'Agarwal', 'Jain', 'Verma', 'Yadav', 'Reddy', 'Nair', 'Iyer', 'Menon', 'Pillai', 'Rao', 'Chandra', 'Prasad', 'Mishra', 'Tiwari', 'Pandey'];

const departments = ['Tamil', 'English', 'Maths', 'Science', 'Social'];
const designations = ['Teacher', 'Senior Teacher', 'Head of Department', 'Assistant Teacher'];
const qualifications = ['B.Ed', 'M.Ed', 'M.A', 'M.Sc', 'B.A', 'B.Sc', 'Ph.D'];

const generatePhone = () => {
  const prefixes = ['98', '97', '96', '95', '94', '93', '92', '91', '90', '89'];
  return prefixes[Math.floor(Math.random() * prefixes.length)] + Math.floor(Math.random() * 100000000).toString().padStart(8, '0');
};

const generateAddress = () => {
  const areas = ['Anna Nagar', 'T Nagar', 'Adyar', 'Velachery', 'Tambaram', 'Chrompet', 'Mylapore', 'Nungambakkam', 'Kodambakkam', 'Guindy'];
  return `${Math.floor(Math.random() * 999) + 1}, ${areas[Math.floor(Math.random() * areas.length)]}, Chennai - ${Math.floor(Math.random() * 90000) + 600001}`;
};

const getRandomName = (gender) => {
  const firstName = indianNames[gender][Math.floor(Math.random() * indianNames[gender].length)];
  const lastName = surnames[Math.floor(Math.random() * surnames.length)];
  return `${firstName} ${lastName}`;
};

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get existing counts for ID generation
    const existingStaffCount = await Staff.countDocuments();
    const existingStudentCount = await Student.countDocuments();

    // Create 20 staff members
    console.log('Creating staff members...');
    const staffData = [];
    const staffUsers = [];

    for (let i = 1; i <= 20; i++) {
      const gender = Math.random() > 0.5 ? 'male' : 'female';
      const name = getRandomName(gender);
      const email = `staff${existingStaffCount + i}@erp.com`;
      const department = departments[Math.floor(Math.random() * departments.length)];
      
      // Create user
      const user = new User({
        email,
        password: 'staff123',
        role: 'staff',
        profile: {
          firstName: name.split(' ')[0],
          lastName: name.split(' ')[1],
          phone: generatePhone(),
          address: generateAddress()
        }
      });
      
      staffUsers.push(user);
      
      // Create staff profile
      staffData.push({
        userId: user._id,
        staffId: `STF${(existingStaffCount + i).toString().padStart(3, '0')}`,
        department,
        designation: designations[Math.floor(Math.random() * designations.length)],
        joiningDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
        qualification: qualifications[Math.floor(Math.random() * qualifications.length)],
        experience: Math.floor(Math.random() * 15) + 1,
        subjects: [department],
        classes: [{
          class: `${Math.floor(Math.random() * 7) + 6}th`,
          section: String.fromCharCode(65 + Math.floor(Math.random() * 3)),
          subject: department
        }],
        salary: {
          basic: 25000 + Math.floor(Math.random() * 25000),
          allowances: 5000 + Math.floor(Math.random() * 5000),
          deductions: 2000 + Math.floor(Math.random() * 2000)
        }
      });
    }

    await User.insertMany(staffUsers);
    await Staff.insertMany(staffData);
    console.log('✅ 20 staff members created');

    // Create students for classes 6-12 (20 students each)
    console.log('Creating students...');
    const studentData = [];
    const studentUsers = [];
    let studentCounter = 1;

    for (let classNum = 6; classNum <= 12; classNum++) {
      for (let studentNum = 1; studentNum <= 20; studentNum++) {
        const gender = Math.random() > 0.5 ? 'male' : 'female';
        const name = getRandomName(gender);
        const email = `student${existingStudentCount + studentCounter}@erp.com`;
        const guardianName = getRandomName(Math.random() > 0.5 ? 'male' : 'female');
        
        // Create user
        const user = new User({
          email,
          password: 'student123',
          role: 'student',
          profile: {
            firstName: name.split(' ')[0],
            lastName: name.split(' ')[1],
            phone: generatePhone(),
            address: generateAddress()
          }
        });
        
        studentUsers.push(user);
        
        // Create student profile
        studentData.push({
          userId: user._id,
          studentId: `STU${(existingStudentCount + studentCounter).toString().padStart(3, '0')}`,
          class: `${classNum}th`,
          section: String.fromCharCode(65 + (studentNum % 3)),
          rollNumber: studentNum.toString().padStart(2, '0'),
          admissionDate: new Date(2020 + Math.floor(Math.random() * 4), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
          guardian: {
            name: guardianName,
            phone: generatePhone(),
            email: `${guardianName.toLowerCase().replace(' ', '.')}@gmail.com`,
            relation: Math.random() > 0.5 ? 'Father' : 'Mother'
          },
          academic: {
            year: '2024-25',
            semester: classNum <= 10 ? 'Annual' : Math.random() > 0.5 ? 'First' : 'Second',
            course: classNum <= 10 ? 'Secondary' : 'Higher Secondary',
            department: classNum <= 10 ? 'General' : Math.random() > 0.5 ? 'Science' : 'Commerce'
          },
          fees: {
            totalAmount: 15000 + Math.floor(Math.random() * 10000),
            paidAmount: 10000 + Math.floor(Math.random() * 5000),
            dueAmount: Math.floor(Math.random() * 5000)
          },
          hostel: Math.random() > 0.7 ? {
            roomNumber: `${Math.floor(Math.random() * 200) + 1}`,
            block: String.fromCharCode(65 + Math.floor(Math.random() * 4)),
            messSubscription: Math.random() > 0.3
          } : undefined,
          transport: Math.random() > 0.5 ? {
            busRoute: `Route ${Math.floor(Math.random() * 10) + 1}`,
            pickupPoint: generateAddress().split(',')[1],
            fee: 2000 + Math.floor(Math.random() * 1000)
          } : undefined
        });
        
        studentCounter++;
      }
    }

    await User.insertMany(studentUsers);
    await Student.insertMany(studentData);
    console.log('✅ 140 students created (20 per class from 6th to 12th)');

    console.log('\n🎉 Seed data insertion completed successfully!');
    console.log(`Total staff: ${await Staff.countDocuments()}`);
    console.log(`Total students: ${await Student.countDocuments()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

seedData();