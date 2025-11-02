# ✅ Perfect Fix Implementation Plan - Auth System

**Date**: November 2, 2025  
**Status**: Ready for Implementation  
**Estimated Time**: 2 hours

---

## 🎯 EXECUTIVE SUMMARY

After deep analysis, we've identified **5 critical issues** with **perfect, non-breaking fixes**:

1. ✅ **Hard-coded Tenant** - Fix: Access request in LocalStrategy
2. ✅ **schoolId vs email Mismatch** - Fix: Standardize on email (40 references to update)
3. ✅ **No Session Validation** - Fix: Call `/auth/profile` on mount
4. ✅ **Console Statements** - Fix: Remove or use logger
5. ✅ **Type Mismatch** - Fix: Will be resolved by Fix #2

**Total Impact**: ~40 files need `schoolId` → `email` updates

---

## ISSUE #1: HARD-CODED TENANT ID

### Files to Change: 1

#### File: `apps/api/src/modules/auth/infrastructure/local.strategy.ts`

**BEFORE**:
```typescript
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(email, password, 'default-tenant');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

**AFTER**:
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { Request } from 'express';
import { AuthService } from '../application/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true, // ← Add this
    });
  }

  async validate(req: Request, email: string, password: string): Promise<any> {
    // Extract tenantId from request (set by TenantGuard)
    // TenantGuard runs before this strategy and attaches tenantId to request
    const tenantId = req['tenantId'] || 'default-tenant';
    
    const user = await this.authService.validateUser(email, password, tenantId);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
```

**Changes**:
- ✅ Add `passReqToCallback: true` to super()
- ✅ Update validate() signature: `(req: Request, email: string, password: string)`
- ✅ Extract `tenantId` from `req['tenantId']`
- ✅ Fallback to `'default-tenant'` for backwards compatibility
- ✅ Add `Request` import from 'express'

**Why This Works**:
- TenantGuard runs FIRST and sets `request['tenantId']`
- `passReqToCallback: true` makes Passport pass request as first parameter
- We can now read tenantId from request
- Backwards compatible (default still works)

**Testing**:
- ✅ Test without tenant → Uses default
- ✅ Test with X-Tenant-ID header → Uses header
- ✅ Test with tenantId query param → Uses query
- ✅ Test with tenantId in JWT → Uses JWT

---

## ISSUE #2: SCHOOLID VS EMAIL MISMATCH

### Files to Change: 8 files, ~40 references

### Step 1: Update Type Definitions

#### File: `apps/web/src/lib/auth/types.ts`

**BEFORE**:
```typescript
export interface User {
  id: string;
  schoolId: string;      // ← Remove
  name: string;
  email?: string;       // ← Make required
  // ...
}

export interface LoginCredentials {
  schoolId: string;     // ← Change to email
  password: string;
}

export interface RegisterData {
  schoolId: string;     // ← Change to email
  name: string;          // ← Split to firstName/lastName
  password: string;
  confirmPassword: string;
}
```

**AFTER**:
```typescript
export interface User {
  id: string;
  email: string;         // ← Changed to required email
  name: string;
  role: 'student' | 'grader' | 'admin';
  points: number;
  level: number;
  joinDate: Date;
  lastActive: Date;
  avatar?: string;
  bio?: string;
  completedActivities: string[];
  pendingSubmissions: Submission[];
  approvedSubmissions: Submission[];
}

export interface LoginCredentials {
  email: string;        // ← Changed to email
  password: string;
}

export interface RegisterData {
  email: string;        // ← Changed to email
  firstName: string;     // ← Split name
  lastName: string;      // ← Split name
  password: string;
  confirmPassword: string;
}
```

---

### Step 2: Fix API Endpoints

#### File: `apps/web/src/lib/api/endpoints.ts`

