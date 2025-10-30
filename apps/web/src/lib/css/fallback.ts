/**
 * Fallback CSS System
 * Provides critical styles when Tailwind CSS fails to load
 */

export const FALLBACK_CSS = `
/* Critical Fallback Styles */
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Courier New', Courier, monospace;
  background-color: #000000;
  color: #00ff00;
  line-height: 1.5;
}

/* Layout Utilities */
.min-h-screen { min-height: 100vh; }
.h-screen { height: 100vh; }
.w-full { width: 100%; }
.h-full { height: 100%; }

/* Flexbox */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-row { flex-direction: row; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.flex-1 { flex: 1; }

/* Grid */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }
.gap-8 { gap: 2rem; }

/* Spacing */
.p-0 { padding: 0; }
.p-1 { padding: 0.25rem; }
.p-2 { padding: 0.5rem; }
.p-4 { padding: 1rem; }
.p-6 { padding: 1.5rem; }
.p-8 { padding: 2rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-12 { padding-top: 3rem; padding-bottom: 3rem; }
.py-20 { padding-top: 5rem; padding-bottom: 5rem; }
.m-0 { margin: 0; }
.m-4 { margin: 1rem; }
.mx-auto { margin-left: auto; margin-right: auto; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-12 { margin-bottom: 3rem; }
.mb-16 { margin-bottom: 4rem; }
.mt-4 { margin-top: 1rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-8 { margin-top: 2rem; }

/* Positioning */
.relative { position: relative; }
.absolute { position: absolute; }
.fixed { position: fixed; }
.inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.top-4 { top: 1rem; }
.right-4 { right: 1rem; }
.z-10 { z-index: 10; }
.z-50 { z-index: 50; }

/* Colors */
.bg-black { background-color: #000000; }
.bg-green-500 { background-color: #00ff00; }
.bg-green-400 { background-color: #00ff00; }
.bg-green-300 { background-color: #00ff00; }
.bg-gray-900 { background-color: #1a1a1a; }
.bg-gray-400 { background-color: #9ca3af; }
.text-green-400 { color: #00ff00; }
.text-green-300 { color: #00ff00; }
.text-green-500 { color: #00ff00; }
.text-white { color: #ffffff; }
.text-gray-300 { color: #d1d5db; }
.text-gray-400 { color: #9ca3af; }
.text-yellow-400 { color: #fbbf24; }
.text-orange-400 { color: #fb923c; }
.text-red-500 { color: #ef4444; }

/* Typography */
.text-xs { font-size: 0.75rem; }
.text-sm { font-size: 0.875rem; }
.text-base { font-size: 1rem; }
.text-lg { font-size: 1.125rem; }
.text-xl { font-size: 1.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-4xl { font-size: 2.25rem; }
.text-6xl { font-size: 3.75rem; }
.font-mono { font-family: 'Courier New', Courier, monospace; }
.font-bold { font-weight: bold; }
.font-semibold { font-weight: 600; }
.leading-relaxed { line-height: 1.625; }
.leading-tight { line-height: 1.25; }

/* Borders */
.border { border: 1px solid #00ff00; }
.border-b { border-bottom: 1px solid #00ff00; }
.border-t { border-top: 1px solid #00ff00; }
.rounded { border-radius: 0.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.rounded-full { border-radius: 9999px; }

/* Shadows */
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1); }

/* Transitions */
.transition-all { transition: all 0.2s ease-in-out; }
.duration-200 { transition-duration: 200ms; }

/* Hover States */
.hover\\:bg-green-500\\/10:hover { background-color: rgba(0, 255, 0, 0.1); }
.hover\\:bg-green-500\\/20:hover { background-color: rgba(0, 255, 0, 0.2); }
.hover\\:opacity-80:hover { opacity: 0.8; }

/* Responsive */
@media (min-width: 640px) {
  .sm\\:flex-row { flex-direction: row; }
}

@media (min-width: 768px) {
  .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1024px) {
  .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

/* Container */
.container {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1rem;
  padding-right: 1rem;
}

@media (min-width: 640px) {
  .container { max-width: 640px; }
}

@media (min-width: 768px) {
  .container { max-width: 768px; }
}

@media (min-width: 1024px) {
  .container { max-width: 1024px; }
}

@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}

/* Matrix-specific styles */
.text-shadow-matrix {
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.text-shadow-neon {
  text-shadow: 
    0 0 5px rgba(0, 255, 0, 0.8),
    0 0 10px rgba(0, 255, 0, 0.6),
    0 0 15px rgba(0, 255, 0, 0.4);
}

/* Button styles */
button {
  cursor: pointer;
  border: none;
  background: none;
  font-family: inherit;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Focus styles */
button:focus-visible {
  outline: 2px solid #00ff00;
  outline-offset: 2px;
}

/* Animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Utility classes */
.space-x-3 > * + * { margin-left: 0.75rem; }
.space-x-4 > * + * { margin-left: 1rem; }
.space-y-3 > * + * { margin-top: 0.75rem; }
.space-y-4 > * + * { margin-top: 1rem; }

.max-w-4xl { max-width: 56rem; }
.max-w-md { max-width: 28rem; }
.max-h-96 { max-height: 24rem; }

.overflow-y-auto { overflow-y: auto; }

.cursor-pointer { cursor: pointer; }
.cursor-not-allowed { cursor: not-allowed; }

.break-all { word-break: break-all; }

/* Text alignment */
.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }

/* Display */
.hidden { display: none; }
.block { display: block; }
.inline { display: inline; }
.inline-block { display: inline-block; }
.inline-flex { display: inline-flex; }

/* Width/Height */
.w-2 { width: 0.5rem; }
.w-4 { width: 1rem; }
.w-6 { width: 1.5rem; }
.w-8 { width: 2rem; }
.w-12 { width: 3rem; }
.w-16 { width: 4rem; }
.h-2 { height: 0.5rem; }
.h-4 { height: 1rem; }
.h-6 { height: 1.5rem; }
.h-8 { height: 2rem; }
.h-12 { height: 3rem; }
.h-16 { height: 4rem; }

/* Opacity */
.opacity-50 { opacity: 0.5; }
.opacity-80 { opacity: 0.8; }

/* Backdrop */
.backdrop-blur-sm { backdrop-filter: blur(4px); }

/* Matrix background effects */
.matrix-bg {
  background: 
    radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(0, 255, 0, 0.1) 0%, transparent 50%),
    linear-gradient(135deg, #000000 0%, #001100 25%, #000000 50%, #001100 75%, #000000 100%);
}

/* Scan lines effect */
.scan-lines::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(transparent 50%, rgba(0, 255, 0, 0.03) 50%);
  background-size: 100% 4px;
  animation: scan-lines 0.1s linear infinite;
  pointer-events: none;
  z-index: 1;
}

@keyframes scan-lines {
  0% { transform: translateY(0); }
  100% { transform: translateY(4px); }
}
`;

export function injectFallbackCSS(): void {
  if (typeof window === 'undefined') return;

  // Check if fallback CSS is already injected
  const existingStyle = document.getElementById('fallback-css');
  if (existingStyle) return;

  // Create and inject fallback CSS
  const style = document.createElement('style');
  style.id = 'fallback-css';
  style.textContent = FALLBACK_CSS;
  document.head.appendChild(style);

  console.log('Fallback CSS injected');
}

export function removeFallbackCSS(): void {
  if (typeof window === 'undefined') return;

  const existingStyle = document.getElementById('fallback-css');
  if (existingStyle) {
    existingStyle.remove();
    console.log('Fallback CSS removed');
  }
}
