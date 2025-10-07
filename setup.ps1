# Quick Start Script for Windows PowerShell

Write-Host "🌍 SoilSense AI - Quick Start" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if in correct directory
if (-Not (Test-Path "backend") -or -Not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from the project root directory" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Step 1: Setting up Backend..." -ForegroundColor Cyan

# Backend setup
cd backend

# Check if venv exists
if (-Not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate venv
Write-Host "Activating virtual environment..." -ForegroundColor Yellow
& .\venv\Scripts\Activate.ps1

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -r requirements.txt --quiet

Write-Host "✓ Backend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to root
cd ..

Write-Host "📦 Step 2: Setting up Frontend..." -ForegroundColor Cyan
cd frontend

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing Node.js dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Node modules already installed" -ForegroundColor Green
}

Write-Host "✓ Frontend setup complete!" -ForegroundColor Green
Write-Host ""

# Return to root
cd ..

Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  Before running, please:" -ForegroundColor Yellow
Write-Host "  1. Add your API keys to backend\.env" -ForegroundColor Yellow
Write-Host "  2. Add your tokens to frontend\.env.local" -ForegroundColor Yellow
Write-Host "  3. Run: earthengine authenticate" -ForegroundColor Yellow
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd backend; .\venv\Scripts\Activate.ps1; uvicorn main:app --reload" -ForegroundColor White
Write-Host "  Terminal 2: cd frontend; npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "📖 For detailed setup, see SETUP_GUIDE.md" -ForegroundColor Cyan
