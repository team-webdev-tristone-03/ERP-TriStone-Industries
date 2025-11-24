const User = require('../models/User');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

const seedData = async () => {
  try {
    // Check if demo users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Demo data already exists');
      return;
    }

    // Create demo users
    const demoUsers = [
      {
        email: 'student_demo@erp.com',
        password: 'student123',
        role: 'student',
        profile: {
          firstName: 'John',
          lastName: 'Doe',
          phone: '1234567890'
        }
      },
      {
        email: 'staff_demo@erp.com',
        password: 'staff123',
        role: 'staff',
        profile: {
          firstName: 'Jane',
          lastName: 'Smith',
          phone: '0987654321'
        }
      },
      {
        email: 'admin_demo@erp.com',
        password: 'admin123',
        role: 'admin',
        profile: {
          firstName: 'Admin',
          lastName: 'User',
          phone: '5555555555'
        }
      }
    ];

    const createdUsers = await User.insertMany(demoUsers);
    console.log('Demo users created');

    // Create student profile
    const studentUser = createdUsers.find(user => user.role === 'student');
    const studentProfile = new Student({
      userId: studentUser._id,
      studentId: 'STU001',
      class: '10th',
      section: 'A',
      rollNumber: '001',
      admissionDate: new Date('2023-06-01'),
      guardian: {
        name: 'Robert Doe',
        phone: '1111111111',
        email: 'robert.doe@email.com',
        relation: 'Father'
      },
      academic: {
        year: '2023-24',
        semester: '1',
        course: 'Science',
        department: 'Physics'
      },
      attendance: [
        {
          date: new Date(),
          status: 'present',
          subject: 'Mathematics'
        }
      ],
      marks: [
        {
          subject: 'Mathematics',
          examType: 'Mid-term',
          marks: 85,
          maxMarks: 100,
          date: new Date()
        }
      ],
      fees: {
        totalAmount: 50000,
        paidAmount: 30000,
        dueAmount: 20000,
        installments: [
          {
            amount: 20000,
            dueDate: new Date('2024-03-01'),
            status: 'pending'
          }
        ]
      }
    });

    await studentProfile.save();

    // Create staff profile
    const staffUser = createdUsers.find(user => user.role === 'staff');
    const staffProfile = new Staff({
      userId: staffUser._id,
      staffId: 'STF001',
      department: 'Mathematics',
      designation: 'Assistant Professor',
      joiningDate: new Date('2020-07-01'),
      qualification: 'M.Sc Mathematics',
      experience: 5,
      subjects: ['Mathematics', 'Statistics'],
      classes: [
        {
          class: '10th',
          section: 'A',
          subject: 'Mathematics'
        }
      ],
      salary: {
        basic: 50000,
        allowances: 10000,
        deductions: 5000
      }
    });

    await staffProfile.save();

    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = seedData;