# FUMiniHotelSystem - PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting FUMiniHotelSystem (Assignment 03)" -ForegroundColor Green
Write-Host "  Student: Tran Doan Thanh Tai (SE1910)" -ForegroundColor Yellow
Write-Host "  Database: A3Trandoanthanhtai_SE1910 (MS SQL Server)" -ForegroundColor Yellow
Write-Host "  Backend: Spring Boot 3 + JWT (Port 8080)" -ForegroundColor Yellow
Write-Host "  Frontend: ReactJS + Vite (Port 5173)" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Launch Backend in new window
Start-Process cmd.exe -ArgumentList "/k call `"$scriptDir\A3Trandoanthanhtai_SE1910_BE\run-backend.bat`"" -WorkingDirectory "$scriptDir\A3Trandoanthanhtai_SE1910_BE"

# Launch Frontend in new window
Start-Process cmd.exe -ArgumentList "/k call `"$scriptDir\A3Trandoanthanhtai_SE1910_FE\run-frontend.bat`"" -WorkingDirectory "$scriptDir\A3Trandoanthanhtai_SE1910_FE"

Write-Host ""
Write-Host "Launched both Backend and Frontend in separate windows!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/api" -ForegroundColor White
Write-Host "Frontend UI:  http://localhost:5173/" -ForegroundColor White
Write-Host ""
Start-Sleep -Seconds 3

