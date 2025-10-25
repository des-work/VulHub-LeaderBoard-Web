import { Injectable, Logger } from '@nestjs/common';
import { LeaderboardsRepository } from '../infrastructure/leaderboards.repository';
import { CacheService } from '../../../common/services/cache.service';
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
    private cacheService: CacheService,
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

      // Use cache service with getOrSet pattern
      const cacheKey = `leaderboard:overall:${tenantId}:${timeRange || 'all'}`;
      const leaderboard = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.calculateOverallLeaderboard(tenantId, timeRange),
        { ttl: 300, prefix: 'leaderboard' } // 5 minutes cache
      );

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
      const leaderboard = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.calculateProjectLeaderboard(projectId, tenantId),
        { ttl: 120, prefix: 'leaderboard' } // 2 minutes cache
      );

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
      const leaderboard = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.calculateCategoryLeaderboard(category, tenantId),
        { ttl: 300, prefix: 'leaderboard' } // 5 minutes cache
      );

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
      const userRank = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.getUserRank(userId, tenantId),
        { ttl: 60, prefix: 'user' } // 1 minute cache
      );

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
      const stats = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.getLeaderboardStats(tenantId),
        { ttl: 300, prefix: 'leaderboard' } // 5 minutes cache
      );

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
      const topPerformers = await this.cacheService.getOrSet(
        cacheKey,
        () => this.leaderboardsRepository.getTopPerformers(tenantId, limit),
        { ttl: 120, prefix: 'leaderboard' } // 2 minutes cache
      );

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
        await this.cacheService.delPattern(pattern, { prefix: 'leaderboard' });
        await this.cacheService.delPattern(pattern, { prefix: 'user' });
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
