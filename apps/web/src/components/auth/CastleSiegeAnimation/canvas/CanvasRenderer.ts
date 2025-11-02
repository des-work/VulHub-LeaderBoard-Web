/**
 * Canvas Renderer
 * 
 * Core canvas rendering system with resize handling and rendering pipeline
 */

import { Entity, Castle, Vector2 } from '../types';
import { drawSky, drawTower, drawGate, drawFlagPole, drawHealthBar, drawTitle } from './Effects';
import { CASTLE_CONFIG, PERFORMANCE_CONFIG } from '../config';

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number = 0;
  private height: number = 0;
  private pixelRatio: number = 1;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = context;
    this.pixelRatio = window.devicePixelRatio || 1;
    this.handleResize();
    this.setupEventListeners();
  }

  /**
   * Setup window resize listener
   */
  private setupEventListeners(): void {
    window.addEventListener('resize', () => this.handleResize());
  }

  /**
   * Handle canvas resize
   */
  handleResize(): void {
    const container = this.canvas.parentElement;
    if (!container) {return;}

    const rect = container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;

    // Set canvas size with pixel ratio for crisp rendering
    this.canvas.width = this.width * this.pixelRatio;
    this.canvas.height = this.height * this.pixelRatio;
    
    // Scale context to handle pixel ratio
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
    
    // Set canvas display size
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Draw sky background
   */
  drawBackground(): void {
    drawSky(this.ctx, this.width, this.height);
  }

  /**
   * Draw all stars
   */
  drawStars(stars: Entity[]): void {
    stars.forEach(star => {
      if (this.isVisible(star.position)) {
        star.render(this.ctx);
      }
    });
  }

  /**
   * Draw all projectiles with trails
   */
  drawProjectiles(projectiles: Entity[]): void {
    projectiles.forEach(proj => {
      if (this.isVisible(proj.position)) {
        proj.render(this.ctx);
      }
    });
  }

  /**
   * Draw all explosions
   */
  drawExplosions(explosions: Entity[]): void {
    explosions.forEach(exp => {
      if (this.isVisible(exp.position)) {
        exp.render(this.ctx);
      }
    });
  }

  /**
   * Draw all debris particles
   */
  drawDebris(debris: Entity[]): void {
    debris.forEach(d => {
      if (this.isVisible(d.position)) {
        d.render(this.ctx);
      }
    });
  }

  /**
   * Draw castle structure
   */
  drawCastle(castle: Castle): void {
    const castleX = castle.position.x * this.width;
    const castleY = castle.position.y * this.height;
    const castleW = CASTLE_CONFIG.width * this.width;
    const castleH = CASTLE_CONFIG.height * this.height;

    // Castle base
    this.ctx.save();
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(castleX - castleW / 2, castleY, castleW, castleH);
    
    // Castle towers
    castle.towers.forEach(tower => {
      const towerPos: Vector2 = {
        x: (castle.position.x + tower.position.x) * this.width,
        y: (castle.position.y + tower.position.y) * this.height,
      };
      drawTower(this.ctx, { ...tower, position: towerPos }, this.width, this.height);
    });
    
    // Gate
    const gatePos: Vector2 = {
      x: castle.position.x * this.width,
      y: (castle.position.y + castleH - CASTLE_CONFIG.gate.height) * this.height,
    };
    drawGate(this.ctx, { ...castle.gate, position: gatePos }, this.width, this.height);
    
    // Flag pole
    const flagPolePos: Vector2 = {
      x: castle.position.x * this.width,
      y: (castle.position.y - CASTLE_CONFIG.flagPole.heightMax) * this.height,
    };
    drawFlagPole(this.ctx, { ...castle.flagPole, position: flagPolePos }, this.width, this.height);
    
    // Health bar (if visible)
    if (castle.health < castle.maxHealth) {
      const healthBarWidth = 150;
      const healthBarHeight = 20;
      const healthBarX = castleX - healthBarWidth / 2;
      const healthBarY = castleY - 30;
      drawHealthBar(
        this.ctx,
        castle.health,
        castle.maxHealth,
        healthBarX,
        healthBarY,
        healthBarWidth,
        healthBarHeight
      );
    }
    
    this.ctx.restore();
  }

  /**
   * Draw title with fade-in
   */
  drawTitle(opacity: number = 1): void {
    if (opacity > 0) {
      drawTitle(this.ctx, this.width, this.height, opacity);
    }
  }

  /**
   * Check if entity is visible (for culling)
   */
  private isVisible(position: Vector2): boolean {
    if (!PERFORMANCE_CONFIG.enableSpatialCulling) {return true;}
    
    const margin = PERFORMANCE_CONFIG.cullMargin;
    return (
      position.x >= -margin &&
      position.x <= this.width + margin &&
      position.y >= -margin &&
      position.y <= this.height + margin
    );
  }

  /**
   * Apply screen shake transform
   */
  applyScreenShake(intensity: number): void {
    if (intensity <= 0) {return;}
    
    const offsetX = (Math.random() - 0.5) * intensity;
    const offsetY = (Math.random() - 0.5) * intensity;
    this.ctx.translate(offsetX, offsetY);
  }

  /**
   * Get canvas dimensions
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.width, height: this.height };
  }

  /**
   * Cleanup event listeners
   */
  destroy(): void {
    window.removeEventListener('resize', () => this.handleResize());
  }
}

