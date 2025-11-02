# 🧹 Phase 6: Code Quality Cleanup Plan

**Goal**: Remove dead code, fix imports, standardize patterns, and eliminate technical debt

**Current State**: 135+ exported utilities, inconsistent imports, unused code
**Target State**: Clean, consistent, well-organized codebase

---

## 📋 PHASE 6 OBJECTIVES

### Import Organization & Optimization
- ✅ Remove unused imports
- ✅ Standardize import patterns
- ✅ Fix circular dependencies
- ✅ Optimize bundle splitting

### Dead Code Removal
- ✅ Remove unused exports
- ✅ Delete unused components
- ✅ Clean up unused utilities
- ✅ Remove experimental code

### Code Consistency
- ✅ Standardize naming conventions
- ✅ Consistent error handling patterns
- ✅ Uniform code formatting
- ✅ Consistent file organization

### Performance Optimization
- ✅ Improve tree-shaking
- ✅ Reduce bundle size
- ✅ Optimize imports
- ✅ Remove development code

---

## 🔧 DETAILED IMPLEMENTATION PLAN

### Step 6.1: Import Analysis & Cleanup (Week 1, Days 1-3)

#### Current Issues
```typescript
// Inconsistent import patterns
import { useState, useEffect } from 'react'; // Good
import * as React from 'react'; // Inconsistent
import React, { useState } from 'react'; // Mixed

// Unused imports
import { useCallback, useMemo } from 'react'; // Not used in component
import { formatDate } from '@/lib/utils'; // Not used

// Deep import paths
import { User } from '../../../../types/auth'; // Hard to maintain
```

#### Import Standardization Strategy

**Step 6.1.1: Standardize React Imports**
```typescript
// RULE: Always use named imports for React hooks/utilities
import { useState, useEffect, useCallback, useMemo } from 'react';

// RULE: Use default import only for React itself (rare)
import React from 'react'; // Only when needed

// RULE: Group related imports
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
```

**Step 6.1.2: Standardize Library Imports**
```typescript
// BEFORE: Inconsistent
import { format } from 'date-fns';
import * as _ from 'lodash';
import cn from 'clsx';

// AFTER: Consistent named imports
import { format } from 'date-fns';
import { debounce, throttle } from 'lodash';
import { cn } from '@/lib/utils';
```

**Step 6.1.3: Fix Import Paths**
```typescript
// BEFORE: Deep relative imports
import { User } from '../../../../types/auth';
import { apiClient } from '../../../lib/api/client';

// AFTER: Absolute imports with aliases
import { User } from '@/types/auth';
import { apiClient } from '@/lib/api/client';

// BEFORE: Barrel exports causing bundle issues
import { Button, Input, Card } from '@/components/ui';

// AFTER: Direct imports for better tree-shaking
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
```

**Step 6.1.4: Automated Import Cleanup**
```bash
# Use ESLint to find unused imports
npx eslint --ext .ts,.tsx apps/web/src --rule 'no-unused-vars: error' --rule '@typescript-eslint/no-unused-vars: error'

# Use ts-prune to find unused exports
npx ts-prune --project tsconfig.json
```

### Step 6.2: Dead Code Elimination (Week 1, Days 4-5)

#### Current Issues
- 135+ exported utilities, many unused
- Experimental components never used
- Duplicate utility functions
- Abandoned feature code

#### Dead Code Identification Strategy

**Step 6.2.1: Export Usage Analysis**
```bash
# Find all exports
find apps/web/src -name "*.ts" -o -name "*.tsx" | xargs grep -h "^export" | wc -l
# Result: 537+ exports

# Find unused exports using ts-prune
npx ts-prune --project apps/web/tsconfig.json | grep -v "used in module"
```

**Step 6.2.2: Component Usage Analysis**
```typescript
// Find unused components
const allComponents = [
  'Button', 'Input', 'Card', 'Modal', 'Dropdown',
  'NotificationCenter', 'Toast', 'Loading', 'ErrorBoundary'
];

allComponents.forEach(component => {
  const usage = grep -r component apps/web/src | wc -l;
  if (usage < 2) {
    console.log(`${component} might be unused (${usage} usages)`);
  }
});
```

**Step 6.2.3: Utility Function Audit**
```typescript
// Categorize utilities by usage
const utilities = {
  // Keep (used in 5+ places)
  essential: ['cn', 'formatDate', 'debounce'],

  // Review (used in 2-4 places)
  review: ['chunk', 'groupBy', 'validateEmail'],

  // Remove (used in 0-1 places)
  remove: ['complexAlgorithm', 'experimentalFeature', 'oldFormatDate']
};
```

