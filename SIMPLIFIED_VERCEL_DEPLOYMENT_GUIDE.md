# 🚀 SIMPLIFIED VERCEL DEPLOYMENT GUIDE

**One-click deployment. That's it.**

---

## 📋 PREREQUISITES

- ✅ GitHub account with repository connected
- ✅ Vercel account (free, at vercel.com)
- ✅ SQLite database (included in deployment)
- ✅ File storage at `/public/uploads` (included)

---

## 🎯 3 SIMPLE STEPS

### STEP 1: Set Up Environment Variables on Vercel (2 minutes)

Go to your Vercel project → Settings → Environment Variables

Add these 5 variables for **Production**:

```
DATABASE_URL = file:./prisma/vulhub.db
JWT_SECRET = [generate with: openssl rand -hex 32]
JWT_REFRESH_SECRET = [generate with: openssl rand -hex 32]
CORS_ORIGIN = https://your-vercel-domain.vercel.app
NODE_ENV = production
```

**To generate secrets:**
```bash
openssl rand -hex 32
```

Run twice, copy each output into JWT_SECRET and JWT_REFRESH_SECRET.

### STEP 2: Deploy to Vercel (30 seconds)

1. Go to your Vercel project
2. Click **Deployments** tab
3. Click **Redeploy** on latest commit
4. Wait for build (60 seconds)
5. ✅ Done!

**Or** just `git push origin main` and Vercel auto-deploys

### STEP 3: Test It Works (2 minutes)

**Test login:**
```bash
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**Test health check:**
```bash
curl https://your-domain.vercel.app/api/health
```

---

## 📊 WHAT CHANGES

| Item | Before | After |
|------|--------|-------|
| **Database** | External PostgreSQL | SQLite (included) |
| **File Storage** | MINIO | /public/uploads |
| **Caching** | Redis | In-memory |
| **External Services** | 3+ | 0 |
| **Environment Variables** | 30+ | 5 |
| **Setup Time** | 2+ hours | 5 minutes |
| **Deployment** | Manual + CI/CD | Auto on git push |

---

## ✅ WHAT STILL WORKS

- ✅ User authentication
- ✅ Leaderboard rankings
- ✅ Badges system
- ✅ Project submissions
- ✅ File uploads
- ✅ All user features

---

## 🆘 TROUBLESHOOTING

### Build fails with "Cannot find module"
```
Solution: Clear build cache
1. Go to Settings → Advanced
2. Click "Clear build cache"
3. Redeploy
```

### "CORS error" or "API not responding"
```
Check CORS_ORIGIN variable matches your Vercel domain
Should be: https://your-project-name.vercel.app
```

### Database connection fails
```
Verify DATABASE_URL is set and correct:
  ✅ file:./prisma/vulhub.db (for SQLite)
  ✅ Must start with file: or postgresql://
```

### "Cannot find JWT_SECRET"
```
Make sure JWT_SECRET and JWT_REFRESH_SECRET are set
in Vercel Environment Variables (not just .env)
```

---

## 📞 SUPPORT

For Vercel-specific issues:
- Docs: https://vercel.com/docs
- Community: https://vercel.com/support

For app issues:
- Check logs in Vercel dashboard (Deployments → Logs)
- Check application errors in Function logs

---

## 🎉 THAT'S IT!

Your app is now deployed. No Docker, no Heroku, no external services.

Just `git push origin main` and it auto-deploys to Vercel.

**Deployment time: < 2 minutes**

