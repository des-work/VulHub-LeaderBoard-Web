# 🚀 **Heroku Deployment Guide - VulHub Leaderboard (GitHub Actions)**

**Date**: January 27, 2025  
**Status**: ✅ **PRODUCTION READY** - GitHub Actions deployment guide  
**Priority**: **HIGH** - Automated deployment via GitHub Actions

---

## 📋 **Prerequisites**

Before deploying, ensure you have:
- [ ] GitHub repository with your code
- [ ] Heroku app name from your professor
- [ ] Heroku API key from your professor
- [ ] Professor's Heroku account email
- [ ] Code committed to GitHub repository

---

## 🛠️ **Step 1: Verify App Deployability**

### **1.1 Check Buildpack Requirements**
Our app uses **Node.js buildpacks** with:
- ✅ `package.json` - Present in root and apps
- ✅ `Procfile` - Will be created
- ✅ Node.js server configuration

### **1.2 Verify Package.json Structure**
```json
// Root package.json
{
  "name": "vulhub-leaderboard",
  "scripts": {
    "build": "turbo run build",
    "start": "pnpm --filter @vulhub/web start",
    "heroku-postbuild": "pnpm install && pnpm build"
  },
  "engines": {
    "node": ">=18.0.0",
    "pnpm": ">=8.0.0"
  }
}
```

---

## 🎯 **Step 2: Get Heroku App Information**

### **2.1 Required Information from Professor**
- **Heroku App Name**: `vulhub-leaderboard-web` (or whatever your professor provides)
- **Heroku API Key**: Secret key for deployment
- **Heroku Email**: Professor's Heroku account email

### **2.2 Verify App Name**
```bash
# Your professor should provide something like:
# App Name: vulhub-leaderboard-web
# This will be your deployment target
```

---

## 🔐 **Step 3: Add GitHub Secrets**

### **3.1 Navigate to GitHub Secrets**
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### **3.2 Add Required Secrets**
Add these three secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `HEROKU_API_KEY` | `your-professor-api-key` | API key from professor |
| `HEROKU_APP_NAME` | `vulhub-leaderboard-web` | App name from professor |
| `HEROKU_EMAIL` | `professor@email.com` | Professor's Heroku email |

### **3.3 Verify Secrets Added**
- All three secrets should appear in the repository secrets list
- They are encrypted and secure

---

## ⚙️ **Step 4: Create GitHub Actions Workflow**

### **4.1 Create Workflow Directory**
```bash
mkdir -p .github/workflows
```

### **4.2 Create Deploy Workflow**
Create `.github/workflows/deploy.yml`:
