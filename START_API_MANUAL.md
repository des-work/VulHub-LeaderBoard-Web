# Manual API Startup Guide

The background PowerShell scripts might not show errors. Here's how to start the API manually to see what's happening:

## Option 1: Using PowerShell Script (Recommended)

Open a **new PowerShell window** and run:

```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-api.ps1
```

This will run the API in the **foreground** so you can see all output and errors.

## Option 2: Manual Commands

Open a **new PowerShell window** and run:

```powershell
# Navigate to project
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\api"

# Set environment variables
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4010"
$env:CORS_ORIGIN="http://localhost:3010"
$env:NODE_ENV="development"

# Start API
pnpm dev
```

## Expected Output

You should see:

```
[Nest] INFO [NestFactory] Starting Nest application...
[Nest] INFO [InstanceLoader] AppModule dependencies initialized
...
🚀 Application is running on: http://localhost:4010
📚 API Documentation: http://localhost:4010/api/docs
```

## Common Errors

### Error: Cannot find module '@nestjs/cli'

**Solution:** Run from project root:
```powershell
pnpm install
```

### Error: Can't reach database server

**Solution:** Make sure Docker containers are running:
```powershell
docker ps | findstr vulhub
```

You should see `vulhub-postgres-dev` and `vulhub-redis-dev` as **healthy**.

If not running:
```powershell
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev
```

### Port 4010 already in use

**Solution:** Kill the existing process:
```powershell
# Find the process ID
netstat -ano | findstr ":4010"

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Verify API is Running

Once started, test in a **new terminal**:

```bash
curl http://localhost:4010/api/v1/health
```

Should return:
```json
{"status":"ok","timestamp":"2025-10-31T...","services":{...}}
```

Or open in browser:
- http://localhost:4010/api/v1/health
- http://localhost:4010/api/docs

