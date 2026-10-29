@echo off
echo ========================================================
echo   Starting FUNewsManagementSystem (Assignment 02)
echo   Backend: Spring Boot 3 (Port 8080)
echo   Frontend: ReactJS + Vite (Port 5173)
echo ========================================================

start "FUNews Backend" cmd /k "cd /d %~dp0A2Trandoanthanhtai_SE1910_BE && run-backend.bat"
start "FUNews Frontend" cmd /k "cd /d %~dp0A2Trandoanthanhtai_SE1910_FE && run-frontend.bat"

echo.
echo Projects have been launched in separate console windows!
echo Backend API: http://localhost:8080/api
echo Frontend UI:  http://localhost:5173/
echo.
pause

