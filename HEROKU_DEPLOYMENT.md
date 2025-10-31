# 🚀 Heroku API Deployment Guide

**Time Required:** ~15 minutes  
**Prerequisites:** 
- Heroku account (you have this ✅)
- Supabase connection string (from SUPABASE_SETUP.md)
- GitHub repository with code pushed

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Heroku CLI Setup](#heroku-cli-setup)
3. [Deploy API](#deploy-api)
4. [Configure Environment](#configure-environment)
5. [Run Migrations](#run-migrations)
6. [Verify Deployment](#verify-deployment)
7. [Monitor & Logs](#monitor--logs)

---

## Prerequisites

### Checklist

Before starting, make sure you have:

- ✅ Heroku account logged in at https://dashboard.heroku.com
- ✅ GitHub account with code pushed
- ✅ Supabase database set up
- ✅ Supabase connection string (see SUPABASE_SETUP.md)
- ✅ Procfile exists in project root

### Verify Procfile

Check that `Procfile` exists:

```bash
cat Procfile
```

Should show:
```
web: cd apps/api && pnpm install && pnpm exec nest start
```

If not, I've created it for you.

---

## Heroku CLI Setup

### Step 1: Install Heroku CLI

**macOS:**
```bash
brew tap heroku/brew && brew install heroku
```

**Windows:**
1. Download from: https://devcenter.heroku.com/articles/heroku-cli
2. Run installer
3. Restart terminal

**Linux (Ubuntu):**
```bash
curl https://cli-assets.heroku.com/install-ubuntu.sh | sh
```

### Step 2: Verify Installation

```bash
heroku --version
```

Should show something like:
```
heroku/7.69.0 win32-x64 node-v16.x
```

### Step 3: Login to Heroku

```bash
heroku login
```

This will:
1. Open a browser window
2. Ask you to login
3. Return to terminal when complete

Verify by running:
```bash
heroku auth:whoami
```

Should show your email address.

---

## Deploy API

### Step 1: Prepare Repository

Make sure all changes are committed:

```bash
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
git status
```

Should show "nothing to commit" or just unstaged files you don't need.

Commit any changes:
```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push origin main
```

### Step 2: Create Heroku App

Create a new Heroku app for your API:

```bash
heroku create vulhub-api
```

This will:
1. Create app named `vulhub-api`
2. Add Heroku as a Git remote
3. Show you the URL: `https://vulhub-api.herokuapp.com`

**Note:** If name is taken, Heroku will suggest alternatives.

### Step 3: Deploy Code

Push your code to Heroku:

```bash
git push heroku main
```

Watch the output for:
- `Building...`
- `Installing dependencies...`
- `Building application...`
- `Deployed...`

The first deployment takes 2-3 minutes.

### Step 4: Verify Initial Deployment

Check if app is running:

```bash
heroku ps -a vulhub-api
```

You should see something like:
```
=== web (Basic): 1
web.1: up 2021/10/31 10:30:00 (about a minute ago)
```

---

## Configure Environment

### Step 1: Set Database Connection

**Most Important Step!**

```bash
heroku config:set DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres" -a vulhub-api
```

**Replace with your actual Supabase connection string!**

### Step 2: Set Other Required Variables

```bash
# Node environment
heroku config:set NODE_ENV=production -a vulhub-api

# JWT Secret (change to something random!)
heroku config:set JWT_SECRET="change-this-to-a-random-secret-key-minimum-32-chars-long" -a vulhub-api

# API Port (Heroku sets this automatically, but include for clarity)
heroku config:set PORT=3000 -a vulhub-api

# Tenant configuration
heroku config:set TENANT_ID=default-tenant -a vulhub-api
```

### Step 3: Set Redis URL (Optional)

If using Redis for caching:

```bash
heroku config:set REDIS_URL="redis://default:password@host:port" -a vulhub-api
```

Or use Heroku Redis add-on:

```bash
heroku addons:create heroku-redis:premium-0 -a vulhub-api
```

(Redis is added automatically to Heroku if you use certain add-ons)

### Step 4: Verify Configuration

View all configured variables:

```bash
heroku config -a vulhub-api
```

Should show something like:
```
=== vulhub-api Config Vars
DATABASE_URL: postgresql://postgres:...
JWT_SECRET: change-this-to...
NODE_ENV: production
PORT: 3000
TENANT_ID: default-tenant
```

---

## Run Migrations

### Step 1: Run Prisma Migrations

Now that database is configured, migrate schema:

```bash
heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
```

You'll see:
```
Running `cd apps/api && pnpm prisma db push` attached to terminal on dyno.

Prisma schema loaded from /app/apps/api/prisma/schema.prisma
Datasource "db": PostgreSQL database "postgres", schema "public"

✔ Your database is now in sync with your Prisma schema.
```

### Step 2: Seed Database (Optional)

Load initial data:

```bash
heroku run "cd apps/api && pnpm db:seed" -a vulhub-api
```

This creates:
- Default tenant
- Sample users
- Sample projects
- Initial badges

### Step 3: Verify Tables Created

Check database has tables:

```bash
heroku run "cd apps/api && pnpm prisma studio" -a vulhub-api
```

Or use Supabase dashboard to view tables.

---

## Verify Deployment

### Step 1: Check App Status

```bash
heroku status -a vulhub-api
```

Should show: "green" (running)

### Step 2: Test Health Check

```bash
curl https://vulhub-api.herokuapp.com/api/v1/health
```

Should return:
```json
{
  "status": "ok",
  "info": {
    "api": {
      "status": "up",
      "message": "API is running"
    }
  }
}
```

### Step 3: Open App

```bash
heroku open -a vulhub-api
```

Should open browser to your API.

### Step 4: Get API URL

Your API is now at:
```
https://vulhub-api.herokuapp.com/api/v1
```

**Save this for Vercel deployment!**

---

## Monitor & Logs

### View Live Logs

Watch logs in real-time:

```bash
heroku logs -a vulhub-api --tail
```

Press `Ctrl+C` to stop.

### View Recent Logs

See last 50 lines:

```bash
heroku logs -a vulhub-api -n 50
```

### Search Logs

Find specific errors:

```bash
heroku logs -a vulhub-api | grep ERROR
```

### Common Startup Messages

You should see:
```
Nest application successfully started
Connected to database
Port 3000 open for requests
```

### Check Dyno Status

```bash
heroku ps -a vulhub-api
```

Should show `web.1: up`

If it shows `crashed`, check logs for errors.

---

## Troubleshooting

### App Crashed After Deployment

**Check logs:**
```bash
heroku logs -a vulhub-api
```

**Common causes:**
1. Missing DATABASE_URL → Set it with config:set
2. Port conflicts → Heroku sets PORT automatically
3. Missing dependencies → Check package.json

**Restart app:**
```bash
heroku restart -a vulhub-api
```

### Database Connection Failed

**Symptom:** "Can't connect to database" in logs

**Solution:**
1. Verify connection string:
   ```bash
   heroku config:get DATABASE_URL -a vulhub-api
   ```
2. Test connection locally first (if possible)
3. Check Supabase dashboard for active connections

### Migrations Failed

**Symptom:** "Prisma migration failed"

**Solution:**
1. Check if database is accessible
2. Run migrations again:
   ```bash
   heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api --exit-code
   ```
3. Check Supabase for any issues

### Port Already in Use

**Symptom:** "Port 3000 already in use"

**Solution:** Heroku manages this automatically, but if issues:
```bash
heroku config:unset PORT -a vulhub-api
```

---

## Next Steps

1. ✅ Heroku API deployed
2. ✅ Database connected
3. ⏭️ Deploy Frontend on Vercel
4. ⏭️ Connect Frontend to API
5. ⏭️ Final verification

See `VERCEL_DEPLOYMENT.md` for next steps.

---

## Useful Commands Reference

```bash
# Create new app
heroku create vulhub-api

# Push code
git push heroku main

# Set environment variable
heroku config:set VARIABLE=value -a vulhub-api

# View environment variables
heroku config -a vulhub-api

# View logs
heroku logs -a vulhub-api --tail

# Run command
heroku run "command" -a vulhub-api

# Restart app
heroku restart -a vulhub-api

# Open app in browser
heroku open -a vulhub-api

# Check app status
heroku ps -a vulhub-api
```

---

## ✅ Deployment Complete!

Your API is now running at: `https://vulhub-api.herokuapp.com`

Next: Deploy frontend on Vercel.
