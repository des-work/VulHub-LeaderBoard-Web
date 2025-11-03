# 🔍 LOGIN REDIRECT DEBUG TEST GUIDE

**Date:** November 3, 2025  
**Goal:** Verify login redirects to home page correctly

---

## 🧪 TEST STEPS

### **STEP 1: Open Browser Console**
1. Go to `http://localhost:3000/auth` (or `http://localhost:3003/auth` if port changed)
2. Open **Developer Tools** (F12)
3. Click **Console** tab
4. Keep the console open while testing

### **STEP 2: Enter Login Credentials**
Use **mock credentials** (mock auth is enabled):
```
Email: admin@vulhub.com
Password: test123
```

Or:
```
Email: student@vulhub.com
Password: anything
```

### **STEP 3: Watch Console for Debug Logs**
You should see logs in this order:

```
[AuthPage] handleSubmit called with: { email: "admin@vulhub.com" }
[AuthPage] Calling login...
[authReducer] action: LOGIN_START current state: {...}
[AuthContext] login called with: { email: "admin@vulhub.com" }
[AuthContext] authService.login returned: { user: {...} }
[AuthContext] Tokens and user data stored
[authReducer] action: LOGIN_SUCCESS current state: {...}
[authReducer] LOGIN_SUCCESS - updating state to authenticated
[AuthContext] LOGIN_SUCCESS dispatched
[AuthPage] Login successful, isAuthenticated should be true now
[AuthPage] Authenticated, scheduling redirect to home
[AuthPage] Executing redirect to home
```

### **STEP 4: Check What Happens**
**Expected:**
- ✅ After login, you should see the logs above
- ✅ Page automatically redirects to home page (`http://localhost:3000/` or `http://localhost:3003/`)
- ✅ You see the leaderboard with your username

**If NOT happening:**
- ❌ Logs stop after `Login successful`
- ❌ No redirect happens
- ❌ You stay on the login page

---

## 🔧 WHAT TO LOOK FOR

### **If redirect WORKS:**
1. Console shows all logs including the redirect logs
2. URL changes from `/auth` to `/`
3. Leaderboard page loads
4. ✅ **LOGIN IS WORKING!**

### **If redirect FAILS:**
1. Check if `[AuthPage] Authenticated, scheduling redirect to home` appears
   - If NOT, then `isAuthenticated` is not becoming true
   - Check `[authReducer] LOGIN_SUCCESS` log
2. Check if `[AuthPage] Executing redirect to home` appears
   - If NOT, timeout might be getting cleared
3. Look for any red error messages in console

---

## 📋 MANUAL VERIFICATION SCRIPT

Run this in browser console to check auth state directly:

```javascript
// Check localStorage
console.log('Stored tokens:', localStorage.getItem('access_token'));
console.log('Stored user:', localStorage.getItem('user_data'));

// Or check window.location
console.log('Current URL:', window.location.pathname);
```

---

## 🚀 NEXT STEPS

**Once working:**
1. Remove all `console.log()` statements
2. Test with real API (set `NEXT_PUBLIC_USE_MOCK_AUTH=false`)
3. Deploy with confidence!

---

**Test now and let me know what you see in the console!**
