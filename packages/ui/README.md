# packages/ui

This package contains the shared, composable, and themeable UI component library for the VulHub Leaderboard, built with React, TailwindCSS, and `cva`.

## 🎨 Design System Principles

1.  **Composition over Configuration**: Components are built from small, single-purpose primitives.
2.  **Tokens as Source of Truth**: All styling (colors, spacing, typography, etc.) is derived from design tokens defined in `src/tokens/tokens.json`.
3.  **Variant-Driven Styles**: Component variants (e.g., `intent`, `size`) are managed by `class-variance-authority` (cva) for a predictable and type-safe styling API.
4.  **Accessibility by Default**: Primitives are built with accessibility (keyboard navigation, ARIA attributes, focus management) as a primary concern.
5.  **Headless First**: Where possible, we use headless component libraries (like Radix UI) and apply our own styles, giving us full control over markup and styling.

## 🧱 Structure

The package is organized into a clear hierarchy:

*   `src/tokens/`: The single source of truth for design tokens. These are used to generate Tailwind configuration and CSS variables.
*   `src/primitives/`: The smallest building blocks of the UI (e.g., `Button`, `Input`, `Dialog`). These are typically styled wrappers around headless components. Each primitive has its own variants file (`*.variants.ts`).
*   `src/patterns/`: More complex, app-agnostic components composed from primitives (e.g., `PaginatedTable`, `FilterBar`, `AppShell`). These components often expose "slots" for custom content.
*   `src/hooks/`: Shared UI-related React hooks (e.g., `useMediaQuery`, `usePrefersReducedMotion`).
*   `src/providers/`: Global React context providers (e.g., `ThemeProvider`).

## 🚀 Usage

Components from this package are consumed by the `web` application. The `web` app may create its own "feature" components that compose patterns and add domain-specific logic.

### Example Primitive API

```tsx
import { Button } from '@vulhub/ui/primitives/button';

<Button intent="primary" size="lg" leftIcon={<Icon />}>
  Submit
</Button>
```