**Step 6.2.4: Remove Dead Code**
```typescript
// Files to remove based on analysis:
- utils/dead-code.ts (0 usages)
- components/ExperimentalFeature.tsx (never rendered)
- hooks/useOldApi.ts (replaced by new API)
- types/legacy.ts (replaced by new types)

// Functions to remove:
- export function unusedUtility() {} // 0 usages
- export function duplicateFormat() {} // replaced by formatDate
- export const OLD_CONSTANT = 'old'; // replaced by NEW_CONSTANT
```

### Step 6.3: Naming Convention Standardization (Week 2, Days 1-2)

#### Current Issues
```typescript
// Inconsistent naming patterns
const userData = {}; // vs user
const getUserInfo = () => {}; // vs fetchUser
const handleSubmit = () => {}; // vs onFormSubmit
const formatDate = () => {}; // vs formatDateTime

// Inconsistent file naming
UserProfile.tsx // Component
user-profile.tsx // Inconsistent
userProfile.tsx // Inconsistent
```

#### Standardization Strategy

**Step 6.3.1: Variable Naming**
```typescript
// RULE: Use descriptive names
const user = {}; // ✅ Good
const data = {}; // ❌ Too generic

// RULE: Consistent patterns
const handleSubmit = () => {}; // ✅ Event handlers
const onFormChange = () => {}; // ✅ Event handlers
const formatDate = () => {}; // ✅ Utility functions
const getUserById = () => {}; // ✅ Data fetching
const validateEmail = () => {}; // ✅ Validation
```

**Step 6.3.2: Function Naming**
```typescript
// Data fetching
const getUser = () => {}; // ✅
const fetchUserData = () => {}; // ✅
const loadUser = () => {}; // ✅

// Event handlers
const handleSubmit = () => {}; // ✅
const onButtonClick = () => {}; // ✅
const handleInputChange = () => {}; // ✅

// Utility functions
const formatDate = () => {}; // ✅
const calculateTotal = () => {}; // ✅
const validateForm = () => {}; // ✅
```

**Step 6.3.3: File Naming**
```typescript
// Components: PascalCase
UserProfile.tsx ✅
UserList.tsx ✅

// Hooks: camelCase with use prefix
useUser.ts ✅
useAuth.ts ✅

// Utils: descriptive names
date-utils.ts ✅
string-helpers.ts ✅

// Types: descriptive names
user.types.ts ✅
api.types.ts ✅
```

**Step 6.3.4: Automated Renaming**
```bash
# Use ESLint rules for naming consistency
{
  "rules": {
    "camelcase": "error",
    "@typescript-eslint/naming-convention": [
      "error",
      {
        "selector": "variable",
        "format": ["camelCase", "UPPER_CASE"]
      },
      {
        "selector": "function",
        "format": ["camelCase"]
      }
    ]
  }
}
```

### Step 6.4: Code Formatting & Style Consistency (Week 2, Days 3-4)

#### Current Issues
- Inconsistent indentation (tabs vs spaces)
- Mixed quote styles (" vs ')
- Inconsistent semicolon usage
- Inconsistent bracket spacing

#### Standardization Strategy

**Step 6.4.1: ESLint Configuration**
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'prettier'
  ],
  rules: {
    'quotes': ['error', 'single'],
    'semi': ['error', 'always'],
    'indent': ['error', 2],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never']
  }
};
```

**Step 6.4.2: Prettier Configuration**
```javascript
// .prettierrc.js
module.exports = {
  singleQuote: true,
  semi: true,
  tabWidth: 2,
  trailingComma: 'all',
  printWidth: 100,
  bracketSpacing: true,
  arrowParens: 'avoid'
};
```

**Step 6.4.3: Automated Formatting**
```bash
# Format all files
npx prettier --write "apps/web/src/**/*.{ts,tsx,json,css,md}"

# Check for formatting issues
npx prettier --check "apps/web/src/**/*.{ts,tsx,json,css,md}"

# Fix ESLint issues
npx eslint --ext .ts,.tsx apps/web/src --fix
```

### Step 6.5: Error Handling Standardization (Week 2, Day 5)

#### Current Issues
```typescript
// Inconsistent error handling patterns
try {
  await apiCall();
} catch (error) {
  console.error(error); // ❌
}

try {
  await apiCall();
} catch (error) {
  setError('Something went wrong'); // ❌ Too generic
}

try {
  await apiCall();
} catch (error) {
  throw new Error('Custom error'); // ❌ Loses original error
}
```

#### Standardization Strategy

**Step 6.5.1: Unified Error Handling**
```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code?: string,
    public statusCode?: number
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError('An unexpected error occurred');
}

export function getErrorMessage(error: unknown): string {
  const appError = handleError(error);
  return appError.message;
}
```

**Step 6.5.2: Consistent Error Patterns**
```typescript
// API calls
try {
  const result = await apiCall();
  return result;
} catch (error) {
  throw handleError(error);
}

// Component error handling
const [error, setError] = useState<string | null>(null);

const handleAction = async () => {
  try {
    setError(null);
    await action();
  } catch (err) {
    setError(getErrorMessage(err));
  }
};

// Form validation
const validateField = (value: string): string | null => {
  if (!value.trim()) {
    return 'This field is required';
  }
  return null;
};
```

### Step 6.6: File Organization Cleanup (Week 3, Days 1-3)

#### Current Issues
- Inconsistent folder structure
- Files in wrong locations
- Missing index files
- Circular dependencies

#### Organization Strategy

**Step 6.6.1: Consistent Folder Structure**
```
lib/
├── api/           # API clients and endpoints
├── auth/          # Authentication logic
├── components/    # Reusable components
├── hooks/         # Custom hooks
├── types/         # TypeScript types
├── utils/         # Utility functions
└── validations/   # Validation schemas

components/
├── ui/            # Basic UI components
├── forms/         # Form components
├── layout/        # Layout components
└── feature/       # Feature-specific components
```

**Step 6.6.2: Index Files for Clean Imports**
```typescript
// lib/index.ts
export * from './api';
export * from './auth';
export * from './utils';
export * from './types';

// components/ui/index.ts
export { Button } from './button';
export { Input } from './input';
export { Card } from './card';
```

**Step 6.6.3: Resolve Circular Dependencies**
```typescript
// BEFORE: Circular dependency
// A imports B, B imports A

// AFTER: Extract common types
// types/common.ts (shared types)
// A imports from types/common.ts
// B imports from types/common.ts
```

### Step 6.7: Performance Optimization (Week 3, Days 4-5)

#### Bundle Analysis & Optimization
```typescript
// Analyze bundle
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

// Identify large dependencies
// Remove unused imports
// Optimize dynamic imports
```

#### Runtime Performance
```typescript
// BEFORE: Expensive computations on every render
const expensiveValue = computeExpensiveValue(props);

// AFTER: Memoized expensive computations
const expensiveValue = useMemo(() => computeExpensiveValue(props), [props]);
```

#### Tree Shaking Optimization
```typescript
// BEFORE: Imports everything
import * as utils from '@/lib/utils';

// AFTER: Tree-shakeable imports
import { formatDate, cn } from '@/lib/utils';
```

### Step 6.8: Final Testing & Validation (Week 4, Days 1-5)

#### Comprehensive Testing
```typescript
// Unit tests for utilities
describe('formatDate', () => {
  it('should format dates consistently', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('1/1/2023');
  });
});

// Integration tests for imports
describe('Imports', () => {
  it('should not have circular dependencies', () => {
    // Test that all imports resolve
    const { formatDate } = require('@/lib/utils');
    expect(typeof formatDate).toBe('function');
  });
});

// Bundle size tests
describe('Bundle Size', () => {
  it('should maintain reasonable bundle size', () => {
    const stats = getBundleStats();
    expect(stats.size).toBeLessThan(500 * 1024); // 500KB
  });
});
```

---

## 📊 PHASE 6 METRICS

### Quantitative Targets
- **Unused Exports**: 0 (all exports used or removed)
- **Circular Dependencies**: 0
- **Bundle Size**: Maintain or improve from Phase 5
- **Import Issues**: 0 ESLint import errors

### Qualitative Targets
- ✅ Consistent code formatting
- ✅ Standard naming conventions
- ✅ Clean import organization
- ✅ No dead code
- ✅ Proper error handling

---

## 🔗 PHASE 6 DEPENDENCIES

### Prerequisites
- ✅ All previous phases completed
- ✅ Basic functionality verified
- ✅ Development environment stable

### Risks
- **Breaking Changes**: Import path changes
- **Build Failures**: Removing code that is actually used
- **Performance Impact**: Bundle optimization changes

### Testing Requirements
- **Build Tests**: Verify all builds pass
- **Import Tests**: Verify all imports resolve
- **Bundle Tests**: Verify size optimizations
- **Integration Tests**: Verify no functionality broken

---

## 🎯 PHASE 6 SUCCESS CRITERIA

**Phase 6 is complete when:**

✅ **Clean**: No unused code or imports
✅ **Consistent**: Uniform naming, formatting, and patterns
✅ **Optimized**: Better bundle size and performance
✅ **Maintainable**: Clear organization and structure
✅ **Reliable**: All imports resolve, no circular dependencies

---

## 🚀 FINAL OUTCOME

After Phase 6, your codebase will have:

- **Consistent, clean imports** with no unused dependencies
- **Zero dead code** - everything serves a purpose
- **Standardized patterns** for naming, error handling, and formatting
- **Optimized bundle size** through better tree-shaking
- **Clear file organization** with proper separation of concerns
- **No circular dependencies** or import issues
- **Comprehensive test coverage** for the cleanup changes

**Ready to begin Phase 6 implementation?** This final phase will polish your codebase into a professional, maintainable state.
