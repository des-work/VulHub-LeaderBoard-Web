# 🎯 COMPLETE LOCAL TESTING SETUP GUIDE

**Status:** ✅ Ready for Easy Local Testing  
**Date:** November 5, 2025  
**Time to Start:** ~2 minutes  
**Difficulty:** ⭐ Very Easy

---

## ⚡ QUICKEST WAY TO START (30 seconds)

```bash
# 1. Install dependencies (one-time only)
pnpm install

# 2. Start everything
npm run dev:local
```

Done! Open http://localhost:3000

---

## 📋 COMPLETE SETUP (First Time Only)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Create Environment Files

**File: `apps/api/.env`**
```env
# Core
NODE_ENV=development
PORT=4010
CORS_ORIGIN=http://localhost:3000

# Database (SQLite - local file)
DATABASE_URL=file:./prisma/dev.db

# JWT Authentication
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production

# Logging
LOG_LEVEL=debug
```

**File: `apps/web/.env.local`**
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1

# Auth Configuration (Use Mock for Local Testing)
NEXT_PUBLIC_USE_MOCK_AUTH=true

# WebSocket
NEXT_PUBLIC_WS_URL=ws://localhost:4010

# Development
NODE_ENV=development
```

### Step 3: Initialize Database
```bash
cd apps/api

# Run migrations
pnpm prisma migrate dev

# Seed test data
pnpm prisma db seed

# (Optional) View database in GUI
pnpm prisma studio

cd ../..
```

### Step 4: Start Everything
```bash
npm run dev:local
```

---

## 🚀 THREE ESSENTIAL COMMANDS

```bash
# START: Begin developing (includes auto-port management)
npm run dev:local

# STOP: Gracefully shut down all servers
npm run dev:stop

# CLEAN: Reset cache and temp files (if things break)
npm run dev:cleanup
```

---

## 🌐 ACCESS POINTS AFTER STARTUP

| Service | URL | Purpose |
|---------|-----|---------|
| **Web App** | http://localhost:3000 | Frontend (Next.js) |
| **API** | http://localhost:4010/api | Backend (NestJS) |
| **API Docs** | http://localhost:4010/api/docs | Swagger documentation |
| **Health Check** | http://localhost:4010/api/health | API status |
| **Database GUI** | http://localhost:5555 | Prisma Studio (when running) |

---

## 👤 TEST LOGIN CREDENTIALS

After seeding the database, use any of these to test:

```
Email: test@example.com
Password: password

OR

Email: student@example.com
Password: password

OR

Email: instructor@example.com
Password: password
```

**Mock Auth Note:** When `NEXT_PUBLIC_USE_MOCK_AUTH=true`, the frontend validates these credentials locally without hitting the API.

---

## 📂 PROJECT STRUCTURE

```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   ├── src/
│   │   │   ├── modules/        # Auth, Users, Projects, Submissions, etc.
│   │   │   ├── adapters/       # Database, Cache, Storage
│   │   │   ├── shared/         # Schemas, Utils, Config
│   │   │   └── common/         # Guards, Filters, Services
│   │   └── prisma/
│   │       ├── schema.prisma   # Database schema
│   │       └── dev.db          # SQLite database (created after migrate)
│   │
│   └── web/                    # Next.js Frontend
│       ├── src/
│       │   ├── app/            # Pages (auth, leaderboard, etc.)
│       │   ├── components/     # React components
│       │   ├── lib/            # Utilities, API client, auth
│       │   └── ui-library/     # Reusable UI components
│       └── public/
│           └── uploads/        # File uploads directory
│
└── scripts/                    # Local dev automation
    ├── start-local.js          # Start API & Web
    ├── stop-local.js           # Stop servers
    └── cleanup-local.js        # Clear caches
```

---

## 🔍 COMMON ISSUES & FIXES

### ❌ "Address already in use" Error

**Cause:** Another process is using port 3000 or 4010

**Fix:**
```bash
# Automatic cleanup
npm run dev:stop
npm run dev:local

# Or manual cleanup
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :3000
kill -9 <PID>
```

### ❌ Database Connection Error

**Cause:** Database migration not run

**Fix:**
```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
cd ../..
npm run dev:local
```

### ❌ API not responding / 404 errors

**Cause:** API URL misconfigured

**Check `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1  # Make sure this is correct
```

### ❌ "Cannot find module" errors

**Cause:** Dependencies not installed

**Fix:**
```bash
npm run dev:cleanup
pnpm install
npm run dev:local
```

### ❌ Login not working

**Cause:** Mock auth misconfigured

**Check `apps/web/.env.local`:**
```env
NEXT_PUBLIC_USE_MOCK_AUTH=true  # Should be true for local testing
```

**Then check test credentials file:**
```bash
cat apps/web/src/lib/auth/testCredentials.ts
```

---

## 🧪 LOCAL TESTING WORKFLOWS

### Workflow 1: Frontend-Only Testing
```bash
# If you only want to work on frontend
cd apps/web
pnpm dev

