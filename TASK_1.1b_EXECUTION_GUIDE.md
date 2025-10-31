# Task 1.1b: Dashboard & Leaderboard Testing - Execution Guide

**Date Started:** October 31, 2025  
**Status:** 🟡 In Progress  
**Estimated Time:** 2-3 hours

---

## 🎯 What We're Testing

**Homepage Dashboard:**
- URL: http://localhost:3010 (homepage `/`)
- Components: Leaderboard, Welcome Card, Quick Stats
- API Endpoint: `/api/v1/leaderboards?limit=15`
- Features: Top 15 players, user rank, stats cards

---

## ✅ Prerequisites

- [ ] Logged in as admin@vulhub.com (from Task 1.1a)
- [ ] API running on http://localhost:4010
- [ ] Frontend running on http://localhost:3010
- [ ] Browser DevTools ready (F12)

---

## 📋 Test Case 1.1b.1: View Leaderboard (20 minutes)

### Step 1: Navigate to Dashboard

**Action:**
```
Open browser: http://localhost:3010
```

**Expected:**
- [ ] Page loads without redirect (already authenticated)
- [ ] No loading spinner (or brief loading)
- [ ] Dashboard visible immediately

### Step 2: Observe Leaderboard Section

**Location:** Left/main area of dashboard (2/3 width on large screens)

**What to Check:**
- [ ] "Live Rankings" title visible
- [ ] "Top 15 Players • Updated in real-time" subtitle
- [ ] Red "LIVE" indicator with pulsing dot
- [ ] Trophy icon visible
- [ ] Leaderboard list displays

**Player List Verification:**
- [ ] At least one player visible (or loading skeleton)
- [ ] Players show: Rank, Name, Points
- [ ] Your user highlighted if in top 15
- [ ] Progress bars showing (if implemented)
- [ ] Rankings are numbered (1, 2, 3...)

### Step 3: Check User Rank Display

**If you're in top 15:**
- [ ] Your row is highlighted/emphasized
- [ ] Rank number visible
- [ ] Points displayed correctly

**If you're outside top 15:**
- [ ] "Your Rank" card appears at bottom
- [ ] Shows your rank number
- [ ] Shows your name and points

### Step 4: Performance Check

**In Browser Console (F12):**
```javascript
// Check load time
console.log('Load time:', performance.timing.loadEventEnd - performance.timing.navigationStart, 'ms');
// Should be < 2000ms (2 seconds)

// Check if data loaded
console.log('Leaderboard loaded:', document.querySelector('.matrix-card') !== null);
```

**Expected:**
- [ ] Page loads in < 2 seconds
- [ ] No console errors
- [ ] Network tab shows API call to `/api/v1/leaderboards`
- [ ] API response time < 500ms

### Step 5: Network Request Verification

**In Browser DevTools (F12 → Network tab):**
- [ ] Filter: XHR or Fetch
- [ ] Refresh page (F5)
- [ ] Look for request to: `http://localhost:4010/api/v1/leaderboards?limit=15`
- [ ] Status should be: 200 OK
- [ ] Response should contain array of players

**Test Results:**
- [ ] Dashboard loads successfully
- [ ] Leaderboard displays
- [ ] Top players visible
- [ ] User rank shown
- [ ] Performance acceptable (< 2s)
- [ ] API call successful
- [ ] No console errors

---

## 📋 Test Case 1.1b.2: Welcome Card & Quick Stats (20 minutes)

### Step 1: Check Welcome Card

**Location:** Right sidebar of dashboard

**Welcome Card Should Show:**
- [ ] "Welcome Back!" heading
- [ ] User avatar (initial letter in circle)
- [ ] User name displayed
- [ ] Points and level/role shown
- [ ] "Start Competing" button (navigates to /challenges)
- [ ] "Join Community" button (navigates to /community)

### Step 2: Verify User Data

**Check User Information:**
- [ ] Name matches logged-in user
- [ ] Points match your actual points
- [ ] Role/Level displayed correctly

