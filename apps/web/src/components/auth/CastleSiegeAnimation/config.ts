/**
 * Animation Configuration
 * 
 * Constants and configuration for the Castle Siege Animation
 */

// Colors - COMPLETE
export const COLORS = {
  bgBlack: '#000000',
  matrix: '#00ff00',
  starWhite: '#ffffff',
  flagGreen: '#00ff00',
  titleWhite: '#ffffff',
  skyTop: '#1a1a2e',
  skyMid: '#16213e',
  skyBottom: '#0f3460',
  castleBrown: '#8B7355',
  castleBrownDark: '#654321',
  castleYellow: '#FFD700',
  castleYellowGlow: '#FFED4E',
  castleGate: '#A0522D',
  castleAmber: '#FFBF00',
  castleGateDark: '#8B4513',
  castleGateDarker: '#654321',
  victorGreen: '#00FF00',
  bgDark: '#0a0a0a',
  healthHigh: '#00FF00',
  healthMid: '#FFFF00',
  healthLow: '#FF0000',
  titleGreen: '#00FF00',
  subtitleCyan: '#00FFFF',
  titleCyan: '#00FFFF',
};

// Animation Timings - COMPLETE
export const ANIMATION_TIMINGS = {
  intro: {
    start: 0,
    end: 100,
    duration: 100,
  },
  castle: {
    start: 0,
    end: 800,
    duration: 800,
  },
  armies: {
    start: 800,
    end: 2000,
    duration: 1200,
  },
  battle: {
    start: 2000,
    end: 5000,
    duration: 3000,
  },
  intense: {
    start: 5000,
    end: 7000,
    duration: 2000,
  },
  victory: {
    start: 7000,
    end: 8200,
    duration: 1200,
  },
  flag: {
    start: 8200,
    end: 9400,
    duration: 1200,
  },
  title: {
    start: 9400,
    end: 10000,
    duration: 600,
  },
};

export const TOTAL_DURATION = 10000; // 10 seconds

// Army Configuration
export const ARMIES = [
  { color: '#ef4444', position: 'left' as const, units: 15 },
  { color: '#3b82f6', position: 'right' as const, units: 15 },
  { color: '#f59e0b', position: 'bottom' as const, units: 10 },
];

// Star Configuration - EXPANDED
export const STAR_CONFIG = {
  count: 100,
  initialCount: 20,
  maxCount: 150,
  growthRate: 5,
  minSize: 1,
  maxSize: 2,
  twinkleSpeed: 0.02,
  minBrightness: 0.3,
  maxBrightness: 1.0,
  twinkleSpeedMin: 0.01,
  twinkleSpeedMax: 0.03,
  colors: ['#ffffff', '#e0e0ff', '#ffe0e0'],
};

// Projectile Configuration - EXPANDED
export const PROJECTILE_CONFIG = {
  speed: 0.015,
  size: 4,
  trail: true,
  trailLength: 10,
  trailProbability: 0.7,
  rotationSpeed: 0.05,
  spawnInterval: {
    normal: 400,
    intense: 200,
  },
};

// Castle Configuration - RESTRUCTURED & EXPANDED
export const CASTLE_CONFIG = {
  width: 0.15,
  height: 0.20,
  position: {
    x: 0.5,
    y: 0.65,
  },
  maxHealth: 100,
  healthPerHit: 10,
  towers: {
    count: 3,
    positions: [
      { x: 0.2, y: 0.3 },
      { x: 0.5, y: 0.2 },
      { x: 0.8, y: 0.3 },
    ],
    width: 40,
    height: 60,
    windowSize: { width: 8, height: 12 },
  },
  gate: {
    width: 30,
    height: 40,
    position: { x: 0.5, y: 0.7 },
    borderWidth: 2,
  },
  flagPole: {
    heightMin: 0.30,
    heightMax: 0.45,
    flagHeight: 0.08,
    flagWidth: 0.10,
    waveSpeed: 0.1,
    width: 8,
  },
};

// Shake Configuration
export const SHAKE_CONFIG = {
  intensity: 5,
  decay: 0.3,
};

// Performance Configuration - EXPANDED
export const PERFORMANCE_CONFIG = {
  maxProjectiles: 50,
  maxExplosions: 20,
  maxDebris: 100,
  maxStars: 150,
  enableSpatialCulling: true,
  cullMargin: 100,
};

// Debris Configuration - EXPANDED
export const DEBRIS_CONFIG = {
  count: 5,
  countPerExplosion: 8,
  minSpeed: 0.5,
  maxSpeed: 2.0,
  gravity: 0.1,
  minLife: 1000,
  maxLife: 2000,
  minSize: 2,
  maxSize: 6,
  rotationSpeedMin: 0.02,
  rotationSpeedMax: 0.08,
  lifeDecay: 1,
};

// Explosion Configuration
export const EXPLOSION_CONFIG = {
  duration: 500,
  maxScale: 3.0,
  particleCount: 8,
  opacityStart: 1.0,
  scaleSpeed: 0.05,
  rotationSpeed: 0.1,
  opacityDecay: 0.02,
  lifeDecay: 1,
};

// Title Configuration - EXPANDED
export const TITLE_CONFIG = {
  text: 'VulHub Leaderboard',
  subtitle: 'Capture The Flag & Security Learning Platform',
  fontSize: { main: 60, subtitle: 36 },
  fadeInDuration: 600,
  position: { x: 0.5, y: 0.3 },
};