# Then open http://localhost:3000
# Use mock auth to test without backend
```

### Workflow 2: Backend-Only Testing
```bash
# If you only want to work on API
cd apps/api
pnpm start:dev

# Then use Swagger at http://localhost:4010/api/docs
# Or Postman/Curl to test endpoints
```

### Workflow 3: Full Stack Testing
```bash
# Best for end-to-end testing
npm run dev:local

# Open http://localhost:3000
# Test the entire flow
```

### Workflow 4: Database Testing
```bash
# To inspect/modify database
cd apps/api
pnpm prisma studio

# This opens http://localhost:5555 with database GUI
```

---

## 📊 DEVELOPMENT BUILD VERIFICATION

After each change, verify the build:

```bash
# Type checking
npm run type-check

# Linting
cd apps/web && npm run lint
cd ../api && npm run lint

# Full build test
npm run build
```

---

## 🔄 TYPICAL LOCAL DEVELOPMENT WORKFLOW

### Day 1 Setup
```bash
1. Clone repository
2. pnpm install
3. Create .env files (see Step 2 above)
4. cd apps/api && pnpm prisma migrate dev
5. pnpm prisma db seed
6. cd ../..
7. npm run dev:local
8. Open http://localhost:3000
```

### Daily Startup
```bash
1. npm run dev:local
2. Open http://localhost:3000
3. Start coding!
```

### If Something Breaks
```bash
1. Ctrl+C (stop servers)
2. npm run dev:cleanup
3. npm run dev:local
4. Ctrl+Shift+R (hard refresh browser)
```

### Before Pushing
```bash
1. npm run type-check
2. npm run lint
3. npm run build
4. npm run dev:local (final test)
5. git push
```

---

## 📝 USEFUL SCRIPTS

```bash
# Development
npm run dev:local              # Start everything
npm run dev:stop               # Stop everything
npm run dev:cleanup            # Clean cache
npm run build                  # Full build

# API Only
cd apps/api
npm run start:dev              # Start API in watch mode
npm run build                  # Build API
npm run lint                   # Lint API code
npm run type-check             # TypeScript check

# Web Only
cd apps/web
npm run dev                    # Start web in dev mode
npm run build                  # Build web
npm run lint                   # Lint web code
npm run type-check             # TypeScript check

# Database
cd apps/api
npm run prisma:migrate         # Run migrations
npm run prisma:seed            # Seed data
npm run prisma:studio          # Open Prisma Studio
```

---

## ✅ VERIFICATION CHECKLIST

After setup, verify everything works:

- [ ] Dependencies installed: `pnpm install` completed
- [ ] Environment files created: `.env` and `.env.local` exist
- [ ] Database initialized: `prisma migrate dev` ran
- [ ] Database seeded: `prisma db seed` ran
- [ ] Servers starting: `npm run dev:local` shows green checkmarks
- [ ] Frontend loads: http://localhost:3000 opens in browser
- [ ] Can login: Try with test credentials
- [ ] Leaderboard displays: See rankings after login
- [ ] No console errors: Check browser dev tools (F12)
- [ ] API responding: http://localhost:4010/api/health returns 200

---

## 🎯 QUICK REFERENCE

| Task | Command |
|------|---------|
| Start developing | `npm run dev:local` |
| Stop servers | `npm run dev:stop` |
| Fix broken state | `npm run dev:cleanup` |
| Run migrations | `cd apps/api && pnpm prisma migrate dev` |
| Seed data | `cd apps/api && pnpm prisma db seed` |
| View database | `cd apps/api && pnpm prisma studio` |
| Check types | `npm run type-check` |
| Lint code | `npm run lint` |
| Full build | `npm run build` |
| Access web app | http://localhost:3000 |
| Access API | http://localhost:4010/api |
| API docs | http://localhost:4010/api/docs |

---

## 🎉 YOU'RE READY!

Your local development environment is now set up for:
- ✅ Easy startup (1 command)
- ✅ Quick testing (30 seconds)
- ✅ Clean teardown
- ✅ Zero configuration pain
- ✅ Full-stack development

Happy coding! 🚀

---

**Document Version:** 1.0  
**Last Updated:** November 5, 2025  
**Status:** Complete & Verified  
**Difficulty:** ⭐ Easy