**BEFORE** (Lines 17-52):
```typescript
async login(schoolId: string, password: string): Promise<LoginResponse> {
  // API expects 'email' field, but we receive 'schoolId' from the form
  // For now, use schoolId as email (users can enter email in School ID field)
  const response = await apiClient.post('/auth/login', { email: schoolId, password });
  
  // API returns { success: true, data: { user, accessToken, refreshToken } }
  // Extract the data property
  const data = response.data || response;
  
  // Transform API user to frontend User interface
  const apiUser = data.user;
  const frontendUser = {
    id: apiUser.id,
    schoolId: apiUser.email || apiUser.schoolId || '', // Use email as schoolId for now
    name: apiUser.firstName && apiUser.lastName 
      ? `${apiUser.firstName} ${apiUser.lastName}`
      : apiUser.name || apiUser.email || 'User',
    email: apiUser.email,
    role: (apiUser.role?.toLowerCase() || 'student') as 'student' | 'grader' | 'admin',
    points: apiUser.points || 0,
    level: apiUser.level || 1,
    joinDate: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
    lastActive: apiUser.updatedAt ? new Date(apiUser.updatedAt) : new Date(),
    avatar: apiUser.avatarUrl || undefined,
    bio: apiUser.bio || undefined,
    completedActivities: apiUser.completedActivities || [],
    pendingSubmissions: apiUser.pendingSubmissions || [],
    approvedSubmissions: apiUser.approvedSubmissions || [],
  };
  
  return {
    user: frontendUser,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
}
```

**AFTER**:
```typescript
// Helper function to transform API user to frontend User (reusable)
function transformApiUserToFrontendUser(apiUser: any): User {
  return {
    id: apiUser.id,
    email: apiUser.email,
    name: apiUser.firstName && apiUser.lastName 
      ? `${apiUser.firstName} ${apiUser.lastName}`.trim()
      : apiUser.name || apiUser.email || 'User',
    role: mapApiRoleToFrontendRole(apiUser.role),
    points: apiUser.points || 0,
    level: apiUser.level || 1,
    joinDate: apiUser.createdAt ? new Date(apiUser.createdAt) : new Date(),
    lastActive: apiUser.updatedAt ? new Date(apiUser.updatedAt) : new Date(),
    avatar: apiUser.avatarUrl || undefined,
    bio: apiUser.bio || undefined,
    completedActivities: apiUser.completedActivities || [],
    pendingSubmissions: apiUser.pendingSubmissions || [],
    approvedSubmissions: apiUser.approvedSubmissions || [],
  };
}

// Helper to map API roles to frontend roles
function mapApiRoleToFrontendRole(apiRole: string): 'student' | 'grader' | 'admin' {
  const role = apiRole?.toLowerCase();
  if (role === 'instructor' || role === 'grader') return 'grader';
  if (role === 'admin') return 'admin';
  return 'student';
}

export const AuthApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await apiClient.post('/auth/login', { email, password });
    const data = response.data || response;
    
    return {
      user: transformApiUserToFrontendUser(data.user),
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
    };
  },
  
  async register(payload: { 
    email: string; 
    firstName: string; 
    lastName: string; 
    password: string;
    tenantId: string;
  }): Promise<RegisterResponse> {
    const response = await apiClient.post('/auth/register', {
      email: payload.email,
      firstName: payload.firstName,
      lastName: payload.lastName,
      password: payload.password,
      tenantId: payload.tenantId,
    });
    
    // Transform response
    return {
      user: transformApiUserToFrontendUser(response.user),
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    };
  },
  // ... rest of methods
}
```

**Changes**:
- ✅ Change parameter: `schoolId: string` → `email: string`
- ✅ Simplify: Remove 30 lines of transformation → 5 lines helper function
- ✅ Fix register: Add proper field mapping (was broken!)
- ✅ Create reusable `transformApiUserToFrontendUser()` helper
- ✅ Create `mapApiRoleToFrontendRole()` helper

---

### Step 3: Update Auth Context

#### File: `apps/web/src/lib/auth/context.tsx`

**BEFORE** (Lines 158-213):
```typescript
const login = async (credentials: LoginCredentials) => {
  // ...
  const response = await AuthApi.login(credentials.schoolId, credentials.password);
  // ...
}

const register = async (data: RegisterData) => {
  // ...
  const response = await AuthApi.register({
    schoolId: data.schoolId,
    name: data.name,
    password: data.password
  });
  // ...
}
```

