@echo off
setlocal
cd /d "%~dp0"

echo ====================================================
echo   Starting CodeGuard AI Full-Stack Platform
echo ====================================================
echo.

echo Freeing port 8080 from any previous Java instances...
taskkill /F /IM java.exe >nul 2>&1
timeout /t 1 /nobreak >nul

echo [1/2] Launching Spring Boot Backend on port 8080...
start "CodeGuard Backend (:8080)" cmd /k "cd /d "%~dp0backend" && mvnw.cmd spring-boot:run"

echo [2/2] Launching React + Vite Frontend on port 5173...
start "CodeGuard Frontend (:5173)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo ====================================================
echo Both servers have been launched in separate windows!
echo - Vite Dev Server: http://localhost:5173
echo - Spring Boot API / Bundled UI: http://localhost:8080
echo ====================================================
