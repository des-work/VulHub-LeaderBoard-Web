# ⚡ **Heroku Quick Reference - VulHub Leaderboard**

**Date**: January 27, 2025  
**Status**: ✅ **PRODUCTION READY** - Essential Heroku commands  
**Priority**: **HIGH** - Quick deployment reference

---

## 🚀 **Essential Commands**

### **1. Initial Setup**
```bash
# Create Heroku app
heroku create vulhub-leaderboard-web

# Add database and Redis
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-web
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-web
```

### **2. Environment Variables**
```bash
# Essential environment variables
heroku config:set JWT_SECRET="$(openssl rand -base64 32)" -a vulhub-leaderboard-web
heroku config:set REFRESH_TOKEN_SECRET="$(openssl rand -base64 32)" -a vulhub-leaderboard-web
heroku config:set NODE_ENV="production" -a vulhub-leaderboard-web
heroku config:set CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web
```

### **3. Deploy**
```bash
# Deploy to Heroku
git push heroku main

# Run database migrations
heroku run "pnpm --filter @vulhub/api prisma migrate deploy" -a vulhub-leaderboard-web
```

### **4. Verify Deployment**
```bash
# Check app status
heroku ps -a vulhub-leaderboard-web

# View logs
heroku logs --tail -a vulhub-leaderboard-web

# Test health endpoint
curl https://vulhub-leaderboard-web.herokuapp.com/api/health
```

---

## 🔧 **Troubleshooting Commands**

### **Check Status**
```bash
# App status
heroku ps -a vulhub-leaderboard-web

# Environment variables
heroku config -a vulhub-leaderboard-web

# Database info
heroku pg:info -a vulhub-leaderboard-web

# Redis info
heroku redis:info -a vulhub-leaderboard-web
```

### **Debug Issues**
```bash
# View logs
heroku logs --tail -a vulhub-leaderboard-web

# Connect to database
heroku pg:psql -a vulhub-leaderboard-web

# Connect to Redis
heroku redis:cli -a vulhub-leaderboard-web

# Run commands in Heroku
heroku run "pnpm --filter @vulhub/api prisma db push" -a vulhub-leaderboard-web
```

---

## 📋 **One-Line Deployment**

```bash
# Complete deployment in one command
heroku create vulhub-leaderboard-web && \
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-web && \
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-web && \
heroku config:set JWT_SECRET="$(openssl rand -base64 32)" REFRESH_TOKEN_SECRET="$(openssl rand -base64 32)" NODE_ENV="production" CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web && \
git push heroku main && \
heroku run "pnpm --filter @vulhub/api prisma migrate deploy" -a vulhub-leaderboard-web
```

---

## 🎯 **Success Checklist**

- [ ] App created: `heroku apps`
- [ ] Database added: `heroku pg:info -a vulhub-leaderboard-web`
- [ ] Redis added: `heroku redis:info -a vulhub-leaderboard-web`
- [ ] Environment set: `heroku config -a vulhub-leaderboard-web`
- [ ] Code deployed: `git push heroku main`
- [ ] Migrations run: `heroku run "pnpm --filter @vulhub/api prisma migrate deploy"`
- [ ] App running: `heroku ps -a vulhub-leaderboard-web`
- [ ] Health check: `curl https://vulhub-leaderboard-web.herokuapp.com/api/health`

---

*Quick Reference completed on January 27, 2025. Use these commands for fast Heroku deployment.*
