# ⚡ Quick Fix Card - Critical Blockers

**Total Time:** ~1-2 hours | **Files to Fix:** 4 files

---

## 1️⃣ API Build Error (5 min) ❌ CRITICAL

**File:** `apps/api/src/common/filters/http-exception.filter.ts`  
**Line:** 54

**Replace:**
```typescript
userFriendlyMessage = Array.isArray(message) ? message.join(', ') : message;
```

**With:**
```typescript
if (Array.isArray(message)) {
  userFriendlyMessage = message.join(', ');
} else if (typeof message === 'string') {
  userFriendlyMessage = message;
} else {
  userFriendlyMessage = String(message);
}
```

---

## 2️⃣ MobileMenu Export (2 min) ❌ CRITICAL

**File:** `apps/web/src/components/navigation/MobileMenu.tsx`  
**Add at end of file (line 159):**

```typescript
export default MobileMenu;
```

---

## 3️⃣ Grading Page Types (15 min) ❌ CRITICAL

**File:** `apps/web/src/app/grading/page.tsx`

**Add after imports (~line 20):**
```typescript
type SortKey = 'date' | 'challenge' | 'student' | 'status';
type SortDirection = 'asc' | 'desc';
interface SortConfig {
  key: SortKey;
  direction: SortDirection;
}
```

**Find this (~line 55):**
```typescript
sort: { key: "date"; direction: "desc"; };
```

**Replace with:**
```typescript
sort: SortConfig;
```

**Find handleSort (~line 197):**
```typescript
const handleSort = (key: 'date') => {
```

**Replace with:**
```typescript
const handleSort = (key: SortKey) => {
```

---

## 4️⃣ Database Schema (2 min) ⚠️ CRITICAL

**File:** `apps/api/prisma/schema.prisma`  
**Line:** 9

**Replace:**
```prisma
provider = "sqlite"
```

**With:**
```prisma
provider = "postgresql"
```

**Then run:**
```bash
cd apps/api
npx prisma migrate dev --name initial_schema
```

---

## ✅ Verification Commands

```bash
# Test API build
cd apps/api && npm run build

# Test Frontend build
cd apps/web && npm run build

# Test Types
cd apps/web && npm run type-check
```

**All should pass with 0 errors! ✅**

---

## 🚀 After Fixes → Deploy!

Follow: `QUICK_HEROKU_DEPLOYMENT.md`

