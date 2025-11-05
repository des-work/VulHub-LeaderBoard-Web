# 🚀 VERCEL DEPLOYMENT - UPDATED METHODS (2025)

**Status:** ✅ Complete & Current  
**Last Updated:** November 5, 2025  
**Framework:** Next.js (Frontend) + NestJS (Backend)  
**Database:** SQLite  
**Time to Deploy:** ~5 minutes

---

## 📋 QUICK START (TL;DR)

```bash
# 1. Push to GitHub (triggers Vercel auto-deploy)
git push origin main

# 2. Set environment variables in Vercel dashboard
# See "Environment Variables" section below

# 3. Vercel auto-deploys! Check your domain
# Your app will be live at: https://your-project.vercel.app
```

---

## 🎯 DEPLOYMENT OPTIONS

### **Option 1: Auto-Deploy with GitHub (RECOMMENDED)**

**Setup (One-Time):**
1. Connect GitHub repo to Vercel
2. Set Root Directory to: `/`
3. Framework Preset: Auto-detect (Next.js)
4. Set environment variables
5. Deploy

**Then:** Every `git push origin main` auto-deploys!

---

### **Option 2: Manual Deploy via CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Follow prompts and set environment variables
```

---

### **Option 3: Full Stack Architecture (Advanced)**

If you want separate API and Frontend deployments:

**Option 3a: API on Vercel Serverless (with Next.js as frontend proxy)**
- Frontend: `/` (Next.js, handles routes)
- API: `/api/*` (rewritten to NestJS)

**Option 3b: API on separate service (recommended for scaling)**
- Frontend: Vercel
- API: Railway, Render, or another provider

---

## 🔧 CONFIGURATION

### **vercel.json** (Current - Minimal)

```json
{
  "version": 2
}
```

**Why so simple?**
- Next.js is auto-detected
- Build settings are auto-optimized
- Environment variables set in dashboard
- No need for complex config

### **.vercelignore** (Optional - Excludes files from deployment)

```
# Dependencies
node_modules/
.pnpm-store/

# Build outputs
dist/
.next/
out/
coverage/

# Environment files (Vercel handles these)
.env
.env*.local

# Development files
*.log
.DS_Store
Thumbs.db

# Documentation (optional - set to false if you want docs)
docs/
*.md
!README.md

# Scripts (not needed on Vercel)
scripts/

# Database files (created in /tmp on Vercel)
*.db
*.sqlite
*.db-journal

# Prisma
prisma/migrations/.DS_Store
```

---

## 🔑 ENVIRONMENT VARIABLES

### **Required Variables** (Set in Vercel Dashboard)

Go to: **Settings** → **Environment Variables** → Add the following:

#### Production Environment:
```env
NODE_ENV=production
PORT=3000

# Database (SQLite on /tmp for serverless)
DATABASE_URL=file:/tmp/vulhub.db

# JWT Authentication
JWT_SECRET=<generate-secure-32-char-string>
JWT_REFRESH_SECRET=<generate-secure-32-char-string>

# Frontend Configuration
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
NEXT_PUBLIC_USE_MOCK_AUTH=false

# CORS
CORS_ORIGIN=https://your-domain.vercel.app
```

#### Preview/Development Environment:
```env
NODE_ENV=preview
DATABASE_URL=file:/tmp/vulhub-preview.db
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### **Optional Variables**:
```env
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
LOG_LEVEL=info
```

### **Generate Secure Secrets**:
```bash
# Generate 32-character secret
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"

# Or use openssl
openssl rand -hex 32
```

---

## 📊 DEPLOYMENT ARCHITECTURE

### **How Your App Works on Vercel**

```
┌─────────────────────────────────────────────────────────┐
│                  VERCEL (Single Deployment)              │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Frontend (Next.js on Port 3000)                         │
│  ├─ /                 → Home page                        │
│  ├─ /auth             → Login page                       │
│  ├─ /leaderboard      → Rankings                         │
│  ├─ /submissions      → User submissions                 │
│  └─ /badges           → Badge system                     │
│                                                          │
│  Backend (NestJS integrated)                             │
│  ├─ /api/v1/auth      → Authentication                  │
│  ├─ /api/v1/users     → User management                 │
│  ├─ /api/v1/projects  → Project data                    │
│  ├─ /api/v1/submit    → Submissions                     │
│  ├─ /api/v1/leaderboard → Leaderboard API              │
│  └─ /api/v1/badges    → Badge system API                │
│                                                          │
│  Database (SQLite in /tmp)                               │
│  └─ /tmp/vulhub.db    → Persistent storage              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🔄 BUILD PROCESS

### **How Vercel Builds Your App**

```
1. Clone from GitHub
   ↓
2. Run pnpm install
   ↓
3. Run postinstall script
   └─ cd apps/api && npm run prisma:generate
   ↓
4. Run build command
   ├─ Build API: cd apps/api && npm run build
   ├─ Build Web: cd apps/web && npm run build
   ↓
5. Deploy
   ├─ Frontend: apps/web/.next
   ├─ Backend: apps/api/dist
   └─ Database: SQLite created at /tmp/vulhub.db
```

### **Build Command** (Auto-detected):
```bash
npm run build
```

### **Start Command** (Auto-detected):
```bash
npm run start:prod  # From apps/web (Next.js)
```

---

## ✅ DEPLOYMENT CHECKLIST

Before deploying, verify:

- [ ] **GitHub repository** is public or Vercel has access
- [ ] **All environment variables** are set in Vercel dashboard
- [ ] **Database migrations** will run automatically on first deploy
- [ ] **Secret keys** are generated and unique
- [ ] **CORS settings** allow your Vercel domain
- [ ] **No sensitive files** are in `.vercelignore`
- [ ] **Package.json** has correct scripts
- [ ] **Node version** is 18+ (set in engines)
- [ ] **Build succeeds locally**: `npm run build`
- [ ] **Runs locally**: `npm run dev:local` works

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### **First Deployment:**

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Connect GitHub Repository**
   - Click "New Project"
   - Select your GitHub repo
   - Authorize Vercel access

3. **Configure Project**
   - Framework Preset: Auto-detect (should find Next.js)
   - Root Directory: `/` (leave empty)
   - Build Command: Auto-detect (uses `npm run build`)
   - Output Directory: Auto-detect (uses `apps/web/.next`)

4. **Set Environment Variables**
   - Click "Environment Variables"
   - Add all variables from "Environment Variables" section
   - Select "Production" and "Preview" environments

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Click domain when ready

6. **Verify Deployment**
   - Visit your app: `https://your-project.vercel.app`
   - Try logging in
   - Check leaderboard loads
   - Test API endpoints

### **Subsequent Deployments:**

Just push to main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Vercel automatically redeploys! 🎉

---

## 🔍 MONITORING & DEBUGGING

### **View Deployment Logs**

1. Go to Vercel Dashboard
2. Click your project
3. Click "Deployments"
4. Click the deployment
5. Click "Logs" tab
6. Search for errors

### **Common Issues & Fixes**

#### Build Fails: "Cannot find module"
```
❌ Error: Cannot find module '@nestjs/cli'
✅ Fix: Ensure build script includes npx -y @nestjs/cli
```

#### Database Connection Error
```
❌ Error: Cannot connect to database
✅ Fix: DATABASE_URL must be file:/tmp/vulhub.db
```

#### API 404 Errors
```
❌ Error: /api/v1/... returns 404
✅ Fix: Check NEXT_PUBLIC_API_URL matches your domain
```

#### TypeScript Errors During Build
```
❌ Error: TS errors in dist
✅ Fix: Run npm run type-check locally first
```

---

## 📈 PERFORMANCE OPTIMIZATION

### **Already Optimized:**
- ✅ Next.js static generation for pages
- ✅ API route caching with MemoryCacheService
- ✅ Image optimization (Next.js native)
- ✅ Code splitting (automatic)
- ✅ Compression enabled

### **To Further Optimize:**
```env
# Enable more aggressive caching
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

---

## 🔐 SECURITY

### **Already Secured:**
- ✅ JWT token authentication
- ✅ CORS enabled
- ✅ Helmet security headers
- ✅ Rate limiting on endpoints
- ✅ HTTPS by default

### **Additional Security:**
1. **Rotate Secrets Regularly**
   - Generate new JWT_SECRET every 6 months
   - Update in Vercel dashboard

2. **Monitor Errors**
   - Check Vercel logs for suspicious activity
   - Set up error tracking (optional)

3. **Database Backups**
   - SQLite DB is in `/tmp` (ephemeral)
   - For persistent DB: switch to PostgreSQL

---

## 📊 DATABASE CONSIDERATIONS

### **Current Setup (SQLite)**

**Pros:**
- ✅ Zero configuration
- ✅ No external database needed
- ✅ Fast for small-medium scale

**Cons:**
- ⚠️ Data lost if serverless function restarts
- ⚠️ Not suitable for high-scale production

### **For Production with Persistent Data**

Switch to PostgreSQL on Railway or similar:

```env
# In Vercel dashboard:
DATABASE_URL=postgresql://user:pass@host:5432/db

# Then run migrations:
pnpm prisma migrate deploy
```

---

## 🔄 CONTINUOUS DEPLOYMENT

### **Automatic Deployments:**
- ✅ `main` branch → Auto-deploys to production
- ✅ Pull requests → Auto-deploy to preview
- ✅ Rollback → Click button to revert

### **Manual Controls:**
- **Pause Deployments**: Vercel Dashboard → Project Settings
- **Redeploy**: Click project → Deployments → Click button
- **Rollback**: Click "Redeploy" on previous deployment

---

## 📞 TROUBLESHOOTING

### **Deploy Won't Start**
```bash
# Check if vercel.json is valid
cat vercel.json

# Should be minimal:
{ "version": 2 }
```

### **Env Variables Not Working**
- Clear browser cache
- Redeploy after setting variables
- Check "Environment" is set to "Production"

### **API Routes Return 404**
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify `/api` routes are in `apps/web/public` or API integration

### **Build Timeout**
- Check package.json dependencies
- Remove unnecessary packages
- Increase build timeout in Vercel settings

---

## 📋 QUICK REFERENCE

| Task | Command |
|------|---------|
| Deploy locally first | `npm run dev:local` |
| Build for production | `npm run build` |
| Test production build | `npm run build && npm start` |
| Push to main | `git push origin main` |
| View Vercel dashboard | https://vercel.com/dashboard |
| Check deployment logs | Vercel Dashboard → Deployments → Logs |
| Set env variables | Vercel Dashboard → Settings → Environment Variables |
| Redeploy | Vercel Dashboard → Deployments → Redeploy |

---

## ✅ FINAL CHECKLIST

After deployment, verify:

- [ ] Frontend loads without errors
- [ ] Can login with test credentials
- [ ] Leaderboard displays
- [ ] Can submit a project
- [ ] Badges are visible
- [ ] API responds at `/api/v1/health`
- [ ] No 404 errors in console
- [ ] No security warnings
- [ ] Database persists data between reloads

---

## 🎉 YOU'RE DEPLOYED!

Your app is now live on Vercel! 🚀

**Next Steps:**
1. Share your app URL
2. Add custom domain (optional)
3. Monitor for errors
4. Scale if needed

---

**Document Version:** 2.0  
**Status:** Current & Complete  
**Last Verified:** November 5, 2025

