import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';
import { LeaderboardEntry, LeaderboardStats } from '../application/leaderboards.service';

@Injectable()
export class LeaderboardsRepository {
  constructor(private prisma: PrismaService) {}

  /**
   * Calculate overall leaderboard
   */
  async calculateOverallLeaderboard(
    tenantId: string,
    timeRange?: 'week' | 'month' | 'all',
  ): Promise<LeaderboardEntry[]> {
    const dateFilter = this.getDateFilter(timeRange);

    // Build query with proper parameterization
    const dateCondition = dateFilter ? 'AND s."createdAt" >= $2' : '';
    const query = `
      SELECT 
        u.id as "userId",
        u."firstName",
        u."lastName",
        u.email,
        u."avatarUrl",
        COALESCE(SUM(s.score), 0) as "totalScore",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
        COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
        COUNT(b.id) as badges,
        MAX(s."createdAt") as "lastSubmissionAt"
      FROM "User" u
      LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1 ${dateCondition}
      LEFT JOIN "Badge" b ON u.id = b."userId" AND b."tenantId" = $1
      WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
      GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
      ORDER BY "totalScore" DESC, "approvedSubmissions" DESC, "averageScore" DESC
    `;
    
    const params = dateFilter ? [tenantId, dateFilter] : [tenantId];
    const results = await this.prisma.$queryRawUnsafe(query, ...params) as any[];

    return results.map((row, index) => ({
      userId: row.userId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      avatarUrl: row.avatarUrl,
      totalScore: Number(row.totalScore),
      totalSubmissions: Number(row.totalSubmissions),
      approvedSubmissions: Number(row.approvedSubmissions),
      averageScore: Number(row.averageScore),
      rank: index + 1,
      badges: Number(row.badges),
      lastSubmissionAt: row.lastSubmissionAt,
    }));
  }

  /**
   * Calculate project-specific leaderboard
   */
  async calculateProjectLeaderboard(
    projectId: string,
    tenantId: string,
  ): Promise<LeaderboardEntry[]> {
    const query = `
      SELECT 
        u.id as "userId",
        u."firstName",
        u."lastName",
        u.email,
        u."avatarUrl",
        COALESCE(SUM(s.score), 0) as "totalScore",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
        COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
        COUNT(b.id) as badges,
        MAX(s."createdAt") as "lastSubmissionAt"
      FROM "User" u
      LEFT JOIN "Submission" s ON u.id = s."userId" 
        AND s."projectId" = $1 
        AND s."tenantId" = $2
      LEFT JOIN "Badge" b ON u.id = b."userId" AND b."tenantId" = $2
      WHERE u."tenantId" = $2 AND u.status = 'ACTIVE'
      GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
      ORDER BY "totalScore" DESC, "approvedSubmissions" DESC, "averageScore" DESC
    `;
    
    const results = await this.prisma.$queryRawUnsafe(query, projectId, tenantId) as any[];

    return results.map((row, index) => ({
      userId: row.userId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      avatarUrl: row.avatarUrl,
      totalScore: Number(row.totalScore),
      totalSubmissions: Number(row.totalSubmissions),
      approvedSubmissions: Number(row.approvedSubmissions),
      averageScore: Number(row.averageScore),
      rank: index + 1,
      badges: Number(row.badges),
      lastSubmissionAt: row.lastSubmissionAt,
    }));
  }

  /**
   * Calculate category leaderboard
   */
  async calculateCategoryLeaderboard(
    category: string,
    tenantId: string,
  ): Promise<LeaderboardEntry[]> {
    const query = `
      SELECT 
        u.id as "userId",
        u."firstName",
        u."lastName",
        u.email,
        u."avatarUrl",
        COALESCE(SUM(s.score), 0) as "totalScore",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
        COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
        COUNT(b.id) as badges,
        MAX(s."createdAt") as "lastSubmissionAt"
      FROM "User" u
      LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
      LEFT JOIN "Project" p ON s."projectId" = p.id AND p.category = $2
      LEFT JOIN "Badge" b ON u.id = b."userId" AND b."tenantId" = $1
      WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
      GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
      ORDER BY "totalScore" DESC, "approvedSubmissions" DESC, "averageScore" DESC
    `;
    
    const results = await this.prisma.$queryRawUnsafe(query, tenantId, category) as any[];

    return results.map((row, index) => ({
      userId: row.userId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      avatarUrl: row.avatarUrl,
      totalScore: Number(row.totalScore),
      totalSubmissions: Number(row.totalSubmissions),
      approvedSubmissions: Number(row.approvedSubmissions),
      averageScore: Number(row.averageScore),
      rank: index + 1,
      badges: Number(row.badges),
      lastSubmissionAt: row.lastSubmissionAt,
    }));
  }

