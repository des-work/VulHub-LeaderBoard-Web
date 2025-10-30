import { FontConfig, FontTheme } from './types';

export const fontConfigs: FontConfig[] = [
  // Cyber/Tech Fonts
  {
    name: 'orbitron',
    displayName: 'Orbitron',
    category: 'cyber',
    cssFamily: 'Orbitron',
    googleFonts: {
      family: 'Orbitron',
      weights: [400, 700, 900],
      subsets: ['latin']
    },
    fallbacks: ['monospace'],
    description: 'Futuristic geometric sans-serif with sharp edges',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: true,
      technical: true
    }
  },
  {
    name: 'exo2',
    displayName: 'Exo 2',
    category: 'cyber',
    cssFamily: 'Exo 2',
    googleFonts: {
      family: 'Exo 2',
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Modern, geometric sans-serif with sci-fi aesthetics',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: true,
      technical: false
    }
  },
  {
    name: 'rajdhani',
    displayName: 'Rajdhani',
    category: 'cyber',
    cssFamily: 'Rajdhani',
    googleFonts: {
      family: 'Rajdhani',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Sharp, condensed sans-serif with technical feel',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: false,
      technical: true
    }
  },
  {
    name: 'audiowide',
    displayName: 'Audiowide',
    category: 'cyber',
    cssFamily: 'Audiowide',
    googleFonts: {
      family: 'Audiowide',
      weights: [400],
      subsets: ['latin']
    },
    fallbacks: ['monospace'],
    description: 'Bold, futuristic display font with electronic feel',
    characteristics: {
      dramatic: true,
      readable: false,
      futuristic: true,
      technical: true
    }
  },

  // Monospace Fonts
  {
    name: 'jetbrains-mono',
    displayName: 'JetBrains Mono',
    category: 'monospace',
    cssFamily: 'JetBrains Mono',
    googleFonts: {
      family: 'JetBrains Mono',
      weights: [100, 200, 300, 400, 500, 600, 700, 800],
      subsets: ['latin']
    },
    fallbacks: ['monospace'],
    description: 'Modern monospace font designed for developers',
    characteristics: {
      dramatic: false,
      readable: true,
      futuristic: false,
      technical: true
    }
  },
  {
    name: 'fira-code',
    displayName: 'Fira Code',
    category: 'monospace',
    cssFamily: 'Fira Code',
    googleFonts: {
      family: 'Fira Code',
      weights: [300, 400, 500, 600, 700],
      subsets: ['latin']
    },
    fallbacks: ['monospace'],
    description: 'Monospace font with programming ligatures',
    characteristics: {
      dramatic: false,
      readable: true,
      futuristic: false,
      technical: true
    }
  },
  {
    name: 'source-code-pro',
    displayName: 'Source Code Pro',
    category: 'monospace',
    cssFamily: 'Source Code Pro',
    googleFonts: {
      family: 'Source Code Pro',
      weights: [200, 300, 400, 500, 600, 700, 800, 900],
      subsets: ['latin']
    },
    fallbacks: ['monospace'],
    description: 'Adobe monospace font with excellent readability',
    characteristics: {
      dramatic: false,
      readable: true,
      futuristic: false,
      technical: true
    }
  },

  // Display Fonts
  {
    name: 'bebas-neue',
    displayName: 'Bebas Neue',
    category: 'display',
    cssFamily: 'Bebas Neue',
    googleFonts: {
      family: 'Bebas Neue',
      weights: [400],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Bold, condensed display font with strong impact',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: false,
      technical: false
    }
  },
  {
    name: 'anton',
    displayName: 'Anton',
    category: 'display',
    cssFamily: 'Anton',
    googleFonts: {
      family: 'Anton',
      weights: [400],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Heavy, condensed sans-serif with strong presence',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: false,
      technical: false
    }
  },
  {
    name: 'russo-one',
    displayName: 'Russo One',
    category: 'display',
    cssFamily: 'Russo One',
    googleFonts: {
      family: 'Russo One',
      weights: [400],
      subsets: ['latin', 'cyrillic']
    },
    fallbacks: ['sans-serif'],
    description: 'Bold, futuristic display font with Russian influence',
    characteristics: {
      dramatic: true,
      readable: true,
      futuristic: true,
      technical: false
    }
  },

  // Sans-serif Fonts
  {
    name: 'inter',
    displayName: 'Inter',
    category: 'sans-serif',
    cssFamily: 'Inter',
    googleFonts: {
      family: 'Inter',
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Modern, highly readable sans-serif',
    characteristics: {
      dramatic: false,
      readable: true,
      futuristic: false,
      technical: false
    }
  },
  {
    name: 'poppins',
    displayName: 'Poppins',
    category: 'sans-serif',
    cssFamily: 'Poppins',
    googleFonts: {
      family: 'Poppins',
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      subsets: ['latin']
    },
    fallbacks: ['sans-serif'],
    description: 'Geometric sans-serif with friendly, modern feel',
    characteristics: {
      dramatic: false,
      readable: true,
      futuristic: false,
      technical: false
    }
  }
];

export const fontThemes: FontTheme[] = [
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    description: 'Futuristic tech aesthetic with sharp, dramatic fonts',
    primary: fontConfigs.find(f => f.name === 'orbitron')!,
    secondary: fontConfigs.find(f => f.name === 'exo2')!,
    accent: fontConfigs.find(f => f.name === 'audiowide')!,
    mono: fontConfigs.find(f => f.name === 'jetbrains-mono')!
  },
  {
    id: 'matrix',
    name: 'Matrix',
    description: 'Classic hacker aesthetic with monospace dominance',
    primary: fontConfigs.find(f => f.name === 'jetbrains-mono')!,
    secondary: fontConfigs.find(f => f.name === 'source-code-pro')!,
    accent: fontConfigs.find(f => f.name === 'fira-code')!,
    mono: fontConfigs.find(f => f.name === 'jetbrains-mono')!
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bold, dramatic display fonts for high impact',
    primary: fontConfigs.find(f => f.name === 'bebas-neue')!,
    secondary: fontConfigs.find(f => f.name === 'russo-one')!,
    accent: fontConfigs.find(f => f.name === 'audiowide')!,
    mono: fontConfigs.find(f => f.name === 'fira-code')!
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Clean, professional fonts with technical precision',
    primary: fontConfigs.find(f => f.name === 'inter')!,
    secondary: fontConfigs.find(f => f.name === 'rajdhani')!,
    accent: fontConfigs.find(f => f.name === 'exo2')!,
    mono: fontConfigs.find(f => f.name === 'source-code-pro')!
  },
  {
    id: 'futuristic',
    name: 'Futuristic',
    description: 'Sci-fi inspired fonts with space-age aesthetics',
    primary: fontConfigs.find(f => f.name === 'exo2')!,
    secondary: fontConfigs.find(f => f.name === 'orbitron')!,
    accent: fontConfigs.find(f => f.name === 'russo-one')!,
    mono: fontConfigs.find(f => f.name === 'jetbrains-mono')!
  }
];
