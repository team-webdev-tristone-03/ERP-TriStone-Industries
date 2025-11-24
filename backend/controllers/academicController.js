const { Class, Subject, Timetable, AcademicYear } = require('../models/Academic');
const Student = require('../models/Student');
const Staff = require('../models/Staff');

// Classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: classes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch classes',
      error: error.message
    });
  }
};

const createClass = async (req, res) => {
  try {
    const { name, sections } = req.body;
    
    const newClass = new Class({
      name,
      sections: Array.isArray(sections) ? sections : sections.split(',').map(s => s.trim())
    });
    
    await newClass.save();
    
    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create class',
      error: error.message
    });
  }
};

const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, sections } = req.body;
    
    const updatedClass = await Class.findByIdAndUpdate(
      id,
      {
        name,
        sections: Array.isArray(sections) ? sections : sections.split(',').map(s => s.trim())
      },
      { new: true }
    );
    
    if (!updatedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update class',
      error: error.message
    });
  }
};

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedClass = await Class.findByIdAndDelete(id);
    
    if (!deletedClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete class',
      error: error.message
    });
  }
};

// Subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find().populate('teacherId', 'userId').sort({ createdAt: -1 });
    res.json({
      success: true,
      data: subjects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch subjects',
      error: error.message
    });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name, code, class: className, teacher, teacherId } = req.body;
    
    const newSubject = new Subject({
      name,
      code,
      class: className,
      teacher,
      teacherId
    });
    
    await newSubject.save();
    
    res.status(201).json({
      success: true,
      message: 'Subject created successfully',
      data: newSubject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create subject',
      error: error.message
    });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, class: className, teacher, teacherId } = req.body;
    
    const updatedSubject = await Subject.findByIdAndUpdate(
      id,
      { name, code, class: className, teacher, teacherId },
      { new: true }
    );
    
    if (!updatedSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subject updated successfully',
      data: updatedSubject
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update subject',
      error: error.message
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedSubject = await Subject.findByIdAndDelete(id);
    
    if (!deletedSubject) {
      return res.status(404).json({
        success: false,
        message: 'Subject not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Subject deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete subject',
      error: error.message
    });
  }
};

// Timetable
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.find().populate('teacherId', 'userId').sort({ day: 1, time: 1 });
    res.json({
      success: true,
      data: timetable
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timetable',
      error: error.message
    });
  }
};

const createTimetableSlot = async (req, res) => {
  try {
    const { class: className, subject, teacher, teacherId, day, time } = req.body;
    
    const newSlot = new Timetable({
      class: className,
      subject,
      teacher,
      teacherId,
      day,
      time
    });
    
    await newSlot.save();
    
    res.status(201).json({
      success: true,
      message: 'Timetable slot created successfully',
      data: newSlot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create timetable slot',
      error: error.message
    });
  }
};

const updateTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    const { class: className, subject, teacher, teacherId, day, time } = req.body;
    
    const updatedSlot = await Timetable.findByIdAndUpdate(
      id,
      { class: className, subject, teacher, teacherId, day, time },
      { new: true }
    );
    
    if (!updatedSlot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Timetable slot updated successfully',
      data: updatedSlot
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update timetable slot',
      error: error.message
    });
  }
};

const deleteTimetableSlot = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedSlot = await Timetable.findByIdAndDelete(id);
    
    if (!deletedSlot) {
      return res.status(404).json({
        success: false,
        message: 'Timetable slot not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Timetable slot deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete timetable slot',
      error: error.message
    });
  }
};

// Academic Year
const getAcademicYear = async (req, res) => {
  try {
    const academicYear = await AcademicYear.findOne({ isActive: true });
    res.json({
      success: true,
      data: academicYear
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch academic year',
      error: error.message
    });
  }
};

const createAcademicYear = async (req, res) => {
  try {
    const { year, startDate, endDate, terms } = req.body;
    
    // Deactivate current academic year
    await AcademicYear.updateMany({}, { isActive: false });
    
    const newAcademicYear = new AcademicYear({
      year,
      startDate,
      endDate,
      terms,
      isActive: true
    });
    
    await newAcademicYear.save();
    
    res.status(201).json({
      success: true,
      message: 'Academic year created successfully',
      data: newAcademicYear
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create academic year',
      error: error.message
    });
  }
};

module.exports = {
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  getAcademicYear,
  createAcademicYear
};