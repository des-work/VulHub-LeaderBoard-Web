import { Injectable, Logger } from '@nestjs/common';
import { LeaderboardsRepository } from '../infrastructure/leaderboards.repository';
import { RedisService } from '../../../adapters/redis/redis.service';
import { WebSocketGateway } from '../../../ws/websocket.gateway';

export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  totalScore: number;
  totalSubmissions: number;
  approvedSubmissions: number;
  averageScore: number;
  rank: number;
  badges: number;
  lastSubmissionAt?: Date;
}

export interface LeaderboardStats {
  totalUsers: number;
  totalSubmissions: number;
  averageScore: number;
  topScore: number;
  lastUpdated: Date;
}

@Injectable()
export class LeaderboardsService {
  private readonly logger = new Logger(LeaderboardsService.name);

  constructor(
    private leaderboardsRepository: LeaderboardsRepository,
    private redisService: RedisService,
    private webSocketGateway: WebSocketGateway,
  ) {}

  /**
   * Get overall leaderboard
   */
  async getOverallLeaderboard(
    tenantId: string,
    page: number = 1,
    limit: number = 50,
    timeRange?: 'week' | 'month' | 'all',
  ) {
    try {
      this.logger.log(`Getting overall leaderboard for tenant ${tenantId}`);

      // Try to get from cache first
      const cacheKey = `leaderboard:overall:${tenantId}:${timeRange || 'all'}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        return this.paginateResults(data, page, limit);
      }

      // Calculate leaderboard from database
      const leaderboard = await this.leaderboardsRepository.calculateOverallLeaderboard(
        tenantId,
        timeRange,
      );

      // Cache for 5 minutes
      await this.redisService.set(cacheKey, JSON.stringify(leaderboard), 300);

      return this.paginateResults(leaderboard, page, limit);
    } catch (error) {
      this.logger.error('Failed to get overall leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get project-specific leaderboard
   */
  async getProjectLeaderboard(
    projectId: string,
    tenantId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    try {
      this.logger.log(`Getting project leaderboard for project ${projectId}`);

      const cacheKey = `leaderboard:project:${projectId}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        return this.paginateResults(data, page, limit);
      }

      const leaderboard = await this.leaderboardsRepository.calculateProjectLeaderboard(
        projectId,
        tenantId,
      );

      // Cache for 2 minutes (project leaderboards change more frequently)
      await this.redisService.set(cacheKey, JSON.stringify(leaderboard), 120);

      return this.paginateResults(leaderboard, page, limit);
    } catch (error) {
      this.logger.error(`Failed to get project leaderboard for ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get category leaderboard
   */
  async getCategoryLeaderboard(
    category: string,
    tenantId: string,
    page: number = 1,
    limit: number = 50,
  ) {
    try {
      this.logger.log(`Getting category leaderboard for category ${category}`);

      const cacheKey = `leaderboard:category:${category}:${tenantId}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        const data = JSON.parse(cached);
        return this.paginateResults(data, page, limit);
      }

      const leaderboard = await this.leaderboardsRepository.calculateCategoryLeaderboard(
        category,
        tenantId,
      );

      await this.redisService.set(cacheKey, JSON.stringify(leaderboard), 300);

      return this.paginateResults(leaderboard, page, limit);
    } catch (error) {
      this.logger.error(`Failed to get category leaderboard for ${category}:`, error);
      throw error;
    }
  }

  /**
   * Get user's rank and statistics
   */
  async getUserRank(userId: string, tenantId: string) {
    try {
      const cacheKey = `user:rank:${userId}:${tenantId}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const userRank = await this.leaderboardsRepository.getUserRank(userId, tenantId);
      
      // Cache for 1 minute
      await this.redisService.set(cacheKey, JSON.stringify(userRank), 60);

      return userRank;
    } catch (error) {
      this.logger.error(`Failed to get user rank for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(tenantId: string): Promise<LeaderboardStats> {
    try {
      const cacheKey = `leaderboard:stats:${tenantId}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const stats = await this.leaderboardsRepository.getLeaderboardStats(tenantId);
      
      // Cache for 5 minutes
      await this.redisService.set(cacheKey, JSON.stringify(stats), 300);

      return stats;
    } catch (error) {
      this.logger.error('Failed to get leaderboard stats:', error);
      throw error;
    }
  }

  /**
   * Update leaderboard when submission is approved
   */
  async updateLeaderboardOnSubmission(submissionId: string, tenantId: string) {
    try {
      this.logger.log(`Updating leaderboard for submission ${submissionId}`);

      // Clear relevant caches
      await this.clearLeaderboardCaches(tenantId);

      // Recalculate and broadcast updates
      await this.broadcastLeaderboardUpdate(tenantId);

      this.logger.log('Leaderboard updated successfully');
    } catch (error) {
      this.logger.error('Failed to update leaderboard:', error);
      throw error;
    }
  }

  /**
   * Get top performers
   */
  async getTopPerformers(tenantId: string, limit: number = 10) {
    try {
      const cacheKey = `leaderboard:top:${tenantId}:${limit}`;
      const cached = await this.redisService.get(cacheKey);
      
      if (cached) {
        return JSON.parse(cached);
      }

      const topPerformers = await this.leaderboardsRepository.getTopPerformers(tenantId, limit);
      
      // Cache for 2 minutes
      await this.redisService.set(cacheKey, JSON.stringify(topPerformers), 120);

      return topPerformers;
    } catch (error) {
      this.logger.error('Failed to get top performers:', error);
      throw error;
    }
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(tenantId: string, limit: number = 20) {
    try {
      return await this.leaderboardsRepository.getRecentActivity(tenantId, limit);
    } catch (error) {
      this.logger.error('Failed to get recent activity:', error);
      throw error;
    }
  }

  /**
   * Paginate leaderboard results
   */
  private paginateResults(leaderboard: LeaderboardEntry[], page: number, limit: number) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = leaderboard.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: leaderboard.length,
        totalPages: Math.ceil(leaderboard.length / limit),
        hasNext: endIndex < leaderboard.length,
        hasPrev: page > 1,
      },
    };
  }

  /**
   * Clear leaderboard caches
   */
  private async clearLeaderboardCaches(tenantId: string) {
    try {
      const patterns = [
        `leaderboard:overall:${tenantId}:*`,
        `leaderboard:project:*`,
        `leaderboard:category:*:${tenantId}`,
        `leaderboard:stats:${tenantId}`,
        `leaderboard:top:${tenantId}:*`,
        `user:rank:*:${tenantId}`,
      ];

      for (const pattern of patterns) {
        // Note: In a real implementation, you'd use Redis SCAN to find and delete keys by pattern
        // For now, we'll clear specific cache keys
        await this.redisService.del(pattern);
      }
    } catch (error) {
      this.logger.error('Failed to clear leaderboard caches:', error);
    }
  }

  /**
   * Broadcast leaderboard updates via WebSocket
   */
  private async broadcastLeaderboardUpdate(tenantId: string) {
    try {
      // Get updated leaderboard data
      const leaderboard = await this.getOverallLeaderboard(tenantId, 1, 10);
      const stats = await this.getLeaderboardStats(tenantId);

      // Broadcast to all connected clients in the tenant
      this.webSocketGateway.server.to(`tenant:${tenantId}`).emit('leaderboard:update', {
        leaderboard: leaderboard.data,
        stats,
        timestamp: new Date().toISOString(),
      });

      this.logger.log(`Broadcasted leaderboard update for tenant ${tenantId}`);
    } catch (error) {
      this.logger.error('Failed to broadcast leaderboard update:', error);
    }
  }
}
