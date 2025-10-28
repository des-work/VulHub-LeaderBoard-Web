# VulHub Development Startup Script
# This script ensures a clean development environment

Write-Host "🚀 Starting VulHub Development Environment..." -ForegroundColor Green

# Function to kill processes on specific ports
function Stop-ProcessOnPort {
    param([int]$Port)
    
    $processes = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($processes) {
        foreach ($process in $processes) {
            $pid = $process.OwningProcess
            Write-Host "Stopping process $pid on port $Port" -ForegroundColor Yellow
            Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
        }
    }
}

# Clean up existing processes
Write-Host "🧹 Cleaning up existing processes..." -ForegroundColor Yellow
Stop-ProcessOnPort -Port 3000
Stop-ProcessOnPort -Port 3001
Stop-ProcessOnPort -Port 3002
Stop-ProcessOnPort -Port 3003
Stop-ProcessOnPort -Port 3004
Stop-ProcessOnPort -Port 3005
Stop-ProcessOnPort -Port 3006
Stop-ProcessOnPort -Port 4000

# Wait a moment for processes to fully stop
Start-Sleep -Seconds 2

# Build UI package first
Write-Host "🔨 Building UI package..." -ForegroundColor Blue
Set-Location "packages/ui"
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build UI package" -ForegroundColor Red
    exit 1
}

# Build API
Write-Host "🔨 Building API..." -ForegroundColor Blue
Set-Location "../../apps/api"
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to build API" -ForegroundColor Red
    exit 1
}

# Start API in background
Write-Host "🚀 Starting API server..." -ForegroundColor Green
Start-Process -FilePath "pnpm" -ArgumentList "start:dev" -WindowStyle Hidden

# Wait for API to start
Start-Sleep -Seconds 5

# Start Web App
Write-Host "🌐 Starting Web Application..." -ForegroundColor Green
Set-Location "../web"
Start-Process -FilePath "pnpm" -ArgumentList "dev" -WindowStyle Hidden

# Wait for Web App to start
Start-Sleep -Seconds 10

Write-Host "✅ Development environment started successfully!" -ForegroundColor Green
Write-Host "📱 Web App: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔌 API: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🏥 Health Check: http://localhost:4000/health" -ForegroundColor Cyan

Write-Host "`nPress Ctrl+C to stop all services" -ForegroundColor Yellow

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} catch {
    Write-Host "`n🛑 Stopping development environment..." -ForegroundColor Red
    Stop-ProcessOnPort -Port 3000
    Stop-ProcessOnPort -Port 4000
    Write-Host "✅ Development environment stopped" -ForegroundColor Green
}
