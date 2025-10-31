# Redis Configuration Fix

## Issue
The API was failing with Redis connection errors because:
- The startup scripts were using `REDIS_URL=redis://localhost:6380`
- But the API configuration expects `REDIS_HOST` and `REDIS_PORT` as separate variables

## Root Cause
In `apps/api/src/config/configuration.ts`:
```typescript
redis: {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  // ...
}
```

The configuration doesn't parse `REDIS_URL` format.

## Fix Applied
Updated all scripts and documentation to use:
```bash
REDIS_HOST=localhost
REDIS_PORT=6380
```

Instead of:
```bash
REDIS_URL=redis://localhost:6380
```

## Files Updated
1. `start-api.ps1` - Startup script
2. `LOCAL_DEVELOPMENT_GUIDE.md` - Documentation
3. `START_LOCAL_DEVELOPMENT.ps1` - Setup script
4. `START_API_MANUAL.md` - Manual instructions

## Testing
After restarting the API with correct environment variables, Redis connection should work.

## Additional Fix
Also fixed `TenantGuard` to allow `'default'` tenant ID in development mode.

## Date
October 31, 2025

