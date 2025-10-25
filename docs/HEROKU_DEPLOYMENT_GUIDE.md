# 🚀 **Heroku Deployment Guide - VulHub Leaderboard**

**Date**: January 27, 2025  
**Status**: ✅ **PRODUCTION READY** - Complete deployment guide  
**Priority**: **HIGH** - Step-by-step Heroku deployment instructions

---

## 📋 **Prerequisites**

Before deploying, ensure you have:
- [ ] Heroku account (free tier available)
- [ ] Heroku CLI installed (`heroku --version`)
- [ ] Git repository with all code committed
- [ ] Node.js 18+ and pnpm installed locally
- [ ] PostgreSQL database (Heroku Postgres addon)
- [ ] Redis instance (Heroku Redis addon)

---

## 🛠️ **Step 1: Heroku App Setup**

### **1.1 Create Heroku Apps**
```bash
# Create main web application
heroku create vulhub-leaderboard-web

# Create API application (if deploying separately)
heroku create vulhub-leaderboard-api

# Verify apps were created
heroku apps
```

### **1.2 Set Buildpacks**
```bash
# For the main app (handles both web and API)
heroku buildpacks:set heroku/nodejs -a vulhub-leaderboard-web

# Add pnpm support (if needed)
heroku buildpacks:add https://github.com/jontewks/pnpm-heroku-buildpack -a vulhub-leaderboard-web
```

---

## 🗄️ **Step 2: Database Setup**

### **2.1 Add PostgreSQL Addon**
```bash
# Add Heroku Postgres (free tier)
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-web

# Verify database
heroku pg:info -a vulhub-leaderboard-web
```

### **2.2 Get Database URL**
```bash
# Get the database URL
heroku config:get DATABASE_URL -a vulhub-leaderboard-web

# This will output something like:
# postgres://username:password@hostname:port/database
```

---

## 🔴 **Step 3: Redis Setup**

### **3.1 Add Redis Addon**
```bash
# Add Heroku Redis (free tier)
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-web

# Verify Redis
heroku redis:info -a vulhub-leaderboard-web
```

### **3.2 Get Redis URL**
```bash
# Get Redis URL
heroku config:get REDIS_URL -a vulhub-leaderboard-web

# This will output something like:
# redis://username:password@hostname:port
```

---

## ⚙️ **Step 4: Environment Variables**

### **4.1 Required Environment Variables**
```bash
# Database
heroku config:set DATABASE_URL="$(heroku config:get DATABASE_URL -a vulhub-leaderboard-web)" -a vulhub-leaderboard-web

# Redis
heroku config:set REDIS_URL="$(heroku config:get REDIS_URL -a vulhub-leaderboard-web)" -a vulhub-leaderboard-web

# JWT Configuration
heroku config:set JWT_SECRET="your-super-secret-jwt-key-here" -a vulhub-leaderboard-web
heroku config:set JWT_EXPIRES_IN="1h" -a vulhub-leaderboard-web
heroku config:set REFRESH_TOKEN_SECRET="your-super-secret-refresh-key-here" -a vulhub-leaderboard-web
heroku config:set REFRESH_TOKEN_EXPIRES_IN="7d" -a vulhub-leaderboard-web

# Application Configuration
heroku config:set NODE_ENV="production" -a vulhub-leaderboard-web
heroku config:set API_PORT="3001" -a vulhub-leaderboard-web
heroku config:set CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web

# Email Configuration (optional)
heroku config:set EMAIL_SERVICE_HOST="smtp.sendgrid.net" -a vulhub-leaderboard-web
heroku config:set EMAIL_SERVICE_PORT="587" -a vulhub-leaderboard-web
heroku config:set EMAIL_SERVICE_USER="apikey" -a vulhub-leaderboard-web
heroku config:set EMAIL_SERVICE_PASSWORD="your-sendgrid-api-key" -a vulhub-leaderboard-web
heroku config:set EMAIL_FROM="no-reply@vulhub.com" -a vulhub-leaderboard-web

# Storage Configuration (optional)
heroku config:set STORAGE_ACCESS_KEY="your-s3-access-key" -a vulhub-leaderboard-web
heroku config:set STORAGE_SECRET_KEY="your-s3-secret-key" -a vulhub-leaderboard-web
heroku config:set STORAGE_ENDPOINT="https://s3.amazonaws.com" -a vulhub-leaderboard-web
heroku config:set STORAGE_BUCKET="vulhub-evidence" -a vulhub-leaderboard-web
```

