# 🌐 Deployment Overview

**Your complete guide to deploying VulHub Leaderboard to production**

---

## 🎯 Deployment Strategy

VulHub Leaderboard is a **monorepo** with two main applications:
- **Frontend** (Next.js) - User interface
- **Backend** (NestJS) - API server

Each component can be deployed independently to different platforms.

---

## 🚀 Recommended Stack

### Free Tier Option ($ 0/month)
**Perfect for: Testing, personal projects, low traffic**

| Component | Platform | Specs | Cost |
|-----------|----------|-------|------|
| **Frontend** | Vercel | Unlimited bandwidth | FREE |
| **Backend** | Railway Free / Render Free | 500 hours/month | FREE |
| **Database** | Supabase | 500MB PostgreSQL | FREE |

**Limitations:**
- Backend may sleep after 15 min inactivity (cold starts)
- Database limited to 500MB
- No guaranteed uptime SLA

### Professional Option ($7-15/month)
**Perfect for: Production use, steady traffic, reliability**

| Component | Platform | Specs | Cost |
|-----------|----------|-------|------|
| **Frontend** | Vercel | Unlimited | FREE |
| **Backend** | Railway Pro / Heroku Eco | Always-on | $5-7/mo |
| **Database** | Supabase Pro / Railway DB | 8GB storage | $0-8/mo |

**Benefits:**
- Always-on backend (no cold starts)
- Better performance
- More storage
- Production SLA

### Enterprise Option ($50+/month)
**Perfect for: High traffic, mission-critical, scalability**

| Component | Platform | Specs | Cost |
|-----------|----------|-------|------|
| **Frontend** | Vercel Pro | CDN, Analytics | $20/mo |
| **Backend** | Heroku Standard / AWS | 2+ dynos, load balancing | $25+/mo |
| **Database** | Heroku Postgres / AWS RDS | 64GB+, backups | $15+/mo |

**Benefits:**
- High availability
- Auto-scaling
- Advanced monitoring
- Priority support

---

## 📊 Platform Comparison

### Frontend Hosting

| Platform | Best For | Pros | Cons | Cost |
|----------|----------|------|------|------|
| **Vercel** ⭐ | Next.js apps | • Made for Next.js<br>• Auto-scaling<br>• Global CDN<br>• Zero config | • None significant | FREE |
| **Netlify** | Static sites | • Good free tier<br>• Easy setup | • Not optimized for Next.js | FREE |
| **Cloudflare Pages** | Global reach | • Fast CDN<br>• Good free tier | • Limited Next.js features | FREE |

**Recommendation:** **Vercel** - Built specifically for Next.js, zero configuration needed.

### Backend Hosting

| Platform | Best For | Pros | Cons | Cost |
|----------|----------|------|------|------|
| **Railway** ⭐ | Modern apps | • Easy setup<br>• Good free tier<br>• No cold starts (paid) | • Free tier sleeps | FREE-$5/mo |
| **Render** | Docker apps | • Free tier<br>• Simple pricing | • Cold starts on free tier | FREE-$7/mo |
| **Heroku** | Reliability | • Mature platform<br>• Lots of addons<br>• Great docs | • No free tier<br>• Higher cost | $7+/mo |
| **Fly.io** | Edge computing | • Global deployment<br>• Fast | • Complex setup | $5+/mo |

**Recommendation:** **Railway** for easy setup, **Heroku** for reliability and production features.

### Database Hosting

| Platform | Best For | Pros | Cons | Cost |
|----------|----------|------|------|------|
| **Supabase** ⭐ | PostgreSQL | • 500MB free<br>• Good dashboard<br>• Built-in auth | • Limited free storage | FREE-$25/mo |
| **Neon** | Serverless PG | • Generous free tier<br>• Auto-scaling | • Newer platform | FREE-$19/mo |
| **Railway** | All-in-one | • Bundled with backend | • Costs add up | $5+/mo |
| **Heroku Postgres** | Reliability | • Mature<br>• Easy backups | • No free tier | $5+/mo |

