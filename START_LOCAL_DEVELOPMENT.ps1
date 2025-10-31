# PowerShell script to start local development environment
# Run this instead of Docker for faster development

Write-Host "🚀 Starting VulHub Local Development Environment" -ForegroundColor Green
Write-Host ""

# Check if Docker is running
Write-Host "Checking Docker..." -ForegroundColor Yellow
try {
    docker ps | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop." -ForegroundColor Red
    exit 1
}

# Start PostgreSQL and Redis containers
Write-Host ""
Write-Host "Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev

Start-Sleep -Seconds 5

# Check if containers are healthy
Write-Host ""
Write-Host "Verifying containers..." -ForegroundColor Yellow
$postgresStatus = docker ps --filter "name=vulhub-postgres-dev" --filter "health=healthy" --format "{{.Status}}"
$redisStatus = docker ps --filter "name=vulhub-redis-dev" --filter "health=healthy" --format "{{.Status}}"

if ($postgresStatus -and $redisStatus) {
    Write-Host "✅ PostgreSQL and Redis are healthy" -ForegroundColor Green
} else {
    Write-Host "⚠️  Waiting for containers to be healthy..." -ForegroundColor Yellow
    Start-Sleep -Seconds 10
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Environment Ready!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1️⃣  Start API (in a new terminal):" -ForegroundColor White
Write-Host "   cd apps/api" -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:REDIS_HOST="localhost"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:REDIS_PORT="6380"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:PORT="4010"' -ForegroundColor Gray
Write-Host "   " -NoNewline
Write-Host '$env:CORS_ORIGIN="http://localhost:3010"' -ForegroundColor Gray
Write-Host "   pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "2️⃣  Start Frontend (in another terminal):" -ForegroundColor White
Write-Host "   cd apps/web" -ForegroundColor Gray
Write-Host "   pnpm dev -- -p 3010" -ForegroundColor Gray
Write-Host ""
Write-Host "3️⃣  Access the application:" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3010" -ForegroundColor Cyan
Write-Host "   API: http://localhost:4010/api/v1/health" -ForegroundColor Cyan
Write-Host "   API Docs: http://localhost:4010/api/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "📝 See LOCAL_DEVELOPMENT_GUIDE.md for more details" -ForegroundColor Yellow
Write-Host ""

