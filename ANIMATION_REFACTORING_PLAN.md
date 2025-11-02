# Animation System Refactoring Plan

## Current State Analysis

### Problems Identified
1. **Poor Performance**: Animation rendering is slow and pixelated
2. **Complex Component**: CastleSiegeAnimation.tsx is 800+ lines with heavy DOM manipulation
3. **Inefficient Rendering**: Creating too many DOM elements (200+ stars, 50+ projectiles, explosions, debris)
4. **No Memoization**: Components re-render on every state change
5. **Direct Style Manipulation**: Using inline styles without optimization
6. **Canvas Alternative Needed**: SVG/DOM approach not suitable for complex animations

### Root Causes
- Using React DOM elements for 2000+ pixel positions
- Updating all elements every frame
- No virtualization or culling
- Heavy CSS-in-JS calculations
- Animation state in React instead of canvas

---

## Refactoring Strategy

### Phase 1: Architecture Decision
**Choose: Canvas-based Animation**

**Why Canvas over DOM/SVG:**
- ✅ Single paint layer (not 200+ elements)
- ✅ Native browser graphics performance
- ✅ Supports 60fps animations
- ✅ Efficient for complex particle effects
- ✅ Smaller bundle size
- ✅ Better control over rendering

**Why not keep DOM:**
- ❌ 200+ star elements = 200 paint operations
- ❌ 50+ projectiles + explosions = exponential repaints
- ❌ Each element gets its own GPU layer
- ❌ CSS transforms and transitions overhead
- ❌ React reconciliation on every frame

---

## Phase 2: Modular Canvas Architecture

### New Structure
```
src/components/auth/
├── CastleSiegeAnimation/
│   ├── index.tsx (React wrapper)
│   ├── canvas/
│   │   ├── CanvasRenderer.ts (core canvas rendering)
│   │   ├── AnimationEngine.ts (animation loop & state)
│   │   ├── Entities.ts (particle, projectile, explosion classes)
│   │   └── Effects.ts (rendering helpers)
│   ├── config.ts (animation constants)
│   └── types.ts (TypeScript interfaces)
└── hooks/
    └── useCanvasAnimation.ts (React integration)
```

---

## Benefits of Canvas Approach

### Performance
- ✅ 60fps animations (vs current stuttering)
- ✅ Single canvas element (vs 1000+ DOM nodes)
- ✅ Efficient memory usage
- ✅ Scalable complexity

### Maintainability
- ✅ Modular architecture
- ✅ Easy to test
- ✅ Clear separation of concerns
- ✅ Easy to adjust visuals/timing

### Developer Experience
- ✅ Type-safe with TypeScript
- ✅ Clear entity system
- ✅ Reusable components
- ✅ Simple to extend

---

## Implementation Plan

### Step 1: Canvas Setup
- Create canvas element (full screen)
- Handle window resize
- Setup rendering context

### Step 2: Animation Engine
- Animation loop (requestAnimationFrame)
- Time-based animation (delta time)
- Phase system (intro, castle, battle, victory)
- Entity management

### Step 3: Entity System
- Base Entity class
- Star particles
- Projectiles
- Explosions
- Castle structure

### Step 4: Rendering
- Draw stars with glow
- Draw castle (simple shapes)
- Draw projectiles with trails
- Draw explosions (expanding rings)

### Step 5: React Integration
- Canvas ref management
- useCanvasAnimation hook
- Cleanup on unmount
- Error handling

### Step 6: Optimizations
- Object pooling
- Spatial culling (off-screen)
- Batch rendering
- Reduced particle count

---

## Success Criteria

1. ✅ Animation plays at 60fps consistently
2. ✅ No visual artifacts or pixelation
3. ✅ Memory usage < 50MB
4. ✅ Render time < 16ms per frame
5. ✅ Skip button works immediately
6. ✅ Smooth transition to form
7. ✅ Code is well-documented
8. ✅ Easy to customize

---

## Estimated Timeline

- **Design & Planning**: ✅ Complete
- **Canvas Setup**: 1 hour
- **Animation Engine**: 1.5 hours
- **Entity System**: 1.5 hours
- **Rendering**: 1.5 hours
- **React Integration**: 1 hour
- **Optimizations**: 1.5 hours
- **Testing & Polish**: 1.5 hours
- **Total**: ~10 hours

---

## Next Steps

1. ✅ Approve plan
2. Create new Canvas-based animation component
3. Implement incrementally with testing
4. Verify performance improvements
5. Deploy improvements

---

## Questions to Confirm

- Proceed with Canvas approach?
- Keep DOM version as fallback?
- Timeline acceptable?
- Any specific features to prioritize?

