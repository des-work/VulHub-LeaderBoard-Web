# 🚀 Vercel Deployment Guide

Complete guide for deploying VulHub Leaderboard to Vercel.

---

## 📋 Prerequisites

- ✅ Vercel account (free tier works)
- ✅ GitHub repository connected to Vercel
- ✅ Node.js 18+ installed locally
- ✅ pnpm installed

---

## 🎯 Deployment Architecture

### Option 1: Web App on Vercel + API Separate (Recommended)

**Web App (Next.js)**: Deploy to Vercel
- Frontend only
- Static pages + API routes (if needed)
- Environment: Production-ready

**API (NestJS)**: Deploy separately
- Railway, Render, or Fly.io
- Full API server
- Database connection

### Option 2: Full Stack on Vercel

**Web App**: Deploy to Vercel
- Next.js frontend
- Next.js API routes (proxy to external API)

**API**: Deploy as separate Vercel project
- NestJS as serverless functions
- Database: Vercel Postgres or SQLite in /tmp

---

## 📦 Step 1: Prepare Repository

### 1.1 Verify Structure
```
VulHub-LeaderBoard-Web/
├── apps/
│   ├── web/          (Next.js - Deploy to Vercel)
│   └── api/          (NestJS - Deploy separately)
├── packages/
├── vercel.json
└── .vercelignore
```

### 1.2 Commit All Changes
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

---

## 🌐 Step 2: Deploy Web App to Vercel

### 2.1 Connect Repository

1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import your GitHub repository
4. Select the repository

### 2.2 Configure Project

**Project Settings**:
- **Framework Preset**: Next.js
- **Root Directory**: `apps/web`
- **Build Command**: `cd ../.. && pnpm build:web`
- **Output Directory**: `.next`
- **Install Command**: `pnpm install`

**Or use `vercel.json`** (already configured):
```json
{
  "version": 2,
  "buildCommand": "cd apps/web && pnpm build",
  "installCommand": "pnpm install",
  "framework": "nextjs",
  "rootDirectory": "apps/web"
}
```

### 2.3 Set Environment Variables

Go to **Settings → Environment Variables** and add:

```env
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

**For all environments**: Production, Preview, Development

### 2.4 Deploy

Click **"Deploy"** and wait for build to complete.

---

## 🔧 Step 3: Deploy API (Choose One)

### Option A: Vercel Serverless Functions (Simple)

**Limitations**:
- ⚠️ SQLite in `/tmp` is ephemeral (lost on restart)
- ⚠️ Not ideal for production
- ✅ Best for testing/demos

**Steps**:
1. Create separate Vercel project for API
2. Set root directory to `apps/api`
3. Configure as serverless functions
4. Use `/tmp` for SQLite database

### Option B: Railway (Recommended for API)

**Steps**:
1. Go to [railway.app](https://railway.app)
2. Create new project
3. Connect GitHub repository
4. Add service: **NestJS**
5. Set root: `apps/api`
6. Add environment variables (see below)
7. Deploy

**Environment Variables**:
```env
DATABASE_URL=file:./prisma/dev.db
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=15m
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend.vercel.app
```

### Option C: Render (Alternative)

**Steps**:
1. Go to [render.com](https://render.com)
2. Create new **Web Service**
3. Connect GitHub repository
4. Set:
   - **Build Command**: `cd apps/api && pnpm install && pnpm build`
   - **Start Command**: `cd apps/api && pnpm start:prod`
5. Add environment variables
6. Deploy

---

## 🗄️ Step 4: Database Setup

### Option 1: SQLite (Development/Testing)

**For Vercel Serverless**:
```env
DATABASE_URL=file:/tmp/vulhub.db
```

**Note**: Data is ephemeral (lost on restart). Use for testing only.

**For Railway/Render**:
```env
DATABASE_URL=file:./prisma/dev.db
```

**Note**: Data persists, but file is local to instance.

### Option 2: Vercel Postgres (Recommended)

**Steps**:
1. In Vercel project → **Storage** tab
2. Click **"Create Database"** → **Postgres**
3. Copy connection string
4. Set as `DATABASE_URL` environment variable

**Update Prisma Schema**:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

**Run Migrations**:
```bash
cd apps/api
pnpm prisma migrate deploy
```

### Option 3: External Database

**Options**:
- Supabase (free tier)
- Neon (free tier)
- PlanetScale (free tier)
- Railway Postgres

**Steps**:
1. Create database on provider
2. Get connection string
3. Set as `DATABASE_URL`
4. Update Prisma schema if needed
5. Run migrations

---

## 🔐 Step 5: Environment Variables

### Frontend (Vercel)

```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NODE_ENV=production
```

### Backend (API Service)

```env
# Database
DATABASE_URL=file:/tmp/vulhub.db  # or PostgreSQL URL