**Recommendation:** **Supabase** for free tier with good features.

---

## ⏱️ Time Estimates

| Deployment Type | Setup Time | Complexity |
|-----------------|------------|------------|
| **Free Tier (Vercel + Railway + Supabase)** | 1-2 hours | Easy |
| **Professional (with Heroku)** | 1.5-2 hours | Medium |
| **Enterprise (custom setup)** | 4-8 hours | Advanced |

---

## 🗺️ Deployment Roadmap

### Phase 1: Pre-Deployment (15 minutes)
1. ✅ Review [Project Status Dashboard](../../PROJECT_STATUS_DASHBOARD.md) (90% ready)
2. ✅ Complete [Pre-Deployment Checklist](../../PRE_DEPLOYMENT_CHECKLIST.md)
3. ✅ Prepare environment variables
4. ✅ Choose platforms (see recommendations above)

### Phase 2: Database Setup (10 minutes)
1. Create database instance (Supabase recommended)
2. Get connection string
3. Test connectivity
4. Run migrations

**Guide:** [Database Setup](database-setup.md)

### Phase 3: Backend Deployment (30-45 minutes)
1. Create platform account (Railway/Render/Heroku)
2. Connect GitHub repository
3. Configure environment variables
4. Deploy and test
5. Verify health checks

**Guide:** [Backend Deployment](backend-options.md)

### Phase 4: Frontend Deployment (15 minutes)
1. Create Vercel account
2. Connect GitHub repository
3. Set API URL environment variable
4. Deploy and test

**Guide:** [Frontend Deployment](vercel-frontend.md)

### Phase 5: Verification (15-30 minutes)
1. Test all features
2. Verify authentication
3. Check database connectivity
4. Monitor for errors
5. Test from multiple devices

**Guide:** [Post-Deployment Testing](post-deployment.md)

---

## 🔑 Required Environment Variables

### Frontend (Vercel)
```env
NEXT_PUBLIC_API_URL=https://your-api.railway.app/api/v1
NODE_ENV=production
```

### Backend (Railway/Render/Heroku)
```env
NODE_ENV=production
PORT=4010
DATABASE_URL=postgresql://user:pass@host:5432/db
CORS_ORIGIN=https://your-app.vercel.app
JWT_SECRET=<generate-secure-32-char-string>
JWT_REFRESH_SECRET=<generate-secure-32-char-string>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_ROUNDS=12
```

