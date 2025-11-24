# ERP System - Full-Featured Educational Management System

A comprehensive ERP system built with React.js frontend and Node.js backend, featuring separate panels for Students, Staff, and Admin with role-based authentication and authorization.

## 🚀 Features

### Student Panel
- **Dashboard**: Today's classes, attendance, upcoming exams, pending homework, fee alerts
- **Profile Management**: Personal, academic, and guardian information
- **Marks & Results**: Exam results, grade cards, performance analytics
- **Attendance Tracking**: Daily & subject-wise attendance with visual graphs
- **Digital Classroom**: Study materials, video lectures, announcements
- **Fee Management**: Online payments, receipts, installment tracking
- **Homework**: Subject-wise assignments, submissions, feedback
- **Timetable**: Weekly schedules, exam timetables
- **Additional Modules**: Cafeteria, Transport, Hostel, Library, Events, Placement, Medical Records

### Staff Panel
- **Dashboard**: Today's classes, pending approvals, student summaries
- **Profile Management**: Personal and professional information
- **Class Management**: Assigned classes, student lists, material uploads
- **Attendance Management**: Mark student attendance, generate reports
- **Marks Management**: Add/update student marks, grade assignments
- **Homework Management**: Create assignments, review submissions
- **Reports**: Performance analytics, attendance reports
- **Additional Modules**: Library, Events, Behavior tracking, Chat

### Admin Panel
- **Dashboard**: System overview, statistics, recent activities
- **Student Management**: CRUD operations, enrollment, ID cards, document management
- **Staff Management**: CRUD operations, role assignments, performance tracking
- **Academic Management**: Classes, sections, subjects, timetables
- **Exam Management**: Schedules, grade systems, result approvals
- **Fee Management**: Structure setup, payment tracking, reports
- **System Management**: Settings, roles, permissions, backup/restore
- **Additional Modules**: Library, Hostel, Transport, Events, Medical Records, Placement

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI framework
- **Material-UI** - Component library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd ERP
```

### 2. Backend Setup
```bash
# Install backend dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env file with your configuration
```

### 3. Frontend Setup
```bash
# Navigate to client directory
cd client

# Install frontend dependencies
npm install
```

### 4. Database Setup
- Start MongoDB service
- The application will automatically create the database and seed demo data

### 5. Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/erp_system
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:3000
```

## 🚀 Running the Application

### Development Mode
```bash
# Run both backend and frontend concurrently
npm run dev

# Or run separately:
# Backend only
npm run server

# Frontend only (in client directory)
cd client && npm start
```

### Production Mode
```bash
# Build frontend
npm run build

# Start production server
npm start
```

## 🔐 Demo Credentials

### Student Login
- **Email**: student_demo@erp.com
- **Password**: student123
- **URL**: http://localhost:3000/student/login

### Staff Login
- **Email**: staff_demo@erp.com
- **Password**: staff123
- **URL**: http://localhost:3000/staff/login

### Admin Login
- **Email**: admin_demo@erp.com
- **Password**: admin123
- **URL**: http://localhost:3000/admin/login

## 📡 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset request
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/me` - Get current user

### Student Routes
- `GET /api/student/dashboard` - Student dashboard data
- `GET /api/student/profile` - Student profile
- `GET /api/student/attendance` - Attendance records
- `GET /api/student/marks` - Marks and results
- `GET /api/student/fees` - Fee information
- `GET /api/student/timetable` - Class timetable

### Staff Routes
- `GET /api/staff/dashboard` - Staff dashboard data
- `GET /api/staff/profile` - Staff profile
- `GET /api/staff/classes` - Assigned classes
- `POST /api/staff/attendance` - Mark student attendance
- `POST /api/staff/marks` - Add student marks
- `GET /api/staff/students` - Get students by class

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/students` - Get all students
- `POST /api/admin/students` - Create new student
- `GET /api/admin/staff` - Get all staff
- `POST /api/admin/staff` - Create new staff
- `PUT /api/admin/users/:id/status` - Update user status

## 🗂️ Project Structure

```
ERP/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── student/    # Student panel components
│   │   │   ├── staff/      # Staff panel components
│   │   │   ├── admin/      # Admin panel components
│   │   │   └── common/     # Shared components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── utils/          # Utility functions
├── models/                 # Database models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── controllers/            # Route controllers
├── utils/                  # Utility functions
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- Input validation and sanitization

## 📱 Mobile Responsiveness

The application is fully responsive and works seamlessly on:
- Desktop computers
- Tablets
- Mobile phones

## 🧪 Testing

```bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test
```

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start server.js --name "erp-backend"

# Build and serve frontend
cd client && npm run build
# Serve build folder with nginx or apache
```

### Using Docker
```bash
# Build Docker image
docker build -t erp-system .

# Run container
docker run -p 5000:5000 -p 3000:3000 erp-system
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Updates & Maintenance

- Regular security updates
- Feature enhancements
- Bug fixes
- Performance optimizations

## 📊 System Requirements

### Minimum Requirements
- RAM: 4GB
- Storage: 10GB
- CPU: Dual-core 2.0GHz

### Recommended Requirements
- RAM: 8GB or higher
- Storage: 20GB or higher
- CPU: Quad-core 2.5GHz or higher

---

**Note**: This is a demo application. For production use, ensure proper security configurations, database optimization, and server hardening.