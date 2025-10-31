# 🗄️ Supabase Database Setup Guide

**Time Required:** ~10 minutes  
**Prerequisites:** Gmail or GitHub account

---

## Table of Contents

1. [Create Supabase Account](#create-supabase-account)
2. [Create New Project](#create-new-project)
3. [Get Connection String](#get-connection-string)
4. [Configure API](#configure-api)
5. [Verify Connection](#verify-connection)

---

## Create Supabase Account

### Step 1: Visit Supabase

1. Open https://supabase.com in your browser
2. Click **"Start your project"** or **"Sign up"** button

### Step 2: Sign Up

Choose sign-up method:
- **Recommended:** GitHub (easiest)
  - Click "Continue with GitHub"
  - Authorize Supabase
  
- **Alternative:** Email
  - Enter email address
  - Check email for verification link
  - Create password

### Step 3: Create Organization

1. After sign-up, you'll see "Create an Organization" screen
2. Enter organization name: `VulHub` or just use default
3. Click **"Create Organization"**

---

## Create New Project

### Step 1: New Project Button

1. In Supabase dashboard, click **"New Project"** button

### Step 2: Project Settings

Fill in these details:

| Field | Value | Notes |
|-------|-------|-------|
| **Name** | `vulhub` or `vulhub-db` | Keep it simple |
| **Database Password** | Create strong password | Save this! You'll need it |
| **Region** | Choose closest to you | US East, EU West, etc. |
| **Plan** | Free | That's fine for MVP |

### Step 3: Create

1. Click **"Create new project"**
2. Wait 2-3 minutes while Supabase provisions your database
3. You should see a loading screen with:
   ```
   Setting up your new project...
   Creating PostgreSQL database...
   ```
4. Once complete, you'll see your project dashboard

---

## Get Connection String

### Step 1: Access Database Settings

1. In your Supabase project dashboard, look for left sidebar
2. Click **"Settings"** (gear icon)
3. In the settings menu, click **"Database"**

### Step 2: Copy Connection String

1. You should see "Connection string" section
2. Choose **"Postgres"** tab (should be default)
3. You'll see a connection string like:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
   ```

4. Click the **copy icon** next to it
5. **Important:** This string has `[PASSWORD]` as a placeholder
   - Replace `[PASSWORD]` with your actual database password (from Step 2.2)
   - The actual string will look like:
     ```
     postgresql://postgres:MyActualPassword123@db.xxxxx.supabase.co:5432/postgres
     ```

### Step 3: Save Connection String

**Save this in a secure location!**

You'll need it for:
- ✅ Heroku API configuration
- ✅ Local testing (optional)
- ✅ Database migrations

---

## Configure API

### Step 1: Add to Heroku

Once you have the connection string, configure Heroku:

```bash
heroku config:set DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres" -a vulhub-api
```

Replace `YOUR_PASSWORD` and the host with your actual values.

### Step 2: Run Migrations

After Heroku is configured with the database connection:

```bash
heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
```

This creates all the database tables using Prisma migrations.

### Step 3: Seed Database

Load initial data (if seeds exist):

```bash
heroku run "cd apps/api && pnpm db:seed" -a vulhub-api
```

---

## Verify Connection

### Option 1: Using psql (Recommended)

1. Install PostgreSQL client if needed:
   ```bash
   # macOS
   brew install postgresql
   
   # Windows (using WSL or install pgAdmin)
   # Or download from: https://www.postgresql.org/download/
   
   # Linux (Ubuntu)
   sudo apt-get install postgresql-client
   ```

2. Connect to Supabase:
   ```bash
   psql postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres
   ```

3. If successful, you'll see:
   ```
   postgres=#
   ```

4. List tables:
   ```sql
   \dt
   ```

5. Exit:
   ```sql
   \q
   ```

### Option 2: Using Supabase Dashboard

1. Go back to Supabase dashboard
2. Click **"SQL Editor"** in left sidebar
3. Click **"New Query"**
4. Run test query:
   ```sql
   SELECT NOW();
   ```
5. Should return current timestamp

### Option 3: Check from Heroku Logs

```bash
heroku logs -a vulhub-api
```

Look for messages like:
```
[Nest] ... info Connected to database successfully
```

---

## Database Maintenance

### View Data

1. In Supabase, click **"Table Editor"** (left sidebar)
2. You'll see all tables:
   - `users`
   - `projects`
   - `submissions`
   - `badges`
   - etc.

3. Click any table to view data

### Backups

Supabase automatically backs up your database:
- **Free tier:** Daily backups
- **Paid tier:** Hourly backups

To manually backup:
1. Click **"Backups"** in settings
2. Click **"Create backup now"**

### Monitor Database

1. Click **"Database"** → **"Disk Usage"**
2. Free tier allows 500MB
3. You can upgrade anytime

---

## Troubleshooting

### Connection String Not Working

**Problem:** Can't connect with psql

**Solution:**
1. Make sure you replaced `[PASSWORD]` with actual password
2. Check that hostname is correct (should be like `db.xxxxx.supabase.co`)
3. Verify network allows PostgreSQL (port 5432)

### "Database full" Error

**Problem:** Free tier storage exceeded

**Solution:**
1. Delete old data or upgrade to paid tier
2. Check disk usage in Supabase dashboard
3. Contact Supabase support

### Tables Don't Exist

**Problem:** Migrations didn't run

**Solution:**
1. Verify connection string in Heroku:
   ```bash
   heroku config -a vulhub-api
   ```
2. Run migrations again:
   ```bash
   heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
   ```
3. Check Heroku logs:
   ```bash
   heroku logs -a vulhub-api
   ```

---

## ✅ Next Steps

1. ✅ Supabase database created
2. ✅ Connection string obtained
3. ⏭️ Configure Heroku with database connection
4. ⏭️ Deploy API
5. ⏭️ Deploy Frontend

See `HEROKU_DEPLOYMENT.md` for next steps.
