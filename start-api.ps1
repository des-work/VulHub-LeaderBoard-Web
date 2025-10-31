# Start API with environment variables
# Run from project root: .\start-api.ps1

Write-Host "Starting VulHub API on port 4010..." -ForegroundColor Green

# Set environment variables
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4010"
$env:CORS_ORIGIN="http://localhost:3010"
$env:NODE_ENV="development"

Write-Host "Environment variables set" -ForegroundColor Green
Write-Host "API will run on: http://localhost:4010" -ForegroundColor Cyan
Write-Host "API Docs will be at: http://localhost:4010/api/docs" -ForegroundColor Cyan
Write-Host ""

# Navigate to API directory and start
Set-Location apps\api
pnpm dev

