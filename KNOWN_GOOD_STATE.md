# Known Good State - October 31, 2025

**Purpose:** This document captures the exact state when everything was working. Use this to restore if needed.

---

## ✅ Verified Working Configuration

### Ports
- API: `4010`
- Frontend: `3010`
- PostgreSQL: `5433` (Docker)
- Redis: `6380` (Docker)

### API Environment Variables
```powershell
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4010"
$env:CORS_ORIGIN="http://localhost:3010"
$env:NODE_ENV="development"
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_WS_URL=ws://localhost:4010
NODE_ENV=development
```

---

## 🔑 Critical Code Changes

### 1. API Response Mapping (`apps/web/src/lib/api/endpoints.ts`)
```typescript
// Extract data from wrapped response
const data = response.data || response;

// Transform API user to frontend format
const frontendUser = {
  id: apiUser.id,
  schoolId: apiUser.email || apiUser.schoolId || '',
  name: apiUser.firstName && apiUser.lastName 
    ? `${apiUser.firstName} ${apiUser.lastName}`
    : apiUser.name || apiUser.email || 'User',
  email: apiUser.email,
  role: (apiUser.role?.toLowerCase() || 'student') as 'student' | 'grader' | 'admin',
  // ... other fields with defaults
};
```

### 2. Login Field Mapping (`apps/web/src/lib/api/endpoints.ts`)
```typescript
// API expects 'email' field
const response = await apiClient.post('/auth/login', { email: schoolId, password });
```

### 3. Tenant Guard (`apps/api/src/common/guards/tenant.guard.ts`)
```typescript
// In development, use 'default-tenant' (matches seed data)
if (process.env.NODE_ENV === 'development') {
  return 'default-tenant';
}
```

---

## 📋 Startup Commands

### Start API
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-api.ps1
```

### Start Frontend
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-web.ps1
```

---

## ✅ Verification Steps

1. **API Health:**
   ```bash
   curl http://localhost:4010/api/v1/health
   ```
   Should return: `{"success":true,"data":{"status":"ok"...}}`

2. **API Login:**
   ```bash
   curl -X POST http://localhost:4010/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@vulhub.com","password":"admin123"}'
   ```
   Should return tokens and user data

3. **Frontend Login:**
   - Open http://localhost:3010
   - Login: `admin@vulhub.com` / `admin123`
   - Should redirect to dashboard

---

## 📁 Important Files (Current State)

### Scripts
- `start-api.ps1` ✅ Working
- `start-web.ps1` ✅ Working
- `quick-test.ps1` ✅ Working

### Configuration
- `apps/web/.env.local` ✅ Created
- `apps/api/src/common/guards/tenant.guard.ts` ✅ Fixed
- `apps/api/src/common/guards/rate-limit.guard.ts` ✅ Adjusted
- `apps/web/src/lib/api/endpoints.ts` ✅ Fixed response mapping

### Documentation
- `SUCCESS_LOGIN_WORKING.md` ✅ Current status
- `QUICK_START_GUIDE.md` ✅ Startup instructions
- `KNOWN_GOOD_STATE.md` ✅ This file

---

## 🎯 Test Credentials

- Admin: `admin@vulhub.com` / `admin123`
- Instructor: `instructor@vulhub.com` / `admin123`
- Student: `student1@vulhub.com` / `admin123`

---

## 🔧 If You Need to Restore

1. **Reset Database:**
   ```powershell
   cd apps/api
   DATABASE_URL="..." pnpm prisma migrate reset --force
   DATABASE_URL="..." pnpm db:seed
   ```

2. **Clear Frontend Cache:**
   ```powershell
   cd apps/web
   rm -rf .next
   ```

3. **Restart Services:**
   - Stop all terminals
   - Restart databases: `docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev`
   - Restart API: `.\start-api.ps1`
   - Restart Frontend: `.\start-web.ps1`

---

## 📊 What Was Fixed

1. ✅ API response structure extraction
2. ✅ User object mapping (API → Frontend)
3. ✅ Login field mapping (schoolId → email)
4. ✅ Tenant ID matching (default-tenant)
5. ✅ Redis configuration (REDIS_HOST/PORT)
6. ✅ Rate limiting (dev limits)
7. ✅ Port conflicts (4010/3010)
8. ✅ Syntax errors (hooks.ts, context.tsx)
9. ✅ Devtools optional (QueryProvider)

---

**Last Verified Working:** October 31, 2025 ~1:30 AM  
**State:** All services running, login working end-to-end

