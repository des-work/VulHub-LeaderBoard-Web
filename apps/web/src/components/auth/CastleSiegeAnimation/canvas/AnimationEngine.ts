/**
 * Animation Engine
 * 
 * Core animation loop and state management for the canvas animation.
 * Handles entity updates, rendering, and performance optimization.
 *
 * @example
 * ```typescript
 * const canvas = document.createElement('canvas');
 * const engine = new AnimationEngine(canvas, () => {
 *   console.log('Animation complete!');
 * });
 *
 * engine.start();
 * ```
 *
 * @class AnimationEngine
 */

import { Entity, AnimationPhase, AnimationState, Castle, Vector2, ProjectileConfig } from '../types';
import { StarEntity, ProjectileEntity, ExplosionEntity, DebrisEntity } from './Entities';
import { CanvasRenderer } from './CanvasRenderer';
import {
  ANIMATION_TIMINGS,
  TOTAL_DURATION,
  ARMIES,
  STAR_CONFIG,
  PROJECTILE_CONFIG,
  CASTLE_CONFIG,
  SHAKE_CONFIG,
  PERFORMANCE_CONFIG,
  DEBRIS_CONFIG,
  EXPLOSION_CONFIG,
} from '../config';
import { COLORS } from '../config';
import { frameRateManager, performanceMonitor, getMemoryUsage } from '../utils/performance';

export class AnimationEngine {
  private renderer: CanvasRenderer;
  private state: AnimationState;
  private entities: Map<string, Entity> = new Map();
  private stars: Entity[] = [];
  private projectiles: Entity[] = [];
  private explosions: Entity[] = [];
  private debris: Entity[] = [];
  
  private castle: Castle;
  private screenShake: number = 0;
  private titleOpacity: number = 0;
  
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;
  private isRunning: boolean = false;
  
  private onCompleteCallback?: () => void;
  private projectileSpawnTimers: Map<string, number> = new Map();

  constructor(canvas: HTMLCanvasElement, onComplete?: () => void) {
    // Fast initialization - defer heavy work
    this.renderer = new CanvasRenderer(canvas);
    this.onCompleteCallback = onComplete;

    this.state = {
      phase: 'intro',
      elapsedTime: 0,
      totalDuration: TOTAL_DURATION,
      isPlaying: false,
      isComplete: false,
    };

    // Only initialize minimal required components
    this.initializeCastle();
    this.initializeMinimalStars(); // Start with just 20 stars
  }

  /**
   * Initialize castle structure
   */
  private initializeCastle(): void {
    this.castle = {
      position: CASTLE_CONFIG.position,
      health: CASTLE_CONFIG.maxHealth,
      maxHealth: CASTLE_CONFIG.maxHealth,
      towers: CASTLE_CONFIG.towers.positions.map((pos, i) => ({
        position: pos,
        width: CASTLE_CONFIG.towers.width,
        height: CASTLE_CONFIG.towers.height,
        hasWindow: i < 2, // First two towers have windows
      })),
      gate: {
        position: { x: 0, y: 0 },
        width: CASTLE_CONFIG.gate.width,
        height: CASTLE_CONFIG.gate.height,
        isOpen: false,
      },
      flagPole: {
        position: { x: 0, y: 0 },
        height: 0,
        flagHeight: 0,
        flagWave: 0,
      },
    };
  }

  /**
   * Initialize minimal stars for fast loading
   */
  private initializeMinimalStars(): void {
    const { width, height } = this.renderer.getDimensions();

    // Start with just initialCount stars for fast loading
    for (let i = 0; i < STAR_CONFIG.initialCount; i++) {
      const id = `star-${i}`;
      const star = new StarEntity(id, {
        x: Math.random() * width,
        y: Math.random() * height,
      });
      this.stars.push(star);
      this.entities.set(id, star);
    }
  }

