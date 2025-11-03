# 🚀 Quick Heroku Deployment Guide

**Estimated Time: 20-30 minutes to launch**

## Prerequisites

- Heroku account (paid) - [Sign up](https://heroku.com)
- Heroku CLI - [Install](https://devcenter.heroku.com/articles/heroku-cli)
- Git repository ready
- Your code on GitHub or GitLab

---

## Step 1: Create Heroku App (5 min)

```bash
# Login to Heroku
heroku login

# Create production app
heroku create vulhub-leaderboard-api

# Create staging app (optional)
heroku create vulhub-leaderboard-api-staging
```

---

## Step 2: Add Database & Redis (3 min)

### PostgreSQL Database
```bash
# Production
heroku addons:create heroku-postgresql:standard-0 \
  -a vulhub-leaderboard-api

# Staging (optional)
heroku addons:create heroku-postgresql:standard-0 \
  -a vulhub-leaderboard-api-staging
```

### Redis Cache (Optional but Recommended)
```bash
# Production
heroku addons:create heroku-redis:premium-0 \
  -a vulhub-leaderboard-api

# Staging (optional)
heroku addons:create heroku-redis:premium-0 \
  -a vulhub-leaderboard-api-staging
```

---

## Step 3: Generate Secrets (2 min)

Generate secure 32-character random strings for JWT:

```bash
# Option 1: OpenSSL (Mac/Linux)
openssl rand -hex 32

# Option 2: Node.js (Windows/All)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Generate **TWO** different secrets and save them.

---

## Step 4: Set Environment Variables (5 min)

```bash
# Replace <values> with your actual values
heroku config:set \
  NODE_ENV=production \
  JWT_SECRET=<your-jwt-secret> \
  JWT_REFRESH_SECRET=<your-refresh-secret> \
  CORS_ORIGIN=https://your-vercel-app.vercel.app \
  -a vulhub-leaderboard-api
```

**List environment variables to verify:**
```bash
heroku config -a vulhub-leaderboard-api
```

---

## Step 5: Connect to Frontend (1 min)

In your Vercel frontend settings, add:

```env
NEXT_PUBLIC_API_URL=https://vulhub-leaderboard-api.herokuapp.com/api/v1
```

Replace `vulhub-leaderboard-api` with your actual app name.

---

## Step 6: Deploy (3 min)

### First-time Setup (Git Remote)
```bash
# Add Heroku as a Git remote
heroku git:remote -a vulhub-leaderboard-api

# Or manually:
git remote add heroku https://git.heroku.com/vulhub-leaderboard-api.git
```

### Deploy Code
```bash
# Deploy (pushes main branch)
git push heroku main

# If on different branch:
git push heroku your-branch:main

# View logs
heroku logs --tail -a vulhub-leaderboard-api
```

---

## Step 7: Run Database Migrations (2 min)

```bash
# Run Prisma migrations
heroku run "npx prisma migrate deploy" -a vulhub-leaderboard-api

# Seed data (optional)
heroku run "npx prisma db seed" -a vulhub-leaderboard-api
```

---

## Step 8: Verify Deployment (2 min)

```bash
# Check app is running
heroku ps -a vulhub-leaderboard-api

# Test health endpoint
curl https://vulhub-leaderboard-api.herokuapp.com/api/v1/health

# Should return:
# {"status":"healthy","info":{...}}
```

---

## ✅ You're Live!

Your application is now running at:

- **API:** `https://vulhub-leaderboard-api.herokuapp.com/api/v1`
- **Frontend:** `https://your-app.vercel.app`

---

## 🔧 Common Commands

### View Logs
```bash
heroku logs --tail -a vulhub-leaderboard-api
heroku logs --source app -a vulhub-leaderboard-api
heroku logs --source heroku -a vulhub-leaderboard-api
```

### Access Database
```bash
# Open PostgreSQL prompt
heroku pg:psql -a vulhub-leaderboard-api

# Get database info
heroku pg:info -a vulhub-leaderboard-api
```

### Restart App
```bash
heroku restart -a vulhub-leaderboard-api
```

### Update Secrets
```bash
heroku config:set JWT_SECRET=<new-secret> -a vulhub-leaderboard-api
```

### Scale Dynos
```bash
# View current
heroku ps -a vulhub-leaderboard-api

# Scale up
heroku ps:scale web=1 -a vulhub-leaderboard-api
```

---

## 🚨 Troubleshooting

### App Won't Start
```bash
# Check logs
heroku logs --tail -a vulhub-leaderboard-api

# Common issues:
# - Missing environment variables
# - Database not migrated
# - Build failed
```

### Database Connection Error
```bash
# Verify DATABASE_URL is set
heroku config -a vulhub-leaderboard-api | grep DATABASE_URL

# Check if migrations ran
heroku run "npx prisma migrate status" -a vulhub-leaderboard-api
```

### CORS Errors
```bash
# Verify CORS_ORIGIN matches frontend URL
heroku config -a vulhub-leaderboard-api | grep CORS_ORIGIN

# Should be: https://your-vercel-app.vercel.app (no trailing slash)
```

---

## 📊 Monitoring

### View Performance
```bash
# Open Heroku dashboard
heroku open -a vulhub-leaderboard-api
```

### Set Up Alerts
1. Go to [Heroku Dashboard](https://dashboard.heroku.com)
2. Select your app
3. Go to **Settings** → **Add-ons**
4. Add monitoring (New Relic, DataDog, etc.)

---

## 🔄 Future Deployments

After the first deployment, just push your code:

```bash
git push heroku main
```

Heroku will automatically:
1. Build your app
2. Run any migrations
3. Restart the app
4. Deploy new version

---

## 📚 Resources

- [Heroku Documentation](https://devcenter.heroku.com)
- [Deploying NestJS](https://devcenter.heroku.com/articles/deploying-nodejs-apps-on-heroku)
- [PostgreSQL Add-on](https://devcenter.heroku.com/articles/heroku-postgresql)
- [Environment Variables](https://devcenter.heroku.com/articles/config-vars)

---

**Your app is now production-ready! 🎉**
