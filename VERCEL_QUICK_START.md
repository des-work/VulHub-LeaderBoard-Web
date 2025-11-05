# ⚡ VERCEL DEPLOYMENT - QUICK START (2 MINUTES)

---

## 🚀 DEPLOY NOW (3 STEPS)

### Step 1: Push Code
```bash
git push origin main
```

### Step 2: Set Environment Variables
Go to **Vercel Dashboard** → **Settings** → **Environment Variables**

Add these for **Production**:
```
NODE_ENV = production
DATABASE_URL = file:/tmp/vulhub.db
JWT_SECRET = <run: openssl rand -hex 32>
JWT_REFRESH_SECRET = <run: openssl rand -hex 32>
NEXT_PUBLIC_API_URL = https://YOUR-PROJECT.vercel.app/api
CORS_ORIGIN = https://YOUR-PROJECT.vercel.app
```

### Step 3: Done!
Your app is deployed! Visit: `https://YOUR-PROJECT.vercel.app`

---

## 📋 BEFORE YOU DEPLOY

```bash
npm run type-check  # ✅ No errors
npm run lint        # ✅ No warnings
npm run build       # ✅ Builds successfully
npm run dev:local   # ✅ Runs locally
```

---

## 🔑 GENERATE SECRETS

```bash
# Mac/Linux
openssl rand -hex 32

# Windows  
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## ✅ VERIFY DEPLOYMENT

After deploying, check:
- [ ] Page loads at your domain
- [ ] Can login (use test credentials)
- [ ] Leaderboard displays
- [ ] No 404 errors in console

---

## 📚 FULL GUIDES

Need more details?
- **Complete Guide:** `VERCEL_DEPLOYMENT_UPDATED.md`
- **Checklist:** `VERCEL_DEPLOYMENT_CHECKLIST.md`
- **Advanced:** `VERCEL_ADVANCED_CONFIG.md`
- **Summary:** `VERCEL_DEPLOYMENT_SUMMARY.md`

---

## 🆘 TROUBLESHOOTING

### Build Failed?
1. Check logs: Vercel Dashboard → Deployments → Logs
2. Run locally: `npm run build`
3. Fix errors
4. Push again

### 404 Errors?
1. Check NEXT_PUBLIC_API_URL matches your domain
2. Verify environment variables set

### Login Not Working?
1. Check JWT_SECRET is set
2. Try in new browser window
3. Check browser console for errors

---

## 📞 SUPPORT

- **Vercel Docs:** https://vercel.com/docs
- **See:** VERCEL_DEPLOYMENT_UPDATED.md (Troubleshooting section)

---

**Status:** ✅ Ready to Deploy  
**Time:** ~5 minutes total  
**Difficulty:** ⭐ Very Easy

