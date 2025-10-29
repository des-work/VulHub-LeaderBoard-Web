# 🚀 Deployment Fixes - Minimal Plan
**Goal**: Fix critical issues so the app works in production  
**No new features** - Just fix what's broken

---

## 🎯 Core Components to Verify

1. **Authentication** - Login/Register works
2. **Users** - User management works  
3. **Projects** - Projects can be viewed/managed
4. **Submissions** - Users can submit work
5. **Leaderboards** - Rankings display correctly
6. **Web App** - Pages load and connect to API

---

## 🔴 CRITICAL FIXES (Must Do)

### **Fix 1: Remove Hard-Coded localhost URLs**
**Why**: Production won't be able to connect to API

**Files to fix:**
1. `apps/web/src/lib/api/client.ts` - Remove localhost fallback
2. `apps/web/next.config.js` - Add environment variable for image domains
3. `apps/api/src/main.ts` - Fix localhost in logs (cosmetic but helpful)

### **Fix 2: Remove Hard-Coded Secrets**
**Why**: Security issue - can't use dev secrets in production

**Files to fix:**
1. `apps/api/src/config/configuration.ts` - Remove default secrets (fail if missing in production)
2. `apps/api/src/config/validation.ts` - Already requires in production (verify it works)

### **Fix 3: Fix CORS Configuration**
**Why**: API will reject requests from production frontend

**Files to fix:**
1. `apps/api/src/config/configuration.ts` - Remove localhost default
2. `apps/api/src/main.ts` - Use CORS from config properly

### **Fix 4: Fix Port Mismatch**
**Why**: Web container won't connect properly

**Files to fix:**
1. `apps/web/package.json` - Remove `-p 4010` flag (use default 3000)
2. `docker-compose.dev.yml` - Verify port mapping is correct

### **Fix 5: Fix Database Default**
**Why**: Can't use dev database URL in production

**Files to fix:**
1. `apps/api/src/config/configuration.ts` - Remove default DB URL in production

---

## ✅ QUICK VERIFICATION

After fixes, verify:
- [ ] Production build works
- [ ] API starts with required env vars only
- [ ] Web app connects to API
- [ ] Docker containers start correctly
- [ ] Health checks pass

---

## 📝 ENVIRONMENT VARIABLES NEEDED

**Required for Production:**
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `CORS_ORIGIN` - Frontend URL(s)
- `NEXT_PUBLIC_API_URL` - API URL for frontend
- `REDIS_HOST` - Redis host (or `REDIS_URL`)

**Optional:**
- Everything else (email, storage, etc.) - app should work without these

---

## 🚫 NOT DOING

- ❌ No new validation systems
- ❌ No new features
- ❌ No refactoring
- ❌ No "improvements" - just fixes
- ❌ No tests (unless fixing broken ones)
- ❌ No documentation changes (unless critical)

---

## ⚡ EXECUTION ORDER

1. Fix hard-coded URLs (30 min)
2. Fix secrets/config (30 min)  
3. Fix CORS (15 min)
4. Fix ports (5 min)
5. Test (30 min)

**Total: ~2 hours**

