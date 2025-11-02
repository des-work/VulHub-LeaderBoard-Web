# 🔬 Deep Dive: Auth System Issues - Perfect Fix Plan

**Date**: November 2, 2025  
**Analysis**: Comprehensive root cause analysis  
**Goal**: Develop perfect, non-breaking fixes

---

## ISSUE #1: HARD-CODED TENANT ID

### Root Cause Analysis

**Location**: `apps/api/src/modules/auth/infrastructure/local.strategy.ts:16`

**Current Code**:
```typescript
async validate(email: string, password: string): Promise<any> {
  const user = await this.authService.validateUser(email, password, 'default-tenant');
  // ...
}
```

**Problem Flow**:
```
1. Request comes in → /auth/login
2. TenantGuard runs FIRST (guard) → Extracts tenantId, attaches to request['tenantId']
3. LocalStrategy.validate() runs SECOND (strategy) → Can't access request, uses hard-coded 'default-tenant'
4. Result: Always uses 'default-tenant', ignores actual tenant from request
```

**Why It's Broken**:
- **Guards run BEFORE strategies** in NestJS
- `TenantGuard` correctly extracts tenantId and attaches to `request['tenantId']`
- But `LocalStrategy.validate()` doesn't receive request object by default
- Passport local strategy signature is: `validate(username, password, done?)`
- No way to access request context in standard Passport local

**Evidence**:
- ✅ `TenantGuard` correctly extracts tenant: `request['tenantId'] = tenantId`
- ✅ `@Tenant()` decorator works: `return request['tenantId']`
- ✅ Controller uses it: `async login(@Body() loginDto: LoginDto, @Tenant() tenantId: string)`
- ❌ `LocalStrategy.validate()` can't access request, hard-codes 'default-tenant'

**Impact**:
- Single tenant only
- Multi-tenant impossible
- Tenant from header/query ignored
- Rigid, non-scalable

---

### Perfect Fix: Access Request in LocalStrategy

**Solution**: Configure PassportStrategy to pass request to validate callback

**Approach**: Use `passReqToCallback: true` in PassportStrategy super() call

**Code Change**:
```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // ← Add this to receive request
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    // Extract tenantId from request (set by TenantGuard)
    const tenantId = req['tenantId'] || 'default-tenant';
    
    const user = await this.authService.validateUser(email, password, tenantId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

**Why This Works**:
- ✅ `passReqToCallback: true` makes Passport pass request as first parameter
- ✅ `TenantGuard` runs first, sets `request['tenantId']`
- ✅ `LocalStrategy` can now read `req['tenantId']`
- ✅ Falls back to 'default-tenant' for backwards compatibility
- ✅ Works with multi-tenant scenarios

**Edge Cases Handled**:
- ✅ If TenantGuard doesn't run: Falls back to 'default-tenant'
- ✅ If tenantId missing: Falls back to 'default-tenant'
- ✅ Development mode: Still works with default tenant
- ✅ Production: Uses tenant from header/query/JWT

**Testing Required**:
- [ ] Test with X-Tenant-ID header
- [ ] Test with tenantId query param
- [ ] Test with tenantId in JWT
- [ ] Test without tenant (should use default)
- [ ] Test with invalid tenant (should fail)

---

## ISSUE #2: SCHOOLID VS EMAIL FIELD MISMATCH

### Root Cause Analysis

**This is a COMPLEX issue with multiple layers**:

#### Layer 1: Type Definitions (2 Different Systems!)

**File 1**: `apps/web/src/lib/auth/types.ts` (WRONG - Uses schoolId)
```typescript
export interface User {
  schoolId: string;  // ← Wrong field
  email?: string;
}

export interface LoginCredentials {
  schoolId: string;  // ← Wrong field
  password: string;
}
```

**File 2**: `apps/web/src/types/auth.ts` (CORRECT - Uses email)
```typescript
export interface User {
  email: string;  // ← Correct
  // ...
}

export interface LoginCredentials {
  email: string;  // ← Correct
  password: string;
}
```

**Problem**: Two different type systems!

---

#### Layer 2: Form Implementation (CORRECT!)

**File**: `apps/web/src/app/auth/page.tsx:36,66`
```typescript
const [email, setEmail] = useState('');  // ← Uses email (correct)

await login({ email, password });  // ← Sends email (correct)
```

**Problem**: Form uses `email`, but `login()` expects `LoginCredentials` which has `schoolId`

---

#### Layer 3: Auth Context (WRONG TYPES!)

**File**: `apps/web/src/lib/auth/context.tsx:158,193`
```typescript
const login = async (credentials: LoginCredentials) => {
  // LoginCredentials has schoolId field
  const response = await AuthApi.login(credentials.schoolId, credentials.password);
  // ...
}
```

**Problem**: 
- Type says `schoolId`
- But form passes `{ email, password }`
- TypeScript should error but doesn't? (Need to check)

---

#### Layer 4: API Endpoint (WRONG PARAMETER NAME!)

**File**: `apps/web/src/lib/api/endpoints.ts:17`
```typescript
async login(schoolId: string, password: string): Promise<LoginResponse> {
  // API expects 'email' field, but we receive 'schoolId' from the form
  // For now, use schoolId as email (users can enter email in School ID field)
  const response = await apiClient.post('/auth/login', { email: schoolId, password });
  // ... 30 lines of transformation
}
```

**Problem**:
- Function parameter: `schoolId` (confusing)
- Sends to API: `{ email: schoolId }` (works but confusing)
- 30+ lines of transformation (unnecessary complexity)

---

#### Layer 5: API Schema (CORRECT!)

**File**: `packages/schema/src/api.ts:4-6`
```typescript
export const LoginSchema = z.object({
  email: z.string().email(),  // ← API expects email (correct)
  password: z.string().min(1),
});
```

**Problem**: API expects `email`, but frontend sends through confusing `schoolId` parameter

---

#### Layer 6: Register Endpoint (BROKEN!)

**File**: `apps/web/src/lib/api/endpoints.ts:54`
```typescript
async register(payload: { schoolId: string; name: string; password: string }) {
  const response = await apiClient.post('/auth/register', payload);
  // ...
}
```

**Problem**:
- Sends `{ schoolId, name, password }`
- API expects `{ email, firstName, lastName, password, tenantId }`
- **THIS WILL BREAK** - field mismatch!

**API Schema** (`packages/schema/src/api.ts:9-14`):
```typescript
export const RegisterSchema = z.object({
  email: z.string().email(),           // ← API expects email
  firstName: z.string().min(1).max(50), // ← API expects firstName
  lastName: z.string().min(1).max(50),  // ← API expects lastName
  password: z.string().min(8).max(100),
  tenantId: z.string().cuid(),
});
```

**Register Flow**:
```
Frontend → { schoolId, name, password }
    ↓
API Endpoint → Expects { email, firstName, lastName, password, tenantId }
    ↓
VALIDATION FAILS! ❌
```

---

### Perfect Fix: Standardize on Email Everywhere

**Decision**: Use `email` everywhere (matches API, industry standard, simpler)

**Files to Change**:

#### Fix 1: `apps/web/src/lib/auth/types.ts`
```typescript
// BEFORE
export interface User {
  schoolId: string;
  email?: string;
}

export interface LoginCredentials {
  schoolId: string;
  password: string;
}

// AFTER
export interface User {
  id: string;
  email: string;  // ← Changed to email (required, not optional)
  name: string;
  // ... rest of fields (remove schoolId)
}

export interface LoginCredentials {
  email: string;  // ← Changed to email
  password: string;
}

export interface RegisterData {
  email: string;  // ← Changed to email
  firstName: string;  // ← Split name
  lastName: string;    // ← Split name
  password: string;
  confirmPassword: string;
}
```

#### Fix 2: `apps/web/src/lib/api/endpoints.ts`
```typescript
// BEFORE (Complex, confusing)
async login(schoolId: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', { email: schoolId, password });
  // ... 30 lines of transformation
  schoolId: apiUser.email || apiUser.schoolId || '',
  // ...
}

// AFTER (Simple, direct)
async login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiClient.post('/auth/login', { email, password });
  
  return {
    user: transformApiUserToFrontendUser(response.user),
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

// Helper function (5 lines, reusable)
function transformApiUserToFrontendUser(apiUser: any): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim() || apiUser.email,
    role: mapRole(apiUser.role),
    points: apiUser.points || 0,
    level: apiUser.level || 1,
    // ... other fields
  };
}

// Register - BEFORE (BROKEN)
async register(payload: { schoolId: string; name: string; password: string }) {
  const response = await apiClient.post('/auth/register', payload); // ← Wrong fields!
}

