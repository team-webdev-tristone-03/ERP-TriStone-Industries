@echo off
echo Starting Full ERP Application...
echo.

echo Checking and killing existing processes on ports 3000 and 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| find "3000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -ano ^| find "5000" ^| find "LISTENING"') do taskkill /f /pid %%a >nul 2>&1
timeout /t 3 >nul

echo Starting Backend Server...
cd /d "%~dp0backend"
start "ERP Backend" cmd /k "npm start"

echo Waiting for backend to start...
timeout /t 5 >nul

echo Starting Frontend Client...
cd /d "%~dp0client"
start "ERP Frontend" cmd /k "npm start"

echo.
echo ========================================
echo ERP Application Starting...
echo Backend: http://localhost:5000/api
echo Frontend: http://localhost:3000
echo Health Check: http://localhost:5000/api/health
echo ========================================
echo.
echo Press any key to close this window...
pause >nul