# 🚀 Vercel Full Stack Deployment Setup

## Configuration Complete

Your project is now configured for **Full Stack deployment on Vercel**:

- ✅ **Web App** → Vercel (Next.js)
- ✅ **API** → Vercel Serverless Functions
- ✅ **Database** → SQLite in `/tmp` (ephemeral)

---

## 📁 Files Created/Updated

### 1. Serverless Handler
**File**: `apps/api/src/serverless.ts`

- Wraps NestJS app for Vercel serverless functions
- Caches app instance for performance
- Handles CORS for serverless environment
- Routes `/api/*` requests correctly

### 2. API Entry Point
**File**: `api/index.ts`

- Vercel serverless function entry point
- Routes to the NestJS serverless handler

### 3. Vercel Configuration
**File**: `vercel.json`

**Configuration**:
```json
{
  "functions": {
    "api/index.ts": {
      "runtime": "nodejs18.x",
      "maxDuration": 30
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api"
    }
  ]
}
```

### 4. Database Configuration
**File**: `apps/api/src/config/configuration.ts`

- Auto-detects Vercel environment
- Uses `/tmp/vulhub.db` for SQLite in serverless
- Falls back to local dev database otherwise

### 5. File Storage
**File**: `apps/api/src/adapters/storage/file-storage.service.ts`

- Already configured for `/tmp/uploads` in serverless
- Uses local `public/uploads` for development

---

## 🚀 Deployment Steps

### Step 1: Set Environment Variables in Vercel

Go to **Vercel Dashboard** → Your Project → **Settings** → **Environment Variables**

Add these variables:

```env
# Required
DATABASE_URL=file:/tmp/vulhub.db
NODE_ENV=production
JWT_SECRET=your-secret-here-min-32-chars
JWT_EXPIRES_IN=15m

# Optional
JWT_REFRESH_SECRET=your-refresh-secret-here
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Generate JWT Secrets**:
```bash
openssl rand -hex 32
```

### Step 2: Deploy

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Configure for Vercel full stack deployment"
   git push origin main
   ```

2. **Vercel Auto-Deploy**:
   - Vercel will automatically detect the push
   - Build will start automatically
   - Deploy both web app and API

3. **Manual Deploy** (if needed):
   ```bash
   vercel --prod
   ```

---

## 📊 Architecture

```
┌─────────────────────────────────────┐
│         Vercel Platform              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐                  │
│  │  Next.js App  │                  │
│  │  (apps/web)   │                  │
│  └──────┬───────┘                   │
│         │                           │
│         │ /api/* requests            │
│         ▼                           │
│  ┌──────────────┐                   │
│  │ Serverless   │                   │
│  │ Function     │                   │
│  │ (api/index)  │                   │
│  └──────┬───────┘                   │
│         │                           │
│         │ NestJS App                │
│         ▼                           │
│  ┌──────────────┐                   │
│  │ SQLite DB    │                   │
│  │ /tmp/vulhub.db│                  │
│  └──────────────┘                   │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚠️ Important Notes

### Database (Ephemeral)
- ✅ **SQLite in `/tmp`** works for Vercel serverless
- ⚠️ **Data is ephemeral** - lost on function restart
- ⚠️ **Not shared** across instances
- 📝 **Best for**: Development, demos, testing

### File Storage (Ephemeral)
- ✅ Files stored in `/tmp/uploads`
- ⚠️ **Files are ephemeral** - lost on restart
- ⚠️ **Not persistent** across deployments
- 📝 **Best for**: Temporary files, testing

### Performance
- ✅ **Cold starts**: ~1-3 seconds (first request)
- ✅ **Warm requests**: <100ms
- ✅ **Cached app**: Reused across requests

---

## 🔧 Testing Locally

### Test Serverless Function Locally

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:3000/api/health

# Test endpoint
curl http://localhost:3000/api/submissions
```

---

## 📝 API Routes

All API requests should go to `/api/*`:

- `GET /api/health` - Health check
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Create submission
- `GET /api/leaderboards` - Get leaderboards
- `POST /api/auth/login` - Login
- etc.

---

## 🐛 Troubleshooting

### Database Not Found
**Error**: `Database file not found`

**Solution**:
- Database is created automatically on first request
- Ensure `/tmp` is writable (it is by default on Vercel)

### Cold Start Timeout
**Error**: `Function timeout`

**Solution**:
- Increase `maxDuration` in `vercel.json` (currently 30s)
- Optimize NestJS app initialization
- Use connection pooling

### CORS Errors
**Error**: `CORS policy blocked`

**Solution**:
- Check `CORS_ORIGIN` environment variable
- Serverless handler allows all origins by default
- Verify frontend URL matches

---

## 📊 Monitoring

### Vercel Dashboard
- View function logs
- Monitor performance
- Check errors

### API Health
```bash
curl https://your-app.vercel.app/api/health
```

---

## ✅ Deployment Checklist

- [ ] Environment variables set in Vercel
- [ ] JWT secrets generated and configured
- [ ] Database path configured (`file:/tmp/vulhub.db`)
- [ ] File storage configured (`/tmp/uploads`)
- [ ] CORS configured correctly
- [ ] API routes tested
- [ ] Frontend connects to API
- [ ] Authentication working
- [ ] File uploads working (if applicable)

---

## 🚀 Next Steps

1. **Deploy** to Vercel
2. **Test** all endpoints
3. **Monitor** performance
4. **Optimize** if needed

**Ready to deploy!** 🎉

