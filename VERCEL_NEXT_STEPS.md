# 🚀 VERCEL DEPLOYMENT - COMPLETE SETUP GUIDE

## ✅ Project Created Successfully!

Your Vercel project `vul-hub-leader-board-full-stack` is now ready. Follow these steps to complete the deployment.

---

## 📋 STEP-BY-STEP SETUP

### STEP 1: Set Environment Variables in Vercel

1. In the Vercel dashboard you're looking at
2. Click **Settings** (top navigation)
3. Click **Environment Variables** (left sidebar)
4. Add each variable below by clicking "Add New"

**Required Variables**:
```
DATABASE_URL                = file:/tmp/vulhub.db
NODE_ENV                    = production
JWT_SECRET                  = [GENERATE BELOW]
JWT_EXPIRES_IN              = 15m
NEXT_PUBLIC_API_URL         = /api
```

**Optional Variables**:
```
JWT_REFRESH_SECRET          = [GENERATE BELOW]
JWT_REFRESH_EXPIRES_IN      = 7d
CORS_ORIGIN                 = https://vul-hub-leader-board-full-stack.vercel.app
```

**Generate Secrets** (run in terminal):
```bash
openssl rand -hex 32
```

This gives you a 64-character secure random string. Generate this twice:
- Once for `JWT_SECRET`
- Once for `JWT_REFRESH_SECRET`

⚠️ **IMPORTANT**: Set all variables for **Production** environment.

---

### STEP 2: Deploy to Production

After setting environment variables:

1. Click **Deployments** (top navigation)
2. Find the latest deployment (should show building or building failed)
3. Click the "..." menu on that deployment
4. Click **Promote to Production**

OR

1. Push code to `main` branch:
   ```bash
   git push origin main
   ```
2. Vercel auto-deploys

---

### STEP 3: Wait for Build Completion

The build takes 2-5 minutes. You'll see:
- ✅ **Building** → **Ready** (success)
- ❌ **Building** → **Error** (check logs)

Monitor in the **Deployments** tab.

---

### STEP 4: Test Your Deployment

Once deployment is ready:

1. Click **Visit** button (top right)
2. This opens your live site
3. Test the login page
4. Try logging in with test credentials:
   - Email: `student@example.com`
   - Password: `student123`

---

### STEP 5: Configure Custom Domain (Optional)

If you want a custom domain:

1. Go to **Settings** → **Domains**
2. Click **Add Domain**
3. Enter your domain
4. Follow Vercel's DNS setup instructions

---

## 🔗 Important URLs

Once deployed:

- **Frontend**: `https://vul-hub-leader-board-full-stack.vercel.app`
- **API**: `https://vul-hub-leader-board-full-stack.vercel.app/api`
- **Dashboard**: Your Vercel dashboard link

---

## 🧪 Testing API Endpoints

Test that the API is working:

```bash
# Test health check
curl https://vul-hub-leader-board-full-stack.vercel.app/api/health

# Test login (replace YOUR_EMAIL and YOUR_PASSWORD)
curl -X POST https://vul-hub-leader-board-full-stack.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"student123"}'
```

---

## 📊 Monitoring & Debugging

### Check Build Logs
1. Click **Deployments** tab
2. Click on a deployment
3. Click **Build Logs** to see what happened

### Check Runtime Logs
1. Click **Logs** (top navigation)
2. See real-time application logs
3. Look for errors

### Check Function Logs
1. Click **Deployments** tab
2. Click on a deployment
3. Scroll to see function logs

---

## ⚠️ Important Notes

### Database
- **SQLite in `/tmp`**: Data is ephemeral (lost on restart)
- **Best for**: Development, demos
- **Not persistent**: Each deployment creates a fresh database

### File Storage
- **Uploads in `/tmp`**: Files are ephemeral
- **Lost on restart**: Don't use for production data

### Environment Variables
- Each variable should be set for **Production** environment
- Changes to env vars require a **redeploy**
- To redeploy: Push to main or promote a deployment

---

## ✅ Deployment Checklist

- [ ] Project created in Vercel
- [ ] Environment variables set for Production
- [ ] Build completed successfully
- [ ] Site is accessible via URL
- [ ] Login works with test credentials
- [ ] API endpoints respond correctly
- [ ] No errors in Logs tab

---

## 🐛 Troubleshooting

### Build Failed
- Check **Build Logs** for errors
- Common: Missing environment variables
- Solution: Verify all required vars are set

### Login Not Working
- Check `JWT_SECRET` is set
- Check database initialized (visit `/api/health`)
- Check browser console for errors

### API Returns 500 Error
- Check **Logs** tab for error details
- Check `DATABASE_URL` is correct
- Check all env vars are set

### Can't See Live Site
- Click **Visit** button to open
- Wait for deployment to complete (Ready status)
- Check that domain/URL is correct

---

## 🎉 You're Almost Done!

Once deployment succeeds and you can login:
1. Your full-stack app is live! 🚀
2. Database auto-initializes on first request
3. All API endpoints are available

**Next Steps**:
- Share your URL with others
- Add custom domain (optional)
- Monitor performance in Observability tab
- Set up error alerts (optional)

---

**Need Help?**
- Check Vercel docs: https://vercel.com/docs
- Check your project logs
- Review error messages in dashboard

**Congratulations on your deployment!** 🎊

