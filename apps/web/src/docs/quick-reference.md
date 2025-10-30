# Quick Reference Guide

## 🎨 Colors

### Primary Colors
```css
/* Purple - Main brand color */
text-purple-400    /* #a855f7 */
bg-purple-500      /* #a855f7 */
border-purple-500  /* #a855f7 */

/* Red - Accent color */
text-red-400       /* #ef4444 */
bg-red-500         /* #ef4444 */
border-red-500     /* #ef4444 */

/* Green - Success color */
text-green-400     /* #22c55e */
bg-green-500       /* #22c55e */
border-green-500   /* #22c55e */

/* Black - Background */
bg-black           /* #000000 */
text-white         /* #ffffff */
```

### Color Scale Usage
```css
/* Lightest to darkest */
text-purple-50     /* Very light purple */
text-purple-100    /* Light purple */
text-purple-200    /* Lighter purple */
text-purple-300    /* Light purple */
text-purple-400    /* Medium purple */
text-purple-500    /* Main purple */
text-purple-600    /* Dark purple */
text-purple-700    /* Darker purple */
text-purple-800    /* Very dark purple */
text-purple-900    /* Darkest purple */
text-purple-950    /* Almost black purple */
```

## 🔤 Fonts

### Font Classes
```html
<!-- Headers and titles -->
<h1 class="font-header text-4xl">Main Title</h1>

<!-- Body text -->
<p class="font-body text-base">Body content</p>

<!-- Code and technical -->
<code class="font-code text-sm">const x = 1;</code>

<!-- Display text -->
<div class="font-display text-6xl">DISPLAY</div>
```

### Font Weights
```css
font-thin      /* 100 */
font-light     /* 300 */
font-normal    /* 400 */
font-medium    /* 500 */
font-semibold  /* 600 */
font-bold      /* 700 */
font-extrabold /* 800 */
font-black     /* 900 */
```

## ✨ Visual Effects

### Flickering Effects
```html
<!-- Standard flickering -->
<h1 class="flicker">Flickering Text</h1>

<!-- Slow flickering (4s) -->
<h2 class="flicker-slow">Slow Flicker</h2>

<!-- Fast flickering (0.5s) -->
<h3 class="flicker-fast">Fast Flicker</h3>

<!-- Random flickering -->
<h4 class="flicker-random">Random Flicker</h4>
```

### Neon Glow Effects
```html
<!-- Color-specific glows -->
<h1 class="neon-glow-purple">Purple Glow</h1>
<h2 class="neon-glow-red">Red Glow</h2>
<h3 class="neon-glow-green">Green Glow</h3>

<!-- Generic glow (uses current color) -->
<h4 class="neon-glow">Generic Glow</h4>

<!-- Pulsing glow -->
<h5 class="glow-pulse">Pulsing Glow</h5>
```

### Rainbow Effects
```html
<!-- Rainbow text -->
<h1 class="text-rainbow">Rainbow Text</h1>
```

## 🧩 Component Examples

### Header with Effects
```html
<header class="bg-black border-b border-purple-500/30">
  <h1 class="text-2xl font-bold text-purple-400 font-mono neon-glow-purple flicker">
    VulHub Scoreboard
  </h1>
</header>
```

### Card with Neon Effects
```html
<div class="bg-black/80 border border-purple-500/30 shadow-lg shadow-purple-500/20">
  <h3 class="text-xl font-bold text-red-400 font-mono neon-glow-red">
    Card Title
  </h3>
  <p class="text-gray-300 font-body">
    Card content
  </p>
</div>
```

### Button with Effects
```html
<button class="bg-purple-500 text-white font-mono px-4 py-2 rounded neon-glow-purple hover:bg-purple-600 transition-colors">
  Click Me
</button>
```

### Code Block
```html
<pre class="bg-gray-900 p-4 rounded border border-green-500/30">
  <code class="font-code text-green-400">
    const leaderboard = {
      users: [],
      update: () => {}
    };
  </code>
</pre>
```

## 🎯 Common Patterns

### Main Title
```html
<h1 class="text-6xl font-bold text-purple-400 font-mono neon-glow-purple flicker-slow">
  MAIN TITLE
</h1>
```

### Subtitle
```html
<h2 class="text-4xl font-bold text-red-400 font-mono neon-glow-red flicker">
  Subtitle
</h2>
```

### Body Text
```html
<p class="text-base text-gray-300 font-body">
  Body text content
</p>
```

### Code Snippet
```html
<code class="text-sm text-green-400 font-code bg-gray-900 px-2 py-1 rounded">
  code snippet
</code>
```

### Success Message
```html
<div class="bg-green-500/10 border border-green-500/50 text-green-400 p-4 rounded">
  Success message
</div>
```

### Error Message
```html
<div class="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded">
  Error message
</div>
```

### Warning Message
```html
<div class="bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 p-4 rounded">
  Warning message
</div>
```

## 🔧 JavaScript Utilities

### Font Switching
```typescript
import { applyFont, applyFontToClass, fontPresets } from '../lib/fonts/font-utils';

// Apply font to element
const element = document.getElementById('myElement');
applyFont(element, 'primary');

// Apply font to class
applyFontToClass('my-class', 'secondary');

// Apply all presets
fontPresets.all();
```

### Font Classes
```typescript
import { fontClasses } from '../lib/fonts/font-utils';

// Use in JSX
<h1 className={`${fontClasses.header} text-4xl`}>Title</h1>
<p className={`${fontClasses.body} text-base`}>Body</p>
<code className={`${fontClasses.code} text-sm`}>Code</code>
<div className={`${fontClasses.display} text-6xl`}>Display</div>
```

## 📱 Responsive Design

### Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Responsive Text
```html
<h1 class="text-4xl md:text-6xl lg:text-8xl font-header">
  Responsive Title
</h1>
```

### Responsive Grid
```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Grid items -->
</div>
```

## 🎨 CSS Custom Properties

### Available Variables
```css
/* Colors */
--color-primary-500: 168 85 247;    /* Purple */
--color-secondary-500: 239 68 68;   /* Red */
--color-success: 34 197 94;         /* Green */
--color-neutral-950: 0 0 0;         /* Black */

/* Fonts */
--font-primary: 'Orbitron', monospace;
--font-secondary: 'Exo 2', sans-serif;
--font-mono: 'JetBrains Mono', monospace;
--font-display: 'Audiowide', monospace;
```

### Using Variables
```css
.my-custom-element {
  color: rgb(var(--color-primary-500));
  font-family: var(--font-primary);
  background: linear-gradient(45deg, 
    rgb(var(--color-primary-500)), 
    rgb(var(--color-secondary-500))
  );
}
```

## 🚀 Performance Tips

### Font Loading
- Fonts are loaded automatically via Google Fonts
- Use `font-display: swap` for better performance
- Preload critical fonts if needed

### Effect Performance
- Use `flicker` sparingly to avoid overwhelming users
- Combine effects thoughtfully
- Test on lower-end devices

### CSS Optimization
- Use Tailwind's utility classes
- Avoid custom CSS when possible
- Leverage CSS custom properties for theming
