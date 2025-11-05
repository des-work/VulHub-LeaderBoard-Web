# Monorepo Simplification Plan

## Current Structure (Complex)
```
/
├── packages/
│   ├── schema/          → DTOs, validation schemas (shared by both apps)
│   ├── utils/           → Utility functions (shared by both apps)
│   ├── ui/              → UI component library (only web uses)
│   └── config/          → ESLint, Tailwind, TypeScript configs
├── apps/
│   ├── api/             → NestJS backend
│   └── web/             → Next.js frontend
├── package.json         → Root workspace config
└── turbo.json           → Turbo build orchestration
```

**Problems:**
- 4 separate `node_modules` (root + 3 packages + 2 apps) = slow installs
- Package path resolution issues on Vercel
- `workspace:*` protocol doesn't work with npm/yarn
- Yarn can't link monorepo packages properly on Vercel
- Turbo build dependency graph adds complexity

---

## Proposed Simple Structure (No Complexity Loss)
```
/
├── apps/
│   ├── api/
│   │   ├── src/
│   │   │   ├── common/          (replaces packages/config)
│   │   │   ├── shared/          (replaces packages/schema + packages/utils)
│   │   │   ├── modules/
│   │   │   └── ...
│   │   ├── prisma/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/
│       ├── src/
│       │   ├── lib/shared/      (uses same schemas from ../api/src/shared)
│       │   ├── components/
│       │   └── ...
│       ├── package.json
│       └── tsconfig.json
├── package.json         (root, NO workspaces)
└── README.md
```

**Benefits:**
- ✅ Only 3 `node_modules` (root + api + web)
- ✅ No workspace resolution issues
- ✅ Vercel sees simple 2-app structure
- ✅ Direct relative imports: `import { schemas } from '../api/src/shared'`
- ✅ All functionality preserved
- ✅ Faster builds, simpler dependency tree

---

## Migration Plan (Step by Step)

### Phase 1: Create Shared Folder in API
**Move:** `packages/schema/*` → `apps/api/src/shared/schemas/`
**Move:** `packages/utils/*` → `apps/api/src/shared/utils/`
**Move:** `packages/config/*` → `apps/api/src/shared/config/`

Create centralized exports:
```typescript
// apps/api/src/shared/index.ts
export * from './schemas';
export * from './utils';
export * from './config';
```

### Phase 2: Update Web App Imports
All imports in web app:
```typescript
// Before:
import { CreateProjectDto } from '@vulhub/schema';
import { formatDate } from '@vulhub/utils';

// After:
import { CreateProjectDto, formatDate } from '../api/src/shared';
```

### Phase 3: Update Build Configuration
- Remove `packages/` from `package.json` workspaces
- Remove `turbo.json` (replace with simple npm scripts)
- Keep `package.json` in api and web, remove from packages
- Update root `package.json`:
  ```json
  {
    "scripts": {
      "dev": "concurrently 'npm -C apps/api run dev' 'npm -C apps/web run dev'",
      "build": "npm -C apps/api run build && npm -C apps/web run build"
    }
  }
  ```

### Phase 4: Delete Empty Packages
- Delete `packages/schema/`, `packages/utils/`, `packages/config/`
- Keep `packages/ui/` as separate (only web uses it, no deps from api)

### Phase 5: Cleanup
- Remove `workspace:*` from all `package.json` files
- Update all import paths
- Test build locally
- Deploy to Vercel

---

## Functionality Preserved ✅

| Feature | Status | Why |
|---------|--------|-----|
| Type safety | ✓ | Schemas live in API, web imports same types |
| Code reuse | ✓ | Utils in shared folder, imported by both |
| Configuration | ✓ | Config files accessible from both apps |
| Monorepo benefits | ✓ | Still single repo, just simpler structure |
| Separation of concerns | ✓ | API and web still separate `apps/` |
| Build optimization | ✓ | Simpler dependency tree = faster builds |

---

## What Gets Deleted
- `packages/schema/` (consolidated into api/src/shared/schemas/)
- `packages/utils/` (consolidated into api/src/shared/utils/)
- `packages/config/` (consolidated into api/src/shared/config/)
- `turbo.json` (replaced with simple npm scripts)
- `packages/ui/` can stay if needed, or move to `apps/web/src/ui-library`

---

## What Stays the Same
- All application code logic
- All user functionality
- API endpoints
- Web components
- Database schema
- Deployment process (still Vercel)

---

## Implementation Time
- **Phase 1:** Move files (15 min)
- **Phase 2:** Update imports (30 min)
- **Phase 3:** Update build config (10 min)
- **Phase 4:** Delete old packages (5 min)
- **Phase 5:** Test & verify (10 min)

**Total: ~70 minutes**

---

## Risk Level: LOW
- All changes are structural, not logical
- No functional code changes needed
- Easy to revert if needed (git)
- Vercel deployment will be simpler

---

## Verification Checklist
- [ ] `npm run build` works locally
- [ ] `npm run dev` works locally
- [ ] All imports resolve correctly
- [ ] TypeScript compilation passes
- [ ] No build warnings
- [ ] Vercel build succeeds
- [ ] All features work on deployed site

---

## Questions Before Implementation?
**Ready to proceed? (Y/N)**