# JWT
JWT_SECRET=generate-with-openssl-rand-hex-32
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=generate-with-openssl-rand-hex-32
JWT_REFRESH_EXPIRES_IN=7d

# App
NODE_ENV=production
PORT=4000
HOST=0.0.0.0
CORS_ORIGIN=https://your-frontend.vercel.app

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@vulhub.com
```

**Generate Secrets**:
```bash
# Linux/macOS
openssl rand -hex 32

# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

---

## 🧪 Step 6: Test Deployment

### 6.1 Test Frontend
1. Visit your Vercel URL
2. Check if homepage loads
3. Test navigation
4. Check console for errors

### 6.2 Test API
1. Visit `https://your-api-domain.com/health`
2. Should return health status
3. Test authentication endpoints
4. Check database connection

### 6.3 Test Integration
1. Login from frontend
2. Should connect to API
3. Check network tab for API calls
4. Verify CORS is working

---

## 🔍 Step 7: Troubleshooting

### Build Fails

**Error**: `Module not found`
- ✅ Check `package.json` dependencies
- ✅ Verify workspace packages are built
- ✅ Run `pnpm build:packages` first

**Error**: `TypeScript errors`
- ✅ Fix TypeScript errors locally
- ✅ Run `pnpm type-check` before deploying

### API Not Connecting

**Error**: `CORS error`
- ✅ Check `CORS_ORIGIN` environment variable
- ✅ Verify frontend URL matches
- ✅ Check API headers configuration

**Error**: `Database connection failed`
- ✅ Verify `DATABASE_URL` is correct
- ✅ Check database is accessible
- ✅ Run migrations: `pnpm prisma migrate deploy`

### Environment Variables Not Working

**Error**: `Variable not found`
- ✅ Check variable name (case-sensitive)
- ✅ Verify environment (Production/Preview/Development)
- ✅ Redeploy after adding variables

---

## 📊 Step 8: Monitoring

### Vercel Analytics
- Enable in Vercel dashboard
- Track page views, performance
- Monitor API usage

### API Monitoring
- Use service provider's monitoring
- Set up error alerts
- Track response times

### Database Monitoring
- Monitor connection pool
- Track query performance
- Set up backup schedules

---

## 🚀 Step 9: Production Checklist

- [ ] All environment variables set
- [ ] Database migrations run
- [ ] CORS configured correctly
- [ ] JWT secrets generated and secure
- [ ] Frontend connects to API
- [ ] Authentication working
- [ ] File uploads working (if applicable)
- [ ] Error handling in place
- [ ] Monitoring enabled
- [ ] Backup strategy in place

---

## 📝 Next Steps

1. **Custom Domain**: Add custom domain in Vercel
2. **SSL**: Automatic with Vercel
3. **CDN**: Automatic with Vercel
4. **Analytics**: Enable in Vercel dashboard
5. **Backups**: Set up database backups
6. **Monitoring**: Set up error tracking

---

## 🆘 Support

**Issues?**
- Check Vercel logs
- Check API service logs
- Verify environment variables
- Test locally first

**Need Help?**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Project Issues: Check GitHub issues

---

**Ready to deploy!** 🎉

