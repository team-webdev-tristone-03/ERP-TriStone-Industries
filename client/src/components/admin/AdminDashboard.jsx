import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import {
  Dashboard,
  People,
  Person,
  EventAvailable,
  School,
  Grade,
  Assignment,
  Payment,
  LibraryBooks,
  Home,
  DirectionsBus,
  Event,
  Psychology,
  Work,
  LocalHospital,
  Feedback,
  Chat,
  Settings
} from '@mui/icons-material';
import Layout from '../common/Layout.jsx';
import AdminDashboardHome from './AdminDashboardHome.jsx';
import AdminProfile from './AdminProfile.jsx';
import AdminStudents from './AdminStudents.jsx';
import AdminStaff from './AdminStaff.jsx';
import AdminAcademic from './AdminAcademic.jsx';
import AdminExams from './AdminExams.jsx';
import AdminHomework from './AdminHomework.jsx';
import AdminFees from './AdminFees.jsx';
import AdminLibrary from './AdminLibrary.jsx';
import AdminHostel from './AdminHostel.jsx';
import AdminEvents from './AdminEvents.jsx';
import AdminBehaviour from './AdminBehaviour.jsx';
import AdminPlacement from './AdminPlacement.jsx';
import AdminMedical from './AdminMedical.jsx';
import AdminFeedback from './AdminFeedback.jsx';
import AdminChat from './AdminChat.jsx';
import AdminSettings from './AdminSettings.jsx';
import AdminAttendance from './AdminAttendance.jsx';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Profile', icon: <Person />, path: '/admin/profile' },
    { text: 'Student Management', icon: <People />, path: '/admin/students' },
    { text: 'Staff Management', icon: <Person />, path: '/admin/staff' },
    { text: 'Attendance Management', icon: <EventAvailable />, path: '/admin/attendance' },
    { text: 'Class/Academic Management', icon: <School />, path: '/admin/academic' },
    { text: 'Exam/Marks Management', icon: <Grade />, path: '/admin/exams' },
    { text: 'Homework & Classroom', icon: <Assignment />, path: '/admin/homework' },
    { text: 'Fees/Payment Management', icon: <Payment />, path: '/admin/fees' },
    { text: 'Library Management', icon: <LibraryBooks />, path: '/admin/library' },
    { text: 'Hostel & Transport', icon: <Home />, path: '/admin/hostel' },
    { text: 'Event/Notice Management', icon: <Event />, path: '/admin/events' },
    { text: 'Behaviour/Disciplinary', icon: <Psychology />, path: '/admin/behaviour' },
    { text: 'Placement Cell', icon: <Work />, path: '/admin/placement' },
    { text: 'Medical Records', icon: <LocalHospital />, path: '/admin/medical' },
    { text: 'Feedback/Approval', icon: <Feedback />, path: '/admin/feedback' },
    { text: 'Chat Management', icon: <Chat />, path: '/admin/chat' },
    { text: 'Settings/Roles', icon: <Settings />, path: '/admin/settings' }
  ];

  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.pathname === '/admin/') {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  return (
    <Layout menuItems={menuItems} title="Admin Portal">
      <Routes>
        <Route path="/dashboard" element={<AdminDashboardHome />} />
        <Route path="/profile" element={<AdminProfile />} />
        <Route path="/students" element={<AdminStudents />} />
        <Route path="/staff" element={<AdminStaff />} />
        <Route path="/attendance" element={<AdminAttendance />} />
        <Route path="/academic" element={<AdminAcademic />} />
        <Route path="/exams" element={<AdminExams />} />
        <Route path="/homework" element={<AdminHomework />} />
        <Route path="/fees" element={<AdminFees />} />
        <Route path="/library" element={<AdminLibrary />} />
        <Route path="/hostel" element={<AdminHostel />} />
        <Route path="/events" element={<AdminEvents />} />
        <Route path="/behaviour" element={<AdminBehaviour />} />
        <Route path="/placement" element={<AdminPlacement />} />
        <Route path="/medical" element={<AdminMedical />} />
        <Route path="/feedback" element={<AdminFeedback />} />
        <Route path="/chat" element={<AdminChat />} />
        <Route path="/settings" element={<AdminSettings />} />
        <Route path="/*" element={<AdminDashboardHome />} />
      </Routes>
    </Layout>
  );
};

export default AdminDashboard;