### **4.2 Verify Environment Variables**
```bash
# Check all environment variables
heroku config -a vulhub-leaderboard-web

# Should show all the variables you set above
```

---

## 📦 **Step 5: Package.json Configuration**

### **5.1 Update Root package.json**
```json
{
  "name": "vulhub-leaderboard",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "build": "turbo run build",
    "start": "pnpm --filter @vulhub/web start",
    "dev": "turbo run dev",
    "heroku-postbuild": "pnpm install && pnpm build"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  },
  "packageManager": "pnpm@8.10.0"
}
```

### **5.2 Create Procfile**
Create a `Procfile` in the root directory:
```
web: pnpm --filter @vulhub/web start
```

### **5.3 Update Web App package.json**
Ensure `apps/web/package.json` has:
```json
{
  "scripts": {
    "start": "next start -p $PORT",
    "build": "next build"
  }
}
```

---

## 🗃️ **Step 6: Database Migration**

### **6.1 Run Database Migrations**
```bash
# Connect to Heroku and run migrations
heroku run "pnpm --filter @vulhub/api prisma migrate deploy" -a vulhub-leaderboard-web

# Alternative: Run migrations locally with production database
DATABASE_URL="$(heroku config:get DATABASE_URL -a vulhub-leaderboard-web)" pnpm --filter @vulhub/api prisma migrate deploy
```

### **6.2 Seed Database (Optional)**
```bash
# Seed with sample data
heroku run "pnpm --filter @vulhub/api prisma db seed" -a vulhub-leaderboard-web
```

---

## 🚀 **Step 7: Deploy to Heroku**

### **7.1 Deploy Code**
```bash
# Add Heroku remote
heroku git:remote -a vulhub-leaderboard-web

# Deploy to Heroku
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### **7.2 Monitor Deployment**
```bash
# Watch deployment logs
heroku logs --tail -a vulhub-leaderboard-web

# Check app status
heroku ps -a vulhub-leaderboard-web
```

---

## 🔍 **Step 8: Post-Deployment Verification**

### **8.1 Health Checks**
```bash
# Check API health
curl https://vulhub-leaderboard-web.herokuapp.com/api/health

# Check web application
curl https://vulhub-leaderboard-web.herokuapp.com
```

### **8.2 Database Connection**
```bash
# Connect to database
heroku pg:psql -a vulhub-leaderboard-web

# Run some queries to verify
\dt
SELECT * FROM "User" LIMIT 5;
```

### **8.3 Redis Connection**
```bash
# Connect to Redis
heroku redis:cli -a vulhub-leaderboard-web

# Test Redis
ping
set test "Hello World"
get test
```

---

## 🛠️ **Step 9: Production Configuration**

### **9.1 Scale Dynos**
```bash
# Scale web dynos (free tier: 1 dyno)
heroku ps:scale web=1 -a vulhub-leaderboard-web

# Check dyno status
heroku ps -a vulhub-leaderboard-web
```

### **9.2 Configure Domains (Optional)**
```bash
# Add custom domain
heroku domains:add your-domain.com -a vulhub-leaderboard-web

# Configure SSL
heroku certs:auto:enable -a vulhub-leaderboard-web
```

---

## 📊 **Step 10: Monitoring & Maintenance**

### **10.1 Application Monitoring**
```bash
# View logs
heroku logs --tail -a vulhub-leaderboard-web

# View specific log types
heroku logs --tail --source app -a vulhub-leaderboard-web
heroku logs --tail --source heroku -a vulhub-leaderboard-web
```

### **10.2 Database Monitoring**
```bash
# Database stats
heroku pg:stats -a vulhub-leaderboard-web

