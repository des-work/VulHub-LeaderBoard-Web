import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { TestUtils } from './test-utils';

export abstract class IntegrationTestBase {
  protected app: INestApplication;
  protected module: TestingModule;
  protected prisma: PrismaService;
  protected redis: RedisService;

  /**
   * Setup test environment
   */
  async setupTest(): Promise<void> {
    // Create test module
    this.module = await Test.createTestingModule({
      imports: [], // Add your app module here
    }).compile();

    this.app = this.module.createNestApplication();
    await this.app.init();

    // Get services
    this.prisma = this.module.get<PrismaService>(PrismaService);
    this.redis = this.module.get<RedisService>(RedisService);

    // Setup test database
    await this.setupTestDatabase();
  }

  /**
   * Cleanup test environment
   */
  async cleanupTest(): Promise<void> {
    // Clean test database
    await this.cleanupTestDatabase();

    // Close app
    if (this.app) {
      await this.app.close();
    }
  }

  /**
   * Setup test database
   */
  protected async setupTestDatabase(): Promise<void> {
    // Create test tenant
    await this.prisma.tenant.create({
      data: {
        id: 'test-tenant-id',
        name: 'Test Tenant',
        domain: 'test.example.com',
        isActive: true,
      },
    });

    // Create test user
    await this.prisma.user.create({
      data: {
        id: 'test-user-id',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        tenantId: 'test-tenant-id',
        status: 'ACTIVE',
        role: 'STUDENT',
      },
    });
  }

  /**
   * Cleanup test database
   */
  protected async cleanupTestDatabase(): Promise<void> {
    // Delete in reverse order of dependencies
    await this.prisma.eventStore.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.leaderboard.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.userBadge.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.badge.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.submission.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.project.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.user.deleteMany({
      where: { tenantId: 'test-tenant-id' },
    });

    await this.prisma.tenant.deleteMany({
      where: { id: 'test-tenant-id' },
    });
  }

  /**
   * Create test data
   */
  protected async createTestData(): Promise<void> {
    // Create test project
    await this.prisma.project.create({
      data: {
        id: 'test-project-id',
        name: 'Test Project',
        description: 'Test project description',
        category: 'WEB',
        difficulty: 'EASY',
        points: 100,
        isActive: true,
        isPublic: true,
        tags: ['test', 'example'],
        tenantId: 'test-tenant-id',
      },
    });

    // Create test badge
    await this.prisma.badge.create({
      data: {
        id: 'test-badge-id',
        name: 'Test Badge',
        description: 'Test badge description',
        icon: 'test-icon.png',
        category: 'ACHIEVEMENT',
        difficulty: 'EASY',
        criteria: { type: 'submission_count', value: 5 },
        isActive: true,
        tenantId: 'test-tenant-id',
      },
    });
  }

  /**
   * Make authenticated request
   */
  protected async makeAuthenticatedRequest(
    method: string,
    url: string,
    data?: any,
    headers?: Record<string, string>
  ): Promise<any> {
    const defaultHeaders = {
      'Authorization': 'Bearer test-token',
      'X-Tenant-ID': 'test-tenant-id',
      'Content-Type': 'application/json',
      ...headers,
    };

    // This would be implemented based on your HTTP testing framework
    // For example, using supertest:
    // return request(this.app.getHttpServer())
    //   [method.toLowerCase()](url)
    //   .set(defaultHeaders)
    //   .send(data);
  }

  /**
   * Assert database state
   */
  protected async assertDatabaseState(
    table: string,
    expectedCount: number,
    conditions?: Record<string, any>
  ): Promise<void> {
    const where = conditions ? { ...conditions, tenantId: 'test-tenant-id' } : { tenantId: 'test-tenant-id' };
    
    const count = await (this.prisma as any)[table].count({ where });
    expect(count).toBe(expectedCount);
  }

  /**
   * Assert event was published
   */
  protected async assertEventPublished(
    eventType: string,
    aggregateId: string
  ): Promise<void> {
    const events = await this.prisma.eventStore.findMany({
      where: {
        eventType,
        aggregateId,
        tenantId: 'test-tenant-id',
      },
    });

    expect(events.length).toBeGreaterThan(0);
  }

  /**
   * Assert cache state
   */
  protected async assertCacheState(
    key: string,
    expectedValue: any
  ): Promise<void> {
    const value = await this.redis.get(key);
    expect(value).toBe(JSON.stringify(expectedValue));
  }

  /**
   * Wait for async operations
   */
  protected async waitForAsync(ms: number = 100): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create test scenario
   */
  protected async createTestScenario(scenario: string): Promise<void> {
    switch (scenario) {
      case 'user_with_submissions':
        await this.createTestData();
        await this.prisma.submission.create({
          data: {
            id: 'test-submission-id',
            projectId: 'test-project-id',
            userId: 'test-user-id',
            tenantId: 'test-tenant-id',
            status: 'APPROVED',
            score: 85,
            feedback: 'Great work!',
            evidenceUrls: ['evidence1.jpg'],
            submittedAt: new Date(),
            reviewedAt: new Date(),
            reviewedBy: 'instructor-id',
          },
        });
        break;

      case 'user_with_badges':
        await this.createTestData();
        await this.prisma.userBadge.create({
          data: {
            id: 'test-user-badge-id',
            userId: 'test-user-id',
            badgeId: 'test-badge-id',
            tenantId: 'test-tenant-id',
            earnedAt: new Date(),
          },
        });
        break;

      case 'leaderboard_data':
        await this.createTestScenario('user_with_submissions');
        await this.prisma.leaderboard.create({
          data: {
            id: 'test-leaderboard-id',
            userId: 'test-user-id',
            tenantId: 'test-tenant-id',
            score: 85,
            rank: 1,
          },
        });
        break;

      default:
        throw new Error(`Unknown test scenario: ${scenario}`);
    }
  }
}
