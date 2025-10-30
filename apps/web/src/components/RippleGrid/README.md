# RippleGrid Component

A powerful WebGL-based animated grid background component built with OGL (OpenGL for the Web) and React.

## Features

- **WebGL-powered animations** - Smooth, hardware-accelerated rendering
- **Interactive mouse effects** - Grid responds to mouse movement
- **Theme integration** - Automatically adapts to your theme system
- **Highly customizable** - Extensive parameter control
- **Performance optimized** - Efficient rendering with proper cleanup
- **TypeScript support** - Full type safety

## Components

### RippleGrid
The base component with full customization options.

```tsx
import { RippleGrid } from '../components/RippleGrid';

<RippleGrid
  gridColor="#00ff00"
  rippleIntensity={0.05}
  gridSize={10.0}
  gridThickness={15.0}
  glowIntensity={0.1}
  opacity={0.6}
  mouseInteraction={true}
/>
```

### MatrixRippleGrid
Pre-configured for Matrix theme with intensity presets.

```tsx
import { MatrixRippleGrid } from '../components/RippleGrid';

<MatrixRippleGrid 
  intensity="medium" 
  enableMouseInteraction={true} 
  opacity={0.6} 
/>
```

### ThemeRippleGrid
Automatically adapts to your current theme.

```tsx
import { ThemeRippleGrid } from '../components/RippleGrid';

<ThemeRippleGrid 
  intensity="high" 
  enableMouseInteraction={true} 
  opacity={0.8} 
/>
```

## Props

### RippleGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `enableRainbow` | `boolean` | `false` | Enable rainbow color mode |
| `gridColor` | `string` | `'#00ff00'` | Grid color (hex format) |
| `rippleIntensity` | `number` | `0.05` | Intensity of ripple effects |
| `gridSize` | `number` | `10.0` | Size of the grid pattern |
| `gridThickness` | `number` | `15.0` | Thickness of grid lines |
| `fadeDistance` | `number` | `1.5` | Distance for fade effect |
| `vignetteStrength` | `number` | `2.0` | Strength of vignette effect |
| `glowIntensity` | `number` | `0.1` | Intensity of glow effect |
| `opacity` | `number` | `1.0` | Overall opacity |
| `gridRotation` | `number` | `0` | Rotation angle in degrees |
| `mouseInteraction` | `boolean` | `true` | Enable mouse interaction |
| `mouseInteractionRadius` | `number` | `1` | Radius of mouse influence |

### MatrixRippleGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Predefined intensity level |
| `enableMouseInteraction` | `boolean` | `true` | Enable mouse interaction |
| `opacity` | `number` | `0.6` | Overall opacity |

### ThemeRippleGridProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `'low' \| 'medium' \| 'high'` | `'medium'` | Predefined intensity level |
| `enableMouseInteraction` | `boolean` | `true` | Enable mouse interaction |
| `opacity` | `number` | `0.6` | Overall opacity |

## Theme Integration

The RippleGrid automatically adapts to different themes:

- **Matrix**: Green grid with cyberpunk aesthetics
- **Cyberpunk**: Pink/magenta grid with neon effects
- **Terminal**: Green grid with terminal-style appearance
- **Default**: Blue grid with modern styling

## Performance

- Uses WebGL for hardware-accelerated rendering
- Automatic cleanup on component unmount
- Responsive to window resize events
- Optimized for 60fps animations
- Memory efficient with proper resource management

## Browser Support

- Modern browsers with WebGL support
- Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome Mobile)

## Usage Examples

### Basic Usage
```tsx
import { RippleGrid } from '../components/RippleGrid';

function MyComponent() {
  return (
    <div className="relative">
      <RippleGrid />
      <div className="relative z-10">
        {/* Your content */}
      </div>
    </div>
  );
}
```

### With Custom Settings
```tsx
import { RippleGrid } from '../components/RippleGrid';

function MyComponent() {
  return (
    <div className="relative">
      <RippleGrid
        gridColor="#ff0080"
        rippleIntensity={0.08}
        gridSize={12.0}
        glowIntensity={0.15}
        opacity={0.8}
      />
      <div className="relative z-10">
        {/* Your content */}
      </div>
    </div>
  );
}
```

### Theme-Aware
```tsx
import { ThemeRippleGrid } from '../components/RippleGrid';

function MyComponent() {
  return (
    <div className="relative">
      <ThemeRippleGrid intensity="high" />
      <div className="relative z-10">
        {/* Your content */}
      </div>
    </div>
  );
}
```

## Styling

The component includes CSS for proper positioning and theme integration:

```css
.ripple-grid-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}
```

## Demo

Visit `/demo` to see the RippleGrid in action with interactive controls.
