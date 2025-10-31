# Full Integration Testing Guide

**Date:** October 31, 2025  
**Status:** Ready for Testing

---

## 🎯 Testing Overview

This guide covers end-to-end testing of the VulHub Leaderboard platform with the API running on port 4010 and frontend on port 3010.

---

## ✅ Prerequisites

All services should be running:
- ✅ PostgreSQL (Docker): `localhost:5433`
- ✅ Redis (Docker): `localhost:6380`
- ✅ API (Local): `http://localhost:4010`
- ✅ Frontend (Local): `http://localhost:3010`

---

## 🧪 Test Suite

### 1. API Health Check

**Endpoint:** `GET http://localhost:4010/api/v1/health`

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "status": "ok",
    "info": {
      "api": { "status": "up", "message": "API is running" }
    }
  }
}
```

**Test Command:**
```bash
curl http://localhost:4010/api/v1/health
```

---

### 2. API Authentication

**Endpoint:** `POST http://localhost:4010/api/v1/auth/login`

**Test Credentials:**
- **Admin:** `admin@vulhub.com` / `admin123`
- **Instructor:** `instructor@vulhub.com` / `admin123`
- **Student:** `student1@vulhub.com` / `admin123`

**Test Command:**
```bash
curl -X POST http://localhost:4010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@vulhub.com","password":"admin123"}'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "admin@vulhub.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "ADMIN"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### 3. Frontend Access

**URL:** http://localhost:3010

**What to Check:**
- [ ] Page loads without errors
- [ ] Login form is visible
- [ ] No console errors in browser DevTools
- [ ] CSS/styling loads correctly
- [ ] Logo and branding appear

---

### 4. Frontend → API Connection Test

**Test Steps:**

1. **Open browser:** http://localhost:3010
2. **Open DevTools:** F12 → Console tab
3. **Check for errors:** Should be no CORS or network errors
4. **Verify API URL:** Check that requests go to `http://localhost:4010/api/v1`

**Expected Console Output:**
```
No CORS errors
No 404 errors
API requests target http://localhost:4010/api/v1
```

---

### 5. Login Flow Test

**Test Steps:**

1. Navigate to http://localhost:3010
2. Enter credentials:
   - Email: `admin@vulhub.com`
   - Password: `admin123`
3. Click "Login"
4. Check response in Network tab

**Success Criteria:**
- [ ] Login request sent to `/api/v1/auth/login`
- [ ] Receives 200 OK response
- [ ] JWT tokens stored (check localStorage/cookies)
- [ ] User redirected to dashboard
- [ ] User info displayed in UI

**Failure Scenarios to Check:**
- [ ] Wrong password → Shows error message
- [ ] Invalid email → Shows validation error
- [ ] Network error → Shows friendly error message

---

### 6. Dashboard Access Test

**After successful login:**

**What to Check:**
- [ ] Dashboard loads
- [ ] User name/email displayed
- [ ] Navigation menu works
- [ ] Leaderboard data loads
- [ ] No authentication errors

---

### 7. API Protected Endpoints Test

**Test authenticated endpoints:**

```bash
# Get user profile (requires token)
curl -X GET http://localhost:4010/api/v1/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get leaderboard
curl -X GET http://localhost:4010/api/v1/leaderboards \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Get projects
curl -X GET http://localhost:4010/api/v1/projects \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected:** All return 200 OK with data

---

### 8. Error Handling Test

**Test various error scenarios:**

**Invalid Login:**
```bash
curl -X POST http://localhost:4010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrong"}'
```

**Expected:** 401 Unauthorized with error message

**Missing Auth Token:**
```bash
curl -X GET http://localhost:4010/api/v1/users/profile
```

**Expected:** 401 Unauthorized

**Invalid Endpoint:**
```bash
curl http://localhost:4010/api/v1/does-not-exist
```

**Expected:** 404 Not Found

---

### 9. WebSocket Connection Test (If Applicable)

**URL:** `ws://localhost:4010`

