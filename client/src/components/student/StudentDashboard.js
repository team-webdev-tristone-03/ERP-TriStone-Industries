import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Dashboard,
  Person,
  Grade,
  EventAvailable,
  Payment,
  Schedule,
  Assignment,
  School,
  LocalCafe,
  DirectionsBus,
  EmojiEvents,
  Home,
  Event,
  LibraryBooks,
  Work,
  LocalHospital,
  Feedback,
  Chat
} from '@mui/icons-material';
import Layout from '../common/Layout';
import StudentDashboardHome from './StudentDashboardHome';
import StudentProfile from './StudentProfile';
import StudentAttendance from './StudentAttendance';
import StudentMarks from './StudentMarks';
import StudentFees from './StudentFees';
import StudentTimetable from './StudentTimetable';
import StudentExams from './StudentExams';
import StudentCafeteria from './StudentCafeteria';
import StudentTransport from './StudentTransport';
import StudentBadges from './StudentBadges';
import StudentHostel from './StudentHostel';
import StudentEvents from './StudentEvents';
import StudentLibrary from './StudentLibrary';
import StudentPlacement from './StudentPlacement';
import StudentMedical from './StudentMedical';
import StudentFeedback from './StudentFeedback';
import StudentChat from './StudentChat';
import StudentClassroom from './StudentClassroom';
import StudentHomework from './StudentHomework';

const StudentDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/student/dashboard' },
    { text: 'Profile', icon: <Person />, path: '/student/profile' },
    { text: 'Marks', icon: <Grade />, path: '/student/marks' },
    { text: 'Attendance', icon: <EventAvailable />, path: '/student/attendance' },
    { text: 'Digital Classroom', icon: <School />, path: '/student/classroom' },
    { text: 'Payment/Fees', icon: <Payment />, path: '/student/fees' },
    { text: 'Homework', icon: <Assignment />, path: '/student/homework' },
    { text: 'Timetable', icon: <Schedule />, path: '/student/timetable' },
    { text: 'Exam Schedule', icon: <Grade />, path: '/student/exams' },
    { text: 'Cafeteria', icon: <LocalCafe />, path: '/student/cafeteria' },
    { text: 'Transport', icon: <DirectionsBus />, path: '/student/transport' },
    { text: 'Badges', icon: <EmojiEvents />, path: '/student/badges' },
    { text: 'Hostel', icon: <Home />, path: '/student/hostel' },
    { text: 'Events', icon: <Event />, path: '/student/events' },
    { text: 'Library', icon: <LibraryBooks />, path: '/student/library' },
    { text: 'Placement', icon: <Work />, path: '/student/placement' },
    { text: 'Medical Records', icon: <LocalHospital />, path: '/student/medical' },
    { text: 'Feedback', icon: <Feedback />, path: '/student/feedback' },
    { text: 'Chat', icon: <Chat />, path: '/student/chat' }
  ];

  useEffect(() => {
    // Redirect to dashboard if on base student route
    if (window.location.pathname === '/student' || window.location.pathname === '/student/') {
      navigate('/student/dashboard');
    }
  }, [navigate]);

  return (
    <Layout menuItems={menuItems} title="Student Portal">
      <Routes>
        <Route path="/dashboard" element={<StudentDashboardHome />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/attendance" element={<StudentAttendance />} />
        <Route path="/marks" element={<StudentMarks />} />
        <Route path="/fees" element={<StudentFees />} />
        <Route path="/classroom" element={<StudentClassroom />} />
        <Route path="/homework" element={<StudentHomework />} />
        <Route path="/timetable" element={<StudentTimetable />} />
        <Route path="/exams" element={<StudentExams />} />
        <Route path="/cafeteria" element={<StudentCafeteria />} />
        <Route path="/transport" element={<StudentTransport />} />
        <Route path="/badges" element={<StudentBadges />} />
        <Route path="/hostel" element={<StudentHostel />} />
        <Route path="/events" element={<StudentEvents />} />
        <Route path="/library" element={<StudentLibrary />} />
        <Route path="/placement" element={<StudentPlacement />} />
        <Route path="/medical" element={<StudentMedical />} />
        <Route path="/feedback" element={<StudentFeedback />} />
        <Route path="/chat" element={<StudentChat />} />
        <Route path="/*" element={<StudentDashboardHome />} />
      </Routes>
    </Layout>
  );
};

export default StudentDashboard;