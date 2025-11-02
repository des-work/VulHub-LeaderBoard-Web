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
   NEXT_PUBLIC_API_URL=https://your-api-url.com/api/v1
   NEXT_PUBLIC_SITE_URL=https://your-vercel-url.vercel.app
   NODE_ENV=production
   ```
5. Deploy (automatic)

**Alternatives:**
- **Netlify** - Also free, similar limits
- **Cloudflare Pages** - Unlimited bandwidth on free tier

---

### 3. **Backend API Hosting** 🚀

**Why Required:** Need to host your NestJS API.

**⚠️ Important:** Heroku removed their free tier in 2022. Here are current options:

#### Option A: **Render** (Recommended ⭐)
- **Cost:** FREE (with limitations)
- **Limits:** Spins down after 15 min inactivity, 750 hours/month
- **Setup Time:** 10 minutes
- **Features:** Auto-deploy from GitHub

**Setup:**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. New → Web Service
4. Connect repository
5. Settings:
   - **Build Command:** `pnpm install && pnpm --filter @vulhub/api build`
   - **Start Command:** `pnpm --filter @vulhub/api start:prod`
   - **Environment:** Node
6. Set environment variables (see below)

#### Option B: **Railway** 
- **Cost:** $5 credit free trial (then $5/month)
- **Limits:** Better performance than Render free tier
- **Setup Time:** 5 minutes

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. New Project → Deploy from GitHub
4. Configure environment variables

#### Option C: **Heroku** (If you have existing account)
- **Cost:** $7/month (Eco Dynos)
- **No free tier available**
- **Best if:** You're already familiar with Heroku

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

## 🎯 Recommended Launch Stack (100% Free)

### **Minimum Viable Launch:**

| Service | Platform | Cost | Setup Time |
|---------|----------|------|------------|
| **Database** | Supabase | FREE | 5 min |
| **Frontend** | Vercel | FREE | 5 min |
| **Backend** | Render | FREE | 10 min |
| **TOTAL** | | **$0/month** | **20 min** |

### **Enhanced Launch (Better Performance):**

| Service | Platform | Cost | Setup Time |
|---------|----------|------|------------|
| **Database** | Supabase | FREE | 5 min |
| **Frontend** | Vercel | FREE | 5 min |
| **Backend** | Railway | $5/month | 5 min |
| **Redis** | Upstash | FREE | 3 min |
| **TOTAL** | | **$5/month** | **18 min** |

---

## 📋 Complete Environment Variables Checklist

### **Frontend (Vercel)**

```env
# Required
NEXT_PUBLIC_API_URL=https://your-api-url.com/api/v1
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
NODE_ENV=production

# Optional
NEXT_PUBLIC_IMAGE_DOMAINS=your-cdn-domain.com
```

### **Backend (Render/Railway/Heroku)**

```env
# Required - Core
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-app.vercel.app

# Required - Database
DATABASE_URL=postgresql://user:pass@host:5432/database

# Required - Security (generate these!)
JWT_SECRET=<32-character-random-string>
JWT_REFRESH_SECRET=<32-character-random-string>

# Optional - Redis (improves performance)
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
   - Create Render/Railway account
   - Connect repository
   - Set environment variables
   - Deploy

4. **Database Migration** (5 min)
   - Run Prisma migrations on Render/Railway
   - Seed initial data (optional)

5. **Testing** (10 min)
   - Test login
   - Test API endpoints
   - Verify database connection

---

## ⚠️ Important Notes

### **Heroku Status:**
- ❌ **No longer has free tier** (removed November 2022)
- ✅ **Eco Dynos available** - $7/month per dyno
- ✅ **You can still use Heroku** if you have credits or want to pay

### **Database Persistence:**
- ✅ **Supabase** - Data persists forever on free tier
- ⚠️ **Render** - Database separate service (can be free)
- ✅ **Railway** - Data persists during trial

### **Performance Notes:**
- **Render Free Tier** - Spins down after 15 min inactivity (first request slow)
- **Railway** - Always on during trial period
- **Vercel** - Instant response (serverless)

---

## 🔄 Upgrade Path

### **When to Upgrade:**

**Render → Railway ($5/month):**
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
  - Check Render/Railway dashboard

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

### **Issue: Render app sleeps**
**Fix:** This is normal on free tier. Options:
- Upgrade to paid ($7/month)
- Use Railway instead
- Keep alive with uptime monitoring (Uptime Robot free)

---

## 📞 Need Help?

1. **Check your environment variables** - Most issues are misconfiguration
2. **Check application logs** - Render/Railway/Vercel all have log viewers
3. **Test API health endpoint** - `curl https://your-api.com/api/v1/health`
4. **Verify database connection** - Check Supabase dashboard for connection stats

---

## 🎉 You're Ready!

With this setup, you can launch for **$0-5/month** with room to scale as you grow.

**Next Steps:**
1. Follow the setup for each platform above
2. Update the main README with your deployment URLs
3. Test everything works
4. Launch! 🚀

