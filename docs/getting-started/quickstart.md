# 🚀 Quick Start Guide

**Get VulHub Leaderboard running in 5 minutes!**

---

## ⚡ Prerequisites (1 minute)

You need:
- ✅ **Node.js** 18+ ([download](https://nodejs.org/))
- ✅ **npm** or **pnpm** (comes with Node.js)
- ✅ **Git** ([download](https://git-scm.com/))

That's it! No database setup needed for local development (uses SQLite).

---

## 🎯 Quick Setup (2 minutes)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web

# Install dependencies
npm install

# This will take 1-2 minutes
```

### Step 2: Setup Environment Files

```bash
# Backend environment
cd apps/api
cp ENV_EXAMPLE_FILE.txt .env
cd ../..

# Frontend environment  
cd apps/web
cp ENV_LOCAL_EXAMPLE_FILE.txt .env.local
cd ../..
```

**The defaults work for local development!** No need to edit anything.

---

## 🚀 Start the Application (30 seconds)

```bash
# From project root, run:
npm run dev:local
```

This single command:
- ✅ Starts the backend API (port 4010)
- ✅ Starts the frontend (port 3000)
- ✅ Creates the SQLite database automatically
- ✅ Handles port conflicts automatically

**Wait for:**
```
✅ Startup Complete!
🌐 Frontend: http://localhost:3000
🔧 API: http://localhost:4010
```

---

## ✅ Verify It Works (1 minute)

### 1. Open the App
Visit: **http://localhost:3000**

You should see the login page with the VulHub branding.

### 2. Test Login
Use these test credentials:
- **Email:** `admin@example.com`
- **Password:** `password123`

### 3. Explore
After login, you'll see:
- 🏆 **Leaderboard** - Top rankings
- 💬 **Community** - Terminal-style forum
- 🎯 **Challenges** - Available vulnerabilities
- 🏅 **Badges** - Achievements
- 👤 **Profile** - Your stats

---

## 🎉 Success!

You're now running VulHub Leaderboard locally!

### What Just Happened?

1. **Backend API** started on port 4010
   - Created SQLite database at `apps/api/prisma/dev.db`
   - Generated Prisma client automatically
   - Loaded test data (users, challenges, badges)

2. **Frontend** started on port 3000
   - Connected to local API
   - Loaded with hot module replacement (HMR)
   - Ready for development

---

## 🛠️ Development Workflow

### Making Changes

**Frontend changes:**
- Edit files in `apps/web/src/`
- Changes auto-reload instantly ✨

**Backend changes:**
- Edit files in `apps/api/src/`
- Server auto-restarts on save ✨

### Useful Commands

```bash
# Stop all servers
npm run dev:stop

# Clean caches (if something breaks)
npm run dev:cleanup

# Restart fresh
npm run dev:local
```

---

## 🔍 Troubleshooting

### "Port already in use"

The script handles this automatically! But if it fails:

```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4010

# Mac/Linux
lsof -i :3000
lsof -i :4010

# Then kill the process
```

### "Cannot connect to API"

Check that both services started:
- Frontend: http://localhost:3000 (should load)
- API Health: http://localhost:4010/health (should return JSON)

### "Database error"

```bash
cd apps/api
npx prisma generate
npx prisma db push
npm run db:seed
cd ../..
```

### Still Stuck?

1. Run cleanup: `npm run dev:cleanup`
2. Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Check the [Full Local Development Guide](local-development.md)
4. See [Troubleshooting Guide](../deployment/troubleshooting.md)

---

## 📚 Next Steps

### Learn the System
- 📖 [Local Development Guide](local-development.md) - Detailed setup
- 🏗️ [Architecture Overview](../architecture/overview.md) - How it works
- ✨ [Features Guide](../features/README.md) - What you can do

### Start Developing
- 💻 [Contributing Guide](../development/contributing.md) - How to contribute
- 🎨 [Code Style Guide](../development/code-style.md) - Coding standards
- 🧪 [Testing Guide](../development/testing.md) - How to test

### Deploy to Production
- 🎯 [Project Status Dashboard](../../PROJECT_STATUS_DASHBOARD.md) - Readiness check
- ✅ [Pre-Deployment Checklist](../../PRE_DEPLOYMENT_CHECKLIST.md) - Before going live
- 🌐 [Deployment Guide](../deployment/overview.md) - Deploy anywhere

---

## 💡 Pro Tips

### Speed Up Development

1. **Use Hot Reload** - Changes appear instantly, no restart needed
2. **Prisma Studio** - Visual database editor: `npx prisma studio` (port 5555)
3. **API Docs** - Swagger UI at http://localhost:4010/api/docs
4. **Debug Mode** - Check browser console (F12) for frontend, terminal for backend

### Common Workflows

**Adding a new feature:**
1. Create branch: `git checkout -b feature/my-feature`
2. Make changes with auto-reload
3. Test locally
4. Commit and push

**Database changes:**
1. Edit `prisma/schema.prisma`
2. Run: `npx prisma db push`
3. (Optional) Run seed: `npm run db:seed`

**Testing the API:**
```bash
# Using curl
curl http://localhost:4010/api/v1/health

# Using browser
http://localhost:4010/api/docs  # Swagger UI
```

---

## 📊 What You Have Now

### Running Services
- ✅ Frontend: Next.js 14 with TypeScript
- ✅ Backend: NestJS with TypeScript
- ✅ Database: SQLite (local) or PostgreSQL (production)
- ✅ Test Data: Users, challenges, badges preloaded

### Access Points
- 🌐 **App:** http://localhost:3000
- 🔧 **API:** http://localhost:4010/api/v1
- 📚 **Swagger:** http://localhost:4010/api/docs
- 💾 **Database:** `apps/api/prisma/dev.db` (SQLite)
- 🎨 **Prisma Studio:** http://localhost:5555 (run `npx prisma studio`)

### Test Credentials
- **Admin:** admin@example.com / password123
- **Student:** student@example.com / password123

---

## 🎯 Summary

You've successfully:
- ✅ Cloned the repository
- ✅ Installed dependencies
- ✅ Configured environment
- ✅ Started all services
- ✅ Verified it works

**Total Time:** ~5 minutes 🎉

**Ready to code!** Check out the [Contributing Guide](../development/contributing.md) to get started.

---

**Need more details?** See the [Full Local Development Guide](local-development.md)

**Ready to deploy?** Check the [Project Status Dashboard](../../PROJECT_STATUS_DASHBOARD.md)

---

<sub>Last Updated: February 10, 2026 | [Edit this page](quickstart.md) | [Back to Docs](../README.md)</sub>

