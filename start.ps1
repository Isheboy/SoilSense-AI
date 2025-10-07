# SoilSense AI - Start Development Servers

Write-Host "🌍 Starting SoilSense AI..." -ForegroundColor Green
Write-Host ""

# Function to start backend
function Start-Backend {
    Write-Host "🔧 Starting Backend Server..." -ForegroundColor Cyan
    cd backend
    & .\venv\Scripts\Activate.ps1
    uvicorn main:app --reload --port 8000
}

# Function to start frontend
function Start-Frontend {
    Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Cyan
    cd frontend
    npm run dev
}

# Create new PowerShell windows for each server
Write-Host "Opening Backend server in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; & { $function:Start-Backend = ${function:Start-Backend}; Start-Backend }"

Write-Host "Opening Frontend server in new window..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; & { $function:Start-Frontend = ${function:Start-Frontend}; Start-Frontend }"

Write-Host ""
Write-Host "✅ Servers starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access the application at:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:8000" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each window to stop the servers" -ForegroundColor Yellow
