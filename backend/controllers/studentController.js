const Student = require('../models/Student');

exports.getDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      userId: req.user.id, 
      organizationId: req.organizationId 
    });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const dashboardData = {
      todaysClasses: [
        { subject: 'Mathematics', time: '09:00 AM', teacher: 'Mr. Smith', room: 'A101' },
        { subject: 'Physics', time: '11:00 AM', teacher: 'Ms. Johnson', room: 'B205' }
      ],
      attendance: { present: 85, total: 100, percentage: 85 },
      upcomingExams: [
        { subject: 'Mathematics', date: '2024-02-15', type: 'Mid-term' },
        { subject: 'Physics', date: '2024-02-20', type: 'Quiz' }
      ],
      pendingHomework: [
        { subject: 'English', title: 'Essay Writing', dueDate: '2024-02-10' }
      ],
      feeAlerts: []
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Student dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ 
      userId: req.user.id, 
      organizationId: req.organizationId 
    }).populate('userId', 'name email');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    console.error('Student profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};