  /**
   * Progressively add more stars over time for better visual experience
   */
  private growStarField(deltaTime: number): void {
    if (this.stars.length >= STAR_CONFIG.maxCount) return;

    // Add stars gradually (growthRate stars per second)
    const starsToAdd = Math.floor((STAR_CONFIG.growthRate * deltaTime) / 1000);
    if (starsToAdd <= 0) return;

    const { width, height } = this.renderer.getDimensions();

    for (let i = 0; i < Math.min(starsToAdd, STAR_CONFIG.maxCount - this.stars.length); i++) {
      const id = `star-${this.stars.length}`;
      const star = new StarEntity(id, {
        x: Math.random() * width,
        y: Math.random() * height,
      });
      this.stars.push(star);
      this.entities.set(id, star);
    }
  }

  /**
   * Start the animation
   */
  start(): void {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.state.isPlaying = true;
    this.lastFrameTime = performance.now();
    this.animate();
  }

  /**
   * Stop the animation
   */
  stop(): void {
    this.isRunning = false;
    this.state.isPlaying = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    // Reset frame rate manager
    frameRateManager.reset();
  }

  /**
   * Main animation loop with performance optimization
   */
  private animate = (currentTime: number = performance.now()): void => {
    if (!this.isRunning) return;
    
    // Frame rate management - skip frame if not time to render
    if (!frameRateManager.shouldRender(currentTime)) {
      this.animationFrameId = requestAnimationFrame(this.animate);
      return;
    }

    // Start performance monitoring
    performanceMonitor.mark('frame-start');
    
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;
    
    // Update state
    this.state.elapsedTime += deltaTime;
    
    // Update phase
    this.updatePhase();
    
    // Update entities with performance tracking
    performanceMonitor.mark('update-start');
    this.updateEntities(deltaTime);
    const updateTime = performanceMonitor.measure('update-start') || 0;

    // Progressively grow star field for better visual experience
    this.growStarField(deltaTime);

    // Spawn projectiles during battle
    if (this.state.phase === 'battle') {
      this.spawnProjectiles();
    }
    
    // Update castle (flag raising, health)
    this.updateCastle(deltaTime);
    
    // Update screen shake
    this.updateScreenShake(deltaTime);
    
    // Update title opacity
    this.updateTitleOpacity();
    
    // Render with performance tracking
    performanceMonitor.mark('render-start');
    this.render();
    const renderTime = performanceMonitor.measure('render-start') || 0;
    
    // Record frame metrics
    const entityCount = this.stars.length + this.projectiles.length + 
                       this.explosions.length + this.debris.length;
    performanceMonitor.recordFrame({
      fps: frameRateManager.getFPS(),
      frameTime: deltaTime,
      memoryUsage: getMemoryUsage(),
      entityCount,
      renderTime,
      updateTime
    });

    // Check for performance degradation
    if (performanceMonitor.isDegrading()) {
      // Auto-reduce quality if degrading
      const currentQuality = frameRateManager.getQuality();
      if (currentQuality === 'high') {
        frameRateManager.setQuality('medium');
      } else if (currentQuality === 'medium') {
        frameRateManager.setQuality('low');
      }
    }
    
    // Continue animation loop
    this.animationFrameId = requestAnimationFrame(this.animate);
    
    // Check completion
    if (this.state.elapsedTime >= TOTAL_DURATION && !this.state.isComplete) {
      this.complete();
    }
  };

  /**
   * Update current phase based on elapsed time
   */
  private updatePhase(): void {
    const time = this.state.elapsedTime;
    
    if (time < ANIMATION_TIMINGS.intro.end) {
      this.state.phase = 'intro';
    } else if (time < ANIMATION_TIMINGS.castle.end) {
      this.state.phase = 'castle';
    } else if (time < ANIMATION_TIMINGS.battle.end) {
      this.state.phase = 'battle';
    } else if (time < ANIMATION_TIMINGS.victory.end) {
      this.state.phase = 'victory';
    } else {
      this.state.phase = 'complete';
    }
  }

  /**
   * Update all entities
   */
  private updateEntities(deltaTime: number): void {
    // Update stars
    this.stars.forEach(star => star.update(deltaTime));
    
    // Update projectiles
    this.projectiles.forEach(proj => {
      proj.update(deltaTime);
      if (!proj.isAlive) {
        this.onProjectileComplete(proj as ProjectileEntity);
      }
    });
    this.projectiles = this.projectiles.filter(p => p.isAlive);
    
    // Update explosions
    this.explosions.forEach(exp => exp.update(deltaTime));
    this.explosions = this.explosions.filter(e => e.isAlive);
    
    // Update debris
    this.debris.forEach(d => d.update(deltaTime));
    this.debris = this.debris.filter(d => d.isAlive);
  }

