@echo off
echo Starting ERP System...
echo.
echo 1. Creating demo users...
node createUsers.js
echo.
echo 2. Starting backend server...
start "Backend Server" cmd /k "node server.js"
echo.
echo 3. Starting frontend (in 3 seconds)...
timeout /t 3 /nobreak > nul
cd client
start "Frontend Server" cmd /k "npm start"
echo.
echo ✅ ERP System started successfully!
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Demo Credentials:
echo Student: student_demo@erp.com / student123
echo Staff: staff_demo@erp.com / staff123  
echo Admin: admin_demo@erp.com / admin123
echo.
pause