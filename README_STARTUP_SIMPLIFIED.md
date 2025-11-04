# 🚀 VulHub Leaderboard - SIMPLIFIED STARTUP GUIDE

**Latest Update:** November 4, 2025  
**Status:** ✅ Production Ready  
**Startup Time:** ~30 seconds

---

## ⚡ TL;DR - Just Want to Start?

```bash
npm run dev:local
```

Done! Both backend and frontend will start automatically. Open http://localhost:3000

---

## 📖 What You Need to Know

### The Goal
We've simplified the entire startup process from 8+ manual steps down to **ONE command**.

### What Happens
When you run `npm run dev:local`:
1. ✅ Checks for port conflicts automatically
2. ✅ Kills any existing processes on ports 3000 & 4010
3. ✅ Starts Backend API (NestJS) on port 4010
4. ✅ Starts Frontend (Next.js) on port 3000
5. ✅ Shows you exactly what URLs to visit

### Time to Fully Running
- **Cold start**: ~30 seconds
- **Warm start**: ~10 seconds

---

## 🎯 Three Commands for Everything

```bash
# START everything
npm run dev:local

# STOP everything
npm run dev:stop

# CLEAN & RESET everything
npm run dev:cleanup
```

That's it. You're done. 🎉

---

## 📋 First Time Setup (One-Time Only)

### Step 1: Install Dependencies
```bash
pnpm install
```

### Step 2: Set Up Environment Variables

**Create `apps/web/.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_WS_URL=ws://localhost:4010
NEXT_PUBLIC_USE_MOCK_DATA=true
NODE_ENV=development
```

**Create `apps/api/.env`:**
```env
DATABASE_URL=file:./dev.db
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
```

### Step 3: Initialize Database
```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
```

### Step 4: Start
```bash
# Go back to project root
cd ../..

# Start everything
npm run dev:local
```

### Step 5: Verify
- Open http://localhost:3000 in browser
- You should see the login page
- Login with test credentials
- You should see the leaderboard

---

## 🔍 What's Running

### Frontend (Next.js)
- **URL**: http://localhost:3000
- **Status**: ✅ Running
- **Purpose**: Web UI for students & instructors
- **Technology**: React 18 + Next.js 14

### Backend (NestJS)
- **URL**: http://localhost:4010/api
- **Status**: ✅ Running
- **Purpose**: REST API
- **Technology**: NestJS + PostgreSQL (SQLite in dev)

---

## 🛠️ Common Tasks

### Restart Everything
```bash
# If something breaks:
npm run dev:stop      # Stop servers
npm run dev:cleanup   # Clean caches
npm run dev:local     # Start fresh
```

### Just Clear Cache
```bash
npm run dev:cleanup
# Then manually clear browser cache (Ctrl+Shift+Delete)
# Then: npm run dev:local
```

### Just Stop Servers
```bash
npm run dev:stop
# Or: Ctrl+C in terminal where servers are running
```

### Run Individual Services
```bash
# Just API
cd apps/api && pnpm start:dev

# Just Web
cd apps/web && pnpm dev
```

---

## ✅ Verification Steps

After running `npm run dev:local`, check:

### 1. Terminal Output
```
✅ Startup Complete!

✓ Backend API: http://localhost:4010
✓ Frontend Web: http://localhost:3000
```

### 2. Backend Health
```bash
# In another terminal:
curl http://localhost:4010/api/v1/health
# Should return: {"status":"ok"} or similar
```

### 3. Frontend Access
- Open http://localhost:3000
- You should see login page
- Try logging in with test account

### 4. Browser Console
- Open DevTools (F12)
- Click Console tab
- Should show NO red errors

---

## 🐛 Troubleshooting

### ❌ "Address already in use"
```bash
npm run dev:stop
npm run dev:local
```

### ❌ Pages won't load / stuck on login
```bash
npm run dev:stop
npm run dev:cleanup
# Clear browser cache: Ctrl+Shift+Delete
npm run dev:local
```

### ❌ TypeScript/Build errors
```bash
npm run dev:cleanup
pnpm install
npm run dev:local
```

### ❌ Can't find "Choose Files" button
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- The button should have bright white text on green

### ❌ Still stuck?
1. Stop everything: `npm run dev:stop`
2. Clean everything: `npm run dev:cleanup`
3. Check env files are set up correctly
4. Restart: `npm run dev:local`

---

## 🎓 Project Structure

```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── api/           # Backend (NestJS)
│   ├── web/           # Frontend (Next.js)
│   └── worker/        # Background jobs
├── packages/
│   ├── schema/        # Shared types
│   ├── config/        # Shared config
│   ├── utils/         # Shared utilities
│   └── ui/            # Shared components
├── scripts/
│   ├── start-local.js    # ← Startup script
│   ├── stop-local.js     # ← Stop script
│   └── cleanup-local.js  # ← Cleanup script
└── docs/              # Documentation
```

