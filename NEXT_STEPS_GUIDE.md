# Next Steps Guide

**Status:** ✅ API Running on Port 4010

---

## Step 1: Start the Frontend

Open a **NEW PowerShell window** (keep API running in the first window):

```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web"
.\start-web.ps1
```

OR manually:
```powershell
cd "C:\Users\desmo\GA Projects\VulHub-LeaderBoard-Web\apps\web"
pnpm dev -- -p 3010
```

**Wait for:** `✓ Ready in XXXms` message

---

## Step 2: Open the Application

Once frontend is ready, open your browser:

**URL:** http://localhost:3010

**What you should see:**
- Login page
- Email/password fields
- Login button

---

## Step 3: Test Login

**Use these credentials:**
- **Email:** `admin@vulhub.com`
- **Password:** `admin123`

**Click "Login"**

**Expected results:**
- ✅ Login request sent to API
- ✅ JWT tokens received
- ✅ Redirected to dashboard
- ✅ User info displayed
- ✅ No console errors

---

## Step 4: Verify Integration

### Check Browser Console (F12)
- ✅ No CORS errors
- ✅ No 401/403 errors
- ✅ API requests successful (200 status)
- ✅ Tokens stored in localStorage

### Check Dashboard
- ✅ User name/email visible
- ✅ Navigation menu works
- ✅ Page loads without errors

### Test Navigation
- ✅ Click different menu items
- ✅ Pages load correctly
- ✅ No broken links

---

## Step 5: Test API Endpoints

While logged in, you can test:

### Get User Profile
- Should show your admin user info

### Get Leaderboard
- Should show rankings and scores

### Get Projects
- Should list available projects

### Get Badges
- Should show available badges

---

## Troubleshooting

### Frontend Won't Start
- Check if port 3010 is available: `netstat -ano | findstr :3010`
- Kill process if needed
- Try again

### Can't Login
- Check API is running: http://localhost:4010/api/v1/health
- Check browser console for errors
- Verify credentials: `admin@vulhub.com` / `admin123`

### CORS Errors
- Make sure API `CORS_ORIGIN` includes `http://localhost:3010`
- Restart API with correct env vars

### Dashboard Doesn't Load
- Check browser console for specific errors
- Verify tokens in localStorage (F12 → Application → Local Storage)
- Try logging out and back in

---

## What Success Looks Like

✅ **Frontend:** http://localhost:3010 loads  
✅ **Login:** Works with admin credentials  
✅ **Dashboard:** Shows user info and navigation  
✅ **API Calls:** All requests return 200 OK  
✅ **No Errors:** Clean console, no CORS issues  

---

## Once Everything Works

You'll have completed:
- ✅ Phase 1, Task 1.1: Backend running
- ✅ Phase 1, Task 1.2: Frontend connected
- 🔄 Phase 1, Task 1.3: Ready to test user journeys

**Next:** Test critical user journeys (login, navigation, leaderboard, etc.)

---

**Remember:** Keep both terminals open:
- **Terminal 1:** API running (`.\start-api.ps1`)
- **Terminal 2:** Frontend running (`.\start-web.ps1`)

