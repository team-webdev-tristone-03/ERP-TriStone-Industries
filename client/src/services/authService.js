import axios from 'axios';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5000/api').trim().replace(/\s+/g, '');

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', {
      method: config.method?.toUpperCase(),
      url: config.baseURL + config.url,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Handle responses and errors
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      baseURL: error.config?.baseURL
    });
    
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      // Let the component handle the redirect based on context
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password, role) => {
    try {
      console.log('Attempting login:', { email, role, apiUrl: API_URL });
      const response = await api.post('/auth/login', { email, password, role });
      return response;
    } catch (error) {
      console.error('Login service error:', error);
      throw error;
    }
  },
  
  forgotPassword: (email, role) => 
    api.post('/auth/forgot-password', { email, role }),
  
  resetPassword: (resetToken, password) => 
    api.post('/auth/reset-password', { resetToken, password }),
  
  getCurrentUser: () => 
    api.get('/auth/me'),
};

export const studentService = {
  getDashboard: () => api.get('/student/dashboard'),
  getProfile: () => api.get('/student/profile'),
  getAttendance: (month, year) => api.get(`/student/attendance?month=${month}&year=${year}`),
  getMarks: () => api.get('/student/marks'),
  getFees: () => api.get('/student/fees'),
  getTimetable: () => api.get('/student/timetable'),
};

export const staffService = {
  getDashboard: () => api.get('/staff/dashboard'),
  getProfile: () => api.get('/staff/profile'),
  getClasses: () => api.get('/staff/classes'),
  markAttendance: (data) => api.post('/staff/attendance', data),
  addMarks: (data) => api.post('/staff/marks', data),
  getStudents: (className, section) => api.get(`/staff/students?class=${className}&section=${section}`),
};

export const adminService = {
  signup: (formData) => api.post('/admin/signup', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getDashboard: () => api.get('/admin/dashboard'),
  getProfile: () => api.get('/admin/profile'),
  updateProfile: (data) => api.put('/admin/profile', data),
  getStudents: (page, limit, search) => api.get(`/admin/students?page=${page}&limit=${limit}&search=${search}`),
  createStudent: (data) => api.post('/admin/students', data),
  updateStudent: (id, data) => api.put(`/admin/students/${id}`, data),
  updateStudentAccess: (id, accessData) => api.put(`/admin/students/${id}/access`, { access: accessData }),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getStaff: (page, limit, search) => api.get(`/admin/staff?page=${page}&limit=${limit}&search=${search}`),
  createStaff: (data) => api.post('/admin/staff', data),
  updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
};

export const academicService = {
  // Classes
  getClasses: () => api.get('/academic/classes'),
  createClass: (data) => api.post('/academic/classes', data),
  updateClass: (id, data) => api.put(`/academic/classes/${id}`, data),
  deleteClass: (id) => api.delete(`/academic/classes/${id}`),
  
  // Subjects
  getSubjects: () => api.get('/academic/subjects'),
  createSubject: (data) => api.post('/academic/subjects', data),
  updateSubject: (id, data) => api.put(`/academic/subjects/${id}`, data),
  deleteSubject: (id) => api.delete(`/academic/subjects/${id}`),
  
  // Timetable
  getTimetable: () => api.get('/academic/timetable'),
  createTimetableSlot: (data) => api.post('/academic/timetable', data),
  updateTimetableSlot: (id, data) => api.put(`/academic/timetable/${id}`, data),
  deleteTimetableSlot: (id) => api.delete(`/academic/timetable/${id}`),
  
  // Academic Year
  getAcademicYear: () => api.get('/academic/academic-year'),
  createAcademicYear: (data) => api.post('/academic/academic-year', data),
};

export const hostelService = {
  // Hostels
  getHostels: () => api.get('/hostel/hostels'),
  createHostel: (data) => api.post('/hostel/hostels', data),
  updateHostel: (id, data) => api.put(`/hostel/hostels/${id}`, data),
  deleteHostel: (id) => api.delete(`/hostel/hostels/${id}`),
  
  // Rooms
  getRooms: () => api.get('/hostel/rooms'),
  createRoom: (data) => api.post('/hostel/rooms', data),
  updateRoom: (id, data) => api.put(`/hostel/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/hostel/rooms/${id}`),
  
  // Hostel Allocations
  getHostelAllocations: () => api.get('/hostel/hostel-allocations'),
  createHostelAllocation: (data) => api.post('/hostel/hostel-allocations', data),
  
  // Transport
  getTransport: () => api.get('/hostel/transport'),
  createTransport: (data) => api.post('/hostel/transport', data),
  updateTransport: (id, data) => api.put(`/hostel/transport/${id}`, data),
  deleteTransport: (id) => api.delete(`/hostel/transport/${id}`),
  
  // Transport Allocations
  getTransportAllocations: () => api.get('/hostel/transport-allocations'),
  createTransportAllocation: (data) => api.post('/hostel/transport-allocations', data),
};

export const eventService = {
  getEvents: () => api.get('/events'),
  createEvent: (data) => api.post('/events', data),
  updateEvent: (id, data) => api.put(`/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/events/${id}`),
  getEventById: (id) => api.get(`/events/${id}`),
  updateEventStatus: (id, status) => api.patch(`/events/${id}/status`, { status }),
};

export default api;