// Register - AFTER (FIXED)
async register(payload: { email: string; firstName: string; lastName: string; password: string; tenantId: string }) {
  const response = await apiClient.post('/auth/register', {
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: payload.password,
    tenantId: payload.tenantId,
  });
  
  return {
    user: transformApiUserToFrontendUser(response.user),
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}
```

#### Fix 3: `apps/web/src/lib/auth/context.tsx`
```typescript
// BEFORE
const login = async (credentials: LoginCredentials) => {
  const response = await AuthApi.login(credentials.schoolId, credentials.password);
}

// AFTER
const login = async (credentials: LoginCredentials) => {
  const response = await AuthApi.login(credentials.email, credentials.password);
}
```

#### Fix 4: `apps/web/src/app/auth/page.tsx` (Already correct, just verify types match)

**Current**:
```typescript
const [email, setEmail] = useState('');  // ✅ Correct
await login({ email, password });        // ✅ Correct
```

**Verify**: Types now match! ✅

---

### Impact Analysis

**Files Affected**:
1. `apps/web/src/lib/auth/types.ts` - Update types
2. `apps/web/src/lib/api/endpoints.ts` - Simplify login, fix register
3. `apps/web/src/lib/auth/context.tsx` - Update login/register calls
4. `apps/web/src/app/auth/page.tsx` - Verify types (should be fine)
5. Any components using `user.schoolId` - Update to `user.email`

**Breaking Changes**:
- ✅ Any code using `user.schoolId` will break
- ✅ Need to update all references
- ✅ Search for `schoolId` usage across codebase

**Backwards Compatibility**:
- ❌ Not backwards compatible
- ✅ Clean break is better than confusion
- ✅ Fix all at once

---

## ISSUE #3: NO SESSION VALIDATION ON MOUNT

### Root Cause Analysis

**Location**: `apps/web/src/lib/auth/context.tsx:82-115`

**Current Code**:
```typescript
useEffect(() => {
  const checkAuth = () => {
    try {
      // Check local session first - this is instant
      const userData = localStorage.getItem('user_data');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        if (parsedUser && parsedUser.id && parsedUser.name) {
          dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
          return;  // ← STOPS HERE, never validates with server
        }
      }
      dispatch({ type: 'SET_LOADING', payload: false });
    } catch (error) {
      // Silent fail
    }
  };
  checkAuth();
}, []);
```

**Problem Flow**:
```
1. User opens page
2. useEffect runs
3. Checks localStorage for 'user_data'
4. If found → Immediately sets authenticated = true
5. NEVER validates token with server
6. NEVER checks if token expired
7. NEVER checks if user still exists
8. NEVER checks if user was deactivated
```

**Security Issues**:
- ❌ Expired tokens still work
- ❌ Deleted users still "logged in"
- ❌ Token blacklisted but still works
- ❌ User deactivated but still authenticated

**API Available**: `/auth/profile` endpoint exists and works!

**Evidence**:
- ✅ `AuthApi.me()` exists: `apiClient.get('/auth/me')`
- ✅ Backend has `getProfile()` method
- ✅ JWT guard validates token
- ❌ Frontend never calls it on mount

---

### Perfect Fix: Validate Session on Mount

**Solution**: Call `/auth/profile` to validate token before setting authenticated state

**Code Change**:
```typescript
useEffect(() => {
  const checkAuth = async () => {
    try {
      // Check if token exists and not expired
      const { accessToken } = getStoredTokens();
      
      if (!accessToken || isTokenExpired(accessToken)) {
        // Token missing or expired - clear everything
        clearTokens();
        localStorage.removeItem('user_data');
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      // Validate token with server
      try {
        const user = await AuthApi.me();
        
        // Transform API user to frontend User
        const frontendUser = transformApiUserToFrontendUser(user);
        
        // Token valid, user exists - set authenticated
        dispatch({ type: 'LOGIN_SUCCESS', payload: frontendUser });
        localStorage.setItem('user_data', JSON.stringify(frontendUser));
        
        // Update tokens if refreshed
        storeTokens(accessToken, getStoredTokens().refreshToken);
      } catch (error) {
        // Token invalid or user not found
        clearTokens();
        localStorage.removeItem('user_data');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      // Unexpected error - clear state
      clearTokens();
      localStorage.removeItem('user_data');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  checkAuth();
}, []);
```

**Why This Works**:
- ✅ Validates token with server (checks expiration, blacklist, user status)
- ✅ Gets fresh user data
- ✅ Handles expired tokens gracefully
- ✅ Handles network errors gracefully
- ✅ Falls back to unauthenticated state on error
- ✅ Updates localStorage with fresh data

**Edge Cases Handled**:
- ✅ Network offline → Falls back to localStorage (can add later)
- ✅ Token expired → Clears and shows login
- ✅ User deactivated → Clears and shows login
- ✅ Token blacklisted → Clears and shows login
- ✅ API error → Clears and shows login

**Performance**:
- ✅ Fast: Only one API call on mount
- ✅ Non-blocking: Doesn't delay page render
- ✅ Shows loading state during validation

---

## ISSUE #4: CONSOLE STATEMENTS IN PRODUCTION

### Root Cause Analysis

**Location**: `apps/web/src/lib/auth/context.tsx:128,133`

**Current Code**:
```typescript
tokenManagerRef.current = new TokenRefreshManager(
  refreshToken,
  (newAccessToken) => {
    console.log('Token refreshed successfully');  // ← Line 128
    storeTokens(newAccessToken, refreshToken);
  },
  () => {
    console.error('Token refresh failed, logging out');  // ← Line 133
    logout();
  }
);
```

**Impact**:
- Development logs in production
- Console noise
- Not using centralized logger

**Fix**: Remove or use logger utility

**Code Change**:
```typescript
tokenManagerRef.current = new TokenRefreshManager(
  refreshToken,
  (newAccessToken) => {
    // Token refreshed successfully - silent
    storeTokens(newAccessToken, refreshToken);
  },
  () => {
    // Token refresh failed - silent logout
    logout();
  }
);
```

**OR** (if you want to keep logging):
```typescript
import { logger } from '@/lib/logging/logger';

tokenManagerRef.current = new TokenRefreshManager(
  refreshToken,
  (newAccessToken) => {
    logger.debug('Token refreshed successfully');
    storeTokens(newAccessToken, refreshToken);
  },
  () => {
    logger.warn('Token refresh failed, logging out');
    logout();
  }
);
```

**Simple Fix**: Just remove console statements (they're not critical)

---

## ISSUE #5: AUTH FORM TYPE MISMATCH

### Root Cause Analysis

**Location**: `apps/web/src/app/auth/page.tsx:36,66`

**Current Code**:
```typescript
const [email, setEmail] = useState('');  // ← Uses email

const handleSubmit = async (e: React.FormEvent) => {
  await login({ email, password });  // ← Passes email
}
```

**Type Definition** (`apps/web/src/lib/auth/types.ts`):
```typescript
export interface LoginCredentials {
  schoolId: string;  // ← Expects schoolId!
  password: string;
}
```

**Problem**:
- Form uses `email` ✅
- But `login()` expects `LoginCredentials` which has `schoolId` ❌
- TypeScript should error but might not (type inference bypass?)

**Why It Might Work**:
- TypeScript might infer `{ email, password }` as compatible
- Or types are not strictly enforced

**This Will Be Fixed** when we fix Issue #2 (standardize on email)

---

## COMPREHENSIVE FIX PLAN

### Phase 1: Critical Fixes (Before Launch)

#### Fix #1: Hard-Coded Tenant (15 min)
1. Update `LocalStrategy` to use `passReqToCallback: true`
2. Update `validate()` signature to receive `req: Request`
3. Extract tenantId from `req['tenantId']`
4. Test with different tenant sources

#### Fix #2: Field Standardization (60 min)
1. Update `apps/web/src/lib/auth/types.ts` - Change `schoolId` → `email`
2. Update `apps/web/src/lib/api/endpoints.ts` - Simplify login, fix register
3. Update `apps/web/src/lib/auth/context.tsx` - Update calls
4. Search for all `schoolId` usage and update
5. Test login flow
6. Test register flow

#### Fix #3: Session Validation (30 min)
1. Update `context.tsx` useEffect to call `AuthApi.me()`
2. Add error handling
3. Add loading states
4. Test with valid token
5. Test with expired token
6. Test with invalid token

#### Fix #4: Console Cleanup (5 min)
1. Remove console statements
2. Replace with logger if needed

**Total Time**: ~2 hours

---

### Phase 2: Verification (30 min)

1. Test full login flow
2. Test register flow
3. Test session persistence
4. Test token expiration
5. Test multi-tenant (if applicable)
6. Verify no console errors

---

## TESTING CHECKLIST

### Tenant Fix Testing
- [ ] Login with X-Tenant-ID header
- [ ] Login with tenantId query param
- [ ] Login without tenant (should use default)
- [ ] Login with invalid tenant (should fail)

### Email Standardization Testing
- [ ] Login with email works
- [ ] Register with email/firstName/lastName works
- [ ] User object has email (not schoolId)
- [ ] All components display email correctly
- [ ] No references to schoolId remain

### Session Validation Testing
- [ ] Page refresh validates token
- [ ] Expired token → Clears and shows login
- [ ] Invalid token → Clears and shows login
- [ ] Valid token → Shows authenticated state
- [ ] Network error → Handles gracefully

---

## RISK ASSESSMENT

| Fix | Risk Level | Mitigation |
|-----|------------|------------|
| Tenant fix | 🟢 Low | Backwards compatible (default still works) |
| Email standardization | 🟡 Medium | Need to update all `schoolId` references |
| Session validation | 🟢 Low | Falls back gracefully on error |
| Console cleanup | 🟢 Low | No functional impact |

---

**Ready to implement these perfect fixes?**

