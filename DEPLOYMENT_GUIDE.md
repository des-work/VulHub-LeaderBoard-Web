# 🚀 VulHub Leaderboard - Complete Deployment Guide

**Updated:** October 31, 2025  
**Target Platforms:** Heroku (API) + Vercel (Frontend) + Supabase (Database)  
**Estimated Time:** 45 minutes for first-time setup

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Supabase Database Setup](#step-1-supabase-database-setup)
4. [Step 2: Heroku API Deployment](#step-2-heroku-api-deployment)
5. [Step 3: Vercel Frontend Deployment](#step-3-vercel-frontend-deployment)
6. [Step 4: Connect Everything](#step-4-connect-everything)
7. [Post-Deployment Verification](#post-deployment-verification)
8. [Troubleshooting](#troubleshooting)

---

## Architecture Overview

```
┌──────────────────────────────────────────────────────────────┐
│                      Frontend (Vercel)                       │
│                   vulhub.vercel.app                          │
│              (Next.js - React Application)                   │
└────────────────────┬─────────────────────────────────────────┘
                     │
                     │ API calls
                     ▼
┌──────────────────────────────────────────────────────────────┐
│                      API (Heroku)                            │
│              vulhub-api.herokuapp.com                        │
│            (NestJS - REST API Server)                        │
└────────────────────┬─────────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
         ▼           ▼           ▼
    ┌────────┐  ┌────────┐  ┌────────┐
    │Database│  │ Redis  │  │Logging │
    │Supabase│  │Upstash │  │        │
    └────────┘  └────────┘  └────────┘
```

---

## Prerequisites

**Before you start, you need:**

- ✅ **Heroku Account** (you have this)
  - Visit: https://www.heroku.com

- ❌ **Supabase Account** (create now)
  - Visit: https://supabase.com

- ❌ **Vercel Account** (create now)
  - Visit: https://vercel.com

- ✅ **GitHub Account** (you should have this for Git)
  - Visit: https://github.com

- ✅ **Local Git repo** (your project)
  - Already set up in your workspace

**Estimated setup times:**
- Supabase: 5 minutes
- Heroku: 10 minutes
- Vercel: 10 minutes
- Total: ~25 minutes

---

## Step 1: Supabase Database Setup

### 1.1 Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project" or "Sign up"
3. Sign up with GitHub (easiest)
   - Click "Continue with GitHub"
   - Authorize Supabase
4. Create an organization or use default

### 1.2 Create New Project

1. In Supabase dashboard, click "New Project"
2. Fill in details:
   - **Name:** `vulhub` or `vulhub-db`
   - **Database Password:** Create a strong password (save it!)
   - **Region:** Choose closest to your users (e.g., US East if in USA)
   - **Plan:** Free tier
3. Click "Create new project" and wait 2-3 minutes for provisioning

### 1.3 Get Connection String

1. In your Supabase project, click on "Settings" (left sidebar)
2. Click "Database"
3. Under "Connection string", select "Postgres" (not "URI")
4. Copy the connection string
   - It looks like: `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres`
   - **Important:** The password in the template is `[PASSWORD]` - replace with your actual password!

### 1.4 Test Connection

1. Open your terminal
2. Try to connect:
   ```bash
   psql postgresql://postgres:[YOUR_PASSWORD]@[HOST]:5432/postgres
   ```
3. If you see `postgres=#` prompt, connection works! Type `\q` to exit.

**✅ Supabase setup complete!**  
**Keep the connection string safe - you'll need it for Heroku**

---

## Step 2: Heroku API Deployment

### 2.1 Prepare Your Repository

1. Make sure your code is pushed to GitHub
   ```bash
   cd /path/to/VulHub-LeaderBoard-Web
   git status
   git push origin main  # or your main branch
   ```

2. Check that Procfile exists in project root
   ```bash
   cat Procfile
   ```
   
   Should see:
   ```
   web: cd apps/api && pnpm exec nest start
   ```

   If not, I've created it for you.

### 2.2 Deploy API to Heroku

**Option A: Using Heroku CLI (Recommended)**

1. Install Heroku CLI (if not already)
   ```bash
   npm install -g heroku
   ```

2. Login to Heroku
   ```bash
   heroku login
   ```
   - Opens browser, login with your account

3. Create Heroku app
   ```bash
   heroku create vulhub-api
   ```
   - Will create: `https://vulhub-api.herokuapp.com`
   - Note: You can use different name if taken

4. Add Supabase database connection
   ```bash
   heroku config:set DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@[HOST]:5432/postgres" -a vulhub-api
   ```
   - Replace with your actual Supabase connection string

5. Set other required environment variables
   ```bash
   heroku config:set NODE_ENV=production -a vulhub-api
   heroku config:set REDIS_URL="redis://default:xxxx@xxxxx.redis.upstash.io:xxxxx" -a vulhub-api
   heroku config:set JWT_SECRET="your-super-secret-key-change-this" -a vulhub-api
   heroku config:set TENANT_ID="default-tenant" -a vulhub-api
   ```

6. Deploy your code
   ```bash
   git push heroku main
   ```
   - Builds and deploys automatically
   - Watch logs for success/errors

7. Run migrations on Heroku database
   ```bash
   heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
   heroku run "cd apps/api && pnpm db:seed" -a vulhub-api
   ```

8. Verify API is running
   ```bash
   heroku open -a vulhub-api
   ```
   - Should open: `https://vulhub-api.herokuapp.com`
   - Or visit: `https://vulhub-api.herokuapp.com/api/v1/health`
   - Should return: `{"status":"ok"}`

**✅ Heroku API deployment complete!**  
**Your API URL:** `https://vulhub-api.herokuapp.com`

---

## Step 3: Vercel Frontend Deployment

### 3.1 Connect GitHub to Vercel

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel to access your repositories
4. Import your repository
   - Click "Import Project"
   - Find your `VulHub-LeaderBoard-Web` repo
   - Click "Import"

### 3.2 Configure for Monorepo

1. In project settings:
   - **Root Directory:** Leave empty (Vercel auto-detects)
   - **Build Command:** `pnpm build` (should auto-fill)
   - **Output Directory:** `.next` (should auto-fill)

2. If Vercel doesn't auto-detect the Next.js app:
   - Root Directory: `./apps/web`

### 3.3 Set Environment Variables

1. Click "Environment Variables"
2. Add these variables:
   ```
   NEXT_PUBLIC_API_URL = https://vulhub-api.herokuapp.com/api/v1
   NODE_ENV = production
   ```

3. Click "Deploy"

### 3.4 Wait for Build

- Vercel automatically builds and deploys
- Check "Deployments" tab for status
- Deployment typically takes 2-5 minutes

**✅ Vercel frontend deployment complete!**  
**Your Frontend URL:** `https://your-project.vercel.app`

---

## Step 4: Connect Everything

### 4.1 Verify API is Accessible

1. From your terminal:
   ```bash
   curl https://vulhub-api.herokuapp.com/api/v1/health
   ```
   
   Should return:
   ```json
   {"status":"ok","info":{"api":{"status":"up","message":"API is running"}}}
   ```

### 4.2 Verify Frontend Can Reach API

1. Go to your Vercel frontend URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Try to login
5. Check Network tab to see if API calls succeed

### 4.3 Verify Database Connection

1. Run this on Heroku:
   ```bash
   heroku logs -a vulhub-api --tail
   ```
   
   Should see:
   ```
   [Nest] ... info Connected to database
   ```

---

## Post-Deployment Verification

See `POST_DEPLOYMENT_CHECKLIST.md` for detailed verification steps.

Quick checklist:
- ✅ Frontend loads at Vercel URL
- ✅ Can login successfully
- ✅ Dashboard displays data
- ✅ Can navigate all pages
- ✅ API calls work (check Network tab in DevTools)
- ✅ Database queries work (check Heroku logs)

---

## Troubleshooting

### Issue: "Cannot find module @nestjs/cli"

**Solution:** Make sure `pnpm` is installed on Heroku
```bash
heroku config:set NPM_CONFIG_PRODUCTION=false -a vulhub-api
```

### Issue: "DATABASE_URL not found"

**Solution:** Verify you set the environment variable
```bash
heroku config -a vulhub-api
```

Should show `DATABASE_URL` in the list.

### Issue: Frontend shows "API Connection Error"

**Solution:** 
1. Check if `NEXT_PUBLIC_API_URL` is set correctly in Vercel
2. Verify API is running: `curl https://vulhub-api.herokuapp.com/api/v1/health`
3. Check CORS settings in API if needed

### Issue: Heroku build fails

**Solution:**
1. Check build logs:
   ```bash
   heroku logs -a vulhub-api
   ```
2. Common issues:
   - Missing dependencies: Run `pnpm install` locally
   - Node version mismatch: Add `engines` to `package.json`
   - Environment variables not set: Check `heroku config`

### Issue: Database migrations fail

**Solution:**
1. Verify connection string is correct
2. Try running migrations locally first:
   ```bash
   DATABASE_URL="your-connection-string" pnpm prisma db push
   ```
3. If that works, run on Heroku:
   ```bash
   heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
   ```

---

## Next Steps After Deployment

1. **Monitor Logs**
   ```bash
   heroku logs -a vulhub-api --tail
   ```

2. **Set Up Error Tracking**
   - Consider adding Sentry or DataDog

3. **Configure Backups**
   - Supabase has automatic backups on free tier

4. **Set Custom Domain** (Optional)
   - Once you have a domain name, configure:
     - Heroku: `heroku domains:add api.yourdomain.com`
     - Vercel: Add domain in settings

---

## Support

If you encounter issues:

1. Check Heroku logs: `heroku logs -a vulhub-api`
2. Check Vercel deployment: https://vercel.com
3. Check Supabase database: https://supabase.com
4. Review the specific setup guide for that service below

---

**✅ Deployment Guide Complete!**

Next: Follow `SUPABASE_SETUP.md`, `HEROKU_DEPLOYMENT.md`, and `VERCEL_DEPLOYMENT.md` for detailed step-by-step instructions with screenshots.
