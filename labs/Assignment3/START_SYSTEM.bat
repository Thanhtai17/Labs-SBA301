@echo off
title FUMiniHotelSystem Launcher - Assignment 03 SBA301
echo ========================================================
echo   Starting FUMiniHotelSystem (Assignment 03)
echo   Student: Tran Doan Thanh Tai (SE1910)
echo   Database: A3Trandoanthanhtai_SE1910 (MS SQL Server)
echo   Backend: Spring Boot 3 + JWT (Port 8080)
echo   Frontend: ReactJS + Vite (Port 5173)
echo ========================================================

start "FUMiniHotel Backend (Port 8080)" /D "%~dp0A3Trandoanthanhtai_SE1910_BE" cmd /k "call run-backend.bat"
start "FUMiniHotel Frontend (Port 5173)" /D "%~dp0A3Trandoanthanhtai_SE1910_FE" cmd /k "call run-frontend.bat"

echo.
echo Launch commands executed! Two separate windows have been started.
echo Backend API: http://localhost:8080/api
echo Frontend UI:  http://localhost:5173/
echo.
timeout /t 5