  /**
   * Spawn projectiles during battle phase
   */
  private spawnProjectiles(): void {
    const time = this.state.elapsedTime;
    const isIntense = time >= ANIMATION_TIMINGS.battle.start + 2000; // Step 3 equivalent
    const interval = isIntense 
      ? PROJECTILE_CONFIG.spawnInterval.intense 
      : PROJECTILE_CONFIG.spawnInterval.normal;
    
    ARMIES.forEach((army, index) => {
      const timerKey = `army-${index}`;
      const lastSpawn = this.projectileSpawnTimers.get(timerKey) || 0;
      
      if (time - lastSpawn >= interval) {
        this.createProjectile(army);
        this.projectileSpawnTimers.set(timerKey, time);
      }
    });
  }

  /**
   * Create a projectile from an army
   */
  private createProjectile(army: typeof ARMIES[0]): void {
    if (this.projectiles.length >= PERFORMANCE_CONFIG.maxProjectiles) return;
    
    const { width, height } = this.renderer.getDimensions();
    let startX: number, startY: number, targetX: number, targetY: number;
    
    switch (army.position) {
      case 'left':
        startX = width * 0.10 + Math.random() * width * 0.20;
        startY = height * 0.60 + Math.random() * height * 0.20;
        targetX = width * CASTLE_CONFIG.position.x + Math.random() * width * 0.04;
        targetY = height * CASTLE_CONFIG.position.y + Math.random() * height * 0.20;
        break;
      case 'right':
        startX = width * 0.70 + Math.random() * width * 0.20;
        startY = height * 0.60 + Math.random() * height * 0.20;
        targetX = width * CASTLE_CONFIG.position.x + Math.random() * width * 0.04;
        targetY = height * CASTLE_CONFIG.position.y + Math.random() * height * 0.20;
        break;
      case 'bottom':
        startX = width * 0.40 + Math.random() * width * 0.20;
        startY = height * 0.85 + Math.random() * height * 0.10;
        targetX = width * CASTLE_CONFIG.position.x + Math.random() * width * 0.04;
        targetY = height * CASTLE_CONFIG.position.y + Math.random() * height * 0.20;
        break;
    }
    
    const id = `proj-${Date.now()}-${Math.random()}`;
    const projectile = new ProjectileEntity(id, {
      start: { x: startX, y: startY },
      target: { x: targetX, y: targetY },
      color: army.color,
      trail: Math.random() > PROJECTILE_CONFIG.trailProbability,
    });
    
    this.projectiles.push(projectile);
    this.entities.set(id, projectile);
  }

  /**
   * Handle projectile completion (create explosion and debris)
   */
  private onProjectileComplete(projectile: ProjectileEntity): void {
    if (this.explosions.length >= PERFORMANCE_CONFIG.maxExplosions) return;
    
    // Create explosion
    const expId = `exp-${Date.now()}-${Math.random()}`;
    const explosion = new ExplosionEntity(expId, projectile.position, projectile.color);
    this.explosions.push(explosion);
    this.entities.set(expId, explosion);
    
    // Create debris
    for (let i = 0; i < DEBRIS_CONFIG.countPerExplosion; i++) {
      if (this.debris.length >= PERFORMANCE_CONFIG.maxDebris) break;
      
      const angle = Math.random() * Math.PI * 2;
      const speed = DEBRIS_CONFIG.minSpeed + Math.random() * (DEBRIS_CONFIG.maxSpeed - DEBRIS_CONFIG.minSpeed);
      const debrisId = `debris-${Date.now()}-${i}`;
      const debris = new DebrisEntity(debrisId, projectile.position, projectile.color, angle, speed);
      this.debris.push(debris);
      this.entities.set(debrisId, debris);
    }
    
    // Reduce castle health
    this.castle.health = Math.max(0, this.castle.health - CASTLE_CONFIG.healthPerHit);
    this.screenShake = SHAKE_CONFIG.intensity;
  }

