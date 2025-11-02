/**
 * Animation Configuration
 * 
 * Constants and configuration for the Castle Siege Animation
 */

// Colors
export const COLORS = {
  bgBlack: '#000000',
  matrix: '#00ff00',
  starWhite: '#ffffff',
  flagGreen: '#00ff00',
  titleWhite: '#ffffff',
};

// Animation Timings
export const ANIMATION_TIMINGS = {
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

// Star Configuration
export const STAR_CONFIG = {
  count: 100,
  minSize: 1,
  maxSize: 2,
  twinkleSpeed: 0.02,
};

// Projectile Configuration
export const PROJECTILE_CONFIG = {
  speed: 0.015,
  size: 4,
  trail: true,
  trailLength: 10,
  spawnInterval: {
    normal: 400,
    intense: 200,
  },
};

// Castle Configuration
export const CASTLE_CONFIG = {
  width: 0.15,
  height: 0.20,
  position: {
    x: 0.5,
    y: 0.65,
  },
  towers: 3,
  flagPole: {
    heightMin: 0.30,
    heightMax: 0.45,
    flagHeight: 0.08,
    flagWidth: 0.10,
    waveSpeed: 0.1,
  },
};

// Shake Configuration
export const SHAKE_CONFIG = {
  intensity: 5,
  decay: 0.3,
};

// Performance Configuration
export const PERFORMANCE_CONFIG = {
  maxProjectiles: 50,
  maxExplosions: 20,
  maxDebris: 100,
  maxStars: 150,
};

// Debris Configuration
export const DEBRIS_CONFIG = {
  count: 5,
  minSpeed: 0.5,
  maxSpeed: 2.0,
  gravity: 0.1,
  minLife: 1000,
  maxLife: 2000,
};

// Explosion Configuration
export const EXPLOSION_CONFIG = {
  duration: 500,
  maxScale: 3.0,
  particleCount: 8,
};

// Title Configuration
export const TITLE_CONFIG = {
  text: 'VulHub Leaderboard',
  fontSize: 48,
  fadeInDuration: 600,
};

