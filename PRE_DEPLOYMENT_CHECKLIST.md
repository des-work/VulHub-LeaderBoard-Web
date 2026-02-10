# ✅ Pre-Deployment Checklist

**Use this checklist before deploying to production**

---

## 🚀 Critical Items (Must Complete)

### Environment Configuration
- [ ] Rename `apps/api/ENV_EXAMPLE_FILE.txt` to `apps/api/.env.example`
- [ ] Rename `apps/web/ENV_LOCAL_EXAMPLE_FILE.txt` to `apps/web/.env.local.example`
- [ ] Create `apps/api/.env` from template
- [ ] Create `apps/web/.env.local` from template
- [ ] Update `DATABASE_URL` in `apps/api/.env` (use SQLite for local, PostgreSQL for prod)
- [ ] Update `JWT_SECRET` and `JWT_REFRESH_SECRET` (32+ chars for production)
- [ ] Update `CORS_ORIGIN` in `apps/api/.env`
- [ ] Update `NEXT_PUBLIC_API_URL` in `apps/web/.env.local`

### Build Verification
- [ ] Run `npm install` successfully
- [ ] Run `npm run build:api` successfully
- [ ] Run `npm run build:web` successfully
- [ ] No TypeScript errors
- [ ] No linter errors

### Database Setup
- [ ] Choose database platform (Supabase recommended for free tier)
- [ ] Create database instance
- [ ] Get connection string
- [ ] Update `DATABASE_URL` in production environment
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push` (or `prisma migrate deploy` for production)
- [ ] Run `npm run db:seed` (optional, for test data)

### Local Testing
- [ ] Run `npm run dev:local`
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend responds at http://localhost:4010/health
- [ ] Can login with test credentials
- [ ] Leaderboard displays
- [ ] Can view challenges
- [ ] Can submit solutions
- [ ] Can view badges
- [ ] Community forum works
- [ ] Profile page displays
- [ ] No console errors in browser

---

## 🌐 Deployment Setup

### Choose Platforms
- [ ] **Frontend:** Vercel (recommended), Netlify, or Cloudflare Pages
- [ ] **Backend:** Railway (free), Render (free), or Heroku (paid $7-50/mo)
- [ ] **Database:** Supabase (free 500MB), Neon (free), or Heroku Postgres

### Frontend Deployment (Vercel)
- [ ] Create Vercel account
- [ ] Connect GitHub repository
- [ ] Set build command: `npm run build:web`
- [ ] Set output directory: `apps/web/.next`
- [ ] Set root directory: `apps/web`
- [ ] Add environment variable: `NEXT_PUBLIC_API_URL` (your API URL)
- [ ] Add environment variable: `NODE_ENV=production`
- [ ] Deploy and test

### Backend Deployment (Railway/Render/Heroku)
- [ ] Create account on chosen platform
- [ ] Create new project
- [ ] Connect GitHub repository
- [ ] Set root directory: `apps/api`
- [ ] Set build command: `npm run build`
- [ ] Set start command: `npm run start:prod`
- [ ] Add environment variables (see section below)
- [ ] Deploy and test

### Backend Environment Variables (Production)
- [ ] `NODE_ENV=production`
- [ ] `PORT=4010` (or platform default)
- [ ] `DATABASE_URL=postgresql://...` (from database platform)
- [ ] `CORS_ORIGIN=https://your-frontend.vercel.app`
- [ ] `JWT_SECRET=...` (secure 32+ char string)
- [ ] `JWT_REFRESH_SECRET=...` (secure 32+ char string)
- [ ] `JWT_EXPIRES_IN=15m`
- [ ] `JWT_REFRESH_EXPIRES_IN=7d`
- [ ] `BCRYPT_ROUNDS=12`

---

## 🔒 Security Review

### Secrets & Keys
- [ ] JWT secrets are 32+ characters
- [ ] JWT secrets are different from each other
- [ ] No secrets committed to git
- [ ] `.env` files in `.gitignore`
- [ ] Production secrets stored in platform dashboard only

### CORS & Origins
- [ ] `CORS_ORIGIN` set to actual frontend URL in production
- [ ] No wildcard CORS in production (`*`)
- [ ] HTTPS enforced in production

### Authentication
- [ ] JWT expiration set appropriately (15m for access token)
- [ ] Refresh token expiration set (7d recommended)
- [ ] Password hashing enabled (bcrypt)
- [ ] Rate limiting configured on auth endpoints

### Headers & Middleware
- [ ] Helmet.js configured
- [ ] CSP headers set
- [ ] HTTPS redirect enabled (if applicable)
- [ ] Compression enabled

