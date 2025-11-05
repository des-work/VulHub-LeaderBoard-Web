# ✅ Option A: Frontend-First Deployment Checklist

## Part 1: Frontend Deployment (Just Completed ✅)

- [x] Configured `vercel.json` for frontend-only build
- [x] Created `.vercelignore` to exclude backend
- [x] Fixed ESLint errors
- [x] Tested `npm run build:web` locally (passes)
- [x] Pushed to GitHub (`main` branch)
- [x] Vercel auto-deployment triggered

**Status**: Frontend code is live or deploying now. Check Vercel dashboard.

---

## Part 2: Backend Deployment (Next Steps - Follow This Checklist)

### Phase A: Create Backend Repository (15 mins)

- [ ] Create new directory: `~/Projects/vulhub-backend`
- [ ] Copy `apps/api` from monorepo to new directory
- [ ] Copy `prisma/` from monorepo to new directory
- [ ] Remove `src/shared` folder from backend (optional—shared code is in monorepo)
- [ ] Create `.gitignore` (ignore node_modules, .env, dist, etc.)
- [ ] Initialize git: `git init`
- [ ] Add and commit: `git add . && git commit -m "Initial backend commit"`

### Phase B: Push to GitHub (10 mins)

- [ ] Create new GitHub repo: `vulhub-backend` (public or private)
- [ ] Add remote: `git remote add origin https://github.com/YOUR_USERNAME/vulhub-backend.git`
- [ ] Rename branch: `git branch -M main`
- [ ] Push: `git push -u origin main`

### Phase C: Set Up Railway Account (5 mins)

- [ ] Go to https://railway.app
- [ ] Sign up (free account)
- [ ] Verify email

### Phase D: Deploy to Railway (10 mins)

- [ ] Click "New Project" on Railway dashboard
- [ ] Select "Deploy from GitHub"
- [ ] Select `vulhub-backend` repo
- [ ] Railway will auto-detect Node.js and build
- [ ] Wait for deployment to complete

### Phase E: Configure Railway Environment Variables (5 mins)

In Railway project dashboard, go to "Variables" and set:

```
DATABASE_URL=file:./prisma/prod.db
NODE_ENV=production
JWT_SECRET=GENERATE_RANDOM_STRING_HERE
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=GENERATE_RANDOM_STRING_HERE
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://YOUR_VERCEL_DOMAIN.vercel.app
```

- [ ] Copy your Railway domain (e.g., `https://your-app-production.up.railway.app`)
- [ ] Save/Deploy

### Phase F: Run Database Migrations (5 mins)

- [ ] Connect to Railway via SSH or CLI
- [ ] Run: `npm run prisma:deploy`
- [ ] Verify no errors

---

## Part 3: Connect Frontend to Backend (5 mins)

### Update Vercel Environment Variables

- [ ] Go to Vercel Dashboard → Your Project → Settings → Environment Variables
- [ ] Update `NEXT_PUBLIC_API_URL`:
  ```
  NEXT_PUBLIC_API_URL=https://YOUR_RAILWAY_DOMAIN/api/v1
  ```
- [ ] Save

### Redeploy Frontend

- [ ] Go to Vercel Dashboard → Deployments
- [ ] Click the three dots on latest deployment → "Redeploy"
- [ ] Wait for redeployment to complete

---

## Part 4: Verification & Testing (10 mins)

### Test Frontend
- [ ] Visit `https://YOUR_VERCEL_DOMAIN.vercel.app`
- [ ] Page loads without errors
- [ ] Check browser console (F12) for any errors

### Test API Connection
- [ ] Try logging in (username/password from seeded data)
- [ ] Check browser network tab (F12 → Network)
- [ ] Verify API calls go to Railway domain
- [ ] Verify responses are successful (200 status)

### Test Leaderboard
- [ ] Visit leaderboard page
- [ ] Verify data loads from backend
- [ ] No CORS errors in console

### Test Backend Health
- [ ] Curl: `curl https://YOUR_RAILWAY_DOMAIN/health`
- [ ] Should return: `{"status":"ok"}`

---

## Part 5: Local Development (Verify It Still Works)

- [ ] Run `npm run dev:local` from monorepo root
- [ ] Frontend loads on http://localhost:3000
- [ ] Backend runs on http://localhost:4000
- [ ] Login works with local backend
- [ ] Leaderboard loads data

---

## Done! 🚀

If all checkboxes are marked:
- ✅ Frontend is live on Vercel
- ✅ Backend is live on Railway
- ✅ They communicate with each other
- ✅ Local dev still works

**You have a fully deployed, production-ready app!**

---

## Troubleshooting Checklist

If something fails:

### Frontend Won't Build on Vercel
- [ ] Check Vercel logs (Deployments → Latest → Logs)
- [ ] Verify `vercel.json` is correct
- [ ] Verify `.vercelignore` excludes `apps/api`
- [ ] Rerun `npm run build:web` locally and fix any errors

### Backend Won't Deploy on Railway
- [ ] Check Railway logs (Project → Logs)
- [ ] Verify GitHub repo was pushed correctly
- [ ] Verify `package.json` has correct scripts
- [ ] Try deploying again (Railway sometimes needs a retry)

### Frontend Can't Call Backend API
- [ ] Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- [ ] Verify Railway domain is correct (no trailing slash)
- [ ] Check CORS errors in browser console
- [ ] Verify backend is running (check Railway logs)
- [ ] Curl the backend health endpoint manually

### CORS Errors
- [ ] Verify `CORS_ORIGIN` in Railway env vars matches Vercel domain
- [ ] Verify backend has `enableCors()` in main.ts
- [ ] Restart backend after changing env vars

### Database Errors
- [ ] Verify `DATABASE_URL` is set in Railway
- [ ] Verify migrations ran: `npm run prisma:deploy`
- [ ] Check Railway logs for migration errors

---

## Next: What's Next?

After deployment:
1. **Monitor**: Set up error tracking (Sentry, LogRocket, etc.)
2. **Scale**: Monitor performance; scale if needed
3. **Automate**: Set up CI/CD for both frontend and backend
4. **Backup**: Set up database backups
5. **Security**: Review environment variables, API secrets, etc.

---

## Questions?

Refer to these files for detailed info:
- `OPTION_A_DEPLOYMENT_GUIDE.md` - Full step-by-step guide
- `OPTION_A_SUMMARY.md` - High-level overview
- `SIMPLIFICATION_PLAN.md` - Why we chose Option A

---

**Good luck! You've got this! 🚀**

