# VulHub Design System Documentation

## Overview

The VulHub design system is a **modular, token-based styling architecture** that provides precise control over every aesthetic aspect of the application. All design decisions are centralized in easily-editable CSS files, making customization fast and predictable.

## 📁 File Structure

```
apps/web/src/
├── styles/                      # Modular design system (NEW)
│   ├── design-tokens.css       # Central configuration (colors, spacing, timing)
│   ├── typography.css          # Font system & text utilities
│   ├── spacing.css             # Margin, padding, gap utilities
│   ├── animations.css          # Keyframes, transitions, motion
│   └── effects.css             # Glows, shadows, filters, special effects
│
└── app/
    └── matrix-unified.css      # Component styles built on tokens
```

---

## 🎨 How to Customize

### Quick Reference

| **To Change...**            | **Edit This File**        | **Section**                      |
|-----------------------------|---------------------------|----------------------------------|
| Colors (green, cyan, etc.)  | `design-tokens.css`       | 1. COLOR PALETTE                 |
| Font families               | `design-tokens.css`       | 2. TYPOGRAPHY SYSTEM → Font Families |
| Font sizes                  | `design-tokens.css`       | 2. TYPOGRAPHY SYSTEM → Font Sizes |
| Spacing (margins, padding)  | `design-tokens.css`       | 3. SPACING SCALE                 |
| Animation speed             | `design-tokens.css`       | 4. ANIMATION & TIMING → Duration |
| Glow intensity              | `design-tokens.css`       | 5. VISUAL EFFECTS → Glow Effects |
| Shadow depth                | `design-tokens.css`       | 5. VISUAL EFFECTS → Shadows      |
| Border radius               | `design-tokens.css`       | 6. LAYOUT & STRUCTURE → Border Radius |
| Button height               | `design-tokens.css`       | 7. COMPONENT-SPECIFIC TOKENS     |
| Add new animations          | `animations.css`          | 1. KEYFRAME ANIMATIONS           |
| Add new text styles         | `typography.css`          | PRESET TEXT STYLES               |

---

## 🚀 Common Customization Examples

### Example 1: Change the Primary Green Color

**File:** `apps/web/src/styles/design-tokens.css`

```css
:root {
  /* Change from bright green (0 255 0) to darker green */
  --color-matrix-500: 0 200 0;  /* Original: 0 255 0 */
  
  /* Or change to cyan for a different aesthetic */
  --color-matrix-500: 0 255 255;
}
```

### Example 2: Make Animations Faster/Slower

**File:** `apps/web/src/styles/design-tokens.css`

```css
:root {
  /* Make animations 2x faster */
  --duration-fast: 75ms;      /* Original: 150ms */
  --duration-normal: 125ms;   /* Original: 250ms */
  --duration-slow: 175ms;     /* Original: 350ms */
  
  /* Or make them slower for emphasis */
  --duration-fast: 300ms;
  --duration-normal: 500ms;
  --duration-slow: 700ms;
}
```

### Example 3: Increase Glow Intensity

**File:** `apps/web/src/styles/design-tokens.css`

```css
:root {
  /* Make glows more intense */
  --glow-md: 0 0 16px rgb(var(--color-matrix-500) / 0.8);   /* Original: 0.4 */
  --glow-lg: 0 0 32px rgb(var(--color-matrix-500) / 1.0);   /* Original: 0.5 */
  
  /* Text glow */
  --text-glow-md: 0 0 20px rgb(var(--color-matrix-500) / 0.9); /* Original: 0.6 */
}
```

### Example 4: Change Font to More "Techy" Style

**File:** `apps/web/src/styles/design-tokens.css`

```css
:root {
  /* Use more tech/cyber fonts */
  --font-family-display: 'Orbitron', 'Rajdhani', 'Exo 2', system-ui, sans-serif;
  --font-family-body: 'Share Tech Mono', 'Roboto Mono', monospace;
  --font-family-accent: 'Audiowide', 'Black Ops One', system-ui, sans-serif;
}
```

**Note:** You'll need to import these fonts in `layout.tsx` or via CDN.

### Example 5: Adjust Spacing Scale (More/Less Compact)

**File:** `apps/web/src/styles/design-tokens.css`