**Generate secure secrets:**
```bash
# Mac/Linux
openssl rand -base64 32

# Windows (PowerShell)
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

---

## ✅ Pre-Deployment Checklist

Before deploying, ensure:

### Code Readiness
- [ ] All features tested locally
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No linter errors (`npm run lint`)
- [ ] Build succeeds (`npm run build`)
- [ ] Environment files configured

### Security
- [ ] JWT secrets are 32+ characters
- [ ] Secrets are different from each other
- [ ] No secrets in git repository
- [ ] CORS configured for production domain
- [ ] HTTPS enforced

### Database
- [ ] Database created
- [ ] Connection string obtained
- [ ] Migrations ready
- [ ] Backup strategy planned

### Platforms
- [ ] Accounts created
- [ ] Payment methods added (if needed)
- [ ] GitHub repository accessible
- [ ] Deployment targets chosen

---

## 🚦 Deployment Options

### Option A: Quick Deploy (Recommended for Testing)
**Time:** 1-2 hours | **Cost:** $0/month

1. [Database Setup](database-setup.md) - Supabase (10 min)
2. [Backend Deploy](backend-options.md#railway) - Railway Free (30 min)
3. [Frontend Deploy](vercel-frontend.md) - Vercel (15 min)
4. [Verify](post-deployment.md) - Testing (30 min)

**Result:** Working app with potential cold starts

### Option B: Professional Deploy (Recommended for Production)
**Time:** 1.5-2 hours | **Cost:** $7-15/month

1. [Database Setup](database-setup.md) - Supabase (10 min)
2. [Backend Deploy](backend-options.md#heroku) - Heroku/Railway Pro (45 min)
3. [Frontend Deploy](vercel-frontend.md) - Vercel (15 min)
4. [Verify](post-deployment.md) - Testing (30 min)

**Result:** Always-on, production-grade app

### Option C: Enterprise Deploy
**Time:** 4-8 hours | **Cost:** $50+/month

Custom setup with:
- Load balancing
- Auto-scaling
- Advanced monitoring
- High availability
- Custom domain + SSL

**Contact:** DevOps team for guidance

---

## 📈 Post-Deployment

### Immediate (First Hour)
- [ ] Test all features in production
- [ ] Verify authentication works
- [ ] Check database connectivity
- [ ] Monitor logs for errors
- [ ] Test from different browsers/devices

### First Day
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Enable error tracking
- [ ] Share with team for testing
- [ ] Document any issues

### First Week
- [ ] Review performance metrics
- [ ] Optimize slow queries
- [ ] Fix any bugs found
- [ ] Gather user feedback
- [ ] Plan improvements

---

## 🆘 Troubleshooting

### Common Issues

**"CORS error"**
- Check `CORS_ORIGIN` includes your frontend URL
- Ensure no trailing slash in URLs

**"Database connection failed"**
- Verify `DATABASE_URL` is correct
- Check database is running
- Confirm IP whitelist (if applicable)

**"JWT token invalid"**
- Ensure `JWT_SECRET` is set
- Verify it's 32+ characters
- Check token expiration settings

**"Build failed"**
- Check environment variables are set
- Verify all dependencies installed
- Review build logs for specifics

**Detailed troubleshooting:** [Troubleshooting Guide](troubleshooting.md)

---

## 📚 Detailed Guides

### By Platform
- [Vercel Frontend Deployment](vercel-frontend.md) - Step-by-step Vercel guide
- [Railway Backend Deployment](backend-options.md#railway) - Railway setup
- [Render Backend Deployment](backend-options.md#render) - Render setup
- [Heroku Backend Deployment](backend-options.md#heroku) - Heroku setup
- [Supabase Database Setup](database-setup.md#supabase) - Supabase guide

### By Task
- [Environment Configuration](environment-setup.md) - All environment variables
- [Database Migrations](database-setup.md#migrations) - Running migrations
- [SSL/HTTPS Setup](ssl-setup.md) - Custom domains
- [Monitoring Setup](monitoring-setup.md) - Observability
- [Backup Strategy](backup-strategy.md) - Data protection

---

## 🎯 Quick Start

**Ready to deploy? Follow this path:**

1. **Read this overview** ✅ (You're here!)
2. **Complete [Pre-Deployment Checklist](../../PRE_DEPLOYMENT_CHECKLIST.md)** (15 min)
3. **Choose your tier** (Free / Professional / Enterprise)
4. **Follow platform guides** (1-2 hours)
   - Start with [Database Setup](database-setup.md)
   - Then [Backend Deployment](backend-options.md)
   - Finally [Frontend Deployment](vercel-frontend.md)
5. **Test everything** - [Post-Deployment Guide](post-deployment.md)

---

## 💡 Pro Tips

1. **Deploy backend first** - Frontend needs API URL
2. **Test with production database** - Catch issues early
3. **Use environment variables** - Never hardcode secrets
4. **Enable monitoring** - Know when things break
5. **Plan for rollback** - Have a backup plan
6. **Start small** - Free tier → upgrade as needed
7. **Monitor costs** - Check usage regularly

---

**Ready to deploy?** Start with the [Pre-Deployment Checklist](../../PRE_DEPLOYMENT_CHECKLIST.md)!

---

<sub>Last Updated: February 10, 2026 | [Edit this page](overview.md) | [Back to Docs](../README.md)</sub>

