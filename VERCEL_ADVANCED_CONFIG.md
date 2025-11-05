# 🔧 VERCEL ADVANCED CONFIGURATION

**Advanced deployment options and optimization techniques**

---

## 📊 DEPLOYMENT ARCHITECTURES

### Architecture 1: Full Stack on Single Vercel Project (CURRENT - RECOMMENDED FOR MVP)

```
┌─────────────────────────────────┐
│       Vercel Deployment         │
├─────────────────────────────────┤
│  Next.js Frontend (Port 3000)    │
│  └─ routes, pages, components   │
│                                 │
│  NestJS API (integrated)        │
│  └─ /api routes proxy to nest   │
│                                 │
│  SQLite DB (/tmp/vulhub.db)    │
│  └─ persistent data layer       │
└─────────────────────────────────┘
```

**Pros:**
- ✅ Single deployment
- ✅ No CORS complexity
- ✅ Easy setup
- ✅ Good for MVP

**Cons:**
- ⚠️ Scales together (harder to scale API without frontend)
- ⚠️ SQLite DB not persistent

---

### Architecture 2: Separate Frontend & API (FOR SCALING)

```
Vercel Frontend                  Railway/Render API
┌──────────────────┐            ┌──────────────────┐
│  Next.js on      │────────►   │  NestJS on       │
│  your-app.vercel│            │  api-your-app.*  │
│       .app       │            │                  │
│                  │            │  PostgreSQL DB   │
│  /api rewritten  │◄────────  │                  │
│  to external API │            │                  │
└──────────────────┘            └──────────────────┘
```

**Pros:**
- ✅ Scale independently
- ✅ Persistent database
- ✅ Better for production
- ✅ More flexible

**Cons:**
- ❌ CORS needed
- ❌ Two deployments
- ❌ More complexity

---

### Architecture 3: API Gateway Pattern (ENTERPRISE)

```
Cloudflare/Vercel Edge
        ↓
    API Gateway
    ↙         ↖
Frontend     API      Other Services
Vercel    Railway   Firebase/etc
```

**For high traffic/complex requirements**

---

## 🔧 VERCEL.JSON EXAMPLES

### Example 1: Basic Configuration (Current)
```json
{
  "version": 2,
  "public": false,
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

### Example 2: With Custom Domains
```json
{
  "version": 2,
  "public": false,
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "domains": [
    "vulhub.com",
    "www.vulhub.com"
  ]
}
```

### Example 3: With Performance Optimizations
```json
{
  "version": 2,
  "public": false,
  "buildCommand": "npm run build",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs",
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "max-age=3600" }
      ]
    }
  ],
  "redirects": [],
  "rewrites": []
}
```

### Example 4: For API-Only Deployment
```json
{
  "version": 2,
  "buildCommand": "cd apps/api && npm run build",
  "outputDirectory": "apps/api/dist",
  "functions": {
    "apps/api/dist/main.js": {
      "memory": 1024,
      "maxDuration": 60
    }
  }
}
```

---

## 🚀 DEPLOYMENT OPTIONS

### Option A: Simple Vercel Deploy
**When:** You're starting out
**How:** Push to GitHub → Auto-deploy

```bash
git push origin main
# Done! Vercel deploys automatically
```

### Option B: Vercel + External Database
**When:** You need persistent data
**How:** Use Railway or Heroku PostgreSQL

```env
# In Vercel env vars
DATABASE_URL=postgresql://user:pass@db.railway.app:5432/vulhub
```

### Option C: Separate Frontend + API
**When:** You need independent scaling

**Frontend (Vercel):**
```bash
# Deploy just apps/web
vercel --prod
```

**API (Railway/Render):**
```bash
# Deploy just apps/api
railway up
# or
render deploy
```

---

## 📊 ENVIRONMENT VARIABLES EXAMPLES

### Local Development
```env
NODE_ENV=development
DATABASE_URL=file:./prisma/dev.db
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=true
```

### Vercel Preview (Pull Requests)
```env
NODE_ENV=preview
DATABASE_URL=file:/tmp/vulhub-preview.db
NEXT_PUBLIC_USE_MOCK_AUTH=true
NEXT_PUBLIC_API_URL=https://preview.vercel.app/api
```

### Vercel Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@db.railway.app/vulhub
NEXT_PUBLIC_API_URL=https://vulhub.com/api
NEXT_PUBLIC_USE_MOCK_AUTH=false
JWT_SECRET=<32-char-secret>
JWT_REFRESH_SECRET=<32-char-secret>
CORS_ORIGIN=https://vulhub.com
```

---

## 🔐 SECURITY BEST PRACTICES

### 1. Secret Management

