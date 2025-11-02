# 🧪 Auth System Testing Guide

**Date**: November 2, 2025
**Status**: Ready for testing

---

## Pre-Test Checklist

- [ ] All code changes reviewed
- [ ] No linter errors confirmed
- [ ] Database migrations applied
- [ ] Environment variables set

---

## Test Suite 1: Login Flow

### Test 1.1: Login with Valid Email
**Steps**:
1. Navigate to `/auth`
2. Enter valid email (e.g., `neo@matrix.io`)
3. Enter correct password
4. Click Login

**Expected**:
- ✅ User redirected to home page
- ✅ User data stored in localStorage
- ✅ Auth token stored in localStorage
- ✅ User state in context shows authenticated

**Verify**:
```
localStorage.getItem('auth_token') // Should have value
localStorage.getItem('user_data') // Should have user object
```

---

### Test 1.2: Login with Invalid Email
**Steps**:
1. Navigate to `/auth`
2. Enter invalid email format (e.g., `notanemail`)
3. Enter any password
4. Try to submit

**Expected**:
- ✅ Form validation prevents submission
- ✅ Error message: "Please enter a valid email"

---

### Test 1.3: Login with Wrong Password
**Steps**:
1. Navigate to `/auth`
2. Enter valid email
3. Enter incorrect password
4. Click Login

**Expected**:
- ✅ Request fails with 401 error
- ✅ Error message: "Invalid credentials"
- ✅ User remains on login page
- ✅ No tokens stored

---

## Test Suite 2: Register Flow

### Test 2.1: Register with Valid Data
**Steps**:
1. Navigate to `/auth/register` (if available)
2. Enter email: `test@example.com`
3. Enter firstName: `John`
4. Enter lastName: `Doe`
5. Enter password: `SecurePass123!`
6. Confirm password: `SecurePass123!`
7. Click Register

**Expected**:
- ✅ API receives: `{ email, firstName, lastName, password, tenantId }`
- ✅ User created successfully
- ✅ User redirected to home
- ✅ User data shows: `name: "John Doe"`, `email: "test@example.com"`
- ✅ No `schoolId` field in user object

**Verify**:
```
const userData = JSON.parse(localStorage.getItem('user_data'));
console.log(userData.email); // "test@example.com"
console.log(userData.name); // "John Doe"
console.log(userData.schoolId); // undefined ✅
```

---

### Test 2.2: Register with Mismatched Passwords
**Steps**:
1. Enter passwords that don't match
2. Try to submit

**Expected**:
- ✅ Error message: "Passwords do not match"
- ✅ Form doesn't submit

---

### Test 2.3: Register with Short Password
**Steps**:
1. Enter password shorter than 8 characters
2. Try to submit

**Expected**:
- ✅ Client validation prevents submission
- ✅ Or server returns error

---

## Test Suite 3: Session Validation

### Test 3.1: Page Refresh with Valid Token
**Steps**:
1. Login successfully
2. Refresh page (F5)

**Expected**:
- ✅ Page validates token with server
- ✅ User remains authenticated
- ✅ No redirect to login page
- ✅ User data displays correctly

**Verify**:
- Check network tab: `GET /auth/me` should succeed with 200
- User should see their name/email on page

---

### Test 3.2: Page Refresh with Expired Token
**Steps**:
1. Login successfully
2. Manually expire the JWT token (advance system clock or use dev tools)
3. Refresh page

**Expected**:
- ✅ Server validation fails
- ✅ Token and user data cleared
- ✅ User redirected to `/auth` login page
- ✅ Graceful error handling (no crash)

---

### Test 3.3: Page Refresh with Invalid Token
**Steps**:
1. Login successfully
2. Manually modify the token in localStorage (change a few characters)
3. Refresh page

**Expected**:
- ✅ Server rejects invalid token
- ✅ User logged out and redirected to `/auth`
- ✅ No crash, clean redirect

---

### Test 3.4: Page Refresh without Token
**Steps**:
1. Clear localStorage completely
2. Navigate to home page
3. Refresh page

**Expected**:
- ✅ User not authenticated
- ✅ Redirected to `/auth` login page
- ✅ Clean state

---

## Test Suite 4: Email Standardization

### Test 4.1: Profile Page Shows Email
**Steps**:
1. Login successfully
2. Navigate to `/profile`

**Expected**:
- ✅ Profile displays user email (e.g., `neo@matrix.io`)
- ✅ Profile header shows: `neo@matrix.io • Student`
- ✅ No `schoolId` displayed anywhere
- ✅ Name shown as full name (firstName + lastName)

**Verify**:
```
user.email = "neo@matrix.io" ✅
user.schoolId = undefined ✅
```

---

