# 🔧 Vercel Deployment Fix

## Error Fixed

**Error**: `Invalid request: should NOT have additional property 'envPrefix'`

**Solution**: Removed `env` property from `vercel.json`. Environment variables should be set in the Vercel dashboard, not in the configuration file.

---

## ✅ Updated Configuration

### `vercel.json` Changes

**Removed**:
- ❌ `env` property (not supported in vercel.json)
- ❌ `envPrefix` property (not supported)

**Kept**:
- ✅ `buildCommand` - Builds packages, API, and web app
- ✅ `functions` - Serverless function configuration
- ✅ `rewrites` - API route rewriting
- ✅ `git` - Git deployment settings

---

## 📝 Environment Variables

**Set these in Vercel Dashboard** → **Settings** → **Environment Variables**:

### Required
```env
DATABASE_URL=file:/tmp/vulhub.db
NODE_ENV=production
JWT_SECRET=<your-secret-here>
JWT_EXPIRES_IN=15m
NEXT_PUBLIC_API_URL=/api
```

### Optional
```env
JWT_REFRESH_SECRET=<your-refresh-secret>
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app.vercel.app
```

---

## 🚀 Deployment Steps

1. **Remove old vercel.json** (if exists in wrong location)
2. **Set environment variables** in Vercel dashboard
3. **Deploy**:
   - If deploying full stack: Use root `vercel.json`
   - If deploying API only: Set Root Directory to `apps/api`

---

## 📊 Deployment Options

### Option 1: Full Stack (Recommended)
- **Root Directory**: Leave empty or `/`
- **Framework**: Next.js
- **Build Command**: Auto-detected or from `vercel.json`
- **Output Directory**: `apps/web/.next`

### Option 2: API Only
- **Root Directory**: `apps/api`
- **Framework**: NestJS
- **Build Command**: `pnpm build`
- **Output Directory**: `dist`

---

## ✅ Configuration is Now Valid

The `vercel.json` file is now valid and should work with Vercel's deployment system.

**Try deploying again!** 🚀

