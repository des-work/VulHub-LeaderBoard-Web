# 🔧 API Container Fix - Phase 1 Task 1.1

**Issue:** API container is failing with `npm error could not determine executable to run` when trying to run `npx nest start --watch`

**Root Cause:** The @nestjs/cli package might not be installed properly in the container, or node_modules might be missing.

---

## 🔍 Diagnosis

**Current Status:**
- ✅ PostgreSQL: Healthy
- ✅ Redis: Healthy  
- ✅ Database: Migrated and seeded (16 users)
- ❌ API: Failing to start

**Error in Logs:**
```
npm error could not determine executable to run
> @vulhub/api@1.0.0 dev /usr/src/app/apps/api
> npx nest start --watch
```

---

## 🛠️ Solution Options

### Option 1: Rebuild API Container (Recommended)

This will rebuild the container with fresh dependencies:

```bash
# Stop and remove API container
docker-compose -f docker-compose.dev.yml stop api-dev
docker-compose -f docker-compose.dev.yml rm -f api-dev

# Rebuild and start
docker-compose -f docker-compose.dev.yml up -d --build api-dev

# Check logs
docker-compose -f docker-compose.dev.yml logs -f api-dev
```

### Option 2: Install Dependencies in Container

Enter the container and manually install dependencies:

```bash
# Enter API container
docker exec -it vulhub-api-dev sh

# Inside container:
cd /usr/src/app
pnpm install

# Exit and restart
exit
docker-compose -f docker-compose.dev.yml restart api-dev
```

### Option 3: Run API Locally (Quick Fix)

Run the API outside Docker while using Docker database:

```bash
# Set environment variables
export DATABASE_URL="postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev"
export REDIS_URL="redis://localhost:6380"
export JWT_SECRET="dev-jwt-secret-key-change-in-production"
export JWT_REFRESH_SECRET="dev-refresh-secret-key-change-in-production"
export PORT=4000

# Navigate to API directory
cd apps/api

# Install dependencies (if not done)
pnpm install

# Generate Prisma client
pnpm prisma:generate

# Start API
pnpm dev
```

The API will connect to the Docker database and Redis, and run on `http://localhost:4000`.

---

## ✅ Verification Steps

After fixing, verify:

1. **API Health Check:**
   ```bash
   curl http://localhost:4000/api/v1/health
   ```
   Should return JSON with status "ok"

2. **API Documentation:**
   - Open: http://localhost:4000/api/docs
   - Should show Swagger UI

3. **Test Login:**
   ```bash
   curl -X POST http://localhost:4000/api/v1/auth/login \
     -H "Content-Type: application/json" \
     -d '{"schoolId":"admin","password":"admin123"}'
   ```

4. **Check Logs:**
   ```bash
   # If using Docker:
   docker-compose -f docker-compose.dev.yml logs -f api-dev
   
   # If running locally:
   # Check terminal where pnpm dev is running
   ```

---

## 📝 Next Steps After Fix

Once API is running:
1. ✅ Task 1.1 complete
2. → Proceed to Task 1.2: Connect Frontend to Backend
3. → Begin integration testing

---

**Recommended:** Try Option 1 (rebuild) first, as it's the cleanest solution.