### Test 4.2: Admin Users Table Shows Email
**Steps**:
1. Login as admin
2. Navigate to `/admin/users`

**Expected**:
- ✅ Table header says "Email" (not "School ID")
- ✅ Table shows email addresses for all users
- ✅ No schoolId column

---

### Test 4.3: Leaderboard Shows Names Not IDs
**Steps**:
1. Navigate to leaderboard/home page
2. Check user listings

**Expected**:
- ✅ User names displayed
- ✅ Email addresses shown (not schoolId)
- ✅ Data accurate and formatted correctly

---

## Test Suite 5: Multi-Tenant Support (Backend)

### Test 5.1: Login with Different Tenant
**Prerequisites**:
- Setup 2 different tenants in database

**Steps**:
1. Make login request with `X-Tenant-ID` header for Tenant A
2. Make login request with `X-Tenant-ID` header for Tenant B

**Expected**:
- ✅ Both requests succeed
- ✅ Each returns correct tenant's user

**Curl Example**:
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "X-Tenant-ID: tenant-a-id" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@tenant-a.com","password":"pass"}'
```

---

## Test Suite 6: Error Handling

### Test 6.1: Network Error During Login
**Steps**:
1. Turn off backend API
2. Try to login
3. Turn backend back on

**Expected**:
- ✅ Error message: "Connection failed" or similar
- ✅ No crash
- ✅ User can retry

---

### Test 6.2: Server Error (500)
**Steps**:
1. Backend throws unexpected error during login

**Expected**:
- ✅ User sees error message
- ✅ Exact error details not exposed to user
- ✅ Clean error handling

---

### Test 6.3: Deactivated User
**Prerequisites**:
- Set user status to 'INACTIVE' in database

**Steps**:
1. Try to login as deactivated user

**Expected**:
- ✅ Login fails with clear message
- ✅ Or user can login but validation fails on `/auth/me`
- ✅ Clean error handling

---

## Test Suite 7: Console Cleanup

### Test 7.1: No Console Spam
**Steps**:
1. Login successfully
2. Open browser console (F12)
3. Refresh page
4. Watch console during token refresh

**Expected**:
- ✅ No `console.log()` messages
- ✅ No `console.error()` messages
- ✅ No development logs in production build

**Verify**:
```javascript
// Should see NO output from auth system
// Only legitimate errors/warnings should appear
```

---

## Test Suite 8: Type Safety

### Test 8.1: TypeScript Compilation
**Steps**:
1. Run: `npm run build` in frontend
2. Check for TypeScript errors

**Expected**:
- ✅ Zero TypeScript errors
- ✅ Build completes successfully

---

### Test 8.2: Form Type Alignment
**Steps**:
1. Login form uses `email` field
2. API expects `email` field
3. Backend uses `email` field
4. Response maps to `email` field

**Expected**:
- ✅ All email throughout the chain
- ✅ No type mismatches
- ✅ IDE shows correct autocomplete

---

## Regression Tests

### Regression 1: Existing Features Still Work
- [ ] Leaderboard displays correctly
- [ ] Submissions can be uploaded
- [ ] Grades can be assigned
- [ ] Profile updates save

### Regression 2: Navigation Works
- [ ] All links work
- [ ] Page navigation smooth
- [ ] No 404 errors

### Regression 3: UI Displays Correctly
- [ ] Forms render properly
- [ ] Errors display clearly
- [ ] Loading states show
- [ ] Buttons respond to clicks

---

## Performance Tests

### Performance 1: Page Load Time
**Before fixes**: Baseline
**After fixes**: Should be same or faster
- Session validation is fast (single API call)

### Performance 2: Token Refresh
- Should be silent and fast
- No noticeable UI lag

---

## Security Tests

### Security 1: XSS Prevention
- [ ] User data properly escaped
- [ ] No raw HTML injection
- [ ] API responses sanitized

### Security 2: CSRF Protection
- [ ] Tokens properly validated
- [ ] CORS headers correct

### Security 3: Password Security
- [ ] Passwords hashed on backend
- [ ] Passwords sent over HTTPS only
- [ ] Passwords never logged

---

## Final Checklist

- [ ] All test suites passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Performance acceptable
- [ ] Security verified
- [ ] Code reviewed
- [ ] Ready for production

---

## Success Criteria

✅ All of the following must pass:

1. **Functional**: All auth flows work correctly
2. **Secure**: Tokens validated properly, sessions secure
3. **Type-Safe**: No TypeScript errors
4. **Performance**: Fast and responsive
5. **User-Friendly**: Clear error messages
6. **Production-Ready**: No console spam, clean logs

---

## Notes for Testing

- Use mock auth first for quick testing
- Then test with real API
- Test on different browsers
- Test on mobile if possible
- Document any issues found

---

**Ready to test! 🚀**