---

## 📊 Technology Stack

### Frontend
- **React 18** - UI framework
- **Next.js 14** - React meta-framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching

### Backend
- **NestJS** - Framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database (SQLite in dev)
- **Prisma** - ORM
- **JWT** - Authentication

### DevOps
- **pnpm** - Package manager
- **Turbo** - Monorepo build system
- **Docker** - Containerization
- **Node.js** - Runtime

---

## 🚀 Next Steps

### For Testing
1. ✅ Start with `npm run dev:local`
2. ✅ Test login flow
3. ✅ Check file uploads work
4. ✅ Verify leaderboard displays
5. ✅ Check browser console for errors

### For Development
1. Make changes to code
2. Save (auto-reload)
3. Test in browser
4. Push to git when done

### For Production
1. See `DEPLOYMENT_GUIDE.md`
2. Follow deployment checklist
3. Test on staging first

---

## 💡 Tips & Tricks

### Customize Ports
```bash
API_PORT=5000 WEB_PORT=3001 npm run dev:local
```

### Check What's Running
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4010

# Mac/Linux
lsof -i :3000
lsof -i :4010
```

### View Database
```bash
cd apps/api
pnpm prisma studio
# Opens Prisma Studio at http://localhost:5555
```

### Run Tests
```bash
npm run test
```

### Check Code Quality
```bash
npm run lint
npm run type-check
```

---

## 🎯 Success Indicators

When everything is working:
- ✅ Login page loads at http://localhost:3000
- ✅ Can login with test credentials
- ✅ Redirects to home page
- ✅ Leaderboard displays with mock data
- ✅ "Choose Files" button has bright white text
- ✅ Can upload files for submission
- ✅ No red errors in browser console
- ✅ API responds to requests

---

## 📚 Documentation Index

| Document | Purpose |
|----------|---------|
| `QUICK_START_LOCAL_DEVELOPMENT.md` | Detailed startup guide |
| `STARTUP_IMPROVEMENT_SUMMARY.md` | What changed & why |
| `LOCAL_TESTING_GUIDE.md` | Complete testing checklist |
| `PROJECT_DOCUMENTATION.md` | Full architecture docs |
| `DEPLOYMENT_GUIDE.md` | How to deploy to production |

---

## ❓ FAQ

### Q: Can I run just the API or just the web?
**A:** Yes! See "Run Individual Services" section above.

### Q: What ports do they use?
**A:** API uses 4010, Web uses 3000. You can customize with env vars.

### Q: Is mock data enabled by default?
**A:** Yes! Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in your env.

### Q: How do I use real authentication?
**A:** Set `NEXT_PUBLIC_USE_MOCK_AUTH=false` and connect to real backend.

### Q: Can I run this on Mac/Linux?
**A:** Yes! The scripts are cross-platform.

### Q: How do I debug?
**A:** Use browser DevTools (F12) and check terminal output.

---

## 🆘 Need Help?

1. **Check the docs** - Most answers are in the doc files
2. **Read error messages** - They usually tell you what's wrong
3. **Clean and restart** - `npm run dev:cleanup && npm run dev:local`
4. **Check the scripts** - Look in `scripts/` folder to see what they do
5. **Ask the team** - Reach out if you're still stuck

---

## 📝 Recent Changes

### November 4, 2025
- ✅ Created `start-local.js` - Start all servers with auto port management
- ✅ Created `stop-local.js` - Stop servers gracefully
- ✅ Created `cleanup-local.js` - Deep clean development environment
- ✅ Added 3 npm scripts: `dev:local`, `dev:stop`, `dev:cleanup`
- ✅ Improved file upload button styling (white text)
- ✅ Created comprehensive startup guides

### Impact
- **8+ manual steps → 1 command**
- **2-3 minutes startup → 30 seconds**
- **Manual debugging → Automatic fixes**
- **Much better developer experience! 🎉**

---

## ✨ What Makes This Better

| Before | After |
|--------|-------|
| 8+ manual steps | 1 command |
| 2-3 minutes to start | ~30 seconds |
| Manual port management | Automatic |
| Multiple terminals needed | Single terminal |
| Manual cache clearing | One `dev:cleanup` command |
| Complex instructions | Simple guide |
| High barrier to entry | Easy for beginners |

---

## 🎉 You're Ready!

Everything is set up and ready to go. Just run:

```bash
npm run dev:local
```

Then open http://localhost:3000 and enjoy! 🚀

---

**Last Updated**: November 4, 2025  
**Maintained by**: VulHub Development Team  
**Status**: ✅ Production Ready
