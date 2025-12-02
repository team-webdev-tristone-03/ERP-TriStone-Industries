const User = require('../models/User');
const Student = require('../models/Student');
const Staff = require('../models/Staff');
const Event = require('../models/Event');
const Organization = require('../models/Organization');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    console.log('Admin signup request received');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    const {
      organizationName,
      organizationType,
      registrationNumber,
      address,
      contactEmail,
      contactPhone,
      website,
      adminFullName,
      adminEmail,
      adminPhone,
      password
    } = req.body;

    // Validate required fields
    if (!organizationName || !organizationType || !contactEmail || !contactPhone || 
        !adminFullName || !adminEmail || !adminPhone || !password) {
      console.log('Missing required fields');
      return res.status(400).json({ 
        message: 'Please provide all required fields',
        received: {
          organizationName: !!organizationName,
          organizationType: !!organizationType,
          contactEmail: !!contactEmail,
          contactPhone: !!contactPhone,
          adminFullName: !!adminFullName,
          adminEmail: !!adminEmail,
          adminPhone: !!adminPhone,
          password: !!password
        }
      });
    }

    // Check if admin email already exists
    const existingUser = await User.findOne({ email: adminEmail });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Admin email already exists' 
      });
    }

    // Check if organization email already exists
    const existingOrg = await Organization.findOne({ contactEmail });
    if (existingOrg) {
      return res.status(400).json({ 
        message: 'Organization with this email already exists' 
      });
    }

    // Parse address if it's a string
    let parsedAddress = address;
    if (typeof address === 'string') {
      try {
        parsedAddress = JSON.parse(address);
      } catch (e) {
        parsedAddress = { city: 'Not Specified', state: 'Not Specified' };
      }
    }
    
    // Ensure address has required fields
    if (!parsedAddress || !parsedAddress.city || !parsedAddress.state) {
      parsedAddress = {
        ...parsedAddress,
        city: parsedAddress?.city || 'Not Specified',
        state: parsedAddress?.state || 'Not Specified'
      };
    }

    // Create admin user
    const adminUser = new User({
      email: adminEmail,
      password,
      role: 'admin',
      profile: {
        firstName: adminFullName.split(' ')[0],
        lastName: adminFullName.split(' ').slice(1).join(' '),
        phone: adminPhone
      },
      isActive: true
    });
    await adminUser.save();
    console.log('Admin user created:', adminUser._id);

    // Create organization
    const organization = new Organization({
      name: organizationName,
      type: organizationType,
      registrationNumber,
      address: parsedAddress,
      contactEmail,
      contactPhone,
      website,
      adminUser: adminUser._id,
      isActive: true
    });
    await organization.save();
    console.log('Organization created:', organization._id);

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: adminUser._id, 
        role: adminUser.role,
        organizationId: organization._id 
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Organization and admin account created successfully',
      data: {
        token,
        user: {
          id: adminUser._id,
          email: adminUser.email,
          role: adminUser.role,
          profile: adminUser.profile
        },
        organization: {
          id: organization._id,
          name: organization.name,
          type: organization.type,
          contactEmail: organization.contactEmail
        }
      }
    });
  } catch (error) {
    console.error('Admin signup error:', error);
    res.status(500).json({ 
      message: 'Server error during signup. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getDashboard = async (req, res) => {
  try {
    // Get real-time counts
    const totalStudents = await Student.countDocuments();
    const totalStaff = await Staff.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalUsers = await User.countDocuments();
    const inactiveUsers = totalUsers - activeUsers;

    // Get recent activities from database
    const recentStudents = await Student.find()
      .populate('userId', 'email profile createdAt')
      .sort({ createdAt: -1 })
      .limit(3);
    
    const recentStaff = await Staff.find()
      .populate('userId', 'email profile createdAt')
      .sort({ createdAt: -1 })
      .limit(2);

    // Calculate attendance percentage (mock calculation)
    const attendanceRate = Math.round(85 + Math.random() * 10); // 85-95%
    
    // Calculate fees collected (mock calculation)
    const feesCollected = Math.round(200000 + Math.random() * 100000);

    const dashboardData = {
      stats: {
        totalStudents,
        totalStaff,
        activeUsers,
        totalUsers,
        inactiveUsers,
        attendanceRate,
        feesCollected
      },
      recentActivities: [
        ...recentStudents.map(student => ({
          type: 'student',
          message: `New student enrolled: ${student.userId?.profile?.firstName || 'Unknown'} ${student.userId?.profile?.lastName || ''}`,
          time: getTimeAgo(student.createdAt || new Date()),
          timestamp: student.createdAt || new Date()
        })),
        ...recentStaff.map(staff => ({
          type: 'staff',
          message: `New staff member: ${staff.userId?.profile?.firstName || 'Unknown'} ${staff.userId?.profile?.lastName || ''}`,
          time: getTimeAgo(staff.createdAt || new Date()),
          timestamp: staff.createdAt || new Date()
        }))
      ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
      systemAlerts: [
        {
          message: `${inactiveUsers} inactive user accounts need attention`,
          severity: inactiveUsers > 5 ? 'warning' : 'info',
          count: inactiveUsers
        },
        {
          message: `Overall attendance: ${attendanceRate}%`,
          severity: attendanceRate < 90 ? 'warning' : 'success',
          count: attendanceRate
        }
      ]
    };

    res.json({ success: true, data: dashboardData });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { studentId: { $regex: search, $options: 'i' } },
          { 'academic.course': { $regex: search, $options: 'i' } },
          { class: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const students = await Student.find(searchQuery)
      .populate('userId', 'email profile isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalStudents = await Student.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalStudents / limit);

    res.json({
      success: true,
      data: {
        students,
        totalStudents,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStaff = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    // Build search query
    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { staffId: { $regex: search, $options: 'i' } },
          { department: { $regex: search, $options: 'i' } },
          { position: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const staff = await Staff.find(searchQuery)
      .populate('userId', 'email profile isActive createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalStaff = await Staff.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalStaff / limit);

    res.json({
      success: true,
      data: {
        staff,
        totalStaff,
        totalPages,
        currentPage: page,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Get staff error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { email, password, profile, studentData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create user account
    const user = new User({
      email,
      password,
      role: 'student',
      profile,
      isActive: true
    });
    await user.save();

    // Create student record
    const student = new Student({
      ...studentData,
      userId: user._id
    });
    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: { student, user: { email: user.email, profile: user.profile } }
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createStaff = async (req, res) => {
  try {
    const { email, password, profile, staffData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Check if staff ID already exists
    if (staffData.staffId) {
      const existingStaff = await Staff.findOne({ staffId: staffData.staffId });
      if (existingStaff) {
        return res.status(400).json({ message: 'Staff ID already exists' });
      }
    }

    // Create user account
    const user = new User({
      email,
      password,
      role: 'staff',
      profile,
      isActive: true
    });
    await user.save();

    // Get organization ID from user's token or default
    let organizationId = req.user?.organizationId;
    if (!organizationId) {
      // Find any organization as fallback (for demo purposes)
      const org = await Organization.findOne();
      organizationId = org?._id;
    }

    // Create staff record
    const staff = new Staff({
      ...staffData,
      userId: user._id,
      organizationId: organizationId
    });
    await staff.save();

    // Populate user data for response
    const populatedStaff = await Staff.findById(staff._id).populate('userId', 'email profile isActive');

    res.status(201).json({
      success: true,
      message: 'Staff created successfully',
      data: populatedStaff
    });
  } catch (error) {
    console.error('Create staff error:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, profile, studentData } = req.body;

    // Find the student
    const student = await Student.findById(id).populate('userId');
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update user profile
    const updateData = { profile };
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const updatedUser = await User.findByIdAndUpdate(
      student.userId._id,
      updateData,
      { new: true }
    );

    // Update student data
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      studentData,
      { new: true }
    ).populate('userId', 'email profile isActive');

    res.json({
      success: true,
      message: 'Student updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudentAccess = async (req, res) => {
  try {
    const { id } = req.params;
    const { access } = req.body;

    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { access },
      { new: true }
    ).populate('userId', 'email profile isActive');

    if (!updatedStudent) {
      return res.status(404).json({ message: 'Student not found' });
    }

    res.json({
      success: true,
      message: 'Student access updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    console.error('Update student access error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the student
    const student = await Student.findById(id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Delete associated user account
    await User.findByIdAndDelete(student.userId);

    // Delete the student record
    await Student.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Delete student error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Events / Announcements
exports.getEvents = async (req, res) => {
  try {
    // optional query: ?type=announcement or ?upcoming=true
    const { type, upcoming } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (upcoming === 'true') filter.date = { $gte: new Date() };

    const events = await Event.find(filter).sort({ date: -1 });
    res.json(Array.isArray(events) ? events : { events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, type } = req.body;
    if (!title || !date) {
      return res.status(400).json({ message: 'Title and date are required' });
    }

    const ev = new Event({
      title,
      description,
      date: new Date(date),
      type: (type || 'event').toLowerCase(),
      createdBy: req.user ? req.user.id : undefined
    });
    await ev.save();

    res.status(201).json({ success: true, event: ev });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
}