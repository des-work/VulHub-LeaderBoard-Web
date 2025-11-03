# ✅ Surgical Fix Checklist
**Print this and check off as you go**

---

## 🔒 PRE-FLIGHT (5 min)

- [ ] `git status` - Check working directory is clean
- [ ] `git add . && git commit -m "checkpoint: pre-critical-fixes"`
- [ ] `git checkout -b fix/surgical-critical-blockers`
- [ ] Create backups:
  ```bash
  cp apps/api/src/common/filters/http-exception.filter.ts apps/api/src/common/filters/http-exception.filter.ts.backup
  cp apps/web/src/components/navigation/MobileMenu.tsx apps/web/src/components/navigation/MobileMenu.tsx.backup
  cp apps/api/prisma/schema.prisma apps/api/prisma/schema.prisma.backup
  cp apps/web/src/app/grading/page.tsx apps/web/src/app/grading/page.tsx.backup
  ```

---

## 🔧 FIX #1: API Build Error (5 min)

**File:** `apps/api/src/common/filters/http-exception.filter.ts`

- [ ] **Line 54:** Find `userFriendlyMessage = Array.isArray(message) ? message.join(', ') : message;`
- [ ] **Replace** that ONE line with:
  ```typescript
  // Type-safe message handling
  if (Array.isArray(message)) {
    userFriendlyMessage = message.join(', ');
  } else if (typeof message === 'string') {
    userFriendlyMessage = message;
  } else if (typeof message === 'object' && message !== null) {
    userFriendlyMessage = JSON.stringify(message);
  } else {
    userFriendlyMessage = String(message || 'An error occurred');
  }
  ```
- [ ] **Verify:** `cd apps/api && npm run build` ✅
- [ ] **Commit:** `git add -A && git commit -m "fix: type-safe error message handling"`

---

## 🔧 FIX #2: MobileMenu Export (2 min)

**File:** `apps/web/src/components/navigation/MobileMenu.tsx`

- [ ] **Go to end of file** (after line 157)
- [ ] **Add ONE line:**
  ```typescript
  export default MobileMenu;
  ```
- [ ] **Verify:** `cd apps/web && npm run type-check | grep MobileMenu` (should be empty)
- [ ] **Commit:** `cd ../.. && git add -A && git commit -m "fix: add default export for MobileMenu"`

---

## 🔧 FIX #3: Database Config (10 min)

**File:** `apps/api/prisma/schema.prisma`

- [ ] **Line 9:** Change `provider = "sqlite"` to `provider = "postgresql"`
- [ ] **Generate migration:**
  ```bash
  cd apps/api
  export DATABASE_URL="file:./dev.db"
  npx prisma migrate dev --name initial_schema
  ```
- [ ] **Verify:** Check `prisma/migrations/` folder has new migration
- [ ] **Test:** `npx prisma migrate deploy` ✅
- [ ] **Build:** `npm run build` ✅
- [ ] **Commit:** `cd ../.. && git add -A && git commit -m "fix: PostgreSQL config and migrations"`

---

## 🔧 FIX #4: Grading Page Types (15 min)

**File:** `apps/web/src/app/grading/page.tsx`

### Phase 1: Add Types (after imports, ~line 20)
- [ ] **Add these types:**
  ```typescript
  type SortKey = 'date' | 'challenge' | 'student' | 'status';
  type SortDirection = 'asc' | 'desc';
  
  interface SortConfig {
    key: SortKey;
    direction: SortDirection;
  }
  
  interface Filter {
    status: 'all' | 'pending' | 'approved' | 'rejected';
  }
  
  interface ViewState {
    filter: Filter;
    search: string;
    sort: SortConfig;
  }
  ```

### Phase 2: Update State (~line 55)
- [ ] **Find:** `const [viewState, setViewState] = useState<{`
- [ ] **Replace the type** with: `useState<ViewState>(`
- [ ] **Keep the initial values** exactly the same

### Phase 3: Update Handler (~line 197)
- [ ] **Find:** `const handleSort = (key: 'date') => {`
- [ ] **Replace with:** `const handleSort = (key: SortKey) => {`
- [ ] **Keep the function body** exactly the same

### Verify
- [ ] **Type check:** `npm run type-check` - 0 errors ✅
- [ ] **Build:** `npm run build` - succeeds ✅
- [ ] **Commit:** `cd ../.. && git add -A && git commit -m "fix: widen grading sort types"`

---

## ✅ FINAL VERIFICATION (5 min)

- [ ] **API builds:** `cd apps/api && npm run build` ✅
- [ ] **Frontend builds:** `cd apps/web && npm run build` ✅
- [ ] **Type check:** `npm run type-check` ✅
- [ ] **Review changes:** `git log --oneline | head -5`
- [ ] **All 4 commits present?** ✅

---

## 🚀 MERGE TO MAIN (2 min)

- [ ] `git checkout main`
- [ ] `git merge fix/surgical-critical-blockers`
- [ ] `git tag -a v1.0.0-rc1 -m "Release Candidate 1"`
- [ ] Create `FIX_SUMMARY.md` documenting all changes

---

## 📊 SUCCESS CRITERIA

✅ **All fixes applied**  
✅ **API builds with 0 errors**  
✅ **Frontend builds with 0 errors**  
✅ **Type check passes**  
✅ **Migrations generated**  
✅ **Git history clean**  

---

## 🆘 IF SOMETHING BREAKS

**Rollback everything:**
```bash
git checkout main
git branch -D fix/surgical-critical-blockers
# Start over from pre-flight
```

**Rollback one file:**
```bash
cp apps/api/src/common/filters/http-exception.filter.ts.backup apps/api/src/common/filters/http-exception.filter.ts
```

---

**Total Time:** ~45 minutes  
**Next Step:** Deploy following `QUICK_HEROKU_DEPLOYMENT.md`