### Step 3: Check Quick Stats Card

**Stats Grid Should Show:**
- [ ] "Quick Stats" heading
- [ ] 4 stat boxes:
  - Points: Your current points
  - Challenges: Number of challenges (may show 0)
  - Badges: Number of badges (may show 0)
  - Level: Your current level

**Verify Stats:**
- [ ] Points number matches your points
- [ ] All stats display correctly
- [ ] Numbers are formatted nicely

### Step 4: Test Button Navigation

**Test "Start Competing" Button:**
- [ ] Click button
- [ ] Should navigate to /challenges
- [ ] Challenges page loads

**Test "Join Community" Button:**
- [ ] Click button
- [ ] Should navigate to /community
- [ ] Community page loads

**Test Results:**
- [ ] Welcome card displays
- [ ] User info correct
- [ ] Stats accurate
- [ ] Buttons work

---

## 📋 Test Case 1.1b.3: Header & Navigation (15 minutes)

### Step 1: Check Header

**Header Should Contain:**
- [ ] Trophy icon with "VulHub Scoreboard" title
- [ ] Navigation buttons:
  - Community, Challenges, Badges, Submissions, Resources, Profile
- [ ] User info section (name, points)
- [ ] Logout button

### Step 2: Test Navigation Links

**Test Each Navigation Button:**
- [ ] Community → Navigates to /community
- [ ] Challenges → Navigates to /challenges
- [ ] Badges → Navigates to /badges
- [ ] Submissions → Navigates to /submissions
- [ ] Resources → Navigates to /resources
- [ ] Profile → Navigates to /profile

**Test Results:**
- [ ] Header displays correctly
- [ ] All navigation works
- [ ] User info accurate

---

## 📋 Test Case 1.1b.4: Responsive Design (20 minutes)

### Step 1: Desktop View (1920x1080)

**Check Layout:**
- [ ] Leaderboard ~2/3 width (left side)
- [ ] Welcome card on right sidebar
- [ ] Header navigation in one row
- [ ] No horizontal scroll

### Step 2: Tablet View (768x1024)

**Open DevTools (F12):**
- [ ] Toggle device toolbar (Ctrl+Shift+M)
- [ ] Set viewport: 768 x 1024
- [ ] Check:
  - [ ] Leaderboard and welcome card stack vertically
  - [ ] Header navigation wraps or mobile menu
  - [ ] Text readable
  - [ ] No content cut off

### Step 3: Mobile View (375x667)

**Set Viewport:** 375 x 667

**Check:**
- [ ] Single column layout
- [ ] Mobile menu appears
- [ ] Leaderboard scrollable
- [ ] Welcome card below leaderboard
- [ ] Text readable
- [ ] Buttons tappable
- [ ] No horizontal scroll

**Test Results:**
- [ ] Desktop responsive
- [ ] Tablet responsive
- [ ] Mobile responsive

---

## 📊 Task 1.1b Completion Checklist

### Test Results Summary

| Test Case | Status | Issues | Notes |
|-----------|--------|--------|-------|
| 1.1b.1: View Leaderboard | ☐ Pass ☐ Fail | | |
| 1.1b.2: Welcome Card & Stats | ☐ Pass ☐ Fail | | |
| 1.1b.3: Header & Navigation | ☐ Pass ☐ Fail | | |
| 1.1b.4: Responsive Design | ☐ Pass ☐ Fail | | |

### Total Issues Found: _____

---

## ✅ Task 1.1b Success Criteria

**All must pass:**
- [ ] Dashboard loads in < 2 seconds
- [ ] Leaderboard displays top 15 players
- [ ] User rank visible
- [ ] Welcome card shows correct info
- [ ] All navigation works
- [ ] Responsive on all devices
- [ ] No console errors

---

**Task 1.1b Status:** 🟡 In Progress  
**Last Updated:** October 31, 2025
