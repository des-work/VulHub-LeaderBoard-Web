/**
 * Object Pooling System
 * 
 * Reduces garbage collection pressure by reusing objects
 */

// ============================================================================
// Generic Object Pool
// ============================================================================

export interface PoolConfig<T> {
  factory: () => T;
  reset: (obj: T) => void;
  initialSize?: number;
  maxSize?: number;
}

export class ObjectPool<T> {
  private pool: T[] = [];
  private factory: () => T;
  private reset: (obj: T) => void;
  private maxSize: number;
  private created: number = 0;
  private reused: number = 0;
  private totalRequests: number = 0;

  constructor(config: PoolConfig<T>) {
    this.factory = config.factory;
    this.reset = config.reset;
    this.maxSize = config.maxSize || 50;
    this.initialize(config.initialSize || 10);
  }

  /**
   * Initialize pool with initial objects
   */
  private initialize(size: number): void {
    for (let i = 0; i < size && i < this.maxSize; i++) {
      this.pool.push(this.factory());
      this.created++;
    }
  }

  /**
   * Get an object from the pool
   */
  get(): T {
    this.totalRequests++;
    const obj = this.pool.pop();

    if (obj) {
      this.reused++;
      this.reset(obj);
      return obj;
    }

    // Pool empty, create new object
    this.created++;
    return this.factory();
  }

  /**
   * Return an object to the pool
   */
  release(obj: T): void {
    if (this.pool.length < this.maxSize) {
      this.reset(obj);
      this.pool.push(obj);
    }
    // If pool is full, let object be garbage collected
  }

  /**
   * Clear the pool
   */
  clear(): void {
    this.pool = [];
    this.created = 0;
    this.reused = 0;
    this.totalRequests = 0;
  }

  /**
   * Get pool statistics
   */
  getStats() {
    return {
      poolSize: this.pool.length,
      created: this.created,
      reused: this.reused,
      totalRequests: this.totalRequests,
      reuseRate: this.totalRequests > 0 ? (this.reused / this.totalRequests) * 100 : 0,
      maxSize: this.maxSize
    };
  }

  /**
   * Get pool size
   */
  size(): number {
    return this.pool.length;
  }
}

// ============================================================================
// Vector2 Pool
// ============================================================================

export interface Vector2 {
  x: number;
  y: number;
}

export class Vector2Pool extends ObjectPool<Vector2> {
  constructor(initialSize: number = 20, maxSize: number = 100) {
    super({
      factory: () => ({ x: 0, y: 0 }),
      reset: (vec) => {
        vec.x = 0;
        vec.y = 0;
      },
      initialSize,
      maxSize
    });
  }

  /**
   * Get a vector with values
   */
  getWithValues(x: number, y: number): Vector2 {
    const vec = this.get();
    vec.x = x;
    vec.y = y;
    return vec;
  }
}

// ============================================================================
// Entity Pool Manager
// ============================================================================

export interface Entity {
  id?: string;
  active?: boolean;
  position?: Vector2;
  velocity?: Vector2;
  life?: number;
  maxLife?: number;
}

export class EntityPoolManager {
  private vectorPool: Vector2Pool;
  private entityPools: Map<string, ObjectPool<any>> = new Map();

  constructor() {
    this.vectorPool = new Vector2Pool(50, 200);
  }

  /**
   * Register a pool for an entity type
   */
  registerPool<T extends Entity>(
    type: string,
    factory: () => T,
    reset: (obj: T) => T,
    initialSize: number = 10,
    maxSize: number = 50
  ): void {
    this.entityPools.set(type, new ObjectPool<T>({
      factory,
      reset,
      initialSize,
      maxSize
    }));
  }

  /**
   * Get an entity from pool
   */
  getEntity<T extends Entity>(type: string): T | null {
    const pool = this.entityPools.get(type);
    if (!pool) {
      console.warn(`No pool registered for entity type: ${type}`);
      return null;
    }
    return pool.get() as T;
  }

  /**
   * Release an entity to pool
   */
  releaseEntity<T extends Entity>(type: string, entity: T): void {
    const pool = this.entityPools.get(type);
    if (pool) {
      pool.release(entity);
    }
  }

  /**
   * Get a vector from pool
   */
  getVector(x: number = 0, y: number = 0): Vector2 {
    const vec = this.vectorPool.get();
    vec.x = x;
    vec.y = y;
    return vec;
  }

  /**
   * Release a vector to pool
   */
  releaseVector(vec: Vector2): void {
    this.vectorPool.release(vec);
  }

  /**
   * Get statistics for all pools
   */
  getStats() {
    const stats: Record<string, any> = {
      vectors: this.vectorPool.getStats()
    };

    this.entityPools.forEach((pool, type) => {
      stats[type] = pool.getStats();
    });

    return stats;
  }

  /**
   * Clear all pools
   */
  clear(): void {
    this.vectorPool.clear();
    this.entityPools.forEach((pool) => pool.clear());
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

export const entityPoolManager = new EntityPoolManager();

