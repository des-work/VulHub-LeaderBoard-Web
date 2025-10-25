import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';

@Injectable()
export class QueryOptimizerService {
  private readonly logger = new Logger(QueryOptimizerService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get user with all related data in a single query
   */
  async getUserWithStats(userId: string, tenantId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { 
          id: userId,
          tenantId 
        },
        include: {
          submissions: {
            where: { tenantId },
            select: {
              id: true,
              score: true,
              status: true,
              createdAt: true,
              project: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  difficulty: true,
                },
              },
            },
          },
          userBadges: {
            where: { tenantId },
            include: {
              badge: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  icon: true,
                },
              },
            },
          },
          _count: {
            select: {
              submissions: {
                where: { tenantId },
              },
            },
          },
        },
      });

      if (!user) {
        return null;
      }

      // Calculate stats from the included data
      const approvedSubmissions = user.submissions.filter(s => s.status === 'APPROVED');
      const totalScore = approvedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = approvedSubmissions.length > 0 
        ? totalScore / approvedSubmissions.length 
        : 0;

      return {
        ...user,
        stats: {
          totalSubmissions: user.submissions.length,
          approvedSubmissions: approvedSubmissions.length,
          totalScore,
          averageScore,
          badges: user.userBadges.length,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get user with stats for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get project with all related data in a single query
   */
  async getProjectWithStats(projectId: string, tenantId: string) {
    try {
      const project = await this.prisma.project.findUnique({
        where: { 
          id: projectId,
          tenantId 
        },
        include: {
          submissions: {
            where: { tenantId },
            select: {
              id: true,
              score: true,
              status: true,
              createdAt: true,
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  avatarUrl: true,
                },
              },
            },
          },
          _count: {
            select: {
              submissions: {
                where: { tenantId },
              },
            },
          },
        },
      });

      if (!project) {
        return null;
      }

      // Calculate stats from the included data
      const approvedSubmissions = project.submissions.filter(s => s.status === 'APPROVED');
      const totalScore = approvedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
      const averageScore = approvedSubmissions.length > 0 
        ? totalScore / approvedSubmissions.length 
        : 0;

      return {
        ...project,
        stats: {
          totalSubmissions: project.submissions.length,
          approvedSubmissions: approvedSubmissions.length,
          totalScore,
          averageScore,
          completionRate: project.submissions.length > 0 
            ? (approvedSubmissions.length / project.submissions.length) * 100 
            : 0,
        },
      };
    } catch (error) {
      this.logger.error(`Failed to get project with stats for ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get leaderboard with user details in a single query
   */
  async getLeaderboardWithUsers(tenantId: string, limit: number = 50) {
    try {
      // Use a single complex query instead of multiple queries
      const results = await this.prisma.$queryRaw`
        WITH user_stats AS (
          SELECT 
            u.id,
            u."firstName",
            u."lastName",
            u.email,
            u."avatarUrl",
            COALESCE(SUM(s.score), 0) as "totalScore",
            COUNT(s.id) as "totalSubmissions",
            COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
            COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
            COUNT(ub.id) as badges
          FROM "User" u
          LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
          LEFT JOIN "UserBadge" ub ON u.id = ub."userId" AND ub."tenantId" = $1
          WHERE u."tenantId" = $1 AND u.status = 'ACTIVE'
          GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
        )
        SELECT 
          *,
          ROW_NUMBER() OVER (
            ORDER BY 
              "totalScore" DESC,
              "approvedSubmissions" DESC,
              "averageScore" DESC
          ) as rank
        FROM user_stats
        ORDER BY "totalScore" DESC, "approvedSubmissions" DESC, "averageScore" DESC
        LIMIT $2
      ` as any[];

      return results.map((row, index) => ({
        userId: row.id,
        firstName: row.firstName,
        lastName: row.lastName,
        email: row.email,
        avatarUrl: row.avatarUrl,
        totalScore: Number(row.totalScore),
        totalSubmissions: Number(row.totalSubmissions),
        approvedSubmissions: Number(row.approvedSubmissions),
        averageScore: Number(row.averageScore),
        badges: Number(row.badges),
        rank: index + 1,
      }));
    } catch (error) {
      this.logger.error(`Failed to get leaderboard with users for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get submissions with user and project details in a single query
   */
  async getSubmissionsWithDetails(tenantId: string, filters: {
    userId?: string;
    projectId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    try {
      const { userId, projectId, status, limit = 50, offset = 0 } = filters;

      const submissions = await this.prisma.submission.findMany({
        where: {
          tenantId,
          ...(userId && { userId }),
          ...(projectId && { projectId }),
          ...(status && { status: status as any }),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
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
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

      return submissions;
    } catch (error) {
      this.logger.error(`Failed to get submissions with details for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get badge progress for multiple users in a single query
   */
  async getBadgeProgressForUsers(userIds: string[], tenantId: string) {
    try {
      const results = await this.prisma.$queryRaw`
        SELECT 
          ub."userId",
          ub."badgeId",
          b.name as "badgeName",
          b.description as "badgeDescription",
          b.icon as "badgeIcon",
          ub."earnedAt",
          CASE 
            WHEN ub."userId" IS NOT NULL THEN true 
            ELSE false 
          END as "isEarned"
        FROM "Badge" b
        LEFT JOIN "UserBadge" ub ON b.id = ub."badgeId" 
          AND ub."userId" = ANY($1::text[])
          AND ub."tenantId" = $2
        WHERE b."tenantId" = $2 AND b."isActive" = true
        ORDER BY b."createdAt" DESC
      ` as any[];

      // Group by user
      const userBadges: Record<string, any[]> = {};
      userIds.forEach(userId => {
        userBadges[userId] = [];
      });

      results.forEach(result => {
        if (result.userId && userBadges[result.userId]) {
          userBadges[result.userId].push({
            badgeId: result.badgeId,
            badgeName: result.badgeName,
            badgeDescription: result.badgeDescription,
            badgeIcon: result.badgeIcon,
            earnedAt: result.earnedAt,
            isEarned: result.isEarned,
          });
        }
      });

      return userBadges;
    } catch (error) {
      this.logger.error(`Failed to get badge progress for users:`, error);
      throw error;
    }
  }

  /**
   * Get dashboard data for a user in a single query
   */
  async getUserDashboard(userId: string, tenantId: string) {
    try {
      const dashboard = await this.prisma.$queryRaw`
        WITH user_stats AS (
          SELECT 
            u.id,
            u."firstName",
            u."lastName",
            u.email,
            u."avatarUrl",
            COALESCE(SUM(s.score), 0) as "totalScore",
            COUNT(s.id) as "totalSubmissions",
            COUNT(CASE WHEN s.status = 'APPROVED' THEN 1 END) as "approvedSubmissions",
            COALESCE(AVG(CASE WHEN s.status = 'APPROVED' THEN s.score END), 0) as "averageScore",
            COUNT(ub.id) as badges,
            MAX(s."createdAt") as "lastSubmissionAt"
          FROM "User" u
          LEFT JOIN "Submission" s ON u.id = s."userId" AND s."tenantId" = $1
          LEFT JOIN "UserBadge" ub ON u.id = ub."userId" AND ub."tenantId" = $1
          WHERE u.id = $2 AND u."tenantId" = $1
          GROUP BY u.id, u."firstName", u."lastName", u.email, u."avatarUrl"
        ),
        recent_submissions AS (
          SELECT 
            s.id,
            s.score,
            s.status,
            s."createdAt",
            p.name as "projectName",
            p.category as "projectCategory",
            p.difficulty as "projectDifficulty"
          FROM "Submission" s
          JOIN "Project" p ON s."projectId" = p.id
          WHERE s."userId" = $2 AND s."tenantId" = $1
          ORDER BY s."createdAt" DESC
          LIMIT 5
        ),
        recent_badges AS (
          SELECT 
            ub.id,
            ub."earnedAt",
            b.name as "badgeName",
            b.description as "badgeDescription",
            b.icon as "badgeIcon"
          FROM "UserBadge" ub
          JOIN "Badge" b ON ub."badgeId" = b.id
          WHERE ub."userId" = $2 AND ub."tenantId" = $1
          ORDER BY ub."earnedAt" DESC
          LIMIT 5
        )
        SELECT 
          us.*,
          rs.*,
          rb.*
        FROM user_stats us
        LEFT JOIN recent_submissions rs ON true
        LEFT JOIN recent_badges rb ON true
      ` as any[];

      return dashboard[0] || null;
    } catch (error) {
      this.logger.error(`Failed to get user dashboard for ${userId}:`, error);
      throw error;
    }
  }
}
