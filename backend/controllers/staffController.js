const Staff = require('../models/Staff');
const { Timetable } = require('../models/Academic');

exports.getDashboard = async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user.id });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const dashboardData = {
      todaysClasses: [
        { class: '10-A', subject: 'Mathematics', time: '09:00 AM', room: 'A101' },
        { class: '10-B', subject: 'Mathematics', time: '11:00 AM', room: 'A102' }
      ],
      pendingApprovals: [],
      studentSummary: { totalStudents: 120, presentToday: 110, absentToday: 10 }
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Staff dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const staff = await Staff.findOne({ userId: req.user.id }).populate('userId', 'name email');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    console.error('Staff profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStaffDetails = async (req, res) => {
  try {
    const { id } = req.params;
    
    const staff = await Staff.findOne({ staffId: id }).populate('userId', 'profile');
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }

    const timetable = await Timetable.find({ teacherId: staff._id });
    
    const timetableByDay = {};
    timetable.forEach(slot => {
      if (!timetableByDay[slot.day]) {
        timetableByDay[slot.day] = [];
      }
      timetableByDay[slot.day].push({
        time: slot.time,
        subject: slot.subject,
        class: slot.class
      });
    });

    const staffDetails = {
      name: `${staff.userId.profile.firstName} ${staff.userId.profile.lastName}`,
      staffId: staff.staffId,
      department: staff.department,
      designation: staff.designation,
      subjects: staff.subjects,
      classes: staff.classes,
      timetable: timetableByDay
    };

    res.json({ success: true, data: staffDetails });
  } catch (error) {
    console.error('Staff details error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};