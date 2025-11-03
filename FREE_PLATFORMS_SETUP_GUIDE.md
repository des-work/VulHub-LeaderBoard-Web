# 🆓 Free External Platforms Setup Guide

## Required vs Optional Services

Based on your codebase requirements, here's what you **need** vs what's **optional** for launch:

---

## ✅ Required Services (Must Have)

### 1. **PostgreSQL Database** 🗄️

**Why Required:** Your production code validates PostgreSQL connection and requires it.

**Best Free Options:**

#### Option A: **Supabase** (Recommended ⭐)
- **Cost:** FREE
- **Limits:** 500MB database, 2GB bandwidth/month, 50MB file storage
- **Setup Time:** 5 minutes
- **Features:** PostgreSQL + Authentication + Storage + Real-time

**Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Sign up with GitHub
3. Create new project
4. Copy `DATABASE_URL` (Connection String → Direct)
5. Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres`

#### Option B: **Neon** (Alternative)
- **Cost:** FREE
- **Limits:** 10GB storage, 1 project, auto-suspend after inactivity
- **Setup Time:** 3 minutes
- **Features:** Serverless PostgreSQL with branching

**Setup:**
1. Go to [neon.tech](https://neon.tech)
2. Sign up with GitHub
3. Create project
4. Copy connection string

#### Option C: **ElephantSQL** (Alternative)
- **Cost:** FREE  
- **Limits:** 20MB storage (Tiny Turtle plan)
- **Setup Time:** 5 minutes

**Setup:**
1. Go to [elephantsql.com](https://www.elephantsql.com)
2. Sign up
3. Create Tiny Turtle instance
4. Copy URL

---

### 2. **Frontend Hosting** 🌐

**Why Required:** Need to host your Next.js app.

#### **Vercel** (Recommended ⭐)
- **Cost:** FREE
- **Limits:** 100GB bandwidth/month, serverless functions
- **Setup Time:** 5 minutes
- **Perfect for:** Next.js (made by Vercel)

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Set environment variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-heroku-api.herokuapp.com/api/v1
   NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
   NODE_ENV=production
   ```
5. Deploy (automatic)

**Alternatives:**
- **Netlify** - Also free, similar limits
- **Cloudflare Pages** - Unlimited bandwidth on free tier

---

### 3. **Backend API Hosting** 🚀

#### **Heroku** (Recommended - Using Your Paid Account ⭐)
- **Cost:** $7-50+/month (with paid account)
- **Performance:** Always-on, no cold starts
- **Limits:** Based on dyno type
- **Setup Time:** 10 minutes
- **Features:** Integrated add-ons, PostgreSQL, Redis, automated deployments

