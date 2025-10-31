# 🌐 Vercel Frontend Deployment Guide

**Time Required:** ~10 minutes  
**Prerequisites:**
- GitHub account with code pushed
- Heroku API deployed and running

---

## Table of Contents

1. [Create Vercel Account](#create-vercel-account)
2. [Import Project](#import-project)
3. [Configure for Monorepo](#configure-for-monorepo)
4. [Set Environment Variables](#set-environment-variables)
5. [Deploy](#deploy)
6. [Verify Deployment](#verify-deployment)

---

## Create Vercel Account

### Step 1: Visit Vercel

1. Open https://vercel.com in your browser
2. Click **"Sign Up"** button (top right)

### Step 2: Sign Up

Choose sign-up method:
- **Recommended:** GitHub (easiest)
  - Click **"Continue with GitHub"**
  - Authorize Vercel to access your repositories
  
- **Alternative:** Email/other methods available

### Step 3: Grant Permissions

Vercel will ask to:
- Read access to public/private repos
- Read/write access to GitHub

Click **"Authorize Vercel"** to proceed.

---

## Import Project

### Step 1: Import Repository

After sign-up, you should see "Import Project" screen.

If not:
1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**

### Step 2: Find Your Repository

1. You should see list of your GitHub repos
2. Find **`VulHub-LeaderBoard-Web`**
3. Click **"Import"** button next to it

### Step 3: Create Team (Optional)

You may be asked to create a team or select personal account.
- Choose **personal account** to keep it simple

---

## Configure for Monorepo

### Step 1: Project Settings

After importing, you'll see configuration page.

Vercel should auto-detect:
- **Framework:** Next.js ✓
- **Root Directory:** Should be `./apps/web` or auto-detected

### Step 2: Verify Settings

Check these settings:

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | Next.js | Should auto-detect |
| **Root Directory** | `./apps/web` | Where Next.js app is |
| **Build Command** | `pnpm build` | Should auto-fill |
| **Output Directory** | `.next` | Should auto-fill |
| **Node Version** | 18.x or latest | Default is fine |

If Root Directory is wrong:
1. Click on the dropdown
2. Select `./apps/web`

---

## Set Environment Variables

### Step 1: Add Environment Variables

1. Look for **"Environment Variables"** section
2. Click to expand or **"Add New Environment Variable"**

### Step 2: Add API URL

Add this variable:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_API_URL` | `https://vulhub-api.herokuapp.com/api/v1` |

**Important:** Replace with your actual Heroku API URL

This tells the frontend where to find the API.

### Step 3: Add Other Variables (Optional)

```
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=VulHub
```

### Step 4: Save

Click **"Save"** to confirm environment variables.

---

## Deploy

### Step 1: Start Deployment

Click the **"Deploy"** button to start deployment.

You'll see:
```
Preparing build...
Installing dependencies...
Building application...
Finalizing deployment...
```

### Step 2: Wait for Completion

First deployment takes 2-5 minutes.

You'll see progress like:
```
✓ Build completed
✓ Optimization complete
✓ Deployed!
```

### Step 3: Get Your URL

Once deployed, you'll see:
```
Congratulations! 🎉

Your project has been successfully deployed.

Visit: https://your-project.vercel.app
```

**Copy and save your Vercel URL!**

---

## Verify Deployment

### Step 1: Visit Your App

1. Click on the URL shown in Vercel
2. Or go to https://your-project.vercel.app

You should see:
- VulHub login page
- No errors in console

### Step 2: Check Console

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Should be clear with no errors

### Step 3: Test Login

1. Enter test credentials:
   - Email: `admin@example.com`
   - Password: `password123`

2. Click Login

3. Watch for:
   - ✅ Login request sent (check Network tab)
   - ✅ Dashboard loads
   - ✅ No errors in console

### Step 4: Check API Communication

1. With DevTools open, go to **Network** tab
2. Try login again
3. Look for requests like:
   - `POST /api/v1/auth/login` → Should return 200
   - Should show Heroku domain in URL

### Step 5: Navigate Pages

Test navigation:
- ✅ Click "COMMUNITY" → Works?
- ✅ Click "CHALLENGES" → Works?
- ✅ Click "DASHBOARD" → Works?
- ✅ Click "PROFILE" → Works?

---

## Set Up Auto-Deployment

### Automatic Deployments

Vercel automatically deploys when you push to GitHub!

1. Any push to `main` branch → Auto-deploys
2. Pull requests → Preview deployments

### Test Auto-Deployment

1. Make small change locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Test auto-deployment"
   git push origin main
   ```
3. Go to Vercel dashboard
4. Should see new deployment starting
5. Once done, visit your URL to see changes

---

## Custom Domain (Optional)

Once you have a domain name:

### Step 1: Add Domain

1. In Vercel, go to Settings → Domains
2. Add your domain
3. Vercel will show DNS records to add

### Step 2: Update DNS

1. Go to your domain provider
2. Add DNS records Vercel provided
3. Wait 5-30 minutes for propagation

### Step 3: Verify

Visit your domain - should work!

---

## Troubleshooting

### Build Failed

**Check build logs:**
1. In Vercel dashboard, click on failed deployment
2. See the error message
3. Common causes:
   - Missing dependencies
   - Environment variable not set
   - Build script error

**Fix:**
1. Make changes locally
2. Test: `pnpm build`
3. Push to GitHub
4. Vercel redeploys automatically

### "Cannot reach API"

**Symptom:** Frontend shows "API error" or network errors

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is set correctly
2. Verify Heroku API is running:
   ```bash
   curl https://vulhub-api.herokuapp.com/api/v1/health
   ```
3. Check CORS settings if needed

### Blank Page or 404

**Symptom:** Visit URL and see blank page

**Solution:**
1. Check browser console (F12)
2. Look for 404 or other errors
3. Verify root directory was set to `./apps/web`
4. Redeploy in Vercel

### Env Variables Not Working

**Symptom:** API endpoint is localhost instead of Heroku

**Solution:**
1. Check `NEXT_PUBLIC_API_URL` is set in Vercel
2. Rebuild: Click **Deployments** → **Redeploy**
3. Environment variables require rebuild to take effect

---

## Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project:** https://vercel.com/dashboard/your-username/your-project
- **Deployments:** Check history and logs
- **Settings:** Configure domains, env vars, etc.

---

## ✅ Next Steps

1. ✅ Frontend deployed on Vercel
2. ✅ API deployed on Heroku
3. ✅ Database connected
4. ⏭️ Full system testing
5. ⏭️ Monitor for errors

See `POST_DEPLOYMENT_CHECKLIST.md` for verification steps.
