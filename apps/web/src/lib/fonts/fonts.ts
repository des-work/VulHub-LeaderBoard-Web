/**
 * Simplified Font System
 * Easy font switching in code
 */

export const fonts = {
  // Primary fonts for headers and important text - Professional and sophisticated
  primary: {
    name: 'Inter',
    css: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    weights: [300, 400, 500, 600, 700, 800],
    description: 'Modern, professional sans-serif with excellent readability'
  },
  
  // Secondary fonts for body text - Clean and elegant
  secondary: {
    name: 'Poppins',
    css: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
    weights: [300, 400, 500, 600, 700, 800],
    description: 'Geometric sans-serif with friendly, approachable feel'
  },
  
  // Monospace for code and technical content - Developer-friendly
  mono: {
    name: 'Fira Code',
    css: "'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
    weights: [300, 400, 500, 600, 700],
    description: 'Programming font with ligatures and excellent readability'
  },
  
  // Display fonts for special effects - Elegant and sophisticated
  display: {
    name: 'Space Grotesk',
    css: "'Space Grotesk', -apple-system, BlinkMacSystemFont, sans-serif",
    weights: [300, 400, 500, 600, 700],
    description: 'Modern display font with geometric precision'
  },
  
  // Elegant serif for special elements
  serif: {
    name: 'Playfair Display',
    css: "'Playfair Display', Georgia, serif",
    weights: [400, 500, 600, 700],
    description: 'Elegant serif for sophisticated headings'
  }
} as const;

// Easy font switching function
export const getFont = (type: keyof typeof fonts) => fonts[type].css;

// Font loading function with proper error handling
export const loadFonts = () => {
  if (typeof document === 'undefined') {return;}
  
  // Check if fonts are already loaded
  if (document.querySelector('link[href*="fonts.googleapis.com"]')) {
    return;
  }
  
  // Create preconnect links first
  const preconnectGoogle = document.createElement('link');
  preconnectGoogle.rel = 'preconnect';
  preconnectGoogle.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnectGoogle);
  
  const preconnectGstatic = document.createElement('link');
  preconnectGstatic.rel = 'preconnect';
  preconnectGstatic.href = 'https://fonts.gstatic.com';
  preconnectGstatic.crossOrigin = 'anonymous';
  document.head.appendChild(preconnectGstatic);
  
  // Create font links with proper fallbacks
  const fontLinks = [
    {
      family: 'Inter',
      weights: '300;400;500;600;700;800',
      display: 'swap'
    },
    {
      family: 'Poppins', 
      weights: '300;400;500;600;700;800',
      display: 'swap'
    },
    {
      family: 'Fira Code',
      weights: '300;400;500;600;700', 
      display: 'swap'
    },
    {
      family: 'Space Grotesk',
      weights: '300;400;500;600;700',
      display: 'swap'
    },
    {
      family: 'Playfair Display',
      weights: '400;500;600;700',
      display: 'swap'
    }
  ];
  
  // Load fonts with error handling
  fontLinks.forEach(font => {
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weights}&display=${font.display}`;
    fontLink.onerror = () => {
    };
    document.head.appendChild(fontLink);
  });
  
  // Set up font loading detection
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
    });
  }
};