# Database maintenance
heroku pg:maintenance -a vulhub-leaderboard-web
```

### **10.3 Redis Monitoring**
```bash
# Redis stats
heroku redis:info -a vulhub-leaderboard-web

# Redis memory usage
heroku redis:cli -a vulhub-leaderboard-web
INFO memory
```

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

#### **Build Failures**
```bash
# Check build logs
heroku logs --tail -a vulhub-leaderboard-web

# Common fixes:
# 1. Ensure all dependencies are in package.json
# 2. Check Node.js version compatibility
# 3. Verify pnpm is properly configured
```

#### **Database Connection Issues**
```bash
# Check database URL
heroku config:get DATABASE_URL -a vulhub-leaderboard-web

# Test connection
heroku run "pnpm --filter @vulhub/api prisma db push" -a vulhub-leaderboard-web
```

#### **Redis Connection Issues**
```bash
# Check Redis URL
heroku config:get REDIS_URL -a vulhub-leaderboard-web

# Test Redis connection
heroku run "node -e \"const redis = require('redis'); const client = redis.createClient(process.env.REDIS_URL); client.ping().then(() => console.log('Redis connected')).catch(console.error);\""
```

#### **Environment Variable Issues**
```bash
# List all environment variables
heroku config -a vulhub-leaderboard-web

# Set missing variables
heroku config:set VARIABLE_NAME="value" -a vulhub-leaderboard-web
```

---

## 📋 **Deployment Checklist**

### **Pre-Deployment**
- [ ] Heroku account created
- [ ] Heroku CLI installed
- [ ] Code committed to Git
- [ ] Environment variables configured
- [ ] Database and Redis addons added

### **Deployment**
- [ ] Heroku app created
- [ ] Buildpacks configured
- [ ] Code deployed successfully
- [ ] Database migrations run
- [ ] Health checks passing

### **Post-Deployment**
- [ ] Application accessible via URL
- [ ] Database connection working
- [ ] Redis connection working
- [ ] API endpoints responding
- [ ] Web application loading
- [ ] Authentication flow working

---

## 🎯 **Quick Deployment Commands**

### **One-Line Deployment**
```bash
# Complete deployment in one command
heroku create vulhub-leaderboard-web && \
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-web && \
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-web && \
heroku config:set JWT_SECRET="your-secret" JWT_EXPIRES_IN="1h" NODE_ENV="production" -a vulhub-leaderboard-web && \
git push heroku main
```

### **Environment Setup Script**
```bash
#!/bin/bash
# Quick environment setup
heroku config:set JWT_SECRET="$(openssl rand -base64 32)" -a vulhub-leaderboard-web
heroku config:set REFRESH_TOKEN_SECRET="$(openssl rand -base64 32)" -a vulhub-leaderboard-web
heroku config:set NODE_ENV="production" -a vulhub-leaderboard-web
heroku config:set CORS_ORIGIN="https://vulhub-leaderboard-web.herokuapp.com" -a vulhub-leaderboard-web
```

---

## 🎉 **Success Criteria**

Your deployment is successful when:
- ✅ **Application URL**: https://vulhub-leaderboard-web.herokuapp.com loads
- ✅ **API Health**: https://vulhub-leaderboard-web.herokuapp.com/api/health returns 200
- ✅ **Database**: Migrations completed successfully
- ✅ **Redis**: Connection established
- ✅ **Authentication**: Login/register flow works
- ✅ **Real-time**: WebSocket connections working

---

## 📞 **Support**

If you encounter issues:
1. **Check Logs**: `heroku logs --tail -a vulhub-leaderboard-web`
2. **Verify Environment**: `heroku config -a vulhub-leaderboard-web`
3. **Test Database**: `heroku pg:psql -a vulhub-leaderboard-web`
4. **Test Redis**: `heroku redis:cli -a vulhub-leaderboard-web`

---

*Heroku Deployment Guide completed on January 27, 2025. Follow these steps for successful deployment.*
