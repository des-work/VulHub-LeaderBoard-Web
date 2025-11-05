# 🚀 VulHub Leaderboard - Quick Start (Local Development)

**Status:** ✅ Simplified & Consolidated  
**Date:** November 4, 2025  
**Time to Start:** ~2 minutes

---

## ⚡ The Fastest Way to Start

```bash
npm run dev:local
```

That's it! This single command will:
- ✅ Check for port conflicts automatically
- ✅ Kill any existing processes using ports 3000 & 4010
- ✅ Start the backend API (NestJS)
- ✅ Start the frontend (Next.js)
- ✅ Display helpful next steps

---

## 📋 What Gets Started

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Backend API | 4010 | http://localhost:4010/api | NestJS API Server |
| Frontend | 3000 | http://localhost:3000 | Next.js Web App |

---

## 🎯 Quick Usage Guide

### Starting Everything
```bash
npm run dev:local
```

### Stopping Everything
```bash
npm run dev:stop
```

### Deep Cleaning (Recommended if having issues)
```bash
npm run dev:cleanup
# Then clear browser cache (Ctrl+Shift+Delete)
# Then run:
npm run dev:local
```

---

## 📝 Step-by-Step Setup (First Time Only)

### 1. Install Dependencies
```bash
# From project root
pnpm install
```

### 2. Set Up Environment Variables
```bash
# In apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_WS_URL=ws://localhost:4010
NEXT_PUBLIC_USE_MOCK_DATA=true
NODE_ENV=development

# In apps/api/.env
DATABASE_URL=file:./dev.db
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
NODE_ENV=development
```

### 3. Initialize Database
```bash
cd apps/api
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4. Start Development
```bash
npm run dev:local
```

---

## 🔍 Troubleshooting

### ❌ "Address already in use" Error
```bash
# Try this first
npm run dev:stop

# Then restart
npm run dev:local
```

### ❌ Still getting port conflicts?
```bash
npm run dev:cleanup
npm run dev:stop
npm run dev:local
```

### ❌ Application won't load / keeps redirecting to login
```bash
# Clear everything and restart
npm run dev:cleanup

# Clear browser cache manually (Ctrl+Shift+Delete)

# Then start fresh
npm run dev:local
```

### ❌ TypeScript errors during startup?
```bash
# Clean build cache
npm run dev:cleanup

# Reinstall dependencies
pnpm install

# Try again
npm run dev:local
```

### ❌ Can't see "Choose Files" button clearly?
- The button should be **bright white text on green background**
- If not, hard-refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

---

## ✅ Verify Everything is Working

### 1. Check Frontend
- Open http://localhost:3000
- You should see the login page with test credentials displayed
- Login with any of these test accounts:
  - **Admin**: `admin@vulhub.com` / `admin123`
  - **Grader**: `grader@vulhub.com` / `grader123`
  - **Student**: `student@vulhub.com` / `student123`
  - **Neo**: `neo@matrix.io` / `matrix123`
  - **Trinity**: `trinity@matrix.io` / `matrix123`
- Should redirect to home/leaderboard after successful login
- Invalid credentials should show an error notification

### 2. Check Backend
- Open http://localhost:4010/api/v1/health
- Should see API health status
- Open DevTools (F12) → Network tab
- API calls should show 200 status

### 3. Check Features
- [ ] Can login with mock auth
- [ ] Leaderboard displays with data
- [ ] File upload button works (Choose Files button visible)
- [ ] Can navigate between pages
- [ ] No red errors in console

---

## 🎓 Learning the Architecture

### Project Structure
```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── api/           # NestJS backend
│   ├── web/           # Next.js frontend
│   └── worker/        # Background jobs
├── packages/
│   ├── schema/        # Shared types
│   ├── config/        # Shared config
│   ├── utils/         # Shared utilities
│   └── ui/            # Shared components
└── scripts/
    ├── start-local.js    # Start all servers
    ├── stop-local.js     # Stop all servers
    └── cleanup-local.js  # Clean caches
```

### Key Commands Reference

```bash
# Development
npm run dev:local        # Start everything
npm run dev:stop         # Stop everything
npm run dev:cleanup      # Clean caches

# Building
npm run build            # Build all packages
npm run build:api        # Build API only
npm run build:web        # Build web only

# Testing
npm run test            # Run all tests
npm run lint            # Run linter
npm run type-check      # Check TypeScript

# Database
cd apps/api && pnpm prisma migrate dev      # Run migrations
cd apps/api && pnpm prisma db seed          # Seed data
cd apps/api && pnpm prisma studio           # Open Prisma Studio
```

---

## 🔄 Typical Development Workflow

### Daily Startup
```bash
1. Open terminal in project root
2. Run: npm run dev:local
3. Open browser to http://localhost:3000
4. Start developing!
```

### When Things Break
```bash
1. Ctrl+C (stop servers)
2. npm run dev:cleanup
3. npm run dev:local
4. Ctrl+Shift+R (hard refresh browser)
```

### Before Pushing Changes
```bash
npm run type-check  # Check TypeScript
npm run lint        # Check code style
npm run test        # Run tests
git push            # Push changes
```

---

## 💡 Tips & Tricks

### Running Individual Services
```bash
# Just API
cd apps/api && pnpm start:dev

# Just Web
cd apps/web && pnpm dev
```

### Checking if ports are in use
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4010

# Mac/Linux
lsof -i :3000
lsof -i :4010
```

### Environment Variables
- **USE_MOCK_AUTH**: Set to `true` to use mock authentication
- **USE_MOCK_DATA**: Set to `true` to use fake data instead of API
- **API_URL**: Backend API base URL
- **WS_URL**: WebSocket URL for real-time features

---

## 📚 Additional Documentation

- [Full Local Testing Guide](./LOCAL_TESTING_GUIDE.md)
- [Architecture Overview](./PROJECT_DOCUMENTATION.md)
- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [API Documentation](./apps/api/README.md)
- [Web Documentation](./apps/web/README.md)

---

## 🆘 Still Having Issues?

1. **Check the logs**: Look at terminal output for errors
2. **Read error messages**: They usually point to the issue
3. **Search docs**: Check related `.md` files
4. **Clear everything**: `npm run dev:cleanup` then `npm run dev:local`
5. **Restart everything**: Kill terminal, open new one, try again

---

## 🎉 Success!

Once both servers are running, you should see:
```
✅ Startup Complete!

✓ Backend API: http://localhost:4010
✓ Frontend Web: http://localhost:3000

📋 Next Steps:
  1. Open http://localhost:3000 in your browser
  2. Login with your test credentials
  3. Test the application features

💡 Tips:
  • Press Ctrl+C to stop all servers
  • Run "npm run dev:cleanup" to clear cache
  • Run "npm run dev:stop" to kill processes
```

Now open http://localhost:3000 and start testing! 🚀

---

**Last Updated:** November 4, 2025  
**Maintained by:** VulHub Team
