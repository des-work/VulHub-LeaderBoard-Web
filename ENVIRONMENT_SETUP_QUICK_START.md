# 🚀 Quick Environment Setup Guide

**Created:** February 10, 2026  
**Purpose:** Get your environment configured in 5 minutes

---

## ⚡ Quick Setup (2 minutes)

### Step 1: Backend Environment

The `.env` files are gitignored for security. You need to create them from the templates:

```bash
# Copy the API environment template
cd apps/api
cp ENV_EXAMPLE_FILE.txt .env

# Edit if needed (defaults work for local dev)
```

**For local development, the defaults work as-is!** ✅

### Step 2: Frontend Environment

```bash
# Copy the web environment template
cd ../web
cp ENV_LOCAL_EXAMPLE_FILE.txt .env.local

# Edit if needed (defaults work for local dev)
```

**For local development, the defaults work as-is!** ✅

### Step 3: Start Development

```bash
# Return to project root
cd ../..

# Start everything
npm run dev:local
```

**That's it!** Your app should now be running:
- 🌐 Frontend: http://localhost:3000
- 🔧 API: http://localhost:4010

---

## 📝 What's in the Environment Files?

### Backend (`apps/api/.env`)

**Required for local dev:**
- `DATABASE_URL` - SQLite database (default: `file:./prisma/dev.db`)
- `JWT_SECRET` - Auth token secret (dev default provided)
- `JWT_REFRESH_SECRET` - Refresh token secret (dev default provided)
- `CORS_ORIGIN` - Frontend URL (default: `http://localhost:3000,http://localhost:3010`)

**Optional:**
- Redis configuration (app works without it)
- Email SMTP settings
- File storage (Cloudinary, S3)
- Monitoring and logging

### Frontend (`apps/web/.env.local`)

**Required:**
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:4010/api/v1`)

**Optional:**
- Analytics (GA, Plausible, Posthog)
- Error tracking (Sentry)
- Feature flags
- Social links

---

## 🚀 Production Setup

### For Backend (Heroku, Railway, Render)

Set these environment variables in your platform dashboard:

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secure-32-char-secret-here
JWT_REFRESH_SECRET=your-secure-32-char-secret-here
CORS_ORIGIN=https://your-frontend-url.vercel.app
PORT=4010
```

**Generate secure secrets:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

### For Frontend (Vercel)

Set in Vercel Dashboard → Settings → Environment Variables:

```env
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-api.herokuapp.com/api/v1
```

---

## 🔍 Troubleshooting

### "CORS_ORIGIN environment variable is required"
**Solution:** Make sure `CORS_ORIGIN` is set in `apps/api/.env`
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:3010
```

### "Cannot connect to database"
**Solution:** For local dev, SQLite is automatic. Just make sure DATABASE_URL is set:
```env
DATABASE_URL="file:./prisma/dev.db"
```

Then run:
```bash
cd apps/api
npx prisma generate
npx prisma db push
```

### "API not reachable from frontend"
**Solution:** Check that NEXT_PUBLIC_API_URL matches your API server:
```env
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
```

### "JWT token invalid"
**Solution:** Make sure JWT secrets are at least 32 characters long:
```env
JWT_SECRET=dev-jwt-secret-key-change-in-production-min-32-chars
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production-min-32-chars
```

---

## 📚 More Information

- **Complete Configuration Guide:** `apps/api/src/config/CONFIGURATION_GUIDE.md`
- **Deployment Guide:** `DEPLOYMENT_GUIDE.md`
- **Local Testing:** `LOCAL_TESTING_GUIDE.md`
- **Assessment:** `PROJECT_READINESS_ASSESSMENT.md`

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Check API health
curl http://localhost:4010/health

# 2. Check API endpoints
curl http://localhost:4010/api/v1/health

# 3. Open frontend
# Browser: http://localhost:3000

# 4. Test login
# Email: admin@example.com
# Password: password123
```

All working? **You're ready to develop!** 🎉

---

## 🎯 Summary

**Local Development:**
1. Copy `ENV_EXAMPLE_FILE.txt` to `.env` in `apps/api/`
2. Copy `ENV_LOCAL_EXAMPLE_FILE.txt` to `.env.local` in `apps/web/`
3. Run `npm run dev:local`
4. Open http://localhost:3000

**Production:**
1. Set environment variables in hosting platform dashboards
2. Use PostgreSQL for database
3. Generate secure JWT secrets (32+ characters)
4. Set CORS_ORIGIN to your actual frontend URL
5. Deploy!

**Need help?** See the troubleshooting section above or check the comprehensive guides.