**Setup:**
1. Go to [heroku.com](https://heroku.com)
2. Log in to your paid account
3. Create two new apps:
   - `vulhub-leaderboard-api` (production)
   - `vulhub-leaderboard-api-staging` (staging - optional)
4. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:standard-0 -a vulhub-leaderboard-api
   ```
5. Add Redis addon (optional but recommended):
   ```bash
   heroku addons:create heroku-redis:premium-0 -a vulhub-leaderboard-api
   ```
6. Set environment variables:
   ```bash
   heroku config:set NODE_ENV=production -a vulhub-leaderboard-api
   heroku config:set JWT_SECRET=<32-char-secret> -a vulhub-leaderboard-api
   heroku config:set JWT_REFRESH_SECRET=<32-char-secret> -a vulhub-leaderboard-api
   heroku config:set CORS_ORIGIN=https://your-vercel-url.vercel.app -a vulhub-leaderboard-api
   ```
7. Deploy via Git:
   ```bash
   git remote add heroku https://git.heroku.com/vulhub-leaderboard-api.git
   git push heroku main
   ```
8. Run migrations:
   ```bash
   heroku run "npx prisma migrate deploy" -a vulhub-leaderboard-api
   ```

**Benefits of Using Heroku (Over Free Tiers):**
- ✅ Always-on (no cold starts like Render free tier)
- ✅ Better performance and reliability
- ✅ Integrated PostgreSQL and Redis add-ons
- ✅ Automatic SSL/TLS certificates
- ✅ Easier deployments via Git push
- ✅ Professional-grade infrastructure

**Alternative (If Not Using Heroku):**

#### **Render** (Free Alternative)
- **Cost:** FREE
- **Limits:** Spins down after 15 min inactivity, 750 hours/month
- **Setup Time:** 10 minutes
- **Features:** Auto-deploy from GitHub

#### **Railway** (Free Trial Alternative)
- **Cost:** $5 free credit (then $5/month typical)
- **Limits:** Better performance than Render free tier
- **Setup Time:** 5 minutes

---

## 🟡 Optional Services (App Works Without These)

### 4. **Redis Cache** 💾

**Status:** ⚠️ **OPTIONAL** - Your code has in-memory fallback

**If you want Redis (improves performance):**

#### **Upstash Redis** (Recommended)
- **Cost:** FREE
- **Limits:** 10,000 commands/day
- **Setup Time:** 3 minutes

**Setup:**
1. Go to [upstash.com](https://upstash.com)
2. Create Redis database
3. Copy connection details:
   ```env
   REDIS_HOST=your-region.upstash.io
   REDIS_PORT=6379
   REDIS_PASSWORD=your-password
   ```

**Alternative:**
- **Redis Cloud** - 30MB free
- **Skip it** - App works fine without Redis for small-medium traffic

---

### 5. **Email Service** 📧

**Status:** ⚠️ **OPTIONAL** - Your code works without email

**If you want email notifications:**

#### **Resend** (Recommended)
- **Cost:** FREE
- **Limits:** 100 emails/day, 3,000/month
- **Setup Time:** 5 minutes

**Setup:**
1. Go to [resend.com](https://resend.com)
2. Sign up
3. Get API key
4. Set variables:
   ```env
   SMTP_HOST=smtp.resend.com
   SMTP_PORT=587
   SMTP_USER=resend
   SMTP_PASS=your-api-key
   ```

**Alternatives:**
- **SendGrid** - 100 emails/day free
- **Mailgun** - 5,000 emails/month free
- **Skip it** - Use in-app notifications only

---

### 6. **File Storage** 📁

**Status:** ⚠️ **OPTIONAL** - Local storage works for submissions

**If you want cloud storage:**

#### **Cloudinary** (Recommended)
- **Cost:** FREE
- **Limits:** 25GB storage, 25GB bandwidth/month
- **Setup Time:** 5 minutes

**Setup:**
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up
3. Get credentials
4. Set variables:
   ```env
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

**Alternatives:**
- **Supabase Storage** - If using Supabase for database (bundled)
- **Vercel Blob** - 10GB free
- **Skip it** - Use local filesystem (works for MVP)

---

## 🎯 Recommended Launch Stack (Your Setup with Paid Heroku)

### **Option A: With Your Paid Heroku Account (Recommended ⭐)**
```
Frontend:  Vercel (free)
Backend:   Heroku (paid - your account) ← Always-on, professional grade
Database:  Supabase (free, 500MB) or Heroku PostgreSQL (included)
Redis:     Heroku Redis (included addon) - optional but recommended
Cost:      $7-50/month (depending on dyno size)
Time:      20-30 minutes setup
```

**Why This is Best:**
- ✅ No cold starts (always-on dyno)
- ✅ Better performance than free tiers
- ✅ Integrated PostgreSQL add-on
- ✅ Easy deployments via Git push
- ✅ Professional monitoring and logs
- ✅ Automatic backups

### **Option B: 100% Free (Budget Alternative)**
```
Frontend:  Vercel (free)
Backend:   Render (free, auto-sleeps after 15 min)
Database:  Supabase (free, 500MB)
Cost:      $0/month
Time:      20 minutes setup
```

**⚠️ Tradeoff:** Render free tier sleeps after 15 minutes of inactivity, so first request is slow (~30 sec)

### **Option C: Better Performance, Low Cost**
```
Frontend:  Vercel (free)
Backend:   Heroku (your account)
Database:  Supabase (free, 500MB)
Redis:     Upstash (free) or Heroku Redis addon
Cost:      $7-20/month
Time:      25 minutes setup
```

---

## 📋 Complete Environment Variables Checklist

### **Frontend (Vercel)**

```env
# Required
NEXT_PUBLIC_API_URL=https://vulhub-leaderboard-api.herokuapp.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NODE_ENV=production

# Optional
NEXT_PUBLIC_IMAGE_DOMAINS=your-cdn-domain.com
```

### **Backend (Heroku)**

```env
# Required - Core
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-app.vercel.app

# Required - Database (Auto-set by Heroku if using PostgreSQL addon, or set manually for Supabase)
DATABASE_URL=postgresql://user:pass@host:5432/database
# OR if using Heroku PostgreSQL addon:
# DATABASE_URL will be automatically set when you add the addon

# Required - Security (generate these!)
JWT_SECRET=<32-character-random-string>
JWT_REFRESH_SECRET=<32-character-random-string>

# Optional - Redis (auto-set if using Heroku Redis addon)
REDIS_URL=redis://... (auto-set by Heroku)
# OR if using Upstash:
REDIS_HOST=your-redis-host.com
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# Optional - Email (for notifications)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=your-api-key
SMTP_FROM=noreply@yourdomain.com

# Optional - Storage (for file uploads)
STORAGE_PROVIDER=cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

---

## 🔐 Generate Secrets

**JWT Secrets (Required):**

```bash
# Option 1: OpenSSL (Mac/Linux)
openssl rand -hex 32

# Option 2: Node.js (All platforms)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Option 3: Online (for quick testing)
# Go to: https://generate-secret.vercel.app/32
```

**Generate TWO different secrets:**
- One for `JWT_SECRET`
- One for `JWT_REFRESH_SECRET`

---

## 🚀 Quick Setup Timeline

### **Total Time: ~30-45 minutes**

1. **Database Setup** (5 min)
   - Create Supabase account
   - Create project
   - Copy DATABASE_URL

2. **Frontend Deployment** (10 min)
   - Connect GitHub to Vercel
   - Set environment variables
   - Deploy

3. **Backend Deployment** (15 min)
   - Create Heroku account
   - Create two apps
   - Set environment variables
   - Deploy

4. **Database Migration** (5 min)
   - Run Prisma migrations on Heroku
   - Seed initial data (optional)

5. **Testing** (10 min)
   - Test login
   - Test API endpoints
   - Verify database connection

---

## ⚠️ Important Notes

### **Heroku Status:**
- ✅ **Eco Dynos available** - $7/month per dyno
- ✅ **You can still use Heroku** if you have credits or want to pay

### **Database Persistence:**
- ✅ **Supabase** - Data persists forever on free tier
- ✅ **Heroku** - Data persists during trial

### **Performance Notes:**
- **Heroku Free Tier** - Always-on, no cold starts
- **Vercel** - Instant response (serverless)

---

## 🔄 Upgrade Path

### **When to Upgrade:**

**Heroku → Paid ($7-50+/month):**
- When: Site traffic increases, cold starts become annoying
- Benefit: Always-on, faster response times

**Free Database → Paid:**
- When: > 500MB data (Supabase) or need backups
- Options: Supabase Pro ($25/mo), Neon Scale ($19/mo)

**Add Redis ($0-10/month):**
- When: > 1000 daily active users
- Benefit: Faster API responses, session management

**Add CDN/Storage:**
- When: > 100 file uploads/day
- Options: Cloudinary, Vercel Blob

---

## ✅ Setup Verification Checklist

After setup, verify everything works:

- [ ] **Database Connection**
  ```bash
  curl https://your-api.com/api/v1/health
  # Should return: {"status":"healthy", ...}
  ```

- [ ] **Frontend Loads**
  - Visit https://your-app.vercel.app
  - Should see login page

- [ ] **API Responds**
  ```bash
  curl https://your-api.com/api/v1/health
  # Should return JSON with database status
  ```

- [ ] **Login Works**
  - Try logging in with test account
  - Should redirect to dashboard

- [ ] **Environment Variables Set**
  - Check Vercel dashboard
  - Check Heroku dashboard

---

## 🆘 Common Issues

### **Issue: Database connection fails**
**Fix:** Check DATABASE_URL format
```env
# Correct format:
postgresql://user:password@host:5432/database

# Common mistake: Missing password or port
```

### **Issue: CORS errors**
**Fix:** Set CORS_ORIGIN to exact frontend URL
```env
# Correct:
CORS_ORIGIN=https://your-app.vercel.app

# Wrong:
CORS_ORIGIN=http://localhost:3000  # Don't use localhost in production!
```

### **Issue: JWT errors**
**Fix:** Ensure secrets are at least 32 characters
```bash
# Generate proper secret:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### **Issue: Heroku app sleeps**
**Fix:** This is normal on free tier. Options:
- Upgrade to paid ($7/month)
- Use Railway instead
- Keep alive with uptime monitoring (Uptime Robot free)

---

## 📞 Need Help?

1. **Check your environment variables** - Most issues are misconfiguration
2. **Check application logs** - Heroku all have log viewers
3. **Test API health endpoint** - `curl https://your-api.com/api/v1/health`
4. **Verify database connection** - Check Supabase dashboard for connection stats

---

## 🎉 You're Ready!

With this setup, you can launch for **$7-50+/month** with room to scale as you grow.

**Next Steps:**
1. Follow the setup for each platform above
2. Update the main README with your deployment URLs
3. Test everything works
4. Launch! 🚀

