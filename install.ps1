# Curry House Jar - Quick Install Script
# Run this script to install all dependencies at once

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Curry House Jar - Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = "c:\Users\sahal\Desktop\tess app"

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if MongoDB is installed
Write-Host "Checking MongoDB installation..." -ForegroundColor Yellow
try {
    $mongoVersion = mongod --version | Select-String "db version"
    Write-Host "✓ MongoDB is installed" -ForegroundColor Green
} catch {
    Write-Host "⚠ MongoDB might not be installed or not in PATH" -ForegroundColor Yellow
    Write-Host "Make sure MongoDB is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing Backend Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location "$projectRoot\backend"
Write-Host "Installing backend packages..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Backend dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install backend dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Installing Mobile App Dependencies" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location "$projectRoot\mobile-app"
Write-Host "Installing mobile app packages..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Mobile app dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "✗ Failed to install mobile app dependencies" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Installation Complete! 🎉" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start MongoDB service:" -ForegroundColor White
Write-Host "   net start MongoDB" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Seed the database with sample data:" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Yellow
Write-Host "   npm run seed" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Start the backend server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. In a new terminal, start the mobile app:" -ForegroundColor White
Write-Host "   cd mobile-app" -ForegroundColor Yellow
Write-Host "   npm start" -ForegroundColor Yellow
Write-Host ""
Write-Host "📖 For detailed instructions, see SETUP_GUIDE.md" -ForegroundColor Cyan
Write-Host ""

Set-Location $projectRoot