**DO:**
- ✅ Generate unique secrets for each environment
- ✅ Store secrets in Vercel dashboard (not in code)
- ✅ Rotate secrets every 6 months
- ✅ Use environment-specific values

**DON'T:**
- ❌ Commit secrets to GitHub
- ❌ Use same secret for dev/prod
- ❌ Hardcode environment variables
- ❌ Share secrets in Slack/email

### 2. Environment Variable Security

```env
# 🔒 NEVER COMMIT THESE
JWT_SECRET=very-secret-key
API_KEY=secret-api-key

# ✅ SAFE - PUBLIC VARIABLES (prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=https://vulhub.com/api
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

### 3. CORS Configuration

```typescript
// apps/api/src/config/configuration.ts
export const corsOrigin = process.env.CORS_ORIGIN || 
  (process.env.NODE_ENV === 'production' 
    ? undefined 
    : 'http://localhost:3000');
```

---

## 📈 PERFORMANCE OPTIMIZATION

### 1. Enable Vercel Edge Caching

```json
{
  "headers": [
    {
      "source": "/api/v1/leaderboard",
      "headers": [
        { "key": "Cache-Control", "value": "s-maxage=60, stale-while-revalidate=120" }
      ]
    }
  ]
}
```

### 2. Optimize Build Size

```bash
# Check what's taking space
npm run build
# Look at apps/web/.next (should be < 500MB)
```

### 3. Enable Image Optimization

Next.js Image component automatically optimizes images. Use it:

```typescript
import Image from 'next/image';

export function Avatar({ src }) {
  return <Image src={src} alt="avatar" width={40} height={40} />;
}
```

---

## 🔄 CI/CD INTEGRATION

### GitHub Actions Integration

Vercel automatically integrates with GitHub:

1. **Auto-deploy on push to main**
2. **Preview deployments on PR**
3. **Automatic rollback if failed**

### Custom Build Steps

If you need custom steps before deploying:

```bash
# 1. Tests
npm run test

# 2. Type checking
npm run type-check

# 3. Build
npm run build

# 4. Deploy (manual)
vercel --prod
```

---

## 🚨 ERROR HANDLING & LOGGING

### Structured Logging for Vercel

```typescript
// apps/api/src/main.ts
const logger = new Logger('App');

app.enableCors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
});

logger.log(`App running on port ${port}`);
logger.log(`Environment: ${process.env.NODE_ENV}`);
```

### Check Logs in Vercel

1. Dashboard → Project → Deployments
2. Click deployment → Logs
3. Search for errors/warnings

---

## 📊 MONITORING & ANALYTICS

### Enable Vercel Analytics
1. Dashboard → Settings → Analytics
2. Click "Enable"
3. View Core Web Vitals

### View Performance Metrics
1. Analytics tab
2. Check:
   - Page load time
   - First Contentful Paint
   - Cumulative Layout Shift

### Error Tracking (Optional)
Integrate Sentry for error tracking:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

---

## 🔄 DATABASE MIGRATION & BACKUP

### Running Migrations on Vercel

Add to `package.json`:
```json
{
  "scripts": {
    "vercel-build": "npm run build && npm run prisma:migrate"
  }
}
```

Then in `vercel.json`:
```json
{
  "buildCommand": "npm run vercel-build"
}
```

### Backup Strategy

**For SQLite (ephemeral data):**
- ⚠️ Data is lost if function restarts
- Use periodic exports if needed

**For PostgreSQL (persistent):**
- Railway/Heroku backups are automatic
- Download backups as needed
- Consider weekly exports

---

## 🛠️ TROUBLESHOOTING ADVANCED

### Build Takes Too Long
```bash
# Check dependencies
npm ls
# Remove unused packages

# Check build size
du -sh apps/web/.next
du -sh apps/api/dist
```

### Memory Issues
```json
{
  "functions": {
    "api/**/*.js": {
      "memory": 3008  // Max available (3GB)
    }
  }
}
```

### Cold Start Issues
- Use serverless functions for API
- Pre-warm connections
- Use connection pooling

---

## 🎯 SCALING CHECKLIST

If your app grows:

- [ ] Switch to PostgreSQL (persistent DB)
- [ ] Enable Redis caching (if needed)
- [ ] Set up API rate limiting
- [ ] Enable Vercel Analytics
- [ ] Add error tracking (Sentry)
- [ ] Optimize images
- [ ] Enable compression
- [ ] Use CDN for static assets
- [ ] Set up monitoring/alerts
- [ ] Plan for multi-region

---

## 📚 RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NestJS Docs:** https://docs.nestjs.com

---

**Status:** Advanced Reference  
**Last Updated:** November 5, 2025  
**Version:** 1.0

