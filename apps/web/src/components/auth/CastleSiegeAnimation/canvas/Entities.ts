/**
 * Entity Classes
 * 
 * Base classes and implementations for all animated entities (stars, projectiles, explosions, debris)
 */

import { Entity, Star, Projectile, Explosion, Debris, Vector2 } from '../types';
import {
  STAR_CONFIG,
  PROJECTILE_CONFIG,
  EXPLOSION_CONFIG,
  DEBRIS_CONFIG,
  COLORS,
} from '../config';

// ============================================================================
// BASE ENTITY CLASS
// ============================================================================

export abstract class BaseEntity implements Entity {
  id: string;
  position: Vector2;
  isAlive: boolean = true;

  constructor(id: string, position: Vector2) {
    this.id = id;
    this.position = position;
  }

  abstract update(deltaTime: number): void;
  abstract render(ctx: CanvasRenderingContext2D): void;
}

// ============================================================================
// STAR ENTITY
// ============================================================================

export class StarEntity extends BaseEntity implements Star {
  size: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
  brightness: number;
  color: string;

  constructor(id: string, position: Vector2) {
    super(id, position);
    this.size = STAR_CONFIG.minSize + Math.random() * (STAR_CONFIG.maxSize - STAR_CONFIG.minSize);
    this.brightness = STAR_CONFIG.minBrightness + Math.random() * (STAR_CONFIG.maxBrightness - STAR_CONFIG.minBrightness);
    this.twinkleSpeed = STAR_CONFIG.twinkleSpeedMin + Math.random() * (STAR_CONFIG.twinkleSpeedMax - STAR_CONFIG.twinkleSpeedMin);
    this.twinklePhase = Math.random() * Math.PI * 2;
    this.opacity = this.brightness;
    this.color = STAR_CONFIG.colors[Math.floor(Math.random() * STAR_CONFIG.colors.length)];
  }

