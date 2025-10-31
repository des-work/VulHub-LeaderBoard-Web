# 🚀 Quick Start Guide for Team Members

**Time Required:** 10 minutes  
**Goal:** Get VulHub running locally and test all features

---

## Prerequisites Checklist

Before starting, ensure you have:
- ✅ **Node.js 18+** installed ([Download](https://nodejs.org/))
- ✅ **pnpm** installed (`npm install -g pnpm`)
- ✅ **Git** installed
- ✅ **PostgreSQL 14+** running locally OR Docker Desktop installed

---

## Step-by-Step Setup (10 Minutes)

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/des-work/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web

# Install all dependencies
pnpm install
```

**Expected Output:** All packages install without errors

---

### Step 2: Set Up Environment Variables (2 minutes)

**Frontend Configuration:**

```bash
# Copy the example file
cp apps/web/.env.local.example apps/web/.env.local
```

The file is already configured for local development:
```
NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
NODE_ENV=development
```

**Backend Configuration:**

```bash
# Copy the example file
cp apps/api/.env.example apps/api/.env
```

**Update the database connection** in `apps/api/.env`:

**Option A: Using Local PostgreSQL**
```bash
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/vulhub
```

**Option B: Using Docker Compose (Recommended)**
```bash
# This is already set correctly in the example
DATABASE_URL=postgresql://vulhub:vulhub123@localhost:5433/vulhub_dev
```

---

### Step 3: Start Database Services (2 minutes)

**If using Docker Compose:**

```bash
# Start PostgreSQL and Redis
pnpm dev:stack

# Wait 10-15 seconds for services to start
# Verify they're running:
docker ps
```

You should see containers for:
- `vulhub-postgres-dev` (port 5433)
- `vulhub-redis-dev` (port 6380)

**If using Local PostgreSQL:**

Make sure PostgreSQL is running and create the database:
```bash
createdb vulhub
# Or via psql:
psql -U postgres
CREATE DATABASE vulhub;
\q
```

---

### Step 4: Set Up Database Schema (2 minutes)

```bash
# Navigate to API directory
cd apps/api

# Generate Prisma client
pnpm prisma generate

# Run migrations to create tables
pnpm prisma db push

# Seed database with test data
pnpm db:seed

# Return to root
cd ../..
```

**Expected Output:**
```
✔ Prisma schema loaded
✔ Your database is now in sync
✔ Database seeded successfully
```

**What this creates:**
- All database tables (users, projects, submissions, badges, etc.)
- Test users (you can login with `admin@example.com` / `password123`)
- Sample challenges/projects
- Initial badges
- Sample leaderboard data

---

### Step 5: Start Development Servers (2 minutes)

**From the project root:**

```bash
# Start both frontend and API
pnpm dev
```

This will start:
- **Frontend**: http://localhost:3010
- **API**: http://localhost:4010/api/v1

**Expected Output:**
```
✓ Frontend ready at http://localhost:3010
✓ API ready at http://localhost:4010/api/v1
```

**Keep this terminal open** - it shows logs from both services.

---

### Step 6: Verify Everything Works

**1. Check API Health:**
```bash
# In a new terminal
curl http://localhost:4010/api/v1/health
```

Should return:
```json
{"status":"ok","info":{"api":{"status":"up","message":"API is running"}}}
```

**2. Open Frontend:**
- Go to: http://localhost:3010
- You should see the login page

**3. Test Login:**
- Email: `admin@example.com`
- Password: `password123`
- Click "Login"
- Should redirect to dashboard with leaderboard

**4. Quick Feature Test:**
- ✅ Dashboard loads with top 15 users
- ✅ Click "COMMUNITY" → Terminal interface works
- ✅ Click "BADGES" → Badges display
- ✅ Click "PROFILE" → Your profile shows
- ✅ All navigation works

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution:**
1. Verify PostgreSQL is running:
   ```bash
   # Docker
   docker ps | grep postgres
   
   # Local
   psql -U postgres -c "SELECT 1"
   ```

2. Check DATABASE_URL in `apps/api/.env` is correct

3. Try restarting database:
   ```bash
   # Docker
   pnpm dev:stack:down
   pnpm dev:stack
   
   # Then re-run migrations
   cd apps/api && pnpm prisma db push
   ```

### Issue: "Port 3010 already in use"

**Solution:**
1. Find what's using the port:
   ```bash
   # macOS/Linux
   lsof -i :3010
   
   # Windows
   netstat -ano | findstr :3010
   ```

2. Kill the process or change port in `apps/web/.env.local`:
   ```
   PORT=3011  # Add this line
   ```

### Issue: "API not reachable"

**Solution:**
1. Check API is running (look at terminal output)

2. Verify `NEXT_PUBLIC_API_URL` in `apps/web/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:4010/api/v1
   ```

3. Test API directly:
   ```bash
   curl http://localhost:4010/api/v1/health
   ```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules apps/*/node_modules
pnpm install
```

### Issue: Database migrations fail

**Solution:**
```bash
# Reset database (Docker)
pnpm dev:stack:down
pnpm dev:stack

# Then re-run
cd apps/api
pnpm prisma db push
pnpm db:seed
```

---

## Next Steps

Once everything is running:

1. **Read the README.md** for detailed feature descriptions
2. **Run the testing checklist** from README (Section 7)
3. **Explore the codebase**:
   - Frontend: `apps/web/src/`
   - Backend: `apps/api/src/`
   - Database schema: `apps/api/prisma/schema.prisma`

4. **Test all features**:
   - Login/logout
   - View leaderboard
   - Browse challenges
   - Check badges
   - Navigate all pages

---

## Helpful Commands

```bash
# View database (Prisma Studio)
cd apps/api && pnpm prisma studio
# Opens at http://localhost:5555

# View API logs
# (Check the terminal where you ran pnpm dev)

# View Docker logs
docker-compose -f docker-compose.dev.yml logs -f

# Stop everything
# Ctrl+C in terminal running pnpm dev
pnpm dev:stack:down  # Stops Docker services
```

---

## Test Credentials

After seeding the database, you can login with:

- **Admin User:**
  - Email: `admin@example.com`
  - Password: `password123`

- **Student Users:**
  - Email: `student1@example.com`
  - Password: `password123`
  - (Multiple test users are created)

---

## Success! 🎉

You should now have:
- ✅ Frontend running at http://localhost:3010
- ✅ API running at http://localhost:4010/api/v1
- ✅ Database with test data
- ✅ Can login and use all features

**Ready to test and develop!** 🚀

---

## Still Having Issues?

1. Check the main **README.md** troubleshooting section
2. Review error messages in terminal
3. Check browser DevTools (F12) for frontend errors
4. Verify all prerequisites are installed correctly
5. Create an issue on GitHub with error details