**AFTER**:
```typescript
const login = async (credentials: LoginCredentials) => {
  dispatch({ type: 'LOGIN_START' });
  
  try {
    if (USE_MOCK_AUTH) {
      // MOCK AUTH - For development
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const mockUser: User = {
        id: Date.now().toString(),
        email: credentials.email,  // ← Changed
        name: credentials.email === 'admin' ? 'Admin User' : 'Student User',
        role: credentials.email === 'admin' ? 'admin' : 'student',
        points: credentials.email === 'admin' ? 0 : 1000,
        level: credentials.email === 'admin' ? 1 : 3,
        joinDate: new Date(),
        lastActive: new Date(),
        completedActivities: [],
        pendingSubmissions: [],
        approvedSubmissions: []
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(mockUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: mockUser });
      
      setErrorTrackingUser({
        id: mockUser.id,
        email: mockUser.email,
        username: mockUser.email,  // ← Changed from schoolId
      });
    } else {
      // REAL API AUTH - For production
      const response = await AuthApi.login(credentials.email, credentials.password);  // ← Changed
      
      storeTokens(response.accessToken, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
      
      setErrorTrackingUser({
        id: response.user.id,
        email: response.user.email,
        username: response.user.email,  // ← Changed from schoolId
      });
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Invalid credentials';
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    throw error;
  }
};

const register = async (data: RegisterData) => {
  dispatch({ type: 'LOGIN_START' });
  
  try {
    if (data.password !== data.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    if (USE_MOCK_AUTH) {
      // MOCK AUTH - For development
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,  // ← Changed
        name: `${data.firstName} ${data.lastName}`,  // ← Changed
        role: 'student',
        points: 0,
        level: 1,
        joinDate: new Date(),
        lastActive: new Date(),
        completedActivities: [],
        pendingSubmissions: [],
        approvedSubmissions: []
      };
      
      localStorage.setItem('auth_token', 'mock_token');
      localStorage.setItem('user_data', JSON.stringify(newUser));
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } else {
      // REAL API AUTH - For production
      // TODO: Get tenantId from somewhere (config, context, etc.)
      const tenantId = 'default-tenant';  // ← Need to fix this too
      
      const response = await AuthApi.register({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        password: data.password,
        tenantId: tenantId,
      });
      
      storeTokens(response.accessToken, response.refreshToken);
      localStorage.setItem('user_data', JSON.stringify(response.user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
    throw error;
  }
};
```

**Changes**:
- ✅ `credentials.schoolId` → `credentials.email`
- ✅ `data.schoolId` → `data.email`
- ✅ `data.name` → `data.firstName` + `data.lastName`
- ✅ `user.schoolId` → `user.email` (in mock and tracking)
- ✅ Add tenantId to register (need to determine source)

---

### Step 4: Update All Component References

#### Files to Update (6 files):

**1. `apps/web/src/app/profile/page.tsx:222`**
```typescript
// BEFORE
<p className="text-lg font-semibold text-bright">{user.schoolId}</p>

// AFTER
<p className="text-lg font-semibold text-bright">{user.email}</p>
```

**2. `apps/web/src/components/profile/ProfileHeader.tsx:42`**
```typescript
// BEFORE
<p className="text-muted mb-4">
  {user.schoolId} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
</p>

// AFTER
<p className="text-muted mb-4">
  {user.email} • {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
</p>
```

**3. `apps/web/src/app/admin/users/page.tsx`**
- Search for `schoolId` usage and update to `email`
- Need to read file to see exact usage

**4. `apps/web/src/lib/users/mock.ts`**
- Update mock data to use `email` instead of `schoolId`

**5. `apps/web/src/docs/api.md`**
- Update documentation to reflect `email` usage

**6. Any other components using `user.schoolId`**

---

### Step 5: Update Auth Form (Already Correct!)

**File**: `apps/web/src/app/auth/page.tsx`

**Status**: ✅ Already uses `email` correctly!

**Verify**:
- ✅ Form state: `email`
- ✅ Form input: `type="email"`
- ✅ Form label: "Email:"
- ✅ Form submit: `{ email, password }`

**No changes needed!**

---

## ISSUE #3: NO SESSION VALIDATION ON MOUNT

### Files to Change: 1

#### File: `apps/web/src/lib/auth/context.tsx` (Lines 82-115)

**BEFORE**:
```typescript
useEffect(() => {
  const checkAuth = () => {
    try {
      // Check local session first - this is instant
      const userData = localStorage.getItem('user_data');
      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Validate user data structure
          if (parsedUser && parsedUser.id && parsedUser.name) {
            dispatch({ type: 'LOGIN_SUCCESS', payload: parsedUser });
            return;  // ← Never validates with server
          } else {
            localStorage.removeItem('user_data');
            localStorage.removeItem('auth_token');
          }
        } catch (parseError) {
          localStorage.removeItem('user_data');
          localStorage.removeItem('auth_token');
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

**AFTER**:
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
        
      } catch (error) {
        // Token invalid, user not found, or server error
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

// Need to import transformApiUserToFrontendUser
// Either import from endpoints.ts or define locally
```

