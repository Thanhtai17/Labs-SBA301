# FUNews Management System - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting FUNewsManagementSystem (Assignment 02)" -ForegroundColor Green
Write-Host "  Backend: Spring Boot 3 (Port 8080)" -ForegroundColor Yellow
Write-Host "  Frontend: ReactJS + Vite (Port 5173)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Launch Backend in new window
Start-Process cmd.exe -ArgumentList "/k call `"$scriptDir\A2Trandoanthanhtai_SE1910_BE\run-backend.bat`"" -WorkingDirectory "$scriptDir\A2Trandoanthanhtai_SE1910_BE"

# Launch Frontend in new window
Start-Process cmd.exe -ArgumentList "/k call `"$scriptDir\A2Trandoanthanhtai_SE1910_FE\run-frontend.bat`"" -WorkingDirectory "$scriptDir\A2Trandoanthanhtai_SE1910_FE"

Write-Host ""
Write-Host "Launched both Backend and Frontend in separate windows!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "Frontend UI:  http://localhost:5173/" -ForegroundColor White
Write-Host ""
Start-Sleep -Seconds 3

