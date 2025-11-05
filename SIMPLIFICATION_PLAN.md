# VulHub True Simplification Plan

**Problem**: Monorepo structure is causing deployment friction on Vercel. We've been trying to fix config, but the real issue is architectural.

**Goal**: Deploy successfully to Vercel with zero deployment headaches.

**Constraint**: We want to keep local dev simple and not fragment the codebase across 10 repos.

---

## PHASE 1: Assess Reality (Current State)

### What Works
- ✅ **Frontend (Next.js)** builds locally: `npm run build:web`
- ✅ **Backend (NestJS)** builds locally: `npm run build:api`
- ✅ **Local dev works**: `npm run dev:local` runs both
- ✅ **Shared code exists** in `apps/api/src/shared` (schemas, utils)
- ✅ **Database**: SQLite, no external services needed

### What Doesn't Work
- ❌ **Vercel deployment fails** on monorepo (auto-detects wrong framework, wrong context)
- ❌ **Multi-build config in vercel.json** is fragile and unpredictable
- ❌ **Publishing @vulhub/shared to npm** adds overhead
- ❌ **Splitting into 3 repos** = 3x the overhead (CI, deployment config, sync issues)

### The Root Issue
**Vercel doesn't love monorepos.** It's designed for single-app repos. Every workaround we've tried (builds array, custom buildCommand, outputDirectory) is fighting Vercel's assumptions.

---

## PHASE 2: Define Goals

### What Do We Actually Need?

1. **Frontend deployed to Vercel** ✅ (the main product)
2. **API available** (can be deployed anywhere, doesn't have to be Vercel)
3. **Local dev is simple** (one command to start everything)
4. **Shared code isn't duplicated** (schemas, utils)
5. **Easy to maintain** (changes in one place, work everywhere)

### Key Insight
We DON'T need monorepo benefits (parallel builds, workspaces, turbo caching). We need:
- **One simple deployment** (frontend to Vercel)
- **Local dev in one place** (already working)
- **Shared code accessible** (already in `apps/api/src/shared`)

---

## PHASE 3: Solution Options (Ranked by Simplicity)

### Option A: "Frontend-First" (RECOMMENDED) ⭐⭐⭐⭐⭐
**Deploy frontend to Vercel. API elsewhere or local.**

**How It Works**:
1. Convert `apps/web` to a standalone repo (or keep it in monorepo, deploy only web to Vercel).
2. Frontend points to API via environment variable (e.g., `NEXT_PUBLIC_API_URL=https://api.example.com` or `http://localhost:3000`).
3. Backend deployed separately (Railway, Render, etc.) or run locally in development.

**Pros**:
- ✅ Vercel auto-detects Next.js, builds in seconds
- ✅ Zero Vercel config needed (maybe just `vercel.json` = `{}`)
- ✅ Backend deployed independently (scales better, easier to update)
- ✅ Local dev unchanged (`npm run dev:local` still works)
- ✅ Simplest path to production

**Cons**:
- ⚠️ Backend not on Vercel (but that's actually fine—Railway is free tier, fast, supports NestJS)

**Timeline**: Deploy frontend in ~15 mins, backend separately.

---

### Option B: "Full-Stack on Vercel" (COMPLEX) ⭐⭐
**Keep monorepo, deploy both to Vercel.**

**How It Works**:
1. Use `vercel.json` with `builds` array (multiple builders).
2. Configure routes to split `/api/*` → backend, `/*` → frontend.
3. Vercel treats each as a separate build and deploys as functions.

**Pros**:
- ✅ Everything in one deploy
- ✅ No multi-host complexity

**Cons**:
- ❌ Vercel config is fragile (we've already spent hours on this)
- ❌ Monorepo detection still causes issues
- ❌ NestJS on Vercel Serverless is slower (cold starts, less suitable than Railway)
- ❌ Not recommended for NestJS (better on traditional servers)

**Timeline**: 2-3 more hours of troubleshooting, risk of still failing.

---

### Option C: "Micro Monorepo" (MODERATE) ⭐⭐⭐
**Simplify monorepo: frontend only in repo, backend in separate focused repo.**

**How It Works**:
1. Delete `apps/api` from main repo, keep only `apps/web`.
2. Create separate `vulhub-backend` repo with just the NestJS app.
3. Local dev: clone both, start both in separate terminals (or use a simple script).

**Pros**:
- ✅ Frontend repo is clean (Vercel auto-detects, zero config)
- ✅ Backend repo is focused (easier to maintain)
- ✅ No npm package publishing overhead
- ✅ Shared code: duplicate it (small, not a big deal) or keep in a simple folder reference

**Cons**:
- ⚠️ Two repos to manage
- ⚠️ Shared code needs a sync strategy (duplication or git submodule)

**Timeline**: ~1-2 hours to split cleanly, then deploy each separately.

---

## PHASE 4: Recommendation

### **Go with Option A: "Frontend-First"** 🚀

**Why**:
1. **Fastest to deploy**: Frontend to Vercel today, API tomorrow.
2. **Simplest architecture**: Each app does one job, deployed appropriately.
3. **Local dev unchanged**: `npm run dev:local` keeps working.
4. **Most reliable**: Vercel + Next.js is battle-tested. Railway + NestJS is battle-tested. Combination is rock solid.
5. **Scales better**: Backend can autoscale independently on Railway.

### Concrete Steps (Option A)

#### Step 1: Prepare Frontend (5 mins)
1. Create a simple `vercel.json`:
   ```json
   {
     "version": 2
   }
   ```
2. Ensure `.vercelignore` excludes `apps/api`, build artifacts, etc.
3. Update `NEXT_PUBLIC_API_URL` to point to backend (e.g., `http://localhost:3000` for local, `https://api.vulhub.example.com` for production).

#### Step 2: Push Frontend to Vercel (5 mins)
1. Link GitHub repo to Vercel.
2. Set Root Directory to `/` (Vercel will find Next.js at `apps/web`).
3. Or, extract `apps/web` to a separate repo and deploy from there.

#### Step 3: Deploy Backend Separately (10 mins)
1. Move `apps/api` to a new repo: `vulhub-backend`.
2. Deploy to Railway (free tier, good for NestJS).
3. Set environment variables (DATABASE_URL, JWT_SECRET, etc.).

#### Step 4: Connect Frontend → Backend (2 mins)
1. In Vercel project settings, set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
2. Redeploy frontend.

**Total Time to Deploy**: ~30 mins, zero monorepo config headaches.

---

## PHASE 5: Local Development (Unchanged)

Users still run:
```bash
npm run dev:local
# Starts both apps locally:
# - Frontend on http://localhost:3000
# - API on http://localhost:3001
```

---

## Decision Point

**Which option appeals to you?**

- **Option A (Recommended)**: Fast, simple, proven. Frontend to Vercel, backend to Railway. Start now.
- **Option B**: Stay in Vercel monorepo mode. More troubleshooting ahead.
- **Option C**: Clean split, two focused repos. Moderate effort, good long-term structure.

---

## Next Steps

Once you decide:
1. I'll execute the plan with zero ambiguity.
2. No more loops, no more "maybe this will work."
3. Just concrete, tested steps.

**Which option do you want to pursue?**

