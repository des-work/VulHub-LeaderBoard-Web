# VulHub Leaderboard - Standardized Startup Sequence

## Overview
This document defines the exact startup sequence for the application, broken into phases with clear verification steps.

## Phase 0: Environment & Services (Pre-Application)
**Goal**: Ensure all services are available

### Checklist
- [ ] Node.js running (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Port 3010 available (frontend dev server)
- [ ] Port 4010 available (API)
- [ ] Database accessible (if applicable)

### Verification
```bash
netstat -ano | findstr :3010
netstat -ano | findstr :4010
```

---

## Phase 1: Application Load (Server Rendering)
**Goal**: Server can render initial HTML without errors

### Server Side
1. Next.js dev server starts
2. Layout component (`layout.tsx`) renders as Server Component
3. HTML is generated and served

### Client Side
1. Browser receives HTML
2. CSS and fonts load
3. JavaScript bundles download
4. React hydration begins

### Verification
- [ ] Can curl the page: `curl http://localhost:3010/auth`
- [ ] HTML contains expected elements
- [ ] No 500 errors in server logs

---

## Phase 2: React Hydration & Provider Setup
**Goal**: React providers initialize without errors

### Order (CRITICAL)
1. Root layout mounts
2. `<html>` and `<body>` hydrate
3. `QueryProvider` initializes (React Query)
4. `AuthProvider` initializes (Auth context)
5. `NotificationProvider` initializes (Notifications)
6. `ErrorBoundary` mounts (Error handling)
7. `ToastContainer` mounts (Toast display)
8. Page component mounts (auth page)

### Common Failures
- **Missing provider**: Child component uses hook but parent provider missing
- **Provider error**: Provider itself throws during initialization
- **Hydration mismatch**: Server HTML differs from client render

### Verification
- [ ] No console errors in DevTools Console tab
- [ ] No "useAuth must be used within AuthProvider" errors
- [ ] No hydration warnings
- [ ] Page is interactive (clickable)

---

## Phase 3: Page Component Mount
**Goal**: Auth page component renders without errors

### Execution Order
1. `AuthPage` component mounts
2. `useState` hooks initialize
3. `useEffect` hooks run (check auth status, etc.)
4. If authenticated → redirect to `/`
5. If not authenticated → render auth UI

### Expected Behavior
- If logged in: Redirect to home
- If not logged in: Show animation or login form

### Verification
- [ ] No console errors
- [ ] Check DevTools for redirect (should see `/` in Network tab)
- [ ] If not logged in, animation should start immediately

---

## Phase 4: Animation Rendering
**Goal**: Castle siege animation displays and completes

### Timeline
- **T=0s**: Animation container appears (full screen, centered)
- **T=0-10s**: Animation plays (castle, projectiles, explosions, etc.)
- **T=10s**: Animation completes, calls `onComplete` callback
- **T=10-10.8s**: Animation fades out (`opacity 0`)
- **T=10.8s**: Form appears (login/register)

### Critical Properties
- Container: `fixed inset-0 z-50` (covers entire screen)
- Centered: `flex items-center justify-center`
- Dismissible: Skip button (top-right)
- Keyboard: Press any key to skip

### Verification
- [ ] Animation appears within 1 second of page load
- [ ] Animation is centered on screen
- [ ] Skip button is visible and clickable
- [ ] Animation completes after ~10 seconds
- [ ] Console shows "Animation complete - starting fade out"
- [ ] After fade, form appears

### Debug Steps
1. Open DevTools (F12)
2. Go to Console tab
3. Look for: "AnimationComplete" log messages
4. Check Element Inspector for animation DOM
5. Check z-index values in Computed Styles

---

## Phase 5: Form Rendering
**Goal**: Login/Register form appears and is interactive

### Timeline
- **T=10.8s**: Form fades in with animation
- **T=11.6s**: Form is fully visible and interactive

### Expected State
- Login form shows by default
- "Sign Up" toggle available
- Email/password fields visible
- Submit button clickable

### Verification
- [ ] Form appears after animation
- [ ] Console shows "Animation faded out - showing form"
- [ ] Form is clickable (not covered by other elements)
- [ ] Form has correct z-index (higher than animation)

---

## Phase 6: User Interaction
**Goal**: Form accepts input and can submit

### Interactions
1. User enters email/password
2. User clicks "Sign In"
3. API request sent to `/api/v1/auth/login`
4. Response received (success or error)
5. Action taken (redirect or show error)

### Verification
- [ ] Form accepts keyboard input
- [ ] Submit button is clickable
- [ ] Network tab shows API request
- [ ] API response is received (200 or error)

---

## Troubleshooting by Phase

### Phase 1 Fails (No HTML)
- [ ] Check if dev server is running
- [ ] Check terminal for build errors
- [ ] Verify port 3010 is not blocked

### Phase 2 Fails (Hydration/Provider Errors)
- [ ] Check Console for provider errors
- [ ] Verify all required providers in layout.tsx
- [ ] Check for console.log statements in providers
- [ ] Look for useEffect errors

### Phase 3 Fails (Page Component Errors)
- [ ] Check for missing imports
- [ ] Verify hook usage (only in client components)
- [ ] Check for runtime errors in useEffect

### Phase 4 Fails (Animation Not Showing)
- [ ] Check if animation component is mounted
- [ ] Verify CSS is loaded
- [ ] Check z-index values
- [ ] Verify animation duration and timing
- [ ] Look for animation component errors in console

### Phase 5 Fails (Form Not Showing)
- [ ] Check if animation completed (`onComplete` called)
- [ ] Verify `showForm` state is set
- [ ] Check z-index of form vs animation
- [ ] Look for form component errors

### Phase 6 Fails (Form Not Interactive)
- [ ] Check if form is covered by other elements
- [ ] Verify button click handlers
- [ ] Check for event listeners

---

## Quick Diagnostic Checklist

```javascript
// Run this in browser console to check state:
console.log('Page loaded: ', document.readyState);
console.log('Animation container: ', document.querySelector('[class*="z-50"]'));
console.log('Form container: ', document.querySelector('[class*="z-100"]'));
console.log('Skip button: ', document.querySelector('button'));
```

---

## Files Involved in Startup

### Core Files
- `apps/web/src/app/layout.tsx` - Root layout, providers
- `apps/web/src/app/auth/page.tsx` - Auth page
- `apps/web/src/components/auth/CastleSiegeAnimation.tsx` - Animation
- `apps/web/src/lib/auth/context.tsx` - Auth provider
- `apps/web/src/lib/data/QueryProvider.tsx` - React Query provider

### CSS
- `apps/web/src/app/matrix-unified.css` - Main styles
- `apps/web/src/app/styles/accessibility.css` - Accessibility
- `apps/web/src/app/styles/responsive.css` - Responsive
- `apps/web/src/app/globals.css` - Global animations

### Configuration
- `apps/web/next.config.js` - Next.js config
- `apps/web/tsconfig.json` - TypeScript config

---

## Performance Notes

### Expected Timings
- HTML delivery: < 500ms
- CSS load: < 300ms
- JavaScript load: < 1s
- React hydration: < 500ms
- Animation start: < 1s
- Total to form interactive: 12-13s

### Optimization Opportunities
- CSS loading (critical vs deferred)
- JavaScript bundle size
- Image optimization
- Font loading strategy

---

## Maintenance

### When to Use This Document
- Debugging startup issues
- Onboarding new developers
- Performance troubleshooting
- Creating automated tests
- Documenting expected behavior

### Update Frequency
- Update when startup sequence changes
- Update when new providers added
- Update when timing changes significantly

