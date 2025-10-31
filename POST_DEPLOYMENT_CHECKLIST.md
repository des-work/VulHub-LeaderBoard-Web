# ✅ Post-Deployment Verification Checklist

**Time Required:** ~15 minutes  
**Goal:** Verify everything works after deployment

---

## Pre-Launch Checklist

### 1. Infrastructure Running

- [ ] **Supabase Database**
  - [ ] Project created
  - [ ] Connection string working
  - [ ] Migrations ran successfully
  - [ ] Tables exist in database
  
  **Test:**
  ```bash
  heroku logs -a vulhub-api | grep "Connected to database"
  ```

- [ ] **Heroku API**
  - [ ] App created
  - [ ] Code deployed
  - [ ] Environment variables set
  - [ ] Dyno is running (not crashed)
  
  **Test:**
  ```bash
  heroku ps -a vulhub-api
  heroku logs -a vulhub-api
  ```

- [ ] **Vercel Frontend**
  - [ ] Project imported
  - [ ] Build successful
  - [ ] Environment variables set
  - [ ] Deployed
  
  **Test:**
  Visit your Vercel URL in browser

---

### 2. API Functionality

- [ ] **Health Check**
  ```bash
  curl https://vulhub-api.herokuapp.com/api/v1/health
  ```
  **Expected:** Returns `{"status":"ok"...}`

- [ ] **Authentication**
  - [ ] Can call login endpoint
  - [ ] Returns token on success
  - [ ] Returns error on invalid credentials
  
  **Test:** Use Postman or curl:
  ```bash
  curl -X POST https://vulhub-api.herokuapp.com/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"admin@example.com","password":"password123"}'
  ```
  **Expected:** Returns `accessToken` and `refreshToken`

- [ ] **Protected Routes**
  - [ ] Returns 401 without token
  - [ ] Returns data with valid token
  
  **Test:**
  ```bash
  # Without token
  curl https://vulhub-api.herokuapp.com/api/v1/leaderboards
  
  # Should return 401 Unauthorized
  ```

- [ ] **Database Queries**
  - [ ] Can fetch users
  - [ ] Can fetch projects
  - [ ] Can fetch leaderboard
  
  **Test:**
  ```bash
  curl https://vulhub-api.herokuapp.com/api/v1/leaderboards \
    -H "Authorization: Bearer YOUR_TOKEN"
  ```

---

### 3. Frontend Functionality

**Note:** For these tests, use `https://your-vercel-url.vercel.app`

- [ ] **Page Loads**
  - [ ] Visit Vercel URL
  - [ ] See login page
  - [ ] No console errors (F12)
  - [ ] No 404 errors

- [ ] **Login Flow**
  - [ ] Enter credentials
  - [ ] Click "Login"
  - [ ] Successfully authenticated
  - [ ] Redirected to dashboard
  - [ ] No errors in DevTools Network tab
  
  **Test Credentials:**
  - Email: `admin@example.com`
  - Password: `password123`

- [ ] **Dashboard Page**
  - [ ] Loads after login
  - [ ] Shows leaderboard
  - [ ] Shows user info
  - [ ] Shows welcome card
  - [ ] Shows quick stats

- [ ] **Navigation**
  - [ ] COMMUNITY link → `/community` works
  - [ ] CHALLENGES link → `/challenges` works
  - [ ] BADGES link → `/badges` works
  - [ ] SUBMISSIONS link → `/submissions` works
  - [ ] PROFILE link → `/profile` works
  - [ ] RESOURCES link → `/resources` works

- [ ] **Logout**
  - [ ] Click logout button
  - [ ] Redirected to login
  - [ ] Token cleared
  - [ ] Cannot access protected pages

---

### 4. API-Frontend Integration

**With DevTools open (F12), on Network tab:**

- [ ] **API Calls Working**
  - [ ] Login call reaches Heroku API
  - [ ] Request shows Heroku domain (not localhost)
  - [ ] Response contains user data
  - [ ] Status code is 200/201

- [ ] **Data Displayed**
  - [ ] User name shows on dashboard
  - [ ] Leaderboard shows users
  - [ ] Stats display correctly
  - [ ] No "undefined" values

- [ ] **Error Handling**
  - [ ] Wrong password shows error message
  - [ ] Network error shows fallback UI
  - [ ] Invalid token redirects to login

---

### 5. Environment Verification

**Heroku:**
```bash
heroku config -a vulhub-api
```

Verify these are set:
- [ ] `DATABASE_URL` → Supabase connection string
- [ ] `NODE_ENV` → `production`
- [ ] `JWT_SECRET` → Set to something secure
- [ ] `PORT` → 3000 (or configured port)

**Vercel:**
Go to Vercel Dashboard → Settings → Environment Variables

Verify:
- [ ] `NEXT_PUBLIC_API_URL` → Correct Heroku URL
- [ ] `NODE_ENV` → `production`

---

### 6. Database Verification

**Check tables exist:**

**Option A: Using Supabase Dashboard**
1. Go to https://supabase.com
2. Login
3. Select your project
4. Click "Table Editor"
5. Verify you see:
   - [ ] `users` table
   - [ ] `projects` table
   - [ ] `submissions` table
   - [ ] `badges` table
   - [ ] Other expected tables

