# VulHub Design System

## Overview
The VulHub Leaderboard uses a custom design system with dramatic fonts and a purple/red/black/green color palette optimized for cybersecurity education and competition.

## Color Palette

### Primary Colors
- **Purple** (`#a855f7`) - Main brand color, headers, and primary elements
- **Red** (`#ef4444`) - Accent color, highlights, and secondary elements  
- **Black** (`#000000`) - Background and dark elements
- **Green** (`#22c55e`) - Success states, accents, and positive indicators

### Color Scale
Each color includes a full scale from 50-950 for different use cases:

#### Purple Scale
```css
--color-primary-50: 250 245 255   /* Lightest purple */
--color-primary-100: 243 232 255
--color-primary-200: 233 213 255
--color-primary-300: 216 180 254
--color-primary-400: 196 132 252
--color-primary-500: 168 85 247   /* Main purple */
--color-primary-600: 147 51 234
--color-primary-700: 126 34 206
--color-primary-800: 107 33 168
--color-primary-900: 88 28 135
--color-primary-950: 59 7 100     /* Darkest purple */
```

#### Red Scale
```css
--color-secondary-50: 254 242 242   /* Lightest red */
--color-secondary-100: 254 226 226
--color-secondary-200: 254 202 202
--color-secondary-300: 252 165 165
--color-secondary-400: 248 113 113
--color-secondary-500: 239 68 68    /* Main red */
--color-secondary-600: 220 38 38
--color-secondary-700: 185 28 28
--color-secondary-800: 153 27 27
--color-secondary-900: 127 29 29
--color-secondary-950: 69 10 10     /* Darkest red */
```

#### Green Scale
```css
--color-success: 34 197 94   /* Main green */
--color-warning: 245 158 11  /* Amber warning */
--color-error: 239 68 68     /* Red error */
--color-info: 59 130 246     /* Blue info */
```

### Usage Examples
```html
<!-- Primary purple text -->
<h1 class="text-purple-400">Main Title</h1>

<!-- Red accent text -->
<h2 class="text-red-400">Subtitle</h2>

<!-- Green success text -->
<p class="text-green-400">Success message</p>

<!-- Black background -->
<div class="bg-black">Dark container</div>
```

## Typography

### Font Families

#### 1. Orbitron (Primary)
- **Use**: Headers, titles, main branding
- **Style**: Futuristic geometric sans-serif
- **Weights**: 400, 700, 900
- **Characteristics**: Sharp edges, sci-fi aesthetic
- **CSS Class**: `font-header`

```html
<h1 class="font-header text-4xl">Main Title</h1>
```

#### 2. Exo 2 (Secondary)
- **Use**: Body text, descriptions, UI elements
- **Style**: Modern geometric sans-serif
- **Weights**: 300, 400, 500, 600, 700
- **Characteristics**: Clean, readable, modern
- **CSS Class**: `font-body`

```html
<p class="font-body text-base">Body text content</p>
```

#### 3. JetBrains Mono (Monospace)
- **Use**: Code, technical content, data
- **Style**: Modern monospace for developers
- **Weights**: 400, 500, 600, 700
- **Characteristics**: Excellent readability, programming-friendly
- **CSS Class**: `font-code`

```html
<code class="font-code text-sm">const user = { name: 'John' };</code>
```

#### 4. Audiowide (Display)
- **Use**: Special effects, large display text
- **Style**: Bold futuristic display font
- **Weights**: 400
- **Characteristics**: Electronic feel, high impact
- **CSS Class**: `font-display`

```html
<div class="font-display text-6xl">DISPLAY TEXT</div>
```

### Font Switching in Code

#### Using CSS Classes
```html
<h1 class="font-header text-4xl">Header Text</h1>
<p class="font-body text-base">Body Text</p>
<code class="font-code text-sm">Code Text</code>
<div class="font-display text-6xl">Display Text</div>
```

#### Using JavaScript
```typescript
import { applyFont, applyFontToClass, fontPresets } from '../lib/fonts/font-utils';

// Apply font to specific element
const element = document.getElementById('myElement');
applyFont(element, 'primary');

// Apply font to all elements with class
applyFontToClass('my-class', 'secondary');

// Apply preset fonts
fontPresets.all(); // Apply all presets
fontPresets.headers(); // Apply only headers
```

## Visual Effects

### Flickering Text Effects
```html
<!-- Standard flickering -->
<h1 class="flicker">Flickering Text</h1>

<!-- Slow flickering -->
<h2 class="flicker-slow">Slow Flicker</h2>

<!-- Fast flickering -->
<h3 class="flicker-fast">Fast Flicker</h3>

<!-- Random flickering -->
<h4 class="flicker-random">Random Flicker</h4>
```

### Neon Glow Effects
```html
<!-- Purple glow -->
<h1 class="neon-glow-purple">Purple Glow</h1>

<!-- Red glow -->
<h2 class="neon-glow-red">Red Glow</h2>

<!-- Green glow -->
<h3 class="neon-glow-green">Green Glow</h3>

<!-- Generic glow (uses current color) -->
<h4 class="neon-glow">Generic Glow</h4>
```

### Pulsing Effects
```html
<!-- Glow pulse -->
<h1 class="glow-pulse">Pulsing Glow</h1>

<!-- Rainbow text -->
<h2 class="text-rainbow">Rainbow Text</h2>
```

## Component Examples

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
    Card content with body font
  </p>
</div>
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

## CSS Variables

All colors and fonts are available as CSS custom properties:

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

## Best Practices

### Color Usage
- Use **purple** for primary actions and headers
- Use **red** for warnings, errors, and secondary highlights
- Use **green** for success states and positive feedback
- Use **black** for backgrounds and dark elements
- Maintain sufficient contrast for accessibility

### Typography
- Use **Orbitron** sparingly for maximum impact
- Use **Exo 2** for most body text and UI elements
- Use **JetBrains Mono** for all code and technical content
- Use **Audiowide** only for special display effects

### Effects
- Use flickering effects sparingly to avoid overwhelming users
- Combine neon glows with appropriate colors
- Test effects on different screen sizes and devices
- Consider users with motion sensitivity

## Accessibility

### Color Contrast
- All text meets WCAG AA contrast requirements
- High contrast mode support available
- Color is never the only indicator of meaning

### Motion
- Reduced motion support for flickering effects
- Smooth transitions for better user experience
- Optional animation controls

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- CSS custom properties support required
- Google Fonts loading for typography
- WebGL support for background effects
