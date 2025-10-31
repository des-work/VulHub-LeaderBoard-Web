# 🚀 Local Development Setup (No Docker API/Web)

**Strategy:** Run API and Web locally, use Docker only for PostgreSQL and Redis  
**Why:** Faster development, easier debugging, avoids Docker workspace issues  
**Status:** ✅ Recommended approach for development and testing

---

## 📋 Prerequisites

✅ Docker Desktop running (for PostgreSQL and Redis only)  
✅ Node.js 18+ installed  
✅ pnpm installed  
✅ Dependencies installed (`pnpm install`)

---

## 🎯 Quick Start

### Step 1: Start Database & Redis (Docker)

```bash
# These containers work perfectly!
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev

# Verify they're running
docker ps | grep vulhub
```

**Expected output:**
- `vulhub-postgres-dev` - healthy (port 5433)
- `vulhub-redis-dev` - healthy (port 6380)

---

### Step 2: Start API (Local Node.js)

Open **Terminal 1** (PowerShell):

```powershell
# Set environment variables
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_HOST="localhost"
$env:REDIS_PORT="6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4010"
$env:CORS_ORIGIN="http://localhost:3010"
$env:NODE_ENV="development"

# Navigate to API
cd apps/api

# Start API
pnpm dev
```

**Wait for output:**
```
🚀 Application is running on: http://localhost:4010
📚 API Documentation: http://localhost:4010/api/docs
```

---

### Step 3: Verify API is Working

Open **Terminal 2**:

```bash
# Test health endpoint
curl http://localhost:4010/api/v1/health

# Should return:
# {"status":"ok","timestamp":"...","services":{...}}

# Test login
curl -X POST http://localhost:4010/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"schoolId\":\"admin\",\"password\":\"admin123\"}"
```

**Open browser:**
- API Docs: http://localhost:4010/api/docs
- Health Check: http://localhost:4010/api/v1/health

---

### Step 4: Configure Frontend

Create/edit `apps/web/.env.local`:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false

# WebSocket (if needed)
NEXT_PUBLIC_WS_URL=ws://localhost:4010
```

---

### Step 5: Start Frontend (Local Next.js)

Open **Terminal 3**:

```bash
cd apps/web
pnpm dev
```

**Wait for output:**
```
- ready started server on 0.0.0.0:3010
- Local: http://localhost:3010
```

---

## ✅ Verification Checklist

Once everything is running:

- [ ] PostgreSQL healthy: `docker ps | grep postgres`
- [ ] Redis healthy: `docker ps | grep redis`
- [ ] API responding: `curl http://localhost:4010/api/v1/health`
- [ ] API docs accessible: http://localhost:4010/api/docs
- [ ] Frontend loaded: http://localhost:3010
- [ ] Frontend can login (try admin/admin123)

---

## 🔧 Troubleshooting

### API won't start

**Check database connection:**
```bash
docker exec -it vulhub-postgres-dev psql -U vulhub -d vulhub_dev -c "SELECT 1;"
```

**Check if port 4010 is in use:**
```bash
netstat -ano | findstr :4010  # Windows
lsof -i :4010                 # Mac/Linux
```

**Check API logs:**
API runs in foreground - check Terminal 1 for errors

### Frontend can't connect to API

**Check CORS:**
Make sure `CORS_ORIGIN` includes your frontend URL

**Check API is running:**
```bash
curl http://localhost:4010/api/v1/health
```

**Check environment variables:**
```bash
# In apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false
```

### Database connection errors

**Reset database:**
```bash
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d postgres-dev redis-dev
pnpm db:dev:migrate
pnpm db:dev:seed
```

---

## 📊 Service Architecture

```
┌─────────────────┐
│  Frontend       │
│  localhost:3010 │
│  (Next.js)      │
└────────┬────────┘
         │ HTTP
         ↓
┌─────────────────┐
│  API            │
│  localhost:4010 │
│  (NestJS)       │
└────┬──────┬─────┘
     │      │
     │      ↓
     │  ┌─────────────┐
     │  │  Redis      │
     │  │  :6380      │
     │  │  (Docker)   │
     │  └─────────────┘
     ↓
┌─────────────┐
│ PostgreSQL  │
│ :5433       │
│ (Docker)    │
└─────────────┘
```

---

## 🚀 Production Deployment Options

When ready for production, you have options:

### Option A: Managed Services (Recommended)
- **Database:** AWS RDS, Azure Database, or DigitalOcean Managed DB
- **Cache:** AWS ElastiCache, Azure Redis Cache
- **API:** Deploy to Vercel, Railway, Render, or any Node.js host
- **Frontend:** Vercel, Netlify, or CloudFlare Pages

### Option B: VPS/VM
- Deploy API as systemd service
- Deploy frontend as systemd service
- Use managed database services
- Nginx as reverse proxy

### Option C: Docker (Fix Later)
- Fix Docker workspace issues
- Use docker-compose.yml for production
- Deploy to AWS ECS, Azure Container Instances, or DigitalOcean App Platform

---

## 💡 Why This Approach Works

1. **Faster Development**
   - No container rebuild times
   - Instant hot reload
   - Direct log access

2. **Easier Debugging**
   - Chrome DevTools for Node.js
   - Direct filesystem access
   - Simpler environment variable management

3. **Production Flexibility**
   - Can deploy anywhere Node.js runs
   - Can use managed services for databases
   - Not locked into Docker

4. **Matches Modern Practices**
   - Vercel, Netlify don't use Docker
   - Most production setups use managed databases
   - Serverless and edge deployments don't need containers

---

## 📝 Environment Variables Reference

### API Environment Variables
```bash
DATABASE_URL=postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public
REDIS_HOST=localhost
REDIS_PORT=6380
JWT_SECRET=dev-jwt-secret-key-change-in-production
JWT_REFRESH_SECRET=dev-refresh-secret-key-change-in-production
PORT=4010
CORS_ORIGIN=http://localhost:3010
NODE_ENV=development
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NEXT_PUBLIC_USE_MOCK_AUTH=false
NEXT_PUBLIC_WS_URL=ws://localhost:4010
```

---

## ⏱️ Startup Time Comparison

| Approach | Time | Hot Reload |
|----------|------|------------|
| **Local** | ~10s | ✅ Instant |
| Docker | ~2-3 min | ⚠️ Slow |

---

**Last Updated:** October 31, 2025  
**Recommended:** Use this approach for all development and testing  
**Next:** Fix Docker for production deployment OR use managed services

