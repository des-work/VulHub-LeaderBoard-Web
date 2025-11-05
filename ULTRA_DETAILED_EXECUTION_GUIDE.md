# 🎯 ULTRA-DETAILED EXECUTION GUIDE

**Date:** November 5, 2025  
**Status:** READY TO EXECUTE  
**Audience:** Step-by-step instructions for exact implementation  
**Version:** FINAL - Refined 3x for maximum clarity

---

## 📍 YOU ARE HERE

This is your **execution roadmap**. Follow it exactly and you will safely simplify your codebase with:
- ✅ Zero user feature loss
- ✅ 40-60% code reduction
- ✅ Complete rollback capability
- ✅ Low risk throughout

---

## 📚 DOCUMENTATION INDEX

**Read in this order:**

1. **This document** ← You are here
   - Ultra-detailed execution blueprint
   - Exact file paths and line numbers
   - Exact commands to run
   - Common issues & fixes

2. **Before Starting:**
   - Read `READY_FOR_YOUR_APPROVAL.md` (decision framework)
   - Read `WHAT_STAYS_VS_WHAT_GOES.md` (feature preservation)

3. **For Context:**
   - `ARCHITECTURE_ASSESSMENT_AND_SIMPLIFICATION_PLAN.md` (why simplify)
   - `DETAILED_SIMPLIFICATION_IMPLEMENTATION_PLAN.md` (5-phase guide)

---

## ✅ PRE-EXECUTION FINAL CHECKLIST

Before starting, complete this checklist:

- [ ] You have the detailed plans reviewed
- [ ] You have 4-6 hours available
- [ ] You have a git client ready
- [ ] You're comfortable with database migrations
- [ ] You can run terminal commands
- [ ] You have a backup or understand rollback
- [ ] You have Node.js 18+ installed
- [ ] You have `pnpm` installed
- [ ] You have PostgreSQL running (or Docker ready)

---

## 🚀 PHASE 1: DATABASE SCHEMA SIMPLIFICATION (30 minutes)

### Goal:
Remove `Tenant` model and `EventStore` model. Remove all `tenantId` fields.

### Step 1.1: Backup Schema

```bash
cd apps/api
cp prisma/schema.prisma prisma/schema.prisma.backup
```

### Step 1.2-1.10: Schema Changes

**File:** `apps/api/prisma/schema.prisma`

- **Line 13-33:** DELETE entire Tenant model
- **Line 44:** DELETE `tenantId     String` from User
- **Line 51:** DELETE `tenant      Tenant @relation...` from User
- **Line 57:** CHANGE `@@unique([email, tenantId])` TO `@@unique([email])`
- **Line 37:** ADD `@unique` to email field
- **Line 72:** DELETE `tenantId    String` from Project
- **Line 77:** DELETE `tenant      Tenant @relation...` from Project
- **Line 87:** DELETE `tenantId     String` from Submission
- **Line 101:** DELETE `tenant  Tenant  @relation...` from Submission
- **Line 115:** DELETE `tenantId    String` from Badge
- **Line 120:** DELETE `tenant     Tenant @relation...` from Badge
- **Line 130:** DELETE `tenantId String` from UserBadge
- **Line 136:** DELETE `tenant Tenant @relation...` from UserBadge
- **Line 138:** CHANGE `@@unique([userId, badgeId, tenantId])` TO `@@unique([userId, badgeId])`
- **Line 145:** DELETE `tenantId  String` from Leaderboard
- **Line 152:** DELETE `tenant Tenant @relation...` from Leaderboard
- **Line 154:** CHANGE `@@unique([userId, tenantId])` TO `@@unique([userId])`
- **Line 183:** DELETE `tenantId     String` from AuditLog
- **Line 195:** DELETE `tenant Tenant @relation...` from AuditLog
- **Line 199:** DELETE `@@index([tenantId])` from AuditLog
- **Line 158-178:** DELETE entire EventStore model

### Step 1.11: Verify & Migrate

```bash
cd apps/api
pnpm prisma validate
pnpm prisma migrate dev --name remove_multi_tenancy_and_events
pnpm prisma generate
pnpm build
```

