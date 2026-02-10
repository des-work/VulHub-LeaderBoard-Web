# 🏗️ Local Development Setup

**Complete guide to setting up your local development environment**

---

## 📋 Prerequisites

### Required Software

| Tool | Version | Purpose | Download |
|------|---------|---------|----------|
| **Node.js** | 18.0+ | Runtime environment | [nodejs.org](https://nodejs.org/) |
| **npm** | 8.0+ | Package manager | Included with Node.js |
| **Git** | Latest | Version control | [git-scm.com](https://git-scm.com/) |

### Optional but Recommended

| Tool | Purpose | Download |
|------|---------|----------|
| **pnpm** | Faster package manager | `npm install -g pnpm` |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com/) |
| **PostgreSQL** | Production database testing | [postgresql.org](https://www.postgresql.org/) |

### Check Your Installation

```bash
node --version    # Should be 18.0 or higher
npm --version     # Should be 8.0 or higher
git --version     # Any recent version
```

---

## 🚀 Setup Process

### Step 1: Clone Repository (1 minute)

```bash
# Clone via HTTPS
git clone https://github.com/your-org/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web

# Or via SSH
git clone git@github.com:your-org/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
```

### Step 2: Install Dependencies (2-3 minutes)

```bash
# Using npm (default)
npm install

# Or using pnpm (faster)
pnpm install
```

This installs dependencies for:
- Root workspace
- Frontend (`apps/web`)
- Backend (`apps/api`)
- Prisma client (auto-generated)

**Expected output:**
```
✅ Dependencies installed successfully
✅ Prisma client generated
✅ Post-install scripts completed
```

### Step 3: Configure Environment (2 minutes)

#### Backend Environment

```bash
# Navigate to API directory
cd apps/api

# Copy environment template
cp ENV_EXAMPLE_FILE.txt .env

# (Optional) Edit .env if needed
# Defaults work for local development!
```

**Default configuration (works as-is):**
```env
NODE_ENV=development
PORT=4010
DATABASE_URL="file:./prisma/dev.db"
CORS_ORIGIN=http://localhost:3000,http://localhost:3010
JWT_SECRET=dev-jwt-secret-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-chars
```

#### Frontend Environment

```bash
# Navigate to web directory
cd ../web

# Copy environment template
cp ENV_LOCAL_EXAMPLE_FILE.txt .env.local

# (Optional) Edit .env.local if needed
# Defaults work for local development!
```

**Default configuration (works as-is):**
```env
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
```

```bash
# Return to project root
cd ../..
```

### Step 4: Initialize Database (1 minute)

The database is created automatically on first run, but you can set it up manually:

```bash
cd apps/api

# Generate Prisma client (done automatically in post-install)
npx prisma generate

# Create database and tables
npx prisma db push

# (Optional) Load test data
npm run db:seed

cd ../..
```

**Test data includes:**
- 2 test users (admin & student)
- 10 sample challenges
- 20 sample badges
- Sample submissions

### Step 5: Start Development Servers (30 seconds)

```bash
# From project root, start everything:
npm run dev:local
```

**This single command:**
- ✅ Checks for port conflicts (auto-resolves)
- ✅ Starts backend API on port 4010
- ✅ Starts frontend on port 3000
- ✅ Initializes database if needed
- ✅ Enables hot module replacement (HMR)

**Wait for success message:**
```
✅ Startup Complete!
🌐 Frontend: http://localhost:3000
🔧 API: http://localhost:4010
📊 Health: http://localhost:4010/health
📚 Swagger: http://localhost:4010/api/docs
```

---

## ✅ Verify Installation

### 1. Check Frontend

Visit: **http://localhost:3000**

Expected result:
- ✅ Login page loads
- ✅ VulHub branding visible
- ✅ No console errors (press F12)

### 2. Check API

Visit: **http://localhost:4010/health**

Expected result:
```json
{
  "status": "ok",
  "timestamp": "2026-02-10T...",
  "uptime": 123.45,
  "message": "API is running successfully!",
  "version": "1.0.0",
  "environment": "development"
}
```

### 3. Test Login

Use test credentials:
- **Email:** admin@example.com
- **Password:** password123

Expected result:
- ✅ Successful login
- ✅ Redirect to dashboard
- ✅ Leaderboard displays
- ✅ Navigation works

### 4. Check API Documentation

Visit: **http://localhost:4010/api/docs**

Expected result:
- ✅ Swagger UI loads
- ✅ All endpoints visible
- ✅ Can test endpoints

---

## 🛠️ Development Workflow

### Making Changes

#### Frontend Changes
```bash
# Edit files in apps/web/src/
# Changes auto-reload instantly (HMR enabled)
```

Example:
1. Edit `apps/web/src/app/page.tsx`
2. Save file
3. Browser refreshes automatically ✨

#### Backend Changes
```bash
# Edit files in apps/api/src/
# Server auto-restarts on save (nodemon enabled)
```

Example:
1. Edit `apps/api/src/modules/auth/application/auth.service.ts`
2. Save file
3. Server restarts automatically ✨

#### Database Schema Changes
```bash
cd apps/api

# 1. Edit prisma/schema.prisma
# 2. Push changes to database
npx prisma db push

# 3. Regenerate Prisma client
npx prisma generate

# 4. (Optional) Reseed data
npm run db:seed

cd ../..
```

### Useful Development Commands

```bash
# Start development (from project root)
npm run dev:local

# Stop all servers
npm run dev:stop

# Clean caches and build artifacts
npm run dev:cleanup

# Build for production (test build)
npm run build

# Run linter
cd apps/web && npm run lint
cd apps/api && npm run lint

# Run type checking
cd apps/web && npm run type-check
cd apps/api && npm run type-check
```

### Database Management

```bash
cd apps/api

# Open Prisma Studio (visual database editor)
npx prisma studio
# Opens on http://localhost:5555

# View current migrations
npx prisma migrate status

# Reset database (WARNING: deletes all data)
npx prisma db push --force-reset

# Seed database
npm run db:seed

cd ../..
```

---

## 🔍 Troubleshooting

### Port Already in Use

**Symptom:** "Port 3000 already in use" or "Port 4010 already in use"

**Solution 1: Automatic (Recommended)**
```bash
npm run dev:local
# Script automatically handles port conflicts
```

**Solution 2: Manual**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :4010
taskkill /PID <process_id> /F

# Mac/Linux
lsof -i :3000
lsof -i :4010
kill -9 <process_id>
```

### Cannot Connect to API

**Symptom:** Frontend shows "Network Error" or API unreachable

**Check:**
```bash
# 1. Verify API is running
curl http://localhost:4010/health

# 2. Check CORS configuration in apps/api/.env
CORS_ORIGIN=http://localhost:3000,http://localhost:3010

# 3. Check frontend API URL in apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
```

### Database Errors

**Symptom:** "Database not found" or Prisma errors

**Solution:**
```bash
cd apps/api

# Regenerate Prisma client
npx prisma generate

# Recreate database
npx prisma db push

# Reseed data
npm run db:seed

cd ../..
```

### Build Errors

**Symptom:** "Module not found" or build failures

**Solution:**
```bash
# Clean everything
npm run dev:cleanup

# Delete node_modules
rm -rf node_modules apps/*/node_modules

# Reinstall
npm install

# Try again
npm run dev:local
```

### Hot Reload Not Working

**Symptom:** Changes don't appear automatically

**Solution:**
```bash
# 1. Check if servers are running
# Look for "✅ Startup Complete!" message

# 2. Restart servers
npm run dev:stop
npm run dev:local

# 3. Hard refresh browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

### Authentication Issues

**Symptom:** "Invalid credentials" or login fails

**Solution:**
```bash
cd apps/api

# Check if database has users
npx prisma studio
# Open "User" table, verify test users exist

# If no users, reseed
npm run db:seed

cd ../..
```

---

## 🎯 Development Tips

### Speed Up Development

1. **Use Hot Module Replacement**
   - Frontend: Instant updates without refresh
   - Backend: Auto-restart on file changes

2. **Prisma Studio for Database**
   ```bash
   cd apps/api && npx prisma studio
   ```
   - Visual database browser
   - Edit data directly
   - View relationships

3. **API Testing with Swagger**
   - Visit http://localhost:4010/api/docs
   - Test endpoints interactively
   - See request/response schemas

4. **Browser DevTools**
   - Press F12 to open
   - Console tab: See logs and errors
   - Network tab: Monitor API calls
   - Application tab: Check localStorage

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "prisma.prisma",
    "bradlc.vscode-tailwindcss",
    "dsznajder.es7-react-js-snippets"
  ]
}
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test locally
npm run dev:local

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

---

## 📊 What's Running

### Development Servers

| Service | Port | URL | Purpose |
|---------|------|-----|---------|
| Frontend | 3000 | http://localhost:3000 | Next.js dev server |
| Backend API | 4010 | http://localhost:4010 | NestJS API |
| Swagger Docs | 4010 | http://localhost:4010/api/docs | API documentation |
| Prisma Studio | 5555 | http://localhost:5555 | Database GUI (manual start) |

### File Locations

| Component | Path |
|-----------|------|
| Frontend code | `apps/web/src/` |
| Backend code | `apps/api/src/` |
| Database | `apps/api/prisma/dev.db` (SQLite) |
| Prisma schema | `apps/api/prisma/schema.prisma` |
| Frontend config | `apps/web/.env.local` |
| Backend config | `apps/api/.env` |

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | password123 |
| Student | student@example.com | password123 |

---

## 🚀 Next Steps

### Learn the Codebase
- [Architecture Overview](../architecture/overview.md) - System design
- [Features Guide](../features/README.md) - What you can build
- [API Reference](../api/README.md) - Available endpoints

### Start Contributing
- [Contributing Guide](../development/contributing.md) - How to contribute
- [Code Style](../development/code-style.md) - Coding standards
- [Testing Guide](../development/testing.md) - How to test

### Deploy to Production
- [Project Status](../../PROJECT_STATUS_DASHBOARD.md) - Check readiness
- [Pre-Deployment Checklist](../../PRE_DEPLOYMENT_CHECKLIST.md) - Before deploying
- [Deployment Guide](../deployment/overview.md) - Deploy anywhere

---

## 💡 Pro Tips

1. **Keep terminals open** - See real-time logs from both frontend and backend
2. **Use Prisma Studio** - Visual database editing is much faster
3. **Check Swagger first** - Test API endpoints before writing frontend code
4. **Enable ESLint** - Catch errors as you type
5. **Commit often** - Small, focused commits are easier to review

---

## 📞 Need Help?

1. Check [Troubleshooting](#troubleshooting) section above
2. Review [Quick Start Guide](quickstart.md) for basics
3. See [Deployment Troubleshooting](../deployment/troubleshooting.md)
4. Open an issue on GitHub
5. Ask the development team

---

**You're all set for local development!** 🎉

---

<sub>Last Updated: February 10, 2026 | [Edit this page](local-development.md) | [Back to Docs](../README.md)</sub>

