const mongoose = require('mongoose');
const Staff = require('./models/Staff');
require('dotenv').config();

const allocateStaff = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get all staff
    const allStaff = await Staff.find({});
    console.log(`Found ${allStaff.length} staff members`);

    // Classes available
    const classes = [6, 7, 8, 9, 10, 11, 12];
    const sections = ['A', 'B', 'C'];

    // Shuffle staff array for random selection
    const shuffledStaff = [...allStaff].sort(() => Math.random() - 0.5);

    // Select 7 staff as Class Teachers
    const classTeachers = shuffledStaff.slice(0, 7);
    const subjectTeachers = shuffledStaff.slice(7);

    console.log(`Assigning ${classTeachers.length} Class Teachers`);
    console.log(`Assigning ${subjectTeachers.length} Subject Teachers`);

    // Update Class Teachers
    for (let i = 0; i < classTeachers.length; i++) {
      const staff = classTeachers[i];
      const assignedClass = classes[i];
      const randomSection = sections[Math.floor(Math.random() * sections.length)];

      await Staff.findByIdAndUpdate(staff._id, {
        designation: 'Class Teacher',
        subjects: [staff.department], // Based on their department
        classes: [{
          class: `${assignedClass}th`,
          section: randomSection,
          subject: staff.department
        }]
      });

      console.log(`✅ ${staff.staffId} assigned as Class Teacher for ${assignedClass}th-${randomSection} (${staff.department})`);
    }

    // Update Subject Teachers
    for (const staff of subjectTeachers) {
      // Randomly assign 2-4 classes to handle
      const numClasses = Math.floor(Math.random() * 3) + 2; // 2-4 classes
      const assignedClasses = [];
      
      // Randomly select classes
      const shuffledClasses = [...classes].sort(() => Math.random() - 0.5);
      for (let i = 0; i < numClasses; i++) {
        const classNum = shuffledClasses[i];
        const randomSection = sections[Math.floor(Math.random() * sections.length)];
        
        assignedClasses.push({
          class: `${classNum}th`,
          section: randomSection,
          subject: staff.department
        });
      }

      await Staff.findByIdAndUpdate(staff._id, {
        designation: 'Subject Teacher',
        subjects: [staff.department], // Based on their department
        classes: assignedClasses
      });

      const classInfo = assignedClasses.map(c => `${c.class}-${c.section}`).join(', ');
      console.log(`✅ ${staff.staffId} assigned as Subject Teacher for classes: ${classInfo} (${staff.department})`);
    }

    // Display summary
    console.log('\n=== ALLOCATION SUMMARY ===');
    
    const updatedStaff = await Staff.find({});
    const classTeacherCount = updatedStaff.filter(s => s.designation === 'Class Teacher').length;
    const subjectTeacherCount = updatedStaff.filter(s => s.designation === 'Subject Teacher').length;
    
    console.log(`Class Teachers: ${classTeacherCount}`);
    console.log(`Subject Teachers: ${subjectTeacherCount}`);
    
    // Show department distribution
    const deptDistribution = {};
    updatedStaff.forEach(staff => {
      if (!deptDistribution[staff.department]) {
        deptDistribution[staff.department] = { classTeacher: 0, subjectTeacher: 0 };
      }
      if (staff.designation === 'Class Teacher') {
        deptDistribution[staff.department].classTeacher++;
      } else {
        deptDistribution[staff.department].subjectTeacher++;
      }
    });

    console.log('\nDepartment Distribution:');
    Object.keys(deptDistribution).forEach(dept => {
      const dist = deptDistribution[dept];
      console.log(`${dept}: ${dist.classTeacher} Class Teachers, ${dist.subjectTeacher} Subject Teachers`);
    });

    console.log('\n🎉 Staff allocation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

allocateStaff();