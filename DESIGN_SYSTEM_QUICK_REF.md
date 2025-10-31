# Design System Quick Reference

## 🎯 "I want to change..."

### Colors
```css
/* File: apps/web/src/styles/design-tokens.css */
--color-matrix-500: 0 255 0;     /* Main green */
--color-cyber-500: 0 255 255;    /* Cyan accent */
```

### Animation Speed
```css
/* File: apps/web/src/styles/design-tokens.css */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Glow Intensity
```css
/* File: apps/web/src/styles/design-tokens.css */
--glow-md: 0 0 8px rgb(var(--color-matrix-500) / 0.4);  /* Increase 0.4 → 0.8 */
--text-glow-md: 0 0 12px rgb(var(--color-matrix-500) / 0.6);  /* Increase 0.6 → 1.0 */
```

### Font Families
```css
/* File: apps/web/src/styles/design-tokens.css */
--font-family-display: 'Orbitron', system-ui, sans-serif;
--font-family-body: 'Inter', system-ui, sans-serif;
```

### Spacing (More/Less Compact)
```css
/* File: apps/web/src/styles/design-tokens.css */
--space-4: 1rem;      /* Reduce to 0.75rem for compact */
--space-6: 1.5rem;    /* Reduce to 1.125rem for compact */
```

---

## 🧩 Component Classes

### Card
```jsx
<div className="matrix-card hover-lift">
  <div className="matrix-card-header">
    <h2 className="text-xl font-display font-bold text-matrix">Title</h2>
  </div>
  <div className="matrix-card-content">Content</div>
</div>
```

### Buttons
```jsx
<button className="matrix-button matrix-button-primary">Primary</button>
<button className="matrix-button matrix-button-outline">Secondary</button>
<button className="matrix-button matrix-button-ghost">Minimal</button>
<button className="matrix-button matrix-button-danger">Delete</button>
```

### Input
```jsx
<input type="text" className="matrix-input" placeholder="Text..." />
```

### Badge
```jsx
<span className="matrix-badge">Default</span>
<span className="matrix-badge matrix-badge-success">Success</span>
<span className="matrix-badge matrix-badge-warning">Warning</span>
```

---

## 🎨 Text Presets

```jsx
<h1 className="text-hero">Hero Title</h1>
<h2 className="text-heading">Section Heading</h2>
<h3 className="text-subheading">Subheading</h3>
<p className="text-body">Body text</p>
<span className="text-caption">Small text</span>
<code className="text-code">Code block</code>
<label className="text-label">Label</label>
```

---

## 🌈 Color Classes

```jsx
<span className="text-matrix">Matrix green</span>
<span className="text-cyber">Cyan</span>
<span className="text-bright">Bright white</span>
<span className="text-muted">Muted gray</span>
<span className="text-dim">Dark gray</span>

<h1 className="text-matrix-glow">Glowing text</h1>
```

---

## 🎬 Animations

```jsx
{/* Entrance */}
<div className="animate-fade-in">Fade in</div>
<div className="animate-slide-in-top">Slide from top</div>
<div className="animate-scale-in">Zoom in</div>

{/* Continuous */}
<div className="animate-matrix-pulse">Pulsing glow</div>
<div className="animate-cyber-scan">Scanning effect</div>

{/* Hover */}
<div className="hover-lift">Lifts on hover</div>
<div className="hover-glow">Glows on hover</div>
```

---

## ✨ Effects

```jsx
{/* Glows */}
<div className="matrix-glow">Green glow</div>
<div className="cyber-glow">Cyan glow</div>

{/* Special */}
<div className="glass-matrix">Frosted glass</div>
<div className="scan-lines">CRT effect</div>
<div className="matrix-grid">Grid background</div>
```

---

## 📐 Layout

```jsx
{/* Surfaces */}
<header className="header-surface">Sticky nav</header>
<div className="row-surface">List item</div>

{/* Containers */}
<div className="container-narrow">Narrow</div>
<div className="container-normal">Normal</div>
<div className="container-wide">Wide</div>
```

---

## 📁 File Map

| File | Contains |
|------|----------|
| `design-tokens.css` | Colors, spacing, timing (main config) |
| `typography.css` | Fonts, text sizes, text utilities |
| `spacing.css` | Margin, padding, gap utilities |
| `animations.css` | Keyframes, transitions, hover effects |
| `effects.css` | Glows, shadows, filters, special effects |
| `matrix-unified.css` | Component styles (cards, buttons, inputs) |

---

## 🔧 Most Common Changes

1. **Brighter/Darker Colors**: Edit RGB values in `design-tokens.css`
2. **Faster/Slower Animations**: Edit `--duration-*` in `design-tokens.css`
3. **More/Less Glow**: Edit opacity in glow definitions in `design-tokens.css`
4. **Different Font**: Edit `--font-family-*` in `design-tokens.css`
5. **More/Less Spacing**: Edit `--space-*` in `design-tokens.css`

---

For full documentation, see `DESIGN_SYSTEM.md`