```css
:root {
  /* Make UI more compact (reduce spacing by ~25%) */
  --space-4: 0.75rem;   /* Original: 1rem */
  --space-6: 1.125rem;  /* Original: 1.5rem */
  --space-8: 1.5rem;    /* Original: 2rem */
  
  /* Or make UI more spacious (increase by ~25%) */
  --space-4: 1.25rem;
  --space-6: 1.875rem;
  --space-8: 2.5rem;
}
```

### Example 6: Create Custom Button Variant

**File:** `apps/web/src/app/matrix-unified.css`

```css
/* Add after existing button variants */
.matrix-button-cyber {
  background: linear-gradient(
    135deg,
    rgb(var(--color-cyber-600)),
    rgb(var(--color-cyber-500))
  );
  color: rgb(0 0 0);
  border-color: rgb(var(--color-cyber-400));
  box-shadow: 0 0 12px rgb(var(--color-cyber-500) / 0.4);
}

.matrix-button-cyber:hover {
  box-shadow: 0 0 20px rgb(var(--color-cyber-500) / 0.6);
}
```

**Usage:** `<button className="matrix-button matrix-button-cyber">Cyber Action</button>`

### Example 7: Add Custom Animation

**File:** `apps/web/src/styles/animations.css`

```css
/* Add to keyframes section */
@keyframes slideInRotate {
  from {
    opacity: 0;
    transform: translateX(-100px) rotate(-10deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0deg);
  }
}

/* Add utility class */
.animate-slide-in-rotate {
  animation: slideInRotate var(--duration-slow) var(--ease-cyber);
}
```

**Usage:** `<div className="animate-slide-in-rotate">Content</div>`

---

## 🎯 Design Token Categories

### 1. Colors (`design-tokens.css` → COLOR PALETTE)

All colors are defined as **RGB triplets** (not hex) for Tailwind compatibility.

```css
--color-matrix-500: 0 255 0;  /* Usage: rgb(var(--color-matrix-500)) */
```

**Available Palettes:**
- **Matrix Colors** (`--color-matrix-*`): Primary green palette (50-900)
- **Cyber Colors** (`--color-cyber-*`): Cyan/blue accent palette (50-900)
- **Neutral Colors** (`--color-neutral-*`): Grayscale (50-950)
- **Semantic Colors**: `--color-success`, `--color-warning`, `--color-error`, `--color-info`
- **Background Colors**: `--color-bg-primary`, `--color-bg-secondary`, etc.
- **Text Colors**: `--color-text-primary`, `--color-text-secondary`, etc.

### 2. Typography (`design-tokens.css` → TYPOGRAPHY SYSTEM)

**Font Families:**
```css
--font-family-display: 'Orbitron', ...;   /* Headers, titles */
--font-family-body: 'Inter', ...;         /* Body text */
--font-family-mono: 'Fira Code', ...;     /* Code blocks */
--font-family-accent: 'Electrolize', ...;  /* Special emphasis */
```

**Font Sizes** (Fluid, responsive):
```css
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);  /* 12-14px */
--font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);  /* 16-18px */
--font-size-3xl: clamp(1.875rem, 1.5rem + 1.875vw, 2.5rem); /* 30-40px */
```

**Utilities in `typography.css`:**
- `.text-xs` through `.text-5xl` (sizes)
- `.font-thin` through `.font-black` (weights)
- `.leading-tight` through `.leading-loose` (line heights)
- `.tracking-tighter` through `.tracking-widest` (letter spacing)
- `.text-matrix`, `.text-cyber`, `.text-bright`, `.text-muted` (colors)
- `.text-hero`, `.text-heading`, `.text-body`, `.text-code` (preset styles)

### 3. Spacing (`design-tokens.css` → SPACING SCALE)

```css
--space-1: 0.25rem;  /* 4px */
--space-4: 1rem;     /* 16px */
--space-8: 2rem;     /* 32px */
```

**Utilities in `spacing.css`:**
- `.m-*`, `.mx-*`, `.my-*`, `.mt-*`, `.mb-*`, `.ml-*`, `.mr-*` (margins)
- `.p-*`, `.px-*`, `.py-*`, `.pt-*`, `.pb-*`, `.pl-*`, `.pr-*` (padding)
- `.gap-*`, `.gap-x-*`, `.gap-y-*` (flex/grid gaps)

### 4. Animations (`design-tokens.css` → ANIMATION & TIMING)

