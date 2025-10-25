import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';
import { Prisma } from '@prisma/client';
import { BadgeProgress } from '../application/badges.service';

@Injectable()
export class BadgesRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.BadgeCreateInput) {
    return this.prisma.badge.create({ data });
  }

  async findMany(args: Prisma.BadgeFindManyArgs) {
    return this.prisma.badge.findMany(args);
  }

  async findUnique(args: Prisma.BadgeFindUniqueArgs) {
    return this.prisma.badge.findUnique(args);
  }

  async update(args: Prisma.BadgeUpdateArgs) {
    return this.prisma.badge.update(args);
  }

  async delete(args: Prisma.BadgeDeleteArgs) {
    return this.prisma.badge.delete(args);
  }

  async count(args: Prisma.BadgeCountArgs) {
    return this.prisma.badge.count(args);
  }

  async getUserBadges(userId: string, tenantId: string) {
    return this.prisma.userBadge.findMany({
      where: { userId, tenantId },
      include: {
        badge: true,
      },
      orderBy: { earnedAt: 'desc' },
    });
  }

  async getUserBadgeProgress(userId: string, tenantId: string): Promise<BadgeProgress[]> {
    const badges = await this.prisma.badge.findMany({
      where: { tenantId, isActive: true },
    });

    const progress: BadgeProgress[] = [];

    for (const badge of badges) {
      const userProgress = await this.getBadgeProgressForUser(badge.id, userId, tenantId);
      progress.push(userProgress);
    }

    return progress;
  }

  async getBadgeProgressForUser(badgeId: string, userId: string, tenantId: string): Promise<BadgeProgress> {
    const badge = await this.prisma.badge.findUnique({
      where: { id: badgeId, tenantId },
    });

    if (!badge) {
      throw new Error('Badge not found');
    }

    // Check if user already has this badge
    const existingBadge = await this.findUserBadge(userId, badgeId, tenantId);
    const isAssigned = !!existingBadge;

    // Simplified badge progress calculation
    let currentValue = 0;
    let targetValue = 1;

    // Simple criteria handling - just check submission count for now
    currentValue = await this.prisma.submission.count({
      where: { userId, tenantId, status: 'APPROVED' },
    });
    targetValue = 5; // Default target

    const progress = Math.min((currentValue / targetValue) * 100, 100);
    const isEarned = currentValue >= targetValue;

    return {
      badgeId,
      userId,
      currentValue,
      targetValue,
      progress,
      isEarned: isEarned && !isAssigned,
    };
  }

  async findUserBadge(userId: string, badgeId: string, tenantId: string) {
    return this.prisma.userBadge.findFirst({
      where: { userId, badgeId, tenantId },
    });
  }

  async assignBadge(data: Prisma.UserBadgeCreateInput) {
    return this.prisma.userBadge.create({ data });
  }

  async getBadgeStats(tenantId: string) {
    const [totalBadges, totalAwards, mostEarned] = await Promise.all([
      this.prisma.badge.count({ where: { tenantId } }),
      this.prisma.userBadge.count({ where: { tenantId } }),
      this.prisma.badge.findFirst({
        where: { tenantId },
        include: {
          _count: {
            select: { userBadges: true },
          },
        },
        orderBy: {
          userBadges: { _count: 'desc' },
        },
      }),
    ]);

    return {
      totalBadges,
      totalAwards,
      averageAwardsPerBadge: totalBadges > 0 ? totalAwards / totalBadges : 0,
      mostEarnedBadge: mostEarned,
    };
  }

  async getMostEarnedBadges(tenantId: string, limit: number) {
    return this.prisma.badge.findMany({
      where: { tenantId },
      include: {
        _count: {
          select: { userBadges: true },
        },
      },
      orderBy: {
        userBadges: { _count: 'desc' },
      },
      take: limit,
    });
  }

  async getRecentBadgeAwards(tenantId: string, limit: number) {
    return this.prisma.userBadge.findMany({
      where: { tenantId },
      take: limit,
      orderBy: { earnedAt: 'desc' },
      include: {
        badge: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  private calculateStreak(submissions: any[]): number {
    if (submissions.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const submission of submissions) {
      const submissionDate = new Date(submission.createdAt);
      submissionDate.setHours(0, 0, 0, 0);

      const dayDiff = Math.floor((currentDate.getTime() - submissionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dayDiff === streak) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }
}
