/**
 * Canvas Animation Types
 * 
 * Type definitions for the Canvas-based castle siege animation system
 */

export interface Vector2 {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Vector2;
  isAlive: boolean;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

export interface Star extends Entity {
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
}

export interface Projectile extends Entity {
  target: Vector2;
  start: Vector2;
  progress: number; // 0-1
  color: string;
  rotation: number;
  speed: number;
  trail: boolean;
}

export interface ProjectileConfig {
  color: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  trail?: boolean;
}

export interface Explosion extends Entity {
  scale: number;
  maxScale: number;
  color: string;
  rotation: number;
  opacity: number;
  life: number; // 0-1
}

export interface Debris extends Entity {
  velocity: Vector2;
  color: string;
  size: number;
  life: number; // 0-1
  rotation: number;
  rotationSpeed: number;
}

export interface Castle {
  position: Vector2;
  health: number;
  maxHealth: number;
  towers: Tower[];
  gate: Gate;
  flagPole: FlagPole;
}

export interface Tower {
  position: Vector2;
  width: number;
  height: number;
  hasWindow: boolean;
}

export interface Gate {
  position: Vector2;
  width: number;
  height: number;
  isOpen: boolean;
}

export interface FlagPole {
  position: Vector2;
  height: number;
  flagHeight: number; // 0-100 (percentage)
  flagWave: number; // 0-360 (degrees)
}

export interface Army {
  color: string;
  position: 'left' | 'right' | 'bottom';
  units: number;
  projectileInterval: number;
}

export type AnimationPhase = 'intro' | 'castle' | 'battle' | 'victory' | 'complete';

export interface PhaseTiming {
  start: number; // milliseconds
  end: number; // milliseconds
  duration: number; // milliseconds
}

export interface AnimationState {
  phase: AnimationPhase;
  elapsedTime: number; // milliseconds
  totalDuration: number; // milliseconds
  isPlaying: boolean;
  isComplete: boolean;
}