  update(deltaTime: number): void {
    // Twinkle animation (sine wave)
    this.twinklePhase += this.twinkleSpeed * (deltaTime / 16.67); // Normalize to 60fps
    this.opacity = this.brightness * (0.5 + 0.5 * Math.sin(this.twinklePhase));
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.opacity <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    
    // Draw star with glow
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Outer glow
    const gradient = ctx.createRadialGradient(
      this.position.x, this.position.y, 0,
      this.position.x, this.position.y, this.size * 3
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(0.5, `${this.color}80`);
    gradient.addColorStop(1, `${this.color}00`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size * 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

// ============================================================================
// PROJECTILE ENTITY
// ============================================================================

export class ProjectileEntity extends BaseEntity implements Projectile {
  target: Vector2;
  start: Vector2;
  progress: number = 0;
  color: string;
  rotation: number = 0;
  speed: number;
  trail: boolean;

  constructor(id: string, config: { start: Vector2; target: Vector2; color: string; trail?: boolean }) {
    super(id, config.start);
    this.start = { ...config.start };
    this.target = { ...config.target };
    this.color = config.color;
    this.trail = config.trail ?? Math.random() > PROJECTILE_CONFIG.trailProbability;
    this.speed = PROJECTILE_CONFIG.speed;
    this.rotation = Math.random() * 360;
  }

  update(deltaTime: number): void {
    if (this.progress >= 1) {
      this.isAlive = false;
      return;
    }

    this.progress += this.speed;
    this.progress = Math.min(1, this.progress);
    
    // Update position (linear interpolation)
    this.position.x = this.start.x + (this.target.x - this.start.x) * this.progress;
    this.position.y = this.start.y + (this.target.y - this.start.y) * this.progress;
    
    // Rotate
    this.rotation += PROJECTILE_CONFIG.rotationSpeed * (deltaTime / 16.67);
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Draw trail if enabled
    if (this.trail && this.progress > 0.1) {
      const trailLength = 20;
      const trailOpacity = 0.6 * (1 - this.progress);
      
      const gradient = ctx.createLinearGradient(
        this.position.x, this.position.y,
        this.start.x, this.start.y
      );
      gradient.addColorStop(0, `${this.color}${Math.floor(trailOpacity * 255).toString(16).padStart(2, '0')}`);
      gradient.addColorStop(1, `${this.color}00`);
      
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.start.x, this.start.y);
      ctx.lineTo(this.position.x, this.position.y);
      ctx.stroke();
    }
    
    // Draw projectile (rotated arrow/line)
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    
    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 2;
    
    // Arrow shape
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(-2, 0);
    ctx.lineTo(0, 4);
    ctx.lineTo(2, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;
    ctx.fill();
    
    ctx.restore();
  }
}

// ============================================================================
// EXPLOSION ENTITY
// ============================================================================

export class ExplosionEntity extends BaseEntity implements Explosion {
  scale: number = 0;
  maxScale: number;
  color: string;
  rotation: number;
  opacity: number;
  life: number = 1;

  constructor(id: string, position: Vector2, color: string) {
    super(id, position);
    this.maxScale = EXPLOSION_CONFIG.maxScale;
    this.color = color;
    this.rotation = Math.random() * 360;
    this.opacity = EXPLOSION_CONFIG.opacityStart;
  }

  update(deltaTime: number): void {
    if (this.life <= 0) {
      this.isAlive = false;
      return;
    }

    this.scale += EXPLOSION_CONFIG.scaleSpeed * (deltaTime / 16.67);
    this.scale = Math.min(this.maxScale, this.scale);
    
    this.rotation += EXPLOSION_CONFIG.rotationSpeed * (deltaTime / 16.67);
    this.opacity -= EXPLOSION_CONFIG.opacityDecay * (deltaTime / 16.67);
    this.opacity = Math.max(0, this.opacity);
    this.life -= EXPLOSION_CONFIG.lifeDecay * (deltaTime / 16.67);
    this.life = Math.max(0, this.life);
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.opacity <= 0 || this.scale <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    
    // Multiple explosion rings
    const rings = 4;
    for (let i = 0; i < rings; i++) {
      const ringScale = this.scale * (1 - i * 0.2);
      const ringOpacity = this.opacity * (1 - i * 0.15);
      
      ctx.globalAlpha = ringOpacity;
      
      // Outer ring
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, ringScale);
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(0.5, `${this.color}80`);
      gradient.addColorStop(1, `${this.color}00`);
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, ringScale, 0, Math.PI * 2);
      ctx.fill();
      
      // Bright core
      if (i === 0) {
        ctx.fillStyle = COLORS.starWhite;
        ctx.beginPath();
        ctx.arc(0, 0, ringScale * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.restore();
  }
}

// ============================================================================
// DEBRIS ENTITY
// ============================================================================

export class DebrisEntity extends BaseEntity implements Debris {
  velocity: Vector2;
  color: string;
  size: number;
  life: number = 1;
  rotation: number = 0;
  rotationSpeed: number;

  constructor(id: string, position: Vector2, color: string, angle: number, speed: number) {
    super(id, position);
    this.velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed,
    };
    this.color = color;
    this.size = DEBRIS_CONFIG.minSize + Math.random() * (DEBRIS_CONFIG.maxSize - DEBRIS_CONFIG.minSize);
    this.rotation = Math.random() * 360;
    this.rotationSpeed = DEBRIS_CONFIG.rotationSpeedMin + Math.random() * (DEBRIS_CONFIG.rotationSpeedMax - DEBRIS_CONFIG.rotationSpeedMin);
  }

  update(deltaTime: number): void {
    if (this.life <= 0) {
      this.isAlive = false;
      return;
    }

    // Update position
    this.position.x += this.velocity.x * (deltaTime / 16.67);
    this.position.y += this.velocity.y * (deltaTime / 16.67);
    
    // Apply gravity
    this.velocity.y += DEBRIS_CONFIG.gravity * (deltaTime / 16.67);
    
    // Rotate
    this.rotation += this.rotationSpeed * (deltaTime / 16.67);
    
    // Decay life
    this.life -= DEBRIS_CONFIG.lifeDecay * (deltaTime / 16.67);
    this.life = Math.max(0, this.life);
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (this.life <= 0) return;

    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    
    // Draw debris particle (small rectangle)
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    
    ctx.restore();
  }
}

