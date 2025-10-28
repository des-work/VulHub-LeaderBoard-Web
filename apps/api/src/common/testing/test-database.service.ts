import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { TestConfigService } from './test-config.service';

@Injectable()
export class TestDatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TestDatabaseService.name);

  constructor(
    private prisma: PrismaService,
    private testConfig: TestConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.testConfig.getConfig().environment === 'test') {
      await this.setupTestDatabase();
    }
  }

  async onModuleDestroy(): Promise<void> {
    if (this.testConfig.getConfig().environment === 'test') {
      await this.cleanupTestDatabase();
    }
  }

  /**
   * Setup test database with fresh data
   */
  async setupTestDatabase(): Promise<void> {
    try {
      this.logger.log('Setting up test database...');

      if (this.testConfig.getDatabaseConfig().resetOnStart) {
        await this.resetDatabase();
      }

      if (this.testConfig.getDatabaseConfig().seedData) {
        await this.seedTestData();
      }

      this.logger.log('Test database setup completed');
    } catch (error) {
      this.logger.error('Failed to setup test database:', error);
      throw error;
    }
  }

  /**
   * Reset database by clearing all data
   */
  async resetDatabase(): Promise<void> {
    this.logger.log('Resetting test database...');

    // Delete in reverse order of dependencies
    await this.prisma.userBadge.deleteMany();
    await this.prisma.badge.deleteMany();
    await this.prisma.submission.deleteMany();
    await this.prisma.project.deleteMany();
    await this.prisma.leaderboard.deleteMany();
    await this.prisma.user.deleteMany();
    await this.prisma.tenant.deleteMany();
    await this.prisma.eventStore.deleteMany();
    await this.prisma.auditLog.deleteMany();

    this.logger.log('Test database reset completed');
  }

  /**
   * Seed test database with initial data
   */
  async seedTestData(): Promise<void> {
    this.logger.log('Seeding test database...');

    const testData = this.testConfig.getTestData();

    // Create test tenant
    await this.prisma.tenant.create({
      data: {
        id: 'test-tenant-1',
        name: 'Test Tenant',
        domain: 'test.example.com',
        isActive: true,
      },
    });

    // Create test users
    for (const user of testData.users) {
      await this.prisma.user.create({
        data: {
          ...user,
          password: 'hashedpassword123',
        },
      });
    }

    // Create test projects
    for (const project of testData.projects) {
      await this.prisma.project.create({
        data: project,
      });
    }

    // Create test submissions
    for (const submission of testData.submissions) {
      await this.prisma.submission.create({
        data: {
          ...submission,
          submittedAt: new Date(),
        },
      });
    }

    // Create test badges
    await this.prisma.badge.createMany({
      data: [
        {
          id: 'test-badge-1',
          name: 'First Submission',
          description: 'Complete your first project submission',
          category: 'Achievement',
          difficulty: 'Easy',
          tenantId: 'test-tenant-1',
        },
        {
          id: 'test-badge-2',
          name: 'High Scorer',
          description: 'Score 90+ on a project',
          category: 'Performance',
          difficulty: 'Hard',
          tenantId: 'test-tenant-1',
        },
      ],
    });

    // Create test leaderboard entries
    await this.prisma.leaderboard.createMany({
      data: [
        {
          userId: 'test-user-1',
          tenantId: 'test-tenant-1',
          score: 100,
          rank: 1,
        },
        {
          userId: 'test-user-2',
          tenantId: 'test-tenant-1',
          score: 85,
          rank: 2,
        },
      ],
    });

    this.logger.log('Test database seeding completed');
  }

  /**
   * Cleanup test database
   */
  async cleanupTestDatabase(): Promise<void> {
    try {
      this.logger.log('Cleaning up test database...');
      await this.resetDatabase();
      this.logger.log('Test database cleanup completed');
    } catch (error) {
      this.logger.error('Failed to cleanup test database:', error);
      throw error;
    }
  }

  /**
   * Get test user by email
   */
  async getTestUser(email: string): Promise<any> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
        submissions: true,
        userBadges: {
          include: {
            badge: true,
          },
        },
      },
    });
  }

  /**
   * Get test project by name
   */
  async getTestProject(name: string): Promise<any> {
    return await this.prisma.project.findFirst({
      where: { name },
      include: {
        submissions: true,
        tenant: true,
      },
    });
  }

  /**
   * Get test submission by ID
   */
  async getTestSubmission(id: string): Promise<any> {
    return await this.prisma.submission.findUnique({
      where: { id },
      include: {
        user: true,
        project: true,
        tenant: true,
      },
    });
  }

  /**
   * Create test data for specific test
   */
  async createTestData(data: any): Promise<void> {
    if (data.tenant) {
      await this.prisma.tenant.create({ data: data.tenant });
    }

    if (data.users) {
      for (const user of data.users) {
        await this.prisma.user.create({ data: user });
      }
    }

    if (data.projects) {
      for (const project of data.projects) {
        await this.prisma.project.create({ data: project });
      }
    }

    if (data.submissions) {
      for (const submission of data.submissions) {
        await this.prisma.submission.create({ data: submission });
      }
    }

    if (data.badges) {
      for (const badge of data.badges) {
        await this.prisma.badge.create({ data: badge });
      }
    }
  }

  /**
   * Cleanup test data for specific test
   */
  async cleanupTestData(data: any): Promise<void> {
    if (data.submissions) {
      await this.prisma.submission.deleteMany({
        where: { id: { in: data.submissions.map((s: any) => s.id) } },
      });
    }

    if (data.projects) {
      await this.prisma.project.deleteMany({
        where: { id: { in: data.projects.map((p: any) => p.id) } },
      });
    }

    if (data.users) {
      await this.prisma.user.deleteMany({
        where: { id: { in: data.users.map((u: any) => u.id) } },
      });
    }

    if (data.tenant) {
      await this.prisma.tenant.delete({
        where: { id: data.tenant.id },
      });
    }
  }

  /**
   * Execute database transaction for tests
   */
  async executeTransaction<T>(fn: (prisma: any) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(fn);
  }

  /**
   * Get database connection status
   */
  async isConnected(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
