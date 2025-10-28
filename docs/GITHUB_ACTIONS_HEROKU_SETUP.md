# 🚀 **GitHub Actions Heroku Deployment - Complete Setup Guide**

**Date**: January 27, 2025  
**Status**: ✅ **PRODUCTION READY** - Complete automated deployment setup  
**Priority**: **HIGH** - Step-by-step GitHub Actions deployment

---

## 📋 **What You Need from Your Professor**

Before starting, get these from your professor:
- [ ] **Heroku App Name**: `vulhub-leaderboard-web` (or whatever they provide)
- [ ] **Heroku API Key**: Secret key for deployment
- [ ] **Professor's Heroku Email**: Their Heroku account email

---

## 🛠️ **Step 1: Verify Your App is Ready**

### **✅ Files Already Created**
- ✅ `.github/workflows/deploy.yml` - GitHub Actions workflow
- ✅ `Procfile` - Heroku process file
- ✅ `package.json` - Updated with Heroku scripts
- ✅ `apps/web/package.json` - Correct start script

### **✅ App Structure Verified**
- ✅ Node.js buildpack compatible
- ✅ Monorepo with pnpm workspaces
- ✅ Next.js web application
- ✅ NestJS API backend

---

## 🔐 **Step 2: Add GitHub Secrets**

### **2.1 Navigate to GitHub Secrets**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### **2.2 Add These Three Secrets**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `HEROKU_API_KEY` | `your-professor-api-key` | API key from professor |
| `HEROKU_APP_NAME` | `vulhub-leaderboard-web` | App name from professor |
| `HEROKU_EMAIL` | `professor@email.com` | Professor's Heroku email |

### **2.3 Verify Secrets**
- All three secrets should appear in the repository secrets list
- They are encrypted and secure

---

## 🚀 **Step 3: Deploy Your App**

### **3.1 Commit and Push**
```bash
# Add all files
git add .

# Commit the changes
git commit -m "Add GitHub Actions Heroku deployment"

# Push to trigger deployment
git push origin main
```

### **3.2 Monitor Deployment**
1. Go to your GitHub repository
2. Click **Actions** tab
3. Watch the "Deploy to Heroku (Buildpacks)" workflow
4. Wait for it to complete successfully

---

## ⚙️ **Step 4: Environment Variables (Automatic)**

The GitHub Actions workflow automatically sets these environment variables:
- ✅ `JWT_SECRET` - Randomly generated secure key
- ✅ `REFRESH_TOKEN_SECRET` - Randomly generated secure key
- ✅ `NODE_ENV` - Set to "production"
- ✅ `CORS_ORIGIN` - Set to your Heroku app URL
- ✅ `API_PORT` - Set to 3001

---

## 🗄️ **Step 5: Database Setup (Professor Required)**

### **5.1 Professor Must Add Addons**
Your professor needs to add these addons to the Heroku app:
```bash
# Add PostgreSQL database
heroku addons:create heroku-postgresql:mini -a vulhub-leaderboard-web

# Add Redis cache
heroku addons:create heroku-redis:mini -a vulhub-leaderboard-web
```

### **5.2 Database Migrations (Automatic)**
The GitHub Actions workflow automatically runs:
```bash
pnpm --filter @vulhub/api prisma migrate deploy
```

---

## 🔍 **Step 6: Verify Deployment**

### **6.1 Check App Status**
After deployment completes:
1. Go to `https://vulhub-leaderboard-web.herokuapp.com`
2. Verify the app loads correctly
3. Test the API health endpoint: `https://vulhub-leaderboard-web.herokuapp.com/api/health`

### **6.2 Check GitHub Actions Logs**
1. Go to **Actions** tab in GitHub
2. Click on the latest "Deploy to Heroku" run
3. Check all steps completed successfully
4. Review the "Show Heroku logs" step for any errors

---

## 🚨 **Troubleshooting**

### **Common Issues & Solutions**

#### **"App not found" Error**
- **Problem**: `HEROKU_APP_NAME` doesn't match the actual app
- **Solution**: Double-check the app name with your professor

#### **Build Failed**
- **Problem**: Missing dependencies or build errors
- **Solution**: Check the build logs in GitHub Actions

#### **Database Connection Failed**
- **Problem**: PostgreSQL addon not added
- **Solution**: Ask professor to add `heroku-postgresql:mini` addon

#### **App Crashes After Deployment**
- **Problem**: Missing environment variables or port issues
- **Solution**: Check Heroku logs in the GitHub Actions output

#### **404 Error on App**
- **Problem**: Procfile or start script issues
- **Solution**: Verify `Procfile` contains `web: pnpm --filter @vulhub/web start`

---

## 📊 **Deployment Process Overview**

### **What Happens During Deployment**
1. **Code Checkout**: GitHub Actions checks out your code
2. **Node.js Setup**: Installs Node.js 20 and pnpm
3. **Environment Variables**: Sets Heroku config vars
4. **Deploy**: Pushes code to Heroku
5. **Database Migrations**: Runs Prisma migrations
6. **Logs**: Shows deployment logs for debugging

### **Timeline**
- **Total Time**: ~5-10 minutes
- **Build Time**: ~3-5 minutes
- **Deploy Time**: ~2-3 minutes
- **Migration Time**: ~1-2 minutes

---

## 🎯 **Success Criteria**

Your deployment is successful when:
- ✅ **GitHub Actions**: All steps completed successfully
- ✅ **App URL**: `https://vulhub-leaderboard-web.herokuapp.com` loads
- ✅ **API Health**: Health endpoint returns 200 status
- ✅ **Database**: Migrations completed without errors
- ✅ **Logs**: No critical errors in Heroku logs

---

## 🔄 **Future Deployments**

### **Automatic Deployments**
- Every push to `main` branch triggers deployment
- Manual deployment available via GitHub Actions UI
- No need to run commands manually

### **Manual Deployment**
1. Go to **Actions** tab in GitHub
2. Click **Deploy to Heroku (Buildpacks)**
3. Click **Run workflow**
4. Select branch and click **Run workflow**

---

## 📞 **Support**

If you encounter issues:
1. **Check GitHub Actions Logs**: Look for error messages
2. **Check Heroku Logs**: Review the "Show Heroku logs" step
3. **Verify Secrets**: Ensure all three secrets are set correctly
4. **Contact Professor**: For Heroku app access or addon issues

---

## 🎉 **You're Ready to Deploy!**

Your VulHub Leaderboard is now configured for automated Heroku deployment via GitHub Actions. Just:

1. **Get the secrets from your professor**
2. **Add them to GitHub repository secrets**
3. **Push your code to trigger deployment**
4. **Monitor the deployment in GitHub Actions**

**Your app will be live at `https://vulhub-leaderboard-web.herokuapp.com`! 🚀**

---

*GitHub Actions Heroku Deployment Guide completed on January 27, 2025. Follow these steps for automated deployment.*
