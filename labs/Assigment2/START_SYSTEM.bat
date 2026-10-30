@echo off
title FUNews Management System Launcher
echo ========================================================
echo   Starting FUNewsManagementSystem (Assignment 02)
echo   Backend: Spring Boot 3 (Port 8080)
echo   Frontend: ReactJS + Vite (Port 5173)
echo ========================================================

start "FUNews Backend (Port 8080)" /D "%~dp0A2Trandoanthanhtai_SE1910_BE" cmd /k "call run-backend.bat"
start "FUNews Frontend (Port 5173)" /D "%~dp0A2Trandoanthanhtai_SE1910_FE" cmd /k "call run-frontend.bat"

echo.
echo Launch commands executed! Two separate windows have been started.
echo Backend API: http://localhost:8080/api
echo Frontend UI:  http://localhost:5173/
echo.
timeout /t 5