**Option B: Using command line**
```bash
heroku run "cd apps/api && pnpm prisma studio" -a vulhub-api
```

Opens admin UI to view database.

---

### 7. Logs & Monitoring

**Check for errors:**

```bash
# Heroku logs
heroku logs -a vulhub-api -n 100

# Should show:
# - "Connected to database"
# - "Listening on port 3000"
# - No ERROR or FATAL messages
```

**Vercel logs:**
1. Go to Vercel Dashboard
2. Click on your project
3. Click "Deployments" tab
4. Click on latest deployment
5. Check "Build Logs" and "Function Logs"
6. Should show successful build

---

### 8. Performance Checks

- [ ] **Page Load Time**
  - [ ] Dashboard loads in < 3 seconds
  - [ ] Navigation switches pages quickly

- [ ] **API Response Time**
  - [ ] API calls return in < 2 seconds
  - [ ] No timeouts

- [ ] **No Memory Leaks**
  - [ ] Open DevTools Memory tab
  - [ ] Perform several actions
  - [ ] Memory usage stable (not continuously increasing)

---

### 9. Security Checks

- [ ] **HTTPS**
  - [ ] Both frontend and API use HTTPS
  - [ ] No mixed content warnings
  - [ ] SSL certificate valid

- [ ] **Tokens**
  - [ ] JWT tokens present in localStorage
  - [ ] Tokens not exposed in logs
  - [ ] Refresh token working

- [ ] **CORS**
  - [ ] Frontend can reach API
  - [ ] No CORS errors in console
  - [ ] API accepts requests from Vercel domain

- [ ] **Password Security**
  - [ ] Passwords not logged
  - [ ] HTTPS enforced
  - [ ] JWT properly signed

---

### 10. Data Persistence

- [ ] **Data Survives Restart**
  1. Create test data (if possible)
  2. Restart Heroku: `heroku restart -a vulhub-api`
  3. Verify data still exists

- [ ] **Database Backups**
  - [ ] Supabase backups are running (check dashboard)
  - [ ] Can view backup history

---

## Issue Resolution

### If Any Check Fails:

#### Check 1: API Not Reachable

**Steps:**
1. Verify API URL is correct:
   ```bash
   curl https://vulhub-api.herokuapp.com/api/v1/health
   ```
2. Check Heroku logs:
   ```bash
   heroku logs -a vulhub-api
   ```
3. Check dyno is running:
   ```bash
   heroku ps -a vulhub-api
   ```
4. If crashed, check error in logs

#### Check 2: Database Connection Failed

**Steps:**
1. Verify `DATABASE_URL`:
   ```bash
   heroku config:get DATABASE_URL -a vulhub-api
   ```
2. Test Supabase connection directly
3. Ensure all migrations ran:
   ```bash
   heroku run "cd apps/api && pnpm prisma db push" -a vulhub-api
   ```

#### Check 3: Frontend Can't Reach API

**Steps:**
1. Verify `NEXT_PUBLIC_API_URL` in Vercel env vars
2. Check Network tab in DevTools to see actual URL being called
3. If still localhost, rebuild Vercel deployment
4. Check CORS headers in API response

#### Check 4: Login Fails

**Steps:**
1. Check credentials are correct
2. Verify database has user data:
   ```bash
   heroku run "cd apps/api && pnpm prisma studio" -a vulhub-api
   ```
3. Check logs for database errors
4. Verify `JWT_SECRET` is set

#### Check 5: Pages Not Loading

**Steps:**
1. Check browser console for errors
2. Check Vercel deployment logs
3. Verify build was successful
4. Try clearing browser cache (Ctrl+Shift+Delete)

---

## Success Criteria

### ✅ System is Ready for Launch if:

1. ✅ Frontend loads at Vercel URL
2. ✅ Can login successfully
3. ✅ Dashboard displays correctly
4. ✅ All navigation works
5. ✅ No console errors
6. ✅ API calls show Heroku domain
7. ✅ Database has all tables
8. ✅ Logs show no errors
9. ✅ Responsive on mobile (optional)
10. ✅ HTTPS everywhere

### 🚀 Ready for Launch!

If all checks pass, your application is ready for production!

---

## Post-Launch Monitoring

### Recommended:

1. **Check Logs Daily**
   ```bash
   heroku logs -a vulhub-api --tail
   ```

2. **Monitor Errors**
   - Consider adding Sentry for error tracking
   - Set up email alerts for crashes

3. **Database Monitoring**
   - Watch disk usage in Supabase
   - Monitor query performance

4. **User Feedback**
   - Monitor error messages users report
   - Track performance issues

---

## Troubleshooting Resources

| Issue | Resource |
|-------|----------|
| Heroku Issues | `heroku logs -a vulhub-api` |
| Database Issues | Supabase Dashboard |
| Frontend Issues | Vercel Dashboard |
| API Integration | Browser DevTools Network tab |
| General Help | Check individual deployment guides |

---

## Next Steps

Once everything is verified:

1. ✅ Share URL with team
2. ✅ Set up monitoring
3. ✅ Plan domain setup
4. ✅ Monitor for issues
5. ✅ Iterate and improve

**Congratulations! Your app is live! 🎉**
