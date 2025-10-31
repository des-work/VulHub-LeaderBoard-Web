# Quick Fix: Rate Limiting & API Restart

## Issue 1: Rate Limiting (429 Error)

**Status:** ✅ This is actually GOOD! It means:
- API is working correctly
- Rate limiting is protecting your API
- You hit the limit from our testing earlier

**Solution:** The rate limit will reset in 1 minute. Or we can adjust it for development.

## Issue 2: Wrong Command

You ran: `pnpm dev -- -p 3010` in the API directory

**Problem:** The `-p 3010` flag is for Next.js frontend, not NestJS API!

**Correct Command:**
```powershell
# Just run this (no port flag needed):
pnpm dev
```

The API uses the `PORT` environment variable from `start-api.ps1` (which sets it to 4010).

---

## Quick Fix: Restart API Correctly

**Option 1: Use the script (Easiest)**
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-api.ps1
```

**Option 2: Manual**
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\api"
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4010"
$env:CORS_ORIGIN="http://localhost:3010"
$env:NODE_ENV="development"
pnpm dev
```

**Note:** No `-p` flag! The API gets its port from `$env:PORT` (4010).

---

## Rate Limiting Reset

The rate limit will reset automatically in ~1 minute. Or wait 30 seconds and try login again.

If you want to disable/adjust rate limiting for development, I can help with that too!