**What to Check:**
- [ ] WebSocket connection establishes
- [ ] Real-time updates work
- [ ] Connection survives refresh

---

### 10. Logout Test

**Test Steps:**

1. While logged in, click "Logout"
2. Check that:
   - [ ] Tokens cleared from storage
   - [ ] Redirected to login page
   - [ ] Cannot access dashboard without login
   - [ ] Previous token no longer works

---

## 🐛 Common Issues & Solutions

### Frontend Won't Load

**Issue:** `curl http://localhost:3010` returns empty or error

**Solutions:**
1. Check if frontend is running: `netstat -ano | findstr :3010`
2. Restart frontend: Stop PowerShell, run `.\start-web.ps1` again
3. Check for port conflicts
4. Clear Next.js cache: `cd apps/web && rm -rf .next && pnpm dev -- -p 3010`

### CORS Errors

**Issue:** Console shows "CORS policy blocked"

**Solutions:**
1. Verify API `CORS_ORIGIN` includes `http://localhost:3010`
2. Restart API with correct env vars
3. Check browser isn't using cached CORS response

### Login Fails

**Issue:** 401 Unauthorized on login

**Solutions:**
1. Verify database is seeded: Check for users in database
2. Confirm tenant ID is `default-tenant`
3. Check password hash is correct
4. Verify API logs for actual error

### API Not Responding

**Issue:** Cannot reach `http://localhost:4010`

**Solutions:**
1. Check if API is running: `netstat -ano | findstr :4010`
2. Verify environment variables are set
3. Check API logs for startup errors
4. Ensure PostgreSQL and Redis are running

---

## 📊 Test Results Template

```markdown
## Test Execution Results

**Date:** [DATE]
**Tester:** [NAME]

| Test | Status | Notes |
|------|--------|-------|
| 1. API Health Check | ✅ / ❌ | |
| 2. API Authentication | ✅ / ❌ | |
| 3. Frontend Access | ✅ / ❌ | |
| 4. Frontend → API Connection | ✅ / ❌ | |
| 5. Login Flow | ✅ / ❌ | |
| 6. Dashboard Access | ✅ / ❌ | |
| 7. Protected Endpoints | ✅ / ❌ | |
| 8. Error Handling | ✅ / ❌ | |
| 9. WebSocket | ✅ / ❌ / N/A | |
| 10. Logout | ✅ / ❌ | |

**Overall Status:** PASS / FAIL

**Issues Found:**
- [List any issues]

**Recommendations:**
- [List any recommendations]
```

---

## 🚀 Quick Test Script

Save this as `quick-test.ps1`:

```powershell
Write-Host "Testing VulHub Integration..." -ForegroundColor Cyan

# Test API Health
Write-Host "`nTest 1: API Health Check" -ForegroundColor Yellow
$health = curl -s http://localhost:4010/api/v1/health
if ($health) {
    Write-Host "PASS: API is responding" -ForegroundColor Green
} else {
    Write-Host "FAIL: API not responding" -ForegroundColor Red
}

# Test Login
Write-Host "`nTest 2: API Login" -ForegroundColor Yellow
$login = curl -s -X POST http://localhost:4010/api/v1/auth/login `
    -H "Content-Type: application/json" `
    -d '{"email":"admin@vulhub.com","password":"admin123"}'
if ($login -like "*accessToken*") {
    Write-Host "PASS: Login successful" -ForegroundColor Green
} else {
    Write-Host "FAIL: Login failed" -ForegroundColor Red
}

# Test Frontend
Write-Host "`nTest 3: Frontend Access" -ForegroundColor Yellow
$frontend = curl -s http://localhost:3010
if ($frontend) {
    Write-Host "PASS: Frontend is responding" -ForegroundColor Green
} else {
    Write-Host "FAIL: Frontend not responding" -ForegroundColor Red
}

Write-Host "`nTest complete!" -ForegroundColor Cyan
```

---

**Last Updated:** October 31, 2025  
**Next:** Run through all tests and document results

