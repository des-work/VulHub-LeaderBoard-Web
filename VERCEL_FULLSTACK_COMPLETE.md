# ✅ Full Stack Vercel Deployment - Complete

## 🎯 Configuration Complete

Your project is now fully configured for **Full Stack deployment on Vercel**:

- ✅ **Web App** → Vercel (Next.js)
- ✅ **API** → Vercel Serverless Functions  
- ✅ **Database** → SQLite in `/tmp` (ephemeral)

---

## 📁 Files Created

### 1. Serverless Handler
**File**: `apps/api/src/serverless.ts`

Wraps your NestJS application for Vercel serverless functions:
- Caches app instance for performance
- Handles CORS for serverless environment
- Routes `/api/*` requests correctly
- Handles OPTIONS preflight requests

### 2. API Entry Point
**File**: `api/index.ts`

Vercel serverless function entry point that routes to the NestJS handler.

### 3. API Configuration
**Files**:
- `api/package.json` - Package configuration
- `api/tsconfig.json` - TypeScript configuration

### 4. Updated Configuration
**Files**:
- `vercel.json` - Updated build command and function configuration
- `apps/api/src/config/configuration.ts` - Auto-detects Vercel and uses `/tmp` for database

---

## 🚀 Deployment Steps

### Step 1: Set Environment Variables

In **Vercel Dashboard** → **Settings** → **Environment Variables**, add:

```env
# Required
DATABASE_URL=file:/tmp/vulhub.db
NODE_ENV=production
JWT_SECRET=<generate-with-openssl-rand-hex-32>
JWT_EXPIRES_IN=15m

# Optional but Recommended
JWT_REFRESH_SECRET=<generate-with-openssl-rand-hex-32>
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-frontend.vercel.app
NEXT_PUBLIC_API_URL=/api
```

**Generate Secrets**:
```bash
openssl rand -hex 32
```

### Step 2: Deploy

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Vercel Auto-Deploys**:
   - Automatically detects push
   - Builds both web and API
   - Deploys as serverless functions

3. **Manual Deploy** (optional):
   ```bash
   vercel --prod
   ```

---

## 📊 Architecture

```
User Request
    ↓
Vercel Platform
    ↓
┌─────────────────┐
│  Next.js App    │  (apps/web)
│  Frontend       │
└────────┬────────┘
         │
         │ /api/* requests
         ↓
┌─────────────────┐
│ Serverless Func │  (api/index.ts)
│ NestJS Handler  │  (apps/api/src/serverless.ts)
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ SQLite Database │  (/tmp/vulhub.db)
│ File Storage    │  (/tmp/uploads)
└─────────────────┘
```

---

## ✅ What's Configured

### Database
- ✅ Auto-detects Vercel environment
- ✅ Uses `/tmp/vulhub.db` for SQLite
- ✅ Created automatically on first request
- ⚠️ **Ephemeral** - data lost on restart

### File Storage
- ✅ Uses `/tmp/uploads` for serverless
- ✅ Automatically creates directories
- ⚠️ **Ephemeral** - files lost on restart

### API Routes
- ✅ All `/api/*` requests routed to serverless function
- ✅ CORS configured for serverless
- ✅ OPTIONS preflight handled
- ✅ Path rewriting (`/api/*` → `/*`)

### Build Process
- ✅ Builds packages first
- ✅ Builds API
- ✅ Builds Web app
- ✅ All configured in `vercel.json`

---

## 🔧 API Endpoints

All API requests should use `/api` prefix:

- `GET /api/health` - Health check
- `GET /api/submissions` - Get submissions
- `POST /api/submissions` - Create submission
- `GET /api/leaderboards` - Get leaderboards
- `POST /api/auth/login` - Login
- `GET /api/users/me` - Get current user
- etc.

---

## ⚠️ Important Notes

### Ephemeral Storage
- **Database**: Data in `/tmp/vulhub.db` is lost on function restart
- **Files**: Files in `/tmp/uploads` are lost on restart
- **Best for**: Development, demos, testing
- **Not for**: Production with persistent data requirements

### Cold Starts
- First request: ~1-3 seconds (app initialization)
- Subsequent requests: <100ms (cached app)
- App instance is cached between requests

### Limitations
- **Function timeout**: 30 seconds (configurable)
- **Memory**: Limited by Vercel plan
- **File size**: Limited by `/tmp` space

---

## 🧪 Testing Locally

### Install Vercel CLI
```bash
npm i -g vercel
```

### Run Locally
```bash
vercel dev
```

### Test Endpoints
```bash
# Health check
curl http://localhost:3000/api/health

# Test API
curl http://localhost:3000/api/submissions
```

---

## 📝 Next Steps

1. ✅ **Deploy** to Vercel
2. ✅ **Set** environment variables
3. ✅ **Test** API endpoints
4. ✅ **Monitor** performance
5. ✅ **Optimize** if needed

---

## 🐛 Troubleshooting

### Database Errors
- Ensure `/tmp` is writable (it is by default)
- Database created automatically on first request

### CORS Errors
- Serverless handler allows all origins by default
- Check `CORS_ORIGIN` if needed

### Function Timeout
- Increase `maxDuration` in `vercel.json`
- Optimize app initialization

### Build Errors
- Check `buildCommand` in `vercel.json`
- Ensure all packages build successfully

---

**Ready to deploy!** 🚀

Follow `VERCEL_FULLSTACK_SETUP.md` for detailed deployment instructions.