**Duration:**
```css
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
--duration-pulse: 2000ms;
```

**Easing:**
```css
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-cyber: cubic-bezier(0.87, 0, 0.13, 1);  /* Sharp, digital */
```

**Utilities in `animations.css`:**
- `.animate-fade-in`, `.animate-slide-in-top`, `.animate-scale-in`
- `.animate-matrix-pulse`, `.animate-cyber-scan`, `.animate-glitch`
- `.transition-all`, `.transition-colors`, `.transition-opacity`
- `.duration-fast`, `.ease-cyber`, `.delay-100`
- `.hover-lift`, `.hover-glow`, `.hover-scale`

### 5. Effects (`design-tokens.css` → VISUAL EFFECTS)

**Glows:**
```css
--glow-md: 0 0 8px rgb(var(--color-matrix-500) / 0.4);
--text-glow-md: 0 0 12px rgb(var(--color-matrix-500) / 0.6);
```

**Utilities in `effects.css`:**
- `.glow-sm` through `.glow-2xl` (box glows)
- `.matrix-glow`, `.cyber-glow` (colored glows)
- `.shadow-sm` through `.shadow-2xl` (elevation shadows)
- `.shadow-cyber-*` (matrix-colored shadows)
- `.blur-*`, `.backdrop-blur-*` (blur effects)
- `.glass`, `.glass-matrix` (frosted glass effects)
- `.scan-lines`, `.vignette`, `.matrix-grid`, `.noise` (special effects)

---

## 🧩 Component System

### Cards

```jsx
<div className="matrix-card hover-lift">
  <div className="matrix-card-header">
    <h2 className="text-xl font-display font-bold text-matrix">Title</h2>
  </div>
  <div className="matrix-card-content">
    <p className="text-muted">Content here</p>
  </div>
</div>
```

### Buttons

```jsx
{/* Primary Action */}
<button className="matrix-button matrix-button-primary">
  Submit
</button>

{/* Secondary Action */}
<button className="matrix-button matrix-button-outline">
  Cancel
</button>

{/* Minimal Action */}
<button className="matrix-button matrix-button-ghost">
  Learn More
</button>

{/* Danger Action */}
<button className="matrix-button matrix-button-danger">
  Delete
</button>
```

### Inputs

```jsx
<input 
  type="text" 
  className="matrix-input" 
  placeholder="Enter text..."
/>

<textarea 
  className="matrix-input" 
  placeholder="Enter description..."
/>
```

### Badges

```jsx
<span className="matrix-badge">New</span>
<span className="matrix-badge matrix-badge-success">Completed</span>
<span className="matrix-badge matrix-badge-warning">Pending</span>
<span className="matrix-badge matrix-badge-error">Failed</span>
```

---

## 🎭 Typography Presets

Instead of manually combining classes, use preset text styles:

```jsx
{/* Hero Text - Large, bold, glowing */}
<h1 className="text-hero">VulHub Scoreboard</h1>

{/* Section Heading */}
<h2 className="text-heading">Live Rankings</h2>

{/* Subheading */}
<h3 className="text-subheading">Quick Stats</h3>

{/* Body Text */}
<p className="text-body">Regular paragraph content...</p>

{/* Caption/Small Text */}
<span className="text-caption">Updated 2 minutes ago</span>

{/* Code/Monospace */}
<code className="text-code">npm install</code>

{/* Label (uppercase, wide tracking) */}
<label className="text-label">Username</label>

{/* Cyber Accent */}
<span className="text-cyber-accent">SYSTEM ONLINE</span>
```

---

## 🌈 Color Utility Classes

```jsx
{/* Text Colors */}
<span className="text-matrix">Matrix green</span>
<span className="text-matrix-bright">Brighter green</span>
<span className="text-cyber">Cyan accent</span>
<span className="text-bright">Brightest white</span>
<span className="text-normal">Standard gray</span>
<span className="text-muted">Muted gray</span>
<span className="text-dim">Darkest gray</span>

{/* Text Glow Effects */}
<h1 className="text-matrix-glow">Glowing Title</h1>
<span className="text-cyber-glow">Glowing Cyan</span>
<span className="text-glow-lg">Custom glow</span>
```

---

## 🎬 Animation Examples

