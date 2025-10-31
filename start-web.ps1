# Start Frontend on port 3010
# Run from project root: .\start-web.ps1

Write-Host "Starting VulHub Frontend on port 3010..." -ForegroundColor Green

# Create .env.local if it doesn't exist
$envFile = "apps\web\.env.local"
if (-not (Test-Path $envFile)) {
    Write-Host "Creating .env.local file..." -ForegroundColor Yellow
    $envContent = @"
# Frontend Environment Variables for Local Development
# Auto-generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false

# WebSocket (if needed)
NEXT_PUBLIC_WS_URL=ws://localhost:4010

# Development
NODE_ENV=development
"@
    $envContent | Out-File -FilePath $envFile -Encoding UTF8
    Write-Host "Created $envFile" -ForegroundColor Green
} else {
    Write-Host "Using existing .env.local" -ForegroundColor Green
}

Write-Host "Frontend will run on: http://localhost:3010" -ForegroundColor Cyan
Write-Host "Connected to API: http://localhost:4010/api/v1" -ForegroundColor Cyan
Write-Host ""

# Navigate to web directory and start
Set-Location apps\web
pnpm dev -- -p 3010

