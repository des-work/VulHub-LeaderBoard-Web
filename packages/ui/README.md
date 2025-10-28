# @vulhub/ui

A comprehensive, accessible, and themeable UI component library for the VulHub Leaderboard, built with React, TypeScript, TailwindCSS, and Radix UI primitives.

## 🎨 Design System Principles

1. **Composition over Configuration**: Components are built from small, single-purpose primitives
2. **Tokens as Source of Truth**: All styling derived from design tokens in `src/tokens/tokens.json`
3. **Variant-Driven Styles**: Component variants managed by `class-variance-authority` for type-safe styling
4. **Accessibility by Default**: Built with keyboard navigation, ARIA attributes, and focus management
5. **Headless First**: Uses Radix UI primitives with custom styling for full control

## 🧱 Package Structure

```
src/
├── tokens/           # Design tokens and CSS variable generation
├── primitives/       # Basic UI components (Button, Input, Card, etc. )
├── components/       # Complex components and accessibility helpers
├── hooks/           # React hooks for UI interactions
├── providers/       # Context providers (Theme, etc.)
├── lib/             # Utility functions
└── styles/          # Global styles and themes
```

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Start Storybook for development
pnpm storybook
```

### Basic Usage

```tsx
import { Button, Input, Card, ThemeProvider } from '@vulhub/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Card>
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Input label="Email" placeholder="Enter your email" />
          <Button>Submit</Button>
        </CardContent>
      </Card>
    </ThemeProvider>
  );
}
```

## 🎨 Design Tokens

The design system is built on a comprehensive token system:

### Colors
- **Primary**: Blue scale for main actions
- **Secondary**: Gray scale for secondary elements
- **Semantic**: Success, warning, error colors
- **Neutral**: Base grays for text and backgrounds

### Typography
- **Font Families**: Inter (sans), JetBrains Mono (mono)
- **Font Sizes**: 12px to 96px with responsive line heights
- **Font Weights**: 100 to 900 with semantic naming

### Spacing
- **Scale**: 0.25rem to 24rem with consistent ratios
- **Semantic**: xs, sm, md, lg, xl for common use cases

## 🧩 Component Primitives

### Button
```tsx
<Button variant="default" size="lg" loading>
  Submit
</Button>
```

**Variants**: default, destructive, outline, secondary, ghost, link  
**Sizes**: sm, default, lg, icon  
**Features**: Loading states, icons, disabled states

### Input
```tsx
<Input 
  label="Email" 
  placeholder="Enter email"
  error="Invalid email"
  leftIcon={<Mail />}
/>
```

**Variants**: default, error, success  
**Sizes**: sm, default, lg  
**Features**: Labels, helper text, error states, icons

### Card
```tsx
<Card variant="elevated" padding="lg">
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

**Variants**: default, outlined, elevated, flat  
**Padding**: none, sm, default, lg

### Badge
```tsx
<Badge variant="success" size="lg">
  Active
</Badge>
```

**Variants**: default, secondary, destructive, success, warning, outline  
**Sizes**: sm, default, lg

### Avatar
```tsx
<Avatar size="lg">
  <AvatarImage src="/user.jpg" alt="User" />
  <AvatarFallback>JD</AvatarFallback>
</Avatar>
```

**Sizes**: sm, default, lg, xl, 2xl

## 🎭 Theme System

### Light/Dark Mode
```tsx
import { ThemeProvider, useTheme } from '@vulhub/ui';

function App() {
  return (
    <ThemeProvider defaultTheme="system">
      <MyApp />
    </ThemeProvider>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Toggle Theme
    </Button>
  );
}
```

### CSS Variables
The theme system uses CSS custom properties for dynamic theming:

```css
:root {
  --color-background: 255 255 255;
  --color-foreground: 15 23 42;
  --color-primary: 59 130 246;
  /* ... */
}
```

## ♿ Accessibility Features

### ARIA Live Regions
```tsx
import { useAriaLiveAnnouncer } from '@vulhub/ui';

function MyComponent() {
  const { announce, AriaLiveComponent } = useAriaLiveAnnouncer();
  
  const handleSubmit = () => {
    // ... submit logic
    announce('Form submitted successfully', 'polite');
  };
  
  return (
    <>
      <AriaLiveComponent />
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
}
```

### Focus Management
```tsx
import { useFocusTrap } from '@vulhub/ui';

function Modal({ isOpen }) {
  const containerRef = useFocusTrap(isOpen);
  
  return (
    <div ref={containerRef}>
      {/* Modal content */}
    </div>
  );
}
```

### Skip Links
```tsx
import { SkipLink } from '@vulhub/ui';

function Layout() {
  return (
    <>
      <SkipLink href="#main">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      {/* Layout content */}
    </>
  );
}
```

## 🧪 Development

### Storybook
```bash
# Start Storybook
pnpm storybook

# Build Storybook
pnpm build-storybook
```

### Component Development
1. Create component in `src/primitives/[component-name]/`
2. Add TypeScript types and variants
3. Create Storybook stories
4. Add accessibility features
5. Test with keyboard navigation

### Testing
```bash
# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

## 📚 Documentation

- **Storybook**: Interactive component documentation
- **TypeScript**: Full type definitions and IntelliSense
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized for production use

## 🤝 Contributing

1. Follow the design system principles
2. Add comprehensive TypeScript types
3. Include accessibility features
4. Write Storybook stories
5. Test with keyboard navigation
6. Ensure responsive design

## 📄 License

MIT © 2025 VulHub Leaderboard Team
