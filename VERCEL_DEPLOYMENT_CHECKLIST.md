# ✅ VERCEL DEPLOYMENT CHECKLIST

**Quick reference for deploying to Vercel**

---

## 📋 PRE-DEPLOYMENT

### Code Preparation
- [ ] Run `npm run type-check` - No TypeScript errors
- [ ] Run `npm run lint` - No linting errors
- [ ] Run `npm run build` - Build succeeds locally
- [ ] Test locally: `npm run dev:local` works
- [ ] All changes committed to git
- [ ] Pushed to GitHub main branch

### Configuration Review
- [ ] `vercel.json` is valid and minimal
- [ ] `.vercelignore` excludes unnecessary files
- [ ] `package.json` has correct scripts
- [ ] `package.json` has `"engines": { "node": ">=18.0.0" }`

### Database
- [ ] Database migrations in `apps/api/prisma/migrations/`
- [ ] `schema.prisma` is up to date
- [ ] All models defined correctly

### Environment Variables
- [ ] Generated JWT_SECRET (32 chars minimum)
- [ ] Generated JWT_REFRESH_SECRET (32 chars minimum)
- [ ] Know your Vercel domain name
- [ ] Have CORS_ORIGIN value ready

---

## 🚀 INITIAL DEPLOYMENT (First Time)

### Step 1: Vercel Setup
- [ ] Create account at https://vercel.com
- [ ] Connect GitHub repository
- [ ] Authorize Vercel access

### Step 2: Create Project
- [ ] Click "New Project"
- [ ] Select VulHub repository
- [ ] Framework Preset: Auto-detect (should find Next.js)
- [ ] Root Directory: `/` (leave empty)
- [ ] Build Command: Auto-detect
- [ ] Output Directory: Auto-detect

### Step 3: Environment Variables
**In Vercel Dashboard → Settings → Environment Variables:**

Add for **Production**:
```
NODE_ENV = production
DATABASE_URL = file:/tmp/vulhub.db
JWT_SECRET = <your-32-char-secret>
JWT_REFRESH_SECRET = <your-32-char-secret>
NEXT_PUBLIC_API_URL = https://your-project.vercel.app/api
CORS_ORIGIN = https://your-project.vercel.app
JWT_EXPIRES_IN = 15m
JWT_REFRESH_EXPIRES_IN = 7d
```

Add for **Preview**:
```
NODE_ENV = preview
DATABASE_URL = file:/tmp/vulhub-preview.db
NEXT_PUBLIC_USE_MOCK_AUTH = true
```

### Step 4: Deploy
- [ ] Click "Deploy" button
- [ ] Wait for build to complete (~2-3 minutes)
- [ ] Verify build succeeded (green checkmark)
- [ ] Click domain link when ready

### Step 5: Verify Live App
- [ ] Visit https://your-project.vercel.app
- [ ] Page loads without errors
- [ ] Can login (use test credentials)
- [ ] Leaderboard displays
- [ ] Can submit a project
- [ ] Badges visible
- [ ] No 404 errors in console

---

## 🔄 SUBSEQUENT DEPLOYMENTS

### For Each Update
```bash
# 1. Make changes locally
git add .
git commit -m "Your message"

# 2. Push to main
git push origin main

# 3. Vercel auto-deploys
# Check dashboard for progress
```

---

## 🔐 GENERATE SECRETS

### Generate JWT_SECRET (Unix/Mac/Linux):
```bash
openssl rand -hex 32
# Output: a1b2c3d4e5f6... (64 chars, 32 bytes)
```

### Generate JWT_SECRET (Windows):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🛠️ TROUBLESHOOTING

### Build Fails: "Cannot find module"
```
❌ Error in build logs
✅ Solution:
   1. Check node_modules locally: npm run build
   2. Push clean repo to GitHub
   3. Redeploy on Vercel
```

### Build Fails: "Database connection error"
```
❌ Error: Cannot connect to SQLite
✅ Solution:
   1. Check DATABASE_URL = file:/tmp/vulhub.db
   2. Verify in Vercel env vars
   3. Check migrations run
```

### 404 API Errors
```
❌ Error: GET /api/v1/... returns 404
✅ Solution:
   1. Check NEXT_PUBLIC_API_URL is correct
   2. Check API routes configured
   3. Check CORS_ORIGIN matches domain
```

### TypeScript Errors During Build
```
❌ Error: TS2322 Type mismatch
✅ Solution:
   1. Run locally: npm run type-check
   2. Fix errors
   3. Push and redeploy
```

### Database Data Lost
```
⚠️ Warning: SQLite data in /tmp is ephemeral
✅ Solution: Use PostgreSQL for persistent data
```

---

## 📊 MONITORING

### Check Deployment Status
1. Go to https://vercel.com/dashboard
2. Click your project
3. Click "Deployments"
4. Latest deployment shows status

### View Build Logs
1. Click deployment
2. Click "Logs" tab
3. Search for errors/warnings

### Check Performance
1. Click "Analytics" tab
2. View Core Web Vitals
3. Check response times

---

## 🔄 ROLLBACK

### Revert to Previous Deployment
1. Go to Vercel Dashboard
2. Click project → Deployments
3. Find previous deployment
4. Click "Redeploy"
5. Select production branch

---

## 📈 SCALING

### If Traffic Increases

**For Higher Performance:**
1. Switch from SQLite to PostgreSQL
2. Add caching layer (Redis)
3. Enable Vercel Analytics
4. Set up error tracking

**For Scaling Database:**
```env
# Switch from SQLite to PostgreSQL
DATABASE_URL = postgresql://user:pass@host:5432/db

# Then run:
pnpm prisma migrate deploy
```

---

## 🔒 SECURITY

### Regular Maintenance
- [ ] Rotate secrets every 6 months
- [ ] Monitor error logs
- [ ] Check for suspicious activity
- [ ] Keep dependencies updated

### Secret Rotation
1. Generate new JWT_SECRET
2. Update in Vercel dashboard
3. Redeploy
4. Old tokens will expire naturally

---

## 📞 COMMON COMMANDS

| Task | Command |
|------|---------|
| Test locally | `npm run dev:local` |
| Build for prod | `npm run build` |
| Check types | `npm run type-check` |
| Lint code | `npm run lint` |
| Push to deploy | `git push origin main` |

---

## ✨ POST-DEPLOYMENT

### Celebrate! 🎉
- [ ] App is live
- [ ] URL is shared
- [ ] Everything working
- [ ] Team notified

### Next Steps
- [ ] Share with users
- [ ] Gather feedback
- [ ] Monitor errors
- [ ] Plan improvements

---

## 📞 SUPPORT

### Vercel Documentation
- Docs: https://vercel.com/docs
- Status: https://www.vercel-status.com

### Common Issues
- Check https://vercel.com/docs/platform/frequently-asked-questions

---

**Status:** ✅ Ready to Deploy  
**Last Updated:** November 5, 2025  
**Version:** 1.0