```jsx
{/* Entrance Animations */}
<div className="animate-fade-in">Fades in</div>
<div className="animate-slide-in-top">Slides from top</div>
<div className="animate-scale-in">Zooms in</div>

{/* Continuous Animations */}
<div className="animate-matrix-pulse">Pulses with glow</div>
<div className="animate-cyber-scan">Scanning effect</div>
<div className="animate-glitch">Glitch effect</div>

{/* Hover Effects */}
<div className="hover-lift">Lifts on hover</div>
<div className="hover-glow">Glows on hover</div>
<div className="hover-scale">Scales on hover</div>

{/* Transitions */}
<button className="transition-all duration-fast ease-cyber">
  Fast cyber transition
</button>
```

---

## 📐 Layout Utilities

```jsx
{/* Z-Index Layers */}
<div className="layer-background">Background layer</div>
<div className="layer-content">Content layer</div>
<div className="layer-header">Header layer (sticky)</div>

{/* Surface Types */}
<header className="header-surface">Sticky navigation</header>
<div className="row-surface">List item or table row</div>

{/* Container Widths */}
<div className="container-narrow">Max 40rem</div>
<div className="container-normal">Max 60rem</div>
<div className="container-wide">Max 80rem</div>

{/* Divider */}
<hr className="matrix-divider" />
```

---

## ✨ Special Effects

```jsx
{/* Visual Effects */}
<div className="matrix-glow">Matrix green glow</div>
<div className="cyber-glow">Cyan glow</div>
<div className="glass-matrix">Frosted glass effect</div>

{/* Retro Effects */}
<div className="scan-lines">CRT scan lines</div>
<div className="vignette">Vignette overlay</div>
<div className="matrix-grid">Grid background</div>
<div className="noise">Film grain texture</div>

{/* Background Gradients */}
<div className="bg-gradient-matrix">Matrix gradient</div>
<div className="bg-gradient-cyber">Cyber gradient</div>
<div className="bg-gradient-matrix-radial">Radial gradient</div>
```

---

## 🔧 Advanced Customization

### Adding a New Color Theme

1. **Define colors in `design-tokens.css`:**
```css
--color-neon-pink-500: 255 16 240;
--color-neon-orange-500: 255 159 10;
```

2. **Create utility classes in `effects.css`:**
```css
.neon-pink-glow {
  box-shadow: 0 0 20px rgb(var(--color-neon-pink-500) / 0.6);
}
```

3. **Add button variant in `matrix-unified.css`:**
```css
.matrix-button-neon-pink {
  background: rgb(var(--color-neon-pink-500));
  color: #000;
  box-shadow: 0 0 12px rgb(var(--color-neon-pink-500) / 0.5);
}
```

### Creating Theme Variations (Dark/Light Mode)

While the app is currently designed for dark mode only, you can add theme switching:

```css
/* In design-tokens.css */
[data-theme="matrix"][data-mode="light"] {
  --color-bg-primary: 255 255 255;
  --color-text-primary: 0 0 0;
  /* ... override other colors ... */
}
```

### Performance Optimization

- **Reduce animation duration** for lower-end devices
- **Disable animations** by setting all `--duration-*` to `0ms`
- **Reduce glow/shadow complexity** by lowering opacity values
- **Use `prefers-reduced-motion`** media query (already implemented)

---

## 📝 Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Build new components** using existing utility classes
3. **Test changes** by editing one token at a time
4. **Use semantic naming** for new custom classes
5. **Keep responsive design** in mind (use fluid `clamp()` values)
6. **Document custom additions** in this file

---

## 🐛 Troubleshooting

### Colors not showing up?
- Ensure colors are in **RGB triplet format**: `0 255 0` not `#00ff00`
- Use colors with `rgb(var(--color-name))` syntax

### Animations not working?
- Check if `prefers-reduced-motion` is enabled in browser
- Verify animation duration isn't set to `0ms`

### Layout looking broken?
- Clear browser cache and hard reload
- Check that all `@import` statements in `matrix-unified.css` are correct

### Glows too intense/subtle?
- Adjust opacity values in `design-tokens.css` → `VISUAL EFFECTS SYSTEM`

---

## 📚 Additional Resources

- [MDN CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Tricks: A Complete Guide to CSS Variables](https://css-tricks.com/a-complete-guide-to-custom-properties/)

---

**Last Updated:** October 2024  
**Version:** 2.0 (Modular Token System)

