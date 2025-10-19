# Curry House Jar - Quick Start Script
# This script starts both backend and mobile app

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Curry House Jar - Starting Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "c:\Users\sahal\Desktop\tess app"

# Check if MongoDB is running
Write-Host "Checking MongoDB..." -ForegroundColor Yellow
$mongoService = Get-Service -Name MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -ne 'Running') {
        Write-Host "Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service -Name MongoDB
        Start-Sleep -Seconds 2
    }
    Write-Host "✓ MongoDB is running" -ForegroundColor Green
} else {
    Write-Host "⚠ MongoDB service not found. Make sure MongoDB is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Backend Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\backend'; Write-Host 'Starting Backend Server...' -ForegroundColor Green; npm run dev"

Write-Host "✓ Backend server starting in new window..." -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Mobile App" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Start mobile app in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$projectRoot\mobile-app'; Write-Host 'Starting Expo Development Server...' -ForegroundColor Green; npm start"

Write-Host "✓ Mobile app starting in new window..." -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Services Started! 🚀" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "✓ Backend API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "✓ Expo Dev Tools: Opening in browser..." -ForegroundColor Cyan
Write-Host ""
Write-Host "📱 To run the app:" -ForegroundColor Yellow
Write-Host "   - Press 'a' for Android" -ForegroundColor White
Write-Host "   - Press 'i' for iOS" -ForegroundColor White
Write-Host "   - Scan QR code with Expo Go app" -ForegroundColor White
Write-Host ""
