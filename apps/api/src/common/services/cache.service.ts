import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../adapters/redis/redis.service';

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
  prefix?: string; // Key prefix
  serialize?: boolean; // Whether to JSON serialize/deserialize
}

@Injectable()
export class CacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly defaultTTL = 3600; // 1 hour

  constructor(private redisService: RedisService) {}

  /**
   * Get value from cache
   */
  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    try {
      const fullKey = this.buildKey(key, options.prefix);
      const value = await this.redisService.get(fullKey);
      
      if (!value) {
        return null;
      }

      if (options.serialize !== false) {
        return JSON.parse(value);
      }

      return value as T;
    } catch (error) {
      this.logger.error(`Cache get error for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Set value in cache
   */
  async set<T>(
    key: string, 
    value: T, 
    options: CacheOptions = {}
  ): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix);
      const ttl = options.ttl || this.defaultTTL;
      
      let serializedValue: string;
      if (options.serialize !== false) {
        serializedValue = JSON.stringify(value);
      } else {
        serializedValue = value as string;
      }

      await this.redisService.setex(fullKey, ttl, serializedValue);
      return true;
    } catch (error) {
      this.logger.error(`Cache set error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete value from cache
   */
  async del(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix);
      await this.redisService.del(fullKey);
      return true;
    } catch (error) {
      this.logger.error(`Cache delete error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Delete multiple keys with pattern
   */
  async delPattern(pattern: string, options: CacheOptions = {}): Promise<number> {
    try {
      const fullPattern = this.buildKey(pattern, options.prefix);
      const keys = await this.redisService.keys(fullPattern);
      
      if (keys.length === 0) {
        return 0;
      }

      await this.redisService.delMultiple(...keys);
      return keys.length;
    } catch (error) {
      this.logger.error(`Cache delete pattern error for ${pattern}:`, error);
      return 0;
    }
  }

  /**
   * Check if key exists in cache
   */
  async exists(key: string, options: CacheOptions = {}): Promise<boolean> {
    try {
      const fullKey = this.buildKey(key, options.prefix);
      const result = await this.redisService.exists(fullKey);
      return result;
    } catch (error) {
      this.logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  /**
   * Get or set pattern (cache-aside)
   */
  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    try {
      // Try to get from cache first
      const cached = await this.get<T>(key, options);
      if (cached !== null) {
        return cached;
      }

      // If not in cache, execute factory function
      const value = await factory();
      
      // Store in cache
      await this.set(key, value, options);
      
      return value;
    } catch (error) {
      this.logger.error(`Cache getOrSet error for key ${key}:`, error);
      // Fallback to factory function if cache fails
      return await factory();
    }
  }

  /**
   * Invalidate cache by pattern
   */
  async invalidatePattern(pattern: string, options: CacheOptions = {}): Promise<void> {
    try {
      const fullPattern = this.buildKey(pattern, options.prefix);
      const keys = await this.redisService.keys(fullPattern);
      
      if (keys.length > 0) {
        await this.redisService.delMultiple(...keys);
        this.logger.log(`Invalidated ${keys.length} cache keys matching pattern: ${pattern}`);
      }
    } catch (error) {
      this.logger.error(`Cache invalidation error for pattern ${pattern}:`, error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    totalKeys: number;
    memoryUsage: string;
    hitRate?: number;
  }> {
    try {
      const info = await this.redisService.info('memory');
      const keyspace = await this.redisService.info('keyspace');
      
      // Parse Redis info
      const memoryMatch = info.match(/used_memory_human:([^\r\n]+)/);
      const keyspaceMatch = keyspace.match(/keys=(\d+)/);
      
      return {
        totalKeys: keyspaceMatch ? parseInt(keyspaceMatch[1]) : 0,
        memoryUsage: memoryMatch ? memoryMatch[1] : 'Unknown',
      };
    } catch (error) {
      this.logger.error('Cache stats error:', error);
      return {
        totalKeys: 0,
        memoryUsage: 'Unknown',
      };
    }
  }

  /**
   * Build cache key with prefix
   */
  private buildKey(key: string, prefix?: string): string {
    if (prefix) {
      return `${prefix}:${key}`;
    }
    return key;
  }

  /**
   * Cache key generators for common patterns
   */
  static generateKeys = {
    user: (userId: string, tenantId: string) => `user:${tenantId}:${userId}`,
    userStats: (userId: string, tenantId: string) => `user:stats:${tenantId}:${userId}`,
    leaderboard: (tenantId: string, type: string = 'overall') => `leaderboard:${tenantId}:${type}`,
    leaderboardStats: (tenantId: string) => `leaderboard:stats:${tenantId}`,
    project: (projectId: string, tenantId: string) => `project:${tenantId}:${projectId}`,
    projectStats: (projectId: string, tenantId: string) => `project:stats:${tenantId}:${projectId}`,
    badge: (badgeId: string, tenantId: string) => `badge:${tenantId}:${badgeId}`,
    userBadges: (userId: string, tenantId: string) => `user:badges:${tenantId}:${userId}`,
    submission: (submissionId: string, tenantId: string) => `submission:${tenantId}:${submissionId}`,
    userSubmissions: (userId: string, tenantId: string) => `user:submissions:${tenantId}:${userId}`,
  };
}
