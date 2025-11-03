# 🧪 LOCAL TESTING GUIDE

**Status:** ✅ Both servers running  
**Date:** November 3, 2025

---

## 🟢 SERVERS RUNNING

### Frontend (Next.js)
- **URL:** http://localhost:3000
- **Status:** ✅ Running
- **Port:** 3000

### Backend API (NestJS)
- **URL:** http://localhost:4010 (or check your .env file)
- **Status:** ✅ Running (background)
- **Port:** Configured in `.env.local`

---

## 📋 TESTING CHECKLIST

### 1. Homepage Test ✅
**URL:** http://localhost:3000

**What to check:**
- [ ] Page loads without errors
- [ ] VulHub Leaderboard title displays
- [ ] Matrix theme styling applied
- [ ] Navigation visible

**Expected:** Page loads with 404 (if not logged in) or redirects to auth

---

### 2. Authentication Test
**URL:** http://localhost:3000/auth

**What to check:**
- [ ] Castle Siege Animation plays
- [ ] "Skip Intro" button visible
- [ ] Animation can be skipped
- [ ] Login form appears after animation
- [ ] Can enter credentials
- [ ] Login submits successfully

**Test Credentials:** (Use your test account or create one)

---

### 3. Navigation Test (After Login)

**Test these pages:**

#### Leaderboard
- **URL:** http://localhost:3000/
- [ ] Leaderboard displays
- [ ] Rankings visible
- [ ] User scores shown
- [ ] Animations work

#### Community
- **URL:** http://localhost:3000/community
- [ ] Forum loads
- [ ] Posts visible
- [ ] Can create new posts
- [ ] Styling correct

#### Profile
- **URL:** http://localhost:3000/profile
- [ ] Profile page loads
- [ ] User stats display
- [ ] Submission history visible
- [ ] Edit options available

#### Grading (If instructor)
- **URL:** http://localhost:3000/grading
- [ ] Submission list loads
- [ ] Can filter submissions
- [ ] Can view submission details
- [ ] Grading interface works

---

### 4. Core Functionality Tests

#### Challenge Submission
- [ ] Can upload challenge files
- [ ] Validation works
- [ ] Submission confirms
- [ ] Status updates

#### Notifications
- [ ] In-app notifications appear
- [ ] Toast messages display
- [ ] Can dismiss notifications
- [ ] Read/unread status works

#### Error Handling
- [ ] 404 page displays correctly
- [ ] Error boundaries catch errors
- [ ] Error messages are user-friendly
- [ ] Can recover from errors

---

### 5. Animation System Test

**URL:** http://localhost:3000/auth

**Specific checks:**
- [ ] Canvas renders
- [ ] Castle appears
- [ ] Projectiles fly
- [ ] Explosions visible
- [ ] Stars twinkling
- [ ] Performance smooth (no lag)
- [ ] Skip button works
- [ ] Completes and transitions to login

**Console Check:**
- Open browser DevTools (F12)
- Check Console tab
- Should see: Minimal or no errors
- Animation logs (if debug mode)

---

### 6. Browser Console Check

**Open DevTools (F12) → Console**

**Should NOT see:**
- ❌ Red errors (critical)
- ❌ Failed API calls (unless expected)
- ❌ TypeScript errors
- ❌ Missing module errors

**OK to see:**
- ⚠️ Yellow warnings (minor)
- ℹ️ Info logs (normal)
- 🔵 Debug logs (if enabled)

---

### 7. Network Tab Check

**Open DevTools (F12) → Network**

**Check API calls:**
- [ ] `/api/auth/me` - 200 or 401
- [ ] `/api/leaderboard` - 200
- [ ] `/api/submissions` - 200
- [ ] All requests have responses
- [ ] No 500 errors

---

### 8. Responsive Design Test

**Test on different sizes:**
- [ ] Desktop (1920x1080)
- [ ] Laptop (1366x768)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Check:**
- [ ] Layout adjusts properly
- [ ] No horizontal scrolling
- [ ] Touch targets adequate
- [ ] Text readable

---

### 9. Performance Test

**Check these metrics:**

#### Page Load Time
- Homepage: < 2 seconds
- Auth page: < 3 seconds (with animation)
- Other pages: < 1.5 seconds

#### Animation Performance
- FPS: 30-60 fps
- No frame drops
- Smooth transitions
- Memory usage stable

**How to check:**
- DevTools → Performance tab
- Record → Reload page
- Check metrics

---

### 10. Database Connection Test

**If you have database setup:**

**Test these:**
- [ ] Can create user account
- [ ] Login persists session
- [ ] Data saves correctly
- [ ] Queries return results
- [ ] Relationships work

**Without database:**
- App should use mock data
- Still functional for testing

---

## 🐛 COMMON ISSUES & FIXES

### Issue: "Connection Refused" on API
**Fix:** 
- Check API is running: `ps aux | grep nest`
- Check port in `.env.local`: `API_URL=http://localhost:4010`
- Restart API: `cd apps/api && npm run start:dev`

### Issue: Animation Not Loading
**Fix:**
- Check browser console for errors
- Verify canvas support: Modern browser required
- Clear cache: Ctrl+Shift+R (hard reload)
- Check `config.ts` is complete

### Issue: Login Fails
**Fix:**
- Check API is running
- Verify database connection
- Check credentials are correct
- Check network tab for API errors

### Issue: Page Won't Load
**Fix:**
- Check both servers running
- Verify ports not in use: `netstat -ano | findstr :3000`
- Clear browser cache
- Check `.env.local` configuration

### Issue: Build/TypeScript Errors
**Fix:**
- Run: `npm run build` to verify
- Check: No red errors in terminal
- Verify: All dependencies installed

---

## ✅ SUCCESS CRITERIA

**All tests passing if:**
1. ✅ Both servers start without errors
2. ✅ Pages load correctly
3. ✅ Animation plays smoothly
4. ✅ Navigation works
5. ✅ Login functional
6. ✅ No console errors (critical)
7. ✅ API endpoints respond
8. ✅ Data persists (if DB setup)

---

## 🚀 NEXT STEPS

**If all tests pass:**
1. ✅ Commit your changes
2. ✅ Proceed to production deployment
3. ✅ Follow `QUICK_HEROKU_DEPLOYMENT.md`

**If tests fail:**
1. Check error messages
2. Review console logs
3. Fix issues
4. Re-test
5. Repeat until all pass

---

## 📝 TEST REPORT TEMPLATE

```
Date: ___________
Tester: _________

✅ = Pass | ⚠️ = Issues | ❌ = Fail

[ ] Homepage loads
[ ] Animation plays
[ ] Login works
[ ] Navigation functional
[ ] No console errors
[ ] Performance good
[ ] Responsive design
[ ] API responding

Issues found:
_______________________________
_______________________________

Overall Status: _______________
Ready for deployment: YES / NO
```

---

## 🎯 QUICK TEST COMMAND

**To verify everything:**
```bash
# Open browser to http://localhost:3000
# Press F12 for DevTools
# Click through all pages
# Check console for errors
# Test login flow
# Verify animation
```

**Estimated time:** 10-15 minutes

---

**Happy Testing! 🧪**