  /**
   * Update castle state (flag raising, etc.)
   */
  private updateCastle(deltaTime: number): void {
    // Flag raising (victory phase)
    if (this.state.phase === 'victory') {
      if (this.castle.flagPole.flagHeight < 100) {
        this.castle.flagPole.flagHeight = Math.min(100, this.castle.flagPole.flagHeight + 2 * (deltaTime / 16.67));
      }
      
      // Flag wave animation
      if (this.castle.flagPole.flagHeight >= 100) {
        this.castle.flagPole.flagWave += CASTLE_CONFIG.flagPole.waveSpeed * (deltaTime / 16.67);
        this.castle.flagPole.flagWave = this.castle.flagPole.flagWave % 360;
      }
    }
  }

  /**
   * Update screen shake
   */
  private updateScreenShake(deltaTime: number): void {
    if (this.screenShake > 0) {
      this.screenShake -= SHAKE_CONFIG.decay * (deltaTime / 16.67);
      this.screenShake = Math.max(0, this.screenShake);
    }
  }

  /**
   * Update title opacity (fade in during victory phase)
   */
  private updateTitleOpacity(): void {
    if (this.state.phase === 'victory') {
      const victoryProgress = (this.state.elapsedTime - ANIMATION_TIMINGS.victory.start) / ANIMATION_TIMINGS.victory.duration;
      this.titleOpacity = Math.min(1, victoryProgress);
    }
  }

  /**
   * Render entire scene
   */
  private render(): void {
    this.renderer.clear();
    this.renderer.drawBackground();
    this.renderer.drawStars(this.stars);
    
    // Apply screen shake
    if (this.screenShake > 0) {
      this.renderer.applyScreenShake(this.screenShake);
    }
    
    // Draw castle
    this.renderer.drawCastle(this.castle);
    
    // Draw projectiles
    this.renderer.drawProjectiles(this.projectiles);
    
    // Draw explosions
    this.renderer.drawExplosions(this.explosions);
    
    // Draw debris
    this.renderer.drawDebris(this.debris);
    
    // Draw title
    if (this.state.phase === 'victory' || this.state.phase === 'complete') {
      this.renderer.drawTitle(this.titleOpacity);
    }
    
    // Reset transform (screen shake)
    if (this.screenShake > 0) {
      this.renderer.applyScreenShake(-this.screenShake);
    }
  }

  /**
   * Complete animation
   */
  private complete(): void {
    this.state.isComplete = true;
    this.stop();
    if (this.onCompleteCallback) {
      this.onCompleteCallback();
    }
  }

  /**
   * Skip to end
   */
  skip(): void {
    this.state.elapsedTime = TOTAL_DURATION;
    this.complete();
  }

  /**
   * Get current state
   */
  getState(): AnimationState {
    return { ...this.state };
  }

  /**
   * Check if animation is complete
   */
  isComplete(): boolean {
    return this.state.isComplete;
  }

  /**
   * Reduce animation quality for better performance
   */
  reduceQuality(): void {
    const currentQuality = frameRateManager.getQuality();
    if (currentQuality === 'high') {
      frameRateManager.setQuality('medium');
    } else if (currentQuality === 'medium') {
      frameRateManager.setQuality('low');
    }
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    return {
      fps: frameRateManager.getFPS(),
      quality: frameRateManager.getQuality(),
      frameMetrics: frameRateManager.getMetrics(),
      averageMetrics: performanceMonitor.getAverageMetrics(),
      currentMetrics: performanceMonitor.getCurrentMetrics(),
      isDegrading: performanceMonitor.isDegrading()
    };
  }

  /**
   * Set quality level explicitly
   */
  setQuality(level: 'high' | 'medium' | 'low'): void {
    frameRateManager.setQuality(level);
  }

  /**
   * Get current quality level
   */
  getQuality(): 'high' | 'medium' | 'low' {
    return frameRateManager.getQuality();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.stop();
    this.renderer.destroy();
    this.entities.clear();
    this.projectileSpawnTimers.clear();
    // Clear performance monitoring
    performanceMonitor.clear();
    frameRateManager.reset();
  }
}

