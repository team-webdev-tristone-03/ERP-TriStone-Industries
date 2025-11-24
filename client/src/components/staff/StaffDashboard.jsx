import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Dashboard,
  Person,
  EventAvailable,
  School,
  Grade,
  Approval,
  Schedule,
  Assignment,
  EmojiEvents,
  LibraryBooks,
  Assessment,
  Event,
  Psychology,
  Chat
} from '@mui/icons-material';
import Layout from '../common/Layout.jsx';
import StaffDashboardHome from './StaffDashboardHome.jsx';
import StaffProfile from './StaffProfile.jsx';
import StaffClasses from './StaffClasses.jsx';
import StaffAttendance from './StaffAttendance.jsx';
import StaffMarks from './StaffMarks.jsx';
import StaffApprovals from './StaffApprovals.jsx';
import StaffTimetable from './StaffTimetable.jsx';
import StaffHomework from './StaffHomework.jsx';
import StaffAchievements from './StaffAchievements.jsx';
import StaffLibrary from './StaffLibrary.jsx';
import StaffReports from './StaffReports.jsx';
import StaffEvents from './StaffEvents.jsx';
import StaffBehaviour from './StaffBehaviour.jsx';
import StaffChat from './StaffChat.jsx';
import StaffDetails from './StaffDetails.jsx';

const StaffDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/staff/dashboard' },
    { text: 'Profile', icon: <Person />, path: '/staff/profile' },
    { text: 'Attendance', icon: <EventAvailable />, path: '/staff/attendance' },
    { text: 'Classes', icon: <School />, path: '/staff/classes' },
    { text: 'Marks', icon: <Grade />, path: '/staff/marks' },
    { text: 'Approvals', icon: <Approval />, path: '/staff/approvals' },
    { text: 'Timetable', icon: <Schedule />, path: '/staff/timetable' },
    { text: 'Homework', icon: <Assignment />, path: '/staff/homework' },
    { text: 'Achievements', icon: <EmojiEvents />, path: '/staff/achievements' },
    { text: 'Library', icon: <LibraryBooks />, path: '/staff/library' },
    { text: 'Reports', icon: <Assessment />, path: '/staff/reports' },
    { text: 'Events', icon: <Event />, path: '/staff/events' },
    { text: 'Behaviour', icon: <Psychology />, path: '/staff/behaviour' },
    { text: 'Chat', icon: <Chat />, path: '/staff/chat' },
    { text: 'My Details', icon: <Person />, path: '/staff/details' }
  ];

  useEffect(() => {
    if (window.location.pathname === '/staff' || window.location.pathname === '/staff/') {
      navigate('/staff/dashboard');
    }
  }, [navigate]);

  return (
    <Layout menuItems={menuItems} title="Staff Portal">
      <Routes>
        <Route path="/dashboard" element={<StaffDashboardHome />} />
        <Route path="/profile" element={<StaffProfile />} />
        <Route path="/classes" element={<StaffClasses />} />
        <Route path="/attendance" element={<StaffAttendance />} />
        <Route path="/marks" element={<StaffMarks />} />
        <Route path="/approvals" element={<StaffApprovals />} />
        <Route path="/timetable" element={<StaffTimetable />} />
        <Route path="/homework" element={<StaffHomework />} />
        <Route path="/achievements" element={<StaffAchievements />} />
        <Route path="/library" element={<StaffLibrary />} />
        <Route path="/reports" element={<StaffReports />} />
        <Route path="/events" element={<StaffEvents />} />
        <Route path="/behaviour" element={<StaffBehaviour />} />
        <Route path="/chat" element={<StaffChat />} />
        <Route path="/details" element={<StaffDetails staffId="STF001" />} />
        <Route path="/*" element={<StaffDashboardHome />} />
      </Routes>
    </Layout>
  );
};

export default StaffDashboard;