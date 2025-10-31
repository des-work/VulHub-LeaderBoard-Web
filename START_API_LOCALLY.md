# 🚀 Start API Locally - Phase 1 Workaround

**Issue:** Docker API container has dependency issues  
**Solution:** Run API locally, connect to Docker database

---

## ✅ Current Status

- ✅ PostgreSQL (Docker): Running on port 5433
- ✅ Redis (Docker): Running on port 6380
- ✅ Database: Migrated and seeded (16 users)
- 🔄 API: Starting locally on port 4000

---

## 🛠️ To Run API Locally

### Option 1: Set Environment Variables in Terminal

```bash
# Windows PowerShell
$env:DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev?schema=public"
$env:REDIS_URL="redis://localhost:6380"
$env:JWT_SECRET="dev-jwt-secret-key-change-in-production"
$env:JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
$env:PORT="4000"
$env:CORS_ORIGIN="http://localhost:4010,http://localhost:3000"

# Navigate to API
cd apps/api

# Generate Prisma client (if needed)
pnpm prisma:generate

# Start API
pnpm dev
```

### Option 2: Create .env File (Blocked by gitignore)

The `.env.local` file is blocked by gitignore. Instead, create environment variables manually or use a tool like `dotenv-cli`.

---

## ✅ Verification

Once API is running:

1. **Health Check:**
   ```bash
   curl http://localhost:4000/api/v1/health
   ```

2. **API Docs:**
   Open: http://localhost:4000/api/docs

3. **Test Login:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d "{\"schoolId\":\"admin\",\"password\":\"admin123\"}"
   ```

---

## 📝 Note

This is a development workaround. The Docker container issue should be fixed for production, but for Phase 1 testing, running locally is fine.

