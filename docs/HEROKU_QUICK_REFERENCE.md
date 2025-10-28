# ⚡ **GitHub Actions Heroku Quick Reference - VulHub Leaderboard**

**Date**: January 27, 2025  
**Status**: ✅ **PRODUCTION READY** - Essential GitHub Actions deployment commands  
**Priority**: **HIGH** - Quick deployment reference

---

## 🚀 **Essential Setup Steps**

### **1. Get Information from Professor**
- **Heroku App Name**: `vulhub-leaderboard-web`
- **Heroku API Key**: Secret key for deployment
- **Professor's Heroku Email**: Their Heroku account email

### **2. Add GitHub Secrets**
Go to GitHub → Settings → Secrets and variables → Actions → New repository secret

| Secret Name | Value |
|-------------|-------|
| `HEROKU_API_KEY` | `your-professor-api-key` |
| `HEROKU_APP_NAME` | `vulhub-leaderboard-web` |
| `HEROKU_EMAIL` | `professor@email.com` |

### **3. Deploy**
```bash
# Commit and push to trigger deployment
git add .
git commit -m "Deploy to Heroku"
git push origin main
```

### **4. Monitor Deployment**
- Go to GitHub → Actions tab
- Watch "Deploy to Heroku (Buildpacks)" workflow
- Wait for completion

---

## 🔍 **Verification Commands**

### **Check Deployment Status**
```bash
# Check if app is running
curl https://vulhub-leaderboard-web.herokuapp.com

# Check API health
curl https://vulhub-leaderboard-web.herokuapp.com/api/health
```

### **Check GitHub Actions**
- Go to GitHub → Actions tab
- Click on latest "Deploy to Heroku" run
- Review all steps for success

---

## 🚨 **Troubleshooting**

### **Common Issues**
- **"App not found"** → Check `HEROKU_APP_NAME` secret
- **Build failed** → Check GitHub Actions build logs
- **Database error** → Professor needs to add PostgreSQL addon
- **404 error** → Check Procfile and start script

### **Check Logs**
- GitHub Actions → Latest run → "Show Heroku logs" step
- Look for error messages and stack traces

---

## 📋 **Success Checklist**

- [ ] GitHub secrets added (3 secrets)
- [ ] Code pushed to main branch
- [ ] GitHub Actions workflow completed successfully
- [ ] App loads at `https://vulhub-leaderboard-web.herokuapp.com`
- [ ] API health endpoint returns 200
- [ ] Database migrations completed
- [ ] No critical errors in logs

---

## 🎯 **One-Line Deployment**

```bash
# Complete deployment in one command
git add . && git commit -m "Deploy to Heroku" && git push origin main
```

---

*Quick Reference completed on January 27, 2025. Use these steps for fast GitHub Actions Heroku deployment.*
