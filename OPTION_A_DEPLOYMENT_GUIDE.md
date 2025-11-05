# Option A: Frontend-First Deployment Guide

## Overview
This guide walks you through deploying:
1. **Frontend (Next.js)** → Vercel
2. **Backend (NestJS)** → Railway

---

## Phase 1: Frontend Deployment to Vercel

### Prerequisites
- GitHub repo linked to Vercel
- `vercel.json` configured for frontend-only build (already done)
- `.vercelignore` configured (already done)

### Step 1: Set Up Frontend Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-backend-railway-url.com/api/v1
NODE_ENV=production
```

(Replace `your-backend-railway-url.com` with your actual Railway domain, set after backend deployment.)

### Step 2: Deploy Frontend

```bash
# Option A: Auto-deploy via GitHub
git push origin main
# Vercel will auto-deploy

# Option B: Manual deploy via CLI
npm install -g vercel
vercel --prod
```

### Step 3: Verify Frontend Build

1. Go to Vercel Dashboard → Deployments
2. Check the latest deployment logs
3. Verify it's building from `apps/web` (not `apps/api`)
4. Wait for build to complete and get your domain (e.g., `https://your-app.vercel.app`)

---

## Phase 2: Backend Deployment to Railway

### Prerequisites
- Railway account (https://railway.app) - free tier available
- NestJS backend code

### Step 1: Create Backend Repository

```bash
# Navigate to new location
cd ~/Projects

# Create new repo locally
mkdir vulhub-backend
cd vulhub-backend
git init
```

### Step 2: Copy Backend Code

Copy the entire `apps/api` folder from the monorepo:

```bash
# From monorepo
cp -r ~/GA\ Projects/VulHub-LeaderBoard-Web/apps/api ~/Projects/vulhub-backend
cp -r ~/GA\ Projects/VulHub-LeaderBoard-Web/prisma ~/Projects/vulhub-backend/

# Set up git
cd ~/Projects/vulhub-backend
git add .
git commit -m "Initial backend commit"
```

### Step 3: Create GitHub Repository

1. Create a new repo on GitHub: `vulhub-backend`
2. Push local code:

```bash
git remote add origin https://github.com/your-username/vulhub-backend.git
git branch -M main
git push -u origin main
```

### Step 4: Set Up Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Choose `vulhub-backend` repo
5. Configure environment variables:

```env
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=<your-secret-here>
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=<your-refresh-secret>
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app.vercel.app
```

6. Click "Deploy"
7. Get your Railway domain (e.g., `https://your-app-production.up.railway.app`)

### Step 5: Set Up Database Migrations

In Railway dashboard:

```bash
# Connect to Railway shell
npm run prisma:deploy
```

Or, add a build script to trigger migrations automatically.

---

## Phase 3: Connect Frontend to Backend

### Step 1: Update Vercel Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

Update `NEXT_PUBLIC_API_URL` to your Railway domain:

```env
NEXT_PUBLIC_API_URL=https://your-app-production.up.railway.app/api/v1
```

### Step 2: Redeploy Frontend

```bash
# Trigger a redeploy
vercel --prod
# OR push a commit to GitHub (auto-triggers)
git add . && git commit -m "Update API URL" && git push
```

### Step 3: Verify End-to-End

1. Visit your Vercel app: `https://your-app.vercel.app`
2. Try logging in (this calls the backend API)
3. Check browser console (F12) for any CORS or API errors
4. If errors, check Railway logs for backend issues

---

## Local Development (Unchanged)

```bash
# From monorepo root
npm run dev:local

# This starts:
# - Frontend on http://localhost:3000
# - Backend on http://localhost:4000
```

---

## Troubleshooting

### Frontend Build Fails on Vercel
- Check Vercel logs: Dashboard → Deployments → Latest → Logs
- Ensure `vercel.json` is correct
- Ensure `.vercelignore` excludes `apps/api`

### Backend Deployment Fails on Railway
- Check Railway logs: Dashboard → Project → Logs
- Ensure environment variables are set
- Ensure database migrations ran: `npm run prisma:deploy`

### Frontend Can't Connect to API
- Check `NEXT_PUBLIC_API_URL` in Vercel env vars
- Check CORS settings in backend (`apps/api/src/config`)
- Verify Railway domain is accessible (curl it)

### CORS Errors
In `apps/api/src/main.ts`, ensure CORS is enabled:

```typescript
app.enableCors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
});
```

---

## Summary

| Component | Host | Status |
|-----------|------|--------|
| Frontend (Next.js) | Vercel | ✅ Deployed |
| Backend (NestJS) | Railway | ✅ Deployed |
| Database | Railway (SQLite) | ✅ Running |
| Local Dev | Both locally | ✅ Running |

**You're live! 🚀**

