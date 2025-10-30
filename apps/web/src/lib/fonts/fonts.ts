/**
 * Simplified Font System
 * Easy font switching in code
 */

export const fonts = {
  // Primary fonts for headers and important text
  primary: {
    name: 'Orbitron',
    css: "'Orbitron', monospace",
    weights: [400, 700, 900],
    description: 'Futuristic geometric sans-serif'
  },
  
  // Secondary fonts for body text
  secondary: {
    name: 'Exo 2',
    css: "'Exo 2', sans-serif", 
    weights: [300, 400, 500, 600, 700],
    description: 'Modern geometric sans-serif'
  },
  
  // Monospace for code and technical content
  mono: {
    name: 'JetBrains Mono',
    css: "'JetBrains Mono', monospace",
    weights: [400, 500, 600, 700],
    description: 'Modern monospace for developers'
  },
  
  // Display fonts for special effects
  display: {
    name: 'Audiowide',
    css: "'Audiowide', monospace",
    weights: [400],
    description: 'Bold futuristic display font'
  }
} as const;

// Easy font switching function
export const getFont = (type: keyof typeof fonts) => fonts[type].css;

// Font loading function
export const loadFonts = () => {
  if (typeof document === 'undefined') return;
  
  // Create font links
  const fontLinks = [
    {
      family: 'Orbitron',
      weights: '400;700;900',
      display: 'swap'
    },
    {
      family: 'Exo 2', 
      weights: '300;400;500;600;700',
      display: 'swap'
    },
    {
      family: 'JetBrains Mono',
      weights: '400;500;600;700', 
      display: 'swap'
    },
    {
      family: 'Audiowide',
      weights: '400',
      display: 'swap'
    }
  ];
  
  fontLinks.forEach(font => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = 'https://fonts.googleapis.com';
    document.head.appendChild(link);
    
    const link2 = document.createElement('link');
    link2.rel = 'preconnect';
    link2.href = 'https://fonts.gstatic.com';
    link2.crossOrigin = 'anonymous';
    document.head.appendChild(link2);
    
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = `https://fonts.googleapis.com/css2?family=${font.family}:wght@${font.weights}&display=${font.display}`;
    document.head.appendChild(fontLink);
  });
};
