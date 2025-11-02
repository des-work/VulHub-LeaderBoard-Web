/**
 * Font Switching Utilities
 * Easy font customization in code
 */

import { fonts, getFont } from './fonts';

// Apply font to element
export const applyFont = (element: HTMLElement, fontType: keyof typeof fonts) => {
  element.style.fontFamily = getFont(fontType);
};

// Apply font to all elements with a class
export const applyFontToClass = (className: string, fontType: keyof typeof fonts) => {
  if (typeof document === 'undefined') {return;}
  
  const elements = document.querySelectorAll(`.${className}`);
  elements.forEach(element => {
    if (element instanceof HTMLElement) {
      applyFont(element, fontType);
    }
  });
};

// Font switching presets for different sections
export const fontPresets = {
  // Headers and titles
  headers: () => applyFontToClass('font-header', 'primary'),
  
  // Body text
  body: () => applyFontToClass('font-body', 'secondary'),
  
  // Code and technical content
  code: () => applyFontToClass('font-code', 'mono'),
  
  // Special display text
  display: () => applyFontToClass('font-display', 'display'),
  
  // Apply all presets
  all: () => {
    fontPresets.headers();
    fontPresets.body();
    fontPresets.code();
    fontPresets.display();
  }
};

// CSS classes for easy font switching
export const fontClasses = {
  header: 'font-header',
  body: 'font-body', 
  code: 'font-code',
  display: 'font-display'
};

// Example usage in components:
// <h1 className={`${fontClasses.header} text-4xl`}>Title</h1>
// <p className={`${fontClasses.body} text-base`}>Body text</p>
// <code className={`${fontClasses.code} text-sm`}>code snippet</code>
// <div className={`${fontClasses.display} text-6xl`}>Display text</div>