### Step 1.12: Commit

```bash
git add prisma/
git commit -m "PHASE 1: Remove multi-tenancy and event sourcing from schema"
```

---

## 🔄 PHASE 2: REMOVE MULTI-TENANCY CODE (1 hour)

### Files to Update:
1. `apps/api/src/modules/auth/application/auth.service.ts`
2. `apps/api/src/modules/auth/infrastructure/auth.controller.ts`
3. `apps/api/src/modules/submissions/application/submissions.service.ts`
4. `apps/api/src/modules/submissions/infrastructure/submissions.controller.ts`
5. All other services (users, badges, leaderboards, projects)

### Pattern for Each File:
- **Remove:** `tenantId: string` parameters
- **Remove:** `TenantGuard` from decorators
- **Remove:** `@Tenant() tenantId: string` parameters
- **Remove:** `tenantId,` from all `where` clauses
- **Remove:** `tenant: { connect: { id: tenantId } }` from creates
- **Update:** All service calls to not pass tenantId

### Auth Service Changes:

**Line 25:**
```typescript
// BEFORE: async validateUser(email: string, password: string, tenantId: string)
// AFTER:  async validateUser(email: string, password: string)
```

**Line 29-32:**
```typescript
// BEFORE: where: { email_tenantId: { email, tenantId } }
// AFTER:  where: { email }
```

**Line 67:**
```typescript
// BEFORE: async login(loginDto: LoginDto, tenantId: string)
// AFTER:  async login(loginDto: LoginDto)
```

### Auth Controller Changes:

**Line 31:**
```typescript
// BEFORE: @UseGuards(TenantGuard, RateLimitGuard)
// AFTER:  @UseGuards(RateLimitGuard)
```

**Line 37-38:**
```typescript
// BEFORE: async login(@Body() loginDto: LoginDto, @Tenant() tenantId: string)
//         return this.authService.login(loginDto, tenantId);
// AFTER:  async login(@Body() loginDto: LoginDto)
//         return this.authService.login(loginDto);
```

**Imports - REMOVE:**
```typescript
import { TenantGuard } from '../../../common/guards/tenant.guard';
import { Tenant } from '../../../common/decorators/tenant.decorator';
```

### Verify & Commit:

```bash
cd apps/api
pnpm build
pnpm test
git add src/
git commit -m "PHASE 2: Remove multi-tenancy code"
```

---

## 🎯 KEY FILE LOCATIONS

### Schema Files:
- `apps/api/prisma/schema.prisma` - Database models

### Auth Module:
- `apps/api/src/modules/auth/application/auth.service.ts` - Auth logic
- `apps/api/src/modules/auth/infrastructure/auth.controller.ts` - Auth endpoints

### Submissions Module:
- `apps/api/src/modules/submissions/application/submissions.service.ts` - Submission logic
- `apps/api/src/modules/submissions/infrastructure/submissions.controller.ts` - Submission endpoints

### Other Modules:
- `apps/api/src/modules/users/application/users.service.ts`
- `apps/api/src/modules/badges/application/badges.service.ts`
- `apps/api/src/modules/leaderboards/application/leaderboards.service.ts`
- `apps/api/src/modules/projects/application/projects.service.ts`

---

## 🔍 GREP COMMANDS TO FIND CHANGES

```bash
# Find all tenantId references
grep -r "tenantId" apps/api/src/

# Find all TenantGuard references
grep -r "TenantGuard" apps/api/src/

# Find all @Tenant() references
grep -r "@Tenant" apps/api/src/

# Find all tenant relations
grep -r "tenant.*Tenant.*@relation" apps/api/src/
```

---

## ✅ SUCCESS CHECKLIST

**After All Phases:**
- [ ] All tenantId removed from code
- [ ] No TenantGuard references
- [ ] No @Tenant() decorators
- [ ] No EventStore references
- [ ] API builds successfully
- [ ] Tests pass
- [ ] Login works
- [ ] Leaderboard displays
- [ ] Submissions can be created

---

**Ready? Reply with "Start Phase 1" and I'll guide you!** 🚀
