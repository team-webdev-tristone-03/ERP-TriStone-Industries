import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Home Page
import HomePage from './components/HomePage';

// Auth Components
import StudentLogin from './components/auth/StudentLogin';
import StaffLogin from './components/auth/StaffLogin';
import AdminLogin from './components/auth/AdminLogin';
import ForgotPassword from './components/auth/ForgotPassword';

// Panel Components
import StudentDashboard from './components/student/StudentDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />
  },
  {
    path: "/student/login",
    element: <StudentLogin />
  },
  {
    path: "/staff/login",
    element: <StaffLogin />
  },
  {
    path: "/admin/login",
    element: <AdminLogin />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/student/*",
    element: (
      <ProtectedRoute role="student">
        <StudentDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/staff/*",
    element: (
      <ProtectedRoute role="staff">
        <StaffDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin/*",
    element: (
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    )
  }
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;