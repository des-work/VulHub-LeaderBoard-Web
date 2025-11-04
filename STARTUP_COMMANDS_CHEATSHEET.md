# 🎯 Startup Commands - Quick Reference

**Print this out or bookmark it! 📌**

---

## ⚡ The Three Commands You Need

```bash
npm run dev:local      # START - Starts API + Web
npm run dev:stop       # STOP - Stops all servers
npm run dev:cleanup    # CLEAN - Clears all caches
```

---

## 📋 Decision Tree

```
Do you want to...?

├─ START DEVELOPMENT?
│  └─ npm run dev:local
│
├─ STOP DEVELOPMENT?
│  └─ npm run dev:stop
│
├─ FIX CACHE/BUILD ISSUES?
│  └─ npm run dev:cleanup
│     └─ Then: npm run dev:local
│
└─ RUN INDIVIDUAL SERVICES?
   ├─ Just API?
   │  └─ cd apps/api && pnpm start:dev
   │
   └─ Just Web?
      └─ cd apps/web && pnpm dev
```

---

## 🎬 Common Scenarios

### Scenario 1: Fresh Day, First Start
```bash
npm run dev:local
# Open http://localhost:3000
```
**Time**: ~30 seconds

### Scenario 2: Something Broke
```bash
npm run dev:stop
npm run dev:cleanup
npm run dev:local
# Clear browser cache: Ctrl+Shift+Delete
```
**Time**: ~10 seconds (cleanup) + ~30 seconds (startup)

### Scenario 3: Port Already in Use
```bash
npm run dev:local
# It handles it automatically!
```
**Time**: ~30 seconds

### Scenario 4: Can't Reach API
```bash
npm run dev:stop
npm run dev:cleanup
npm run dev:local
```
**Time**: ~40 seconds

### Scenario 5: Need to Stop & Leave
```bash
npm run dev:stop
# Done! All servers stopped
```
**Time**: ~2 seconds

---

## 🔍 What Each Command Does

### `npm run dev:local`
```
BEFORE:                    AFTER:
❌ Manual port check       ✅ Auto port check
❌ Manual process kill     ✅ Auto process kill
❌ Start API manually      ✅ Auto start API
❌ Start Web manually      ✅ Auto start Web
❌ Monitor 2 terminals     ✅ Single terminal
❌ Unclear when ready      ✅ Clear status message
```

### `npm run dev:stop`
```
Kills processes on:
- Port 3000 (Frontend)
- Port 4010 (Backend)

Cross-platform:
- Windows: taskkill
- Mac/Linux: kill
```

### `npm run dev:cleanup`
```
Removes:
- .next build cache
- dist folders
- node_modules cache

Reminds you:
- Clear browser cache manually
- How to restart
```

---

## 📍 Expected Output

### Successful Startup
```
🚀 VulHub Leaderboard - Local Development Startup

ℹ Checking for port conflicts...
✓ Ports are ready

🔧 Starting Servers

ℹ Starting backend API server...
✓ Backend API: http://localhost:4010

ℹ Starting frontend web server...
✓ Frontend Web: http://localhost:3000

✅ Startup Complete!

📋 Next Steps:
  1. Open http://localhost:3000 in your browser
  2. Login with your test credentials
  3. Test the application features

💡 Tips:
  • Press Ctrl+C to stop all servers
  • Run "npm run dev:cleanup" to clear cache
  • Run "npm run dev:stop" to kill processes
```

### Successful Stop
```
🛑 Stopping VulHub Development Servers

ℹ Stopping process on port 4010...
✓ Stopped process on port 4010

ℹ Stopping process on port 3000...
✓ Stopped process on port 3000

✓ All servers stopped
ℹ You can now restart with: npm run dev:local
```

### Successful Cleanup
```
🧹 Cleaning VulHub Development Environment

ℹ Removing API .next cache...
✓ Removed API .next cache

ℹ Removing Web .next cache...
✓ Removed Web .next cache

ℹ Removing API dist folder...
✓ Removed API dist folder

ℹ Removing Web dist folder...
✓ Removed Web dist folder

ℹ Clearing browser cache...
ℹ Note: Manually clear your browser cache (Ctrl+Shift+Delete) for complete cleanup

✓ Cleanup complete! Removed 4/6 directories

💡 Next steps:
  1. Clear browser cache (Ctrl+Shift+Delete)
  2. Run: npm run dev:local
  3. Test the application
```

---

## ✅ Quick Checklist

After running `npm run dev:local`:

- [ ] Terminal shows "✅ Startup Complete!"
- [ ] Shows `http://localhost:4010` for API
- [ ] Shows `http://localhost:3000` for Web
- [ ] Browser opens to http://localhost:3000
- [ ] Login page displays
- [ ] Can login with test account
- [ ] Redirect to home/leaderboard works
- [ ] "Choose Files" button visible and bright
- [ ] No red errors in browser console

---

## 🆘 Trouble? Quick Fixes

| Problem | Solution | Time |
|---------|----------|------|
| Port already in use | `npm run dev:local` (auto fixes) | 5 sec |
| Page won't load | `npm run dev:stop && npm run dev:cleanup && npm run dev:local` | 40 sec |
| Build errors | `npm run dev:cleanup && pnpm install && npm run dev:local` | 1-2 min |
| Login loop | Clear browser cache & restart | 20 sec |
| API not responding | Check terminal for errors | 5 sec |

---

## 🌐 Service URLs

When running:

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web interface |
| API | http://localhost:4010/api | REST API |
| API Health | http://localhost:4010/api/v1/health | Status check |
| Prisma Studio | http://localhost:5555 | Database GUI |

---

## 🔑 Environment Variables

If needed, customize:

```bash
# Custom ports
API_PORT=5000 WEB_PORT=3001 npm run dev:local

# Check what's running
curl http://localhost:4010/api/v1/health
```

---

## 📚 Learn More

- Full guide: `README_STARTUP_SIMPLIFIED.md`
- Quick start: `QUICK_START_LOCAL_DEVELOPMENT.md`
- Testing: `LOCAL_TESTING_GUIDE.md`
- Details: `STARTUP_IMPROVEMENT_SUMMARY.md`

---

## 🎯 Bottom Line

```
OLD WAY: 8+ steps, 2-3 minutes, manual fixes
NEW WAY: 1 command, ~30 seconds, automatic

npm run dev:local

That's all you need. 🚀
```

---

**Print this page or screenshot for quick reference!**  
**Last Updated**: November 4, 2025