---

## 🧪 Production Testing

### API Health Checks
- [ ] `GET /health` returns 200
- [ ] `GET /ready` returns 200
- [ ] `GET /api/v1/health` returns 200
- [ ] API responds within 2 seconds

### Authentication Flow
- [ ] Can register new user
- [ ] Can login with email/password
- [ ] Receives JWT access token
- [ ] Receives JWT refresh token
- [ ] Token stored securely
- [ ] Can access protected routes
- [ ] Invalid credentials rejected
- [ ] Logout clears tokens

### Core Features
- [ ] Leaderboard loads and displays rankings
- [ ] Can view challenge list
- [ ] Can view challenge details
- [ ] Can submit solution (with file upload)
- [ ] Submission shows in "My Submissions"
- [ ] Badges page displays correctly
- [ ] Profile shows user stats
- [ ] Community forum accessible
- [ ] Can create forum posts
- [ ] Navigation works across all pages

### Error Handling
- [ ] 404 page displays for invalid routes
- [ ] API errors show user-friendly messages
- [ ] Network errors handled gracefully
- [ ] Invalid form submissions show validation errors
- [ ] Unauthorized requests redirect to login

### Performance
- [ ] Initial page load < 3 seconds
- [ ] API responses < 500ms
- [ ] Images load properly
- [ ] No excessive bundle size warnings
- [ ] Lighthouse score > 80

---

## 📊 Monitoring Setup (Optional but Recommended)

### Error Tracking
- [ ] Set up Sentry or similar
- [ ] Add `SENTRY_DSN` to environment
- [ ] Test error reporting

### Analytics
- [ ] Set up Google Analytics, Plausible, or Posthog
- [ ] Add tracking ID to environment
- [ ] Verify events tracking

### Uptime Monitoring
- [ ] Set up UptimeRobot or similar
- [ ] Monitor `/health` endpoint
- [ ] Configure alerts

---

## 📚 Documentation Review

### User-Facing
- [ ] README.md is up-to-date
- [ ] Installation instructions accurate
- [ ] Environment setup documented
- [ ] Deployment guide reviewed

### Developer-Facing
- [ ] API documentation (Swagger) accessible
- [ ] Architecture documented
- [ ] Contributing guidelines clear
- [ ] Code of conduct present (if open source)

---

## 🎯 Post-Deployment

### Immediate (First Hour)
- [ ] Test all features in production
- [ ] Verify database connection
- [ ] Check logs for errors
- [ ] Test from different browsers
- [ ] Test on mobile device
- [ ] Share with team for testing

### First Day
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Gather user feedback
- [ ] Document any issues
- [ ] Plan hotfixes if needed

### First Week
- [ ] Review analytics
- [ ] Check for production bugs
- [ ] Optimize performance bottlenecks
- [ ] Plan next iteration
- [ ] Update documentation based on learnings

---

## 🚨 Rollback Plan

### If Deployment Fails
1. [ ] Check logs in platform dashboard
2. [ ] Verify environment variables
3. [ ] Test database connection
4. [ ] Check CORS configuration
5. [ ] Rollback to previous version if needed
6. [ ] Fix issue locally
7. [ ] Redeploy

### Emergency Contacts
- [ ] Document who to contact for:
  - Database issues
  - Hosting platform issues
  - DNS/domain issues
  - Code issues

---

## ✅ Final Sign-Off

Before going live, confirm:

- [ ] All critical items completed
- [ ] All tests passing
- [ ] Security review complete
- [ ] Team has reviewed
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Documentation updated

**Deployment Approved By:** ________________  
**Date:** ________________  
**Version:** 1.0.0  

---

## 📞 Need Help?

**Quick Guides:**
- `READINESS_EXECUTIVE_SUMMARY.md` - What you need to know
- `ENVIRONMENT_SETUP_QUICK_START.md` - Environment configuration
- `PROJECT_READINESS_ASSESSMENT.md` - Full assessment
- `DEPLOYMENT_GUIDE.md` - Deployment instructions

**Detailed Guides:**
- `apps/api/src/config/CONFIGURATION_GUIDE.md` - Configuration
- `LOCAL_TESTING_GUIDE.md` - Testing procedures
- `AUTH_TESTING_GUIDE.md` - Authentication testing

**Support:**
- Check logs in hosting platform dashboard
- Review error messages in browser console
- Search documentation for specific issues
- Open GitHub issue if needed

---

**Last Updated:** February 10, 2026  
**Next Review:** After production deployment