**Changes**:
- ✅ Make `checkAuth` async
- ✅ Check token expiration first (fast)
- ✅ Call `AuthApi.me()` to validate with server
- ✅ Transform API user to frontend User
- ✅ Handle errors gracefully
- ✅ Clear state on any error

**Dependencies**:
- Need `transformApiUserToFrontendUser()` helper (create in endpoints.ts and export)
- Need `isTokenExpired()` from tokenManager (already exists)
- Need `getStoredTokens()` from tokenManager (already exists)
- Need `clearTokens()` from tokenManager (already exists)

---

## ISSUE #4: CONSOLE STATEMENTS

### Files to Change: 1

#### File: `apps/web/src/lib/auth/context.tsx:128,133`

**BEFORE**:
```typescript
tokenManagerRef.current = new TokenRefreshManager(
  refreshToken,
  (newAccessToken) => {
    console.log('Token refreshed successfully');
    storeTokens(newAccessToken, refreshToken);
  },
  () => {
    console.error('Token refresh failed, logging out');
    logout();
  }
);
```

**AFTER**:
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

**Changes**:
- ✅ Remove `console.log`
- ✅ Remove `console.error`
- ✅ Add comments instead

**Alternative**: Use logger if you want to keep logging
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

---

## ISSUE #5: TYPE MISMATCH

**Status**: ✅ **Will be automatically fixed by Issue #2**

Once we standardize on `email` everywhere, the types will align:
- Form uses `email` ✅
- Types use `email` ✅
- API uses `email` ✅

**No separate fix needed!**

---

## COMPLETE FILE CHANGE LIST

### Backend (1 file)
1. ✅ `apps/api/src/modules/auth/infrastructure/local.strategy.ts`

### Frontend (9 files)
1. ✅ `apps/web/src/lib/auth/types.ts`
2. ✅ `apps/web/src/lib/api/endpoints.ts`
3. ✅ `apps/web/src/lib/auth/context.tsx`
4. ✅ `apps/web/src/app/profile/page.tsx`
5. ✅ `apps/web/src/components/profile/ProfileHeader.tsx`
6. ✅ `apps/web/src/app/admin/users/page.tsx`
7. ✅ `apps/web/src/lib/users/mock.ts`
8. ✅ `apps/web/src/docs/api.md`
9. ✅ Any other components using `user.schoolId` (need to find)

**Total**: ~10 files to change

---

## IMPLEMENTATION ORDER

### Phase 1: Backend Fix (15 min)
1. ✅ Fix LocalStrategy tenant access

### Phase 2: Frontend Type Updates (30 min)
1. ✅ Update `types.ts`
2. ✅ Update `endpoints.ts` (simplify login, fix register)
3. ✅ Create helper functions

### Phase 3: Frontend Usage Updates (45 min)
1. ✅ Update `context.tsx` (login/register/mock)
2. ✅ Update all component references (profile, admin, etc.)
3. ✅ Search and replace all `schoolId` → `email`

### Phase 4: Session Validation (30 min)
1. ✅ Update `context.tsx` useEffect
2. ✅ Add helper imports
3. ✅ Test validation flow

### Phase 5: Cleanup (5 min)
1. ✅ Remove console statements

**Total Time**: ~2 hours

---

## TESTING CHECKLIST

### After Each Fix:
- [ ] Code compiles (no TypeScript errors)
- [ ] No linter errors
- [ ] Check related files for issues

### Final Testing:
- [ ] Login flow works
- [ ] Register flow works
- [ ] Session persists on refresh
- [ ] Expired tokens handled
- [ ] Invalid tokens handled
- [ ] Multi-tenant works (if applicable)
- [ ] No console spam
- [ ] No type errors

---

## RISK MITIGATION

### Potential Issues:

1. **Register needs tenantId**
   - **Problem**: Frontend needs to know tenantId
   - **Options**:
     - A) Get from config/environment
     - B) Allow user to select (if multi-tenant)
     - C) Default to 'default-tenant' for now
   - **Recommendation**: Option C for now (quick fix), improve later

2. **40 references to schoolId**
   - **Problem**: Easy to miss one
   - **Solution**: 
     - Use find/replace carefully
     - Search after changes: `grep -r "schoolId"`
     - Test all pages that display user info

3. **Mock auth still uses schoolId**
   - **Solution**: Update mock auth in context.tsx too

4. **Transform function needs to be accessible**
   - **Solution**: Export from endpoints.ts or create shared utility

---

**Ready to implement these fixes systematically?**

