# ⚡ QUICK REFERENCE - SERVICE LAYER CLEANUP CHEAT SHEET

## The 3 Basic Changes (Apply to Every Service)

### 1️⃣ Remove tenantId from Method Signatures
```typescript
// ❌ OLD
async method(data, tenantId: string) { }

// ✅ NEW
async method(data) { }
```

### 2️⃣ Remove tenantId from Query Clauses
```typescript
// ❌ OLD
where: { tenantId, status: 'ACTIVE' }

// ✅ NEW
where: { status: 'ACTIVE' }
```

### 3️⃣ Remove Tenant Connections
```typescript
// ❌ OLD
tenant: { connect: { id: tenantId } }

// ✅ NEW
// DELETE THIS LINE ENTIRELY
```

---

## Files to Update (In Order)

| # | File | Errors | Time |
|---|------|--------|------|
| 1 | `src/modules/badges/application/badges.service.ts` | 16 | 20m |
| 2 | `src/modules/submissions/application/submissions.service.ts` | 15 | 20m |
| 3 | `src/common/services/query-optimizer.service.ts` | 15 | 10m |
| 4 | `src/modules/users/application/users.service.ts` | 14 | 5m |
| 5 | `src/modules/projects/application/projects.service.ts` | 12 | 15m |
| 6 | `src/modules/submissions/infrastructure/submissions.controller.ts` | 7 | 10m |
| 7 | `src/modules/leaderboards/application/leaderboards.service.ts` | 7 | 15m |
| 8 | Other services & modules | 18 | 20m |

**Total: ~2.5 hours**

---

## Command Reference

```bash
# Start on new branch
git checkout -b fix/service-layer-tenantid

# After each file update
pnpm build

# Check specific file
pnpm build 2>&1 | grep "src/modules/badges"

# Count remaining errors
pnpm build 2>&1 | grep "ERROR in" | wc -l

# Commit after each phase
git add .
git commit -m "Fix: Remove tenantId from [service name]"

# Final verification
pnpm build 2>&1 | tail -3
```

---

## Pattern Matching (Find & Replace)

### Pattern 1: Method Signature with tenantId
**Find**: `async \w+\([^)]*tenantId: string[^)]*\)`  
**Action**: Remove `, tenantId: string` from signature

### Pattern 2: Where Clause with tenantId
**Find**: `where: \{ tenantId,`  
**Replace**: `where: {`

**Find**: `, tenantId\}`  
**Replace**: `}`

### Pattern 3: Tenant Connection
**Find**: `tenant: \{ connect: \{ id: tenantId \} \},?`  
**Replace**: (DELETE)

### Pattern 4: Repository Call with tenantId
**Find**: `\.([a-z]+)\([^)]*tenantId\)`  
**Action**: Remove tenantId argument

---

## Service-by-Service Checklist

### ✅ Badges Service (16 errors)
- [ ] Remove tenantId from: `create`, `findAll`, `findOne`, `update`, `remove`
- [ ] Remove tenantId from: `getUserBadges`, `assignBadge`, `getBadgeStats`
- [ ] Remove `tenant: { connect: {...} }` from create/update
- [ ] Remove `where: { tenantId, ... }` from all queries

### ✅ Submissions Service (15 errors)
- [ ] Remove tenantId from: `create`, `findAll`, `findOne`, `findByUser`, `findByProject`
- [ ] Remove tenantId from: `getStats`, `update`, `review`, `remove`
- [ ] Update: `findProject(id, tenantId)` → `findProject(id)`
- [ ] Remove all `where: { tenantId }` clauses

### ✅ Query Optimizer (15 errors)
- [ ] Remove tenantId parameter from all methods
- [ ] Remove tenant-specific optimizations
- [ ] Remove tenant references from caching

### ✅ Users Service (14 errors)
- [ ] Verify no `include: { tenant: true }`
- [ ] Verify no methods with tenantId
- [ ] Verify no tenant validation logic

### ✅ Projects Service (12 errors)
- [ ] Remove tenantId from: `create`, `findAll`, `findOne`, `update`, `remove`
- [ ] Remove: `findByCategory(category, tenantId)` → `findByCategory(category)`
- [ ] Remove: `getDifficulties(tenantId)` → `getDifficulties()`

### ✅ Submissions Controller (7 errors)
- [ ] Remove `req.user.tenantId` from ALL service calls
- [ ] Pattern: `service.method(data, req.user.tenantId)` → `service.method(data)`

### ✅ Leaderboards Service (7 errors)
- [ ] Remove tenantId from all 7 methods
- [ ] Update all repository calls

### ✅ Other Services (18 errors)
- [ ] Auth Service: Remove tenant validation
- [ ] JWT Strategy: Remove tenantId from token
- [ ] Audit Services: Remove tenant logging
- [ ] Module Configs: Remove deleted imports
- [ ] Main: Clean up references

---

## Expected Results

**Before Cleanup**:
```
webpack 5.97.1 compiled with 105 errors
```

**After Cleanup**:
```
webpack 5.97.1 compiled successfully
```

---

## If Something Breaks

**Revert last change**:
```bash
git reset --hard HEAD~1
```

**Revert entire branch**:
```bash
git checkout main
git branch -D fix/service-layer-tenantid
```

---

## Success = ✅

- [x] All 105 errors fixed
- [x] `pnpm build` succeeds
- [x] App starts without errors
- [x] User features still work
- [x] Clean git history
