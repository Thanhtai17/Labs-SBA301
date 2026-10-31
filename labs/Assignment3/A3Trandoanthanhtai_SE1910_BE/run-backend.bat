@echo off
title FUMiniHotelSystem Backend - A3Trandoanthanhtai_SE1910
cd /d "%~dp0"
echo Starting Spring Boot Backend on port 8080...
call "F:\TemplatePE\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run
pause

