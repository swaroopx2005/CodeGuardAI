Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "   Starting CodeGuard AI Full-Stack Platform        " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

$root = $PSScriptRoot
if (-not $root) { $root = "C:\Users\swaro\CodeGuardAI" }

# Free port 8080 if needed
Stop-Process -Name java -Force -ErrorAction SilentlyContinue

# 1. Start Spring Boot Backend in a new window using cmd to avoid PowerShell execution policy restrictions
Write-Host "[1/2] Launching Spring Boot Backend on http://localhost:8080..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$root\backend`" && mvnw.cmd spring-boot:run"

# 2. Start Vite Frontend in a new window using cmd to avoid npm.ps1 script execution errors
Write-Host "[2/2] Launching React Vite Frontend on http://localhost:5173..." -ForegroundColor Yellow
Start-Process cmd -ArgumentList "/k", "cd /d `"$root\frontend`" && npm.cmd run dev"

Write-Host ""
Write-Host "Both servers launched successfully!" -ForegroundColor Green
Write-Host "Vite Dev Server: http://localhost:5173" -ForegroundColor Green
Write-Host "Spring Boot API / Fullstack: http://localhost:8080" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Cyan