  /**
   * Get user's rank and statistics
   */
  async getUserRank(userId: string, tenantId: string) {
    const query = `
      WITH user_stats AS (
        SELECT 
          u.id,
          COALESCE(SUM(s.score), 0) as "totalScore",
          COUNT(s.id) as "totalSubmissions",
          COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
          COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore"
        FROM "User" u
        LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
        WHERE u.id = $2 AND u."tenantId" = $1
        GROUP BY u.id
      ),
      ranked_users AS (
        SELECT 
          u.id,
          COALESCE(SUM(s.score), 0) as "totalScore",
          ROW_NUMBER() OVER (
            ORDER BY 
              COALESCE(SUM(s.score), 0) DESC,
              COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) DESC,
              COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) DESC
          ) as rank
        FROM "User" u
        LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
        WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
        GROUP BY u.id
      )
      SELECT 
        us.*,
        ru.rank
      FROM user_stats us
      JOIN ranked_users ru ON us.id = ru.id
    `;
    
    const result = await this.prisma.$queryRawUnsafe(query, tenantId, userId) as any[];

    return result[0] || null;
  }

  /**
   * Get leaderboard statistics
   */
  async getLeaderboardStats(tenantId: string): Promise<LeaderboardStats> {
    const query = `
      SELECT 
        COUNT(DISTINCT u.id) as "totalUsers",
        COUNT(s.id) as "totalSubmissions",
        COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
        COALESCE(MAX(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "topScore"
      FROM "User" u
      LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
      WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
    `;
    
    const result = await this.prisma.$queryRawUnsafe(query, tenantId) as any[];

    const stats = result[0];
    return {
      totalUsers: Number(stats.totalUsers),
      totalSubmissions: Number(stats.totalSubmissions),
      averageScore: Number(stats.averageScore),
      topScore: Number(stats.topScore),
      lastUpdated: new Date(),
    };
  }

  /**
   * Get top performers
   */
  async getTopPerformers(tenantId: string, limit: number) {
    const query = `
      SELECT 
        u.id as "userId",
        u."firstName",
        u."lastName",
        u.email,
        u."avatarUrl",
        COALESCE(SUM(s.score), 0) as "totalScore",
        COUNT(s.id) as "totalSubmissions",
        COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions"
      FROM "User" u
      LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
      WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
      GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
      ORDER BY "totalScore" DESC, "approvedSubmissions" DESC
      LIMIT $2
    `;
    
    const results = await this.prisma.$queryRawUnsafe(query, tenantId, limit) as any[];

    return results.map((row, index) => ({
      userId: row.userId,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      avatarUrl: row.avatarUrl,
      totalScore: Number(row.totalScore),
      totalSubmissions: Number(row.totalSubmissions),
      approvedSubmissions: Number(row.approvedSubmissions),
      rank: index + 1,
    }));
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(tenantId: string, limit: number) {
    return await this.prisma.submission.findMany({
      where: { tenantId, status: 'APPROVED' },
      take: limit,
      orderBy: { reviewedAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            category: true,
            difficulty: true,
          },
        },
      },
    });
  }

  /**
   * Get date filter for time range
   */
  private getDateFilter(timeRange?: 'week' | 'month' | 'all'): Date | null {
    if (!timeRange || timeRange === 'all') return null;
    
    const now = new Date();
    if (timeRange === 'week') {
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeRange === 'month') {
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
    
    return null;
  }
}
