import { tokens } from './tokens.json';

/**
 * Generate CSS custom properties from design tokens
 */
export function generateCSSVariables(): string {
  const cssVariables: string[] = [];

  // Generate color variables
  Object.entries(tokens.colors).forEach(([colorName, colorScale]) => {
    Object.entries(colorScale).forEach(([shade, value]) => {
      cssVariables.push(`  --color-${colorName}-${shade}: ${value};`);
    });
  });

  // Generate typography variables
  Object.entries(tokens.typography.fontSize).forEach(([size, config]) => {
    const [fontSize, lineHeight] = Array.isArray(config) ? config : [config, '1'];
    cssVariables.push(`  --font-size-${size}: ${fontSize};`);
    cssVariables.push(`  --line-height-${size}: ${lineHeight};`);
  });

  Object.entries(tokens.typography.fontWeight).forEach(([weight, value]) => {
    cssVariables.push(`  --font-weight-${weight}: ${value};`);
  });

  Object.entries(tokens.typography.letterSpacing).forEach(([spacing, value]) => {
    cssVariables.push(`  --letter-spacing-${spacing}: ${value};`);
  });

  // Generate spacing variables
  Object.entries(tokens.spacing).forEach(([size, value]) => {
    cssVariables.push(`  --spacing-${size}: ${value};`);
  });

  // Generate border radius variables
  Object.entries(tokens.borderRadius).forEach(([radius, value]) => {
    cssVariables.push(`  --border-radius-${radius}: ${value};`);
  });

  // Generate shadow variables
  Object.entries(tokens.shadows).forEach(([shadow, value]) => {
    cssVariables.push(`  --shadow-${shadow}: ${value};`);
  });

  // Generate animation variables
  Object.entries(tokens.animations.duration).forEach(([duration, value]) => {
    cssVariables.push(`  --duration-${duration}: ${value};`);
  });

  Object.entries(tokens.animations.easing).forEach(([easing, value]) => {
    cssVariables.push(`  --easing-${easing}: ${value};`);
  });

  return `:root {\n${cssVariables.join('\n')}\n}`;
}

/**
 * Generate CSS variables for dark theme
 */
export function generateDarkThemeVariables(): string {
  const darkVariables: string[] = [
    '  --color-background: var(--color-neutral-900);',
    '  --color-foreground: var(--color-neutral-50);',
    '  --color-muted: var(--color-neutral-800);',
    '  --color-muted-foreground: var(--color-neutral-400);',
    '  --color-border: var(--color-neutral-700);',
    '  --color-input: var(--color-neutral-800);',
    '  --color-ring: var(--color-primary-500);',
  ];

  return `[data-theme="dark"] {\n${darkVariables.join('\n')}\n}`;
}

/**
 * Generate CSS variables for light theme
 */
export function generateLightThemeVariables(): string {
  const lightVariables: string[] = [
    '  --color-background: var(--color-neutral-0);',
    '  --color-foreground: var(--color-neutral-900);',
    '  --color-muted: var(--color-neutral-100);',
    '  --color-muted-foreground: var(--color-neutral-500);',
    '  --color-border: var(--color-neutral-200);',
    '  --color-input: var(--color-neutral-0);',
    '  --color-ring: var(--color-primary-500);',
  ];

  return `[data-theme="light"] {\n${lightVariables.join('\n')}\n}`;
}
