import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { TestConfigService } from './test-config.service';

@Injectable()
export class TestUtilsService {
  private readonly logger = new Logger(TestUtilsService.name);

  constructor(
    private testConfig: TestConfigService,
    private prisma?: PrismaService,
    private redis?: RedisService,
  ) {}

  /**
   * Generate test JWT token
   */
  generateTestToken(userId: string, tenantId: string): string {
    // In a real implementation, this would generate a proper JWT
    // For testing, we'll return a mock token
    return `test-token-${userId}-${tenantId}`;
  }

  /**
   * Clean all test data from database
   */
  async cleanDatabase(): Promise<void> {
    if (!this.prisma) {
      this.logger.warn('Prisma service not available, skipping database cleanup');
      return;
    }

    const tables = [
      'UserBadge',
      'Badge',
      'Submission',
      'Project',
      'Leaderboard',
      'EventStore',
      'User',
      'Tenant',
    ];

    for (const table of tables.reverse()) {
      try {
        await (this.prisma as any)[table.toLowerCase()].deleteMany();
        this.logger.debug(`Cleaned table: ${table}`);
      } catch (error) {
        this.logger.warn(`Failed to clean table ${table}:`, error.message);
      }
    }

    this.logger.log('Database cleanup completed');
  }

  /**
   * Seed database with test data
   */
  async seedDatabase(): Promise<void> {
    if (!this.prisma) {
      this.logger.warn('Prisma service not available, skipping database seeding');
      return;
    }

    const config = this.testConfig.getConfig();

    if (!config.database.seedData) {
      this.logger.log('Database seeding skipped');
      return;
    }

    // Create test tenant
    await this.prisma.tenant.create({
      data: {
        id: 'test-tenant-1',
        name: 'Test Tenant',
        domain: 'test.example.com',
        isActive: true,
      },
    });

    // Seed test data
    const { testData } = config;
    await this.seedUsers(testData.users);
    await this.seedProjects(testData.projects);
    await this.seedSubmissions(testData.submissions);

    this.logger.log('Database seeding completed');
  }

  /**
   * Clean Redis test data
   */
  async cleanRedis(): Promise<void> {
    if (!this.redis) {
      this.logger.warn('Redis service not available, skipping Redis cleanup');
      return;
    }

    try {
      const keys = await this.redis.keys('test:*');
      if (keys.length > 0) {
        await Promise.all(keys.map(key => this.redis!.del(key)));
        this.logger.debug(`Cleaned ${keys.length} Redis keys`);
      }
    } catch (error) {
      this.logger.warn('Failed to clean Redis:', error.message);
    }
  }

  /**
   * Reset all test state
   */
  async resetTestState(): Promise<void> {
    await Promise.all([
      this.cleanDatabase(),
      this.cleanRedis(),
    ]);

    await this.seedDatabase();
    this.logger.log('Test state reset completed');
  }

  /**
   * Create authenticated test request headers
   */
  createAuthHeaders(userId: string = 'test-user-1', tenantId: string = 'test-tenant-1'): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.generateTestToken(userId, tenantId)}`,
      'X-Tenant-ID': tenantId,
      'Content-Type': 'application/json',
    };
  }

  /**
   * Generate test data for specific scenarios
   */
  async createTestScenario(scenario: string): Promise<any> {
    if (!this.prisma) {
      throw new Error('Prisma service not available for test scenario creation');
    }

    switch (scenario) {
      case 'user_with_submissions':
        return this.createUserWithSubmissions();
      case 'project_with_multiple_submissions':
        return this.createProjectWithMultipleSubmissions();
      case 'leaderboard_data':
        return this.createLeaderboardData();
      case 'admin_user':
        return this.createAdminUser();
      default:
        throw new Error(`Unknown test scenario: ${scenario}`);
    }
  }

  /**
   * Validate test data integrity
   */
  async validateTestData(): Promise<{ isValid: boolean; errors: string[] }> {
    if (!this.prisma) {
      return { isValid: false, errors: ['Prisma service not available'] };
    }

    const errors: string[] = [];

    try {
      // Check tenant exists
      const tenantCount = await this.prisma.tenant.count();
      if (tenantCount === 0) {
        errors.push('No test tenant found');
      }

      // Check users exist
      const userCount = await this.prisma.user.count();
      if (userCount === 0) {
        errors.push('No test users found');
      }

      // Check referential integrity
      const submissionsWithoutUsers = await this.prisma.submission.findMany({
        where: {
          user: null,
        },
      });

      if (submissionsWithoutUsers.length > 0) {
        errors.push(`${submissionsWithoutUsers.length} submissions without valid users`);
      }

    } catch (error) {
      errors.push(`Database validation failed: ${error.message}`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Create performance test data
   */
  async createPerformanceTestData(options: {
    userCount?: number;
    projectCount?: number;
    submissionCount?: number;
  } = {}): Promise<void> {
    if (!this.prisma) {
      throw new Error('Prisma service not available for performance test data creation');
    }

    const {
      userCount = 100,
      projectCount = 20,
      submissionCount = 500,
    } = options;

    this.logger.log(`Creating performance test data: ${userCount} users, ${projectCount} projects, ${submissionCount} submissions`);

    // Create users in batches
    const users = Array(userCount).fill().map((_, i) => ({
      id: `perf-user-${i}`,
      email: `perf-user-${i}@example.com`,
      firstName: `Perf${i}`,
      lastName: 'User',
      tenantId: 'test-tenant-1',
      status: 'ACTIVE',
      role: 'STUDENT',
    }));

    await this.prisma.user.createMany({ data: users });

    // Create projects
    const projects = Array(projectCount).fill().map((_, i) => ({
      id: `perf-project-${i}`,
      name: `Performance Project ${i}`,
      description: `Project for performance testing ${i}`,
      category: 'WEB' as any,
      difficulty: 'EASY' as any,
      points: (i + 1) * 10,
      isActive: true,
      isPublic: true,
      tags: ['performance', `tag-${i}`],
      tenantId: 'test-tenant-1',
    }));

    await this.prisma.project.createMany({ data: projects });

    // Create submissions
    const submissions = Array(submissionCount).fill().map((_, i) => ({
      id: `perf-submission-${i}`,
      projectId: `perf-project-${i % projectCount}`,
      userId: `perf-user-${i % userCount}`,
      tenantId: 'test-tenant-1',
      status: 'APPROVED' as any,
      score: Math.floor(Math.random() * 100),
      feedback: 'Good work!',
      evidenceUrls: [`https://example.com/evidence-${i}.jpg`],
      submittedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    }));

    await this.prisma.submission.createMany({ data: submissions });

    this.logger.log('Performance test data created successfully');
  }

  /**
   * Create test request headers
   */
  createTestHeaders(userId?: string, tenantId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (userId && tenantId) {
      headers['Authorization'] = `Bearer ${this.generateTestToken(userId, tenantId)}`;
      headers['X-Tenant-ID'] = tenantId;
    }

    return headers;
  }

  /**
   * Generate random test data
   */
  generateRandomUser(overrides: any = {}): any {
    const randomId = Math.random().toString(36).substring(7);
    return {
      id: `test-user-${randomId}`,
      email: `test${randomId}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT',
      status: 'ACTIVE',
      tenantId: 'test-tenant-1',
      ...overrides,
    };
  }

  generateRandomProject(overrides: any = {}): any {
    const randomId = Math.random().toString(36).substring(7);
    return {
      id: `test-project-${randomId}`,
      name: `Test Project ${randomId}`,
      description: 'A test project',
      category: 'Web Application',
      difficulty: 'Easy',
      points: 100,
      isActive: true,
      isPublic: true,
      tenantId: 'test-tenant-1',
      ...overrides,
    };
  }

  /**
   * Wait for async operation
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry operation with exponential backoff
   */
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await this.wait(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Mock external service responses
   */
  createMockResponse(data: any, status: number = 200): any {
    return {
      status,
      data,
      headers: {},
    };
  }

  /**
   * Validate test response structure
   */
  validateResponse(response: any, expectedFields: string[]): boolean {
    if (!response || typeof response !== 'object') {
      return false;
    }

    return expectedFields.every(field => field in response);
  }

  /**
   * Clean up test files
   */
  async cleanupTestFiles(filePaths: string[]): Promise<void> {
    // In a real implementation, this would delete files
    this.logger.log(`Cleaning up ${filePaths.length} test files`);
  }

  // Private helper methods
  private async seedUsers(users: any[]): Promise<void> {
    if (!this.prisma) return;

    for (const user of users) {
      await this.prisma.user.create({ data: user });
    }
  }

  private async seedProjects(projects: any[]): Promise<void> {
    if (!this.prisma) return;

    for (const project of projects) {
      await this.prisma.project.create({ data: project });
    }
  }

  private async seedSubmissions(submissions: any[]): Promise<void> {
    if (!this.prisma) return;

    for (const submission of submissions) {
      await this.prisma.submission.create({ data: submission });
    }
  }

  private async createUserWithSubmissions(): Promise<any> {
    if (!this.prisma) throw new Error('Prisma service not available');

    const user = await this.prisma.user.create({
      data: {
        id: 'scenario-user-1',
        email: 'scenario@example.com',
        firstName: 'Scenario',
        lastName: 'User',
        tenantId: 'test-tenant-1',
        status: 'ACTIVE',
        role: 'STUDENT',
      },
    });

    const project = await this.prisma.project.create({
      data: {
        id: 'scenario-project-1',
        name: 'Scenario Project',
        description: 'Project for scenario testing',
        category: 'WEB',
        difficulty: 'EASY',
        points: 100,
        isActive: true,
        isPublic: true,
        tenantId: 'test-tenant-1',
      },
    });

    const submissions = await Promise.all([
      this.prisma.submission.create({
        data: {
          id: 'scenario-submission-1',
          projectId: project.id,
          userId: user.id,
          tenantId: 'test-tenant-1',
          status: 'APPROVED',
          score: 90,
          feedback: 'Excellent work!',
          evidenceUrls: ['https://example.com/evidence1.jpg'],
        },
      }),
      this.prisma.submission.create({
        data: {
          id: 'scenario-submission-2',
          projectId: project.id,
          userId: user.id,
          tenantId: 'test-tenant-1',
          status: 'PENDING',
          evidenceUrls: ['https://example.com/evidence2.jpg'],
        },
      }),
    ]);

    return { user, project, submissions };
  }

  private async createProjectWithMultipleSubmissions(): Promise<any> {
    if (!this.prisma) throw new Error('Prisma service not available');

    const project = await this.prisma.project.create({
      data: {
        id: 'multi-sub-project',
        name: 'Multi Submission Project',
        description: 'Project with multiple submissions',
        category: 'WEB',
        difficulty: 'MEDIUM',
        points: 150,
        isActive: true,
        isPublic: true,
        tenantId: 'test-tenant-1',
      },
    });

    const users = await Promise.all([
      this.prisma.user.create({
        data: {
          id: 'multi-user-1',
          email: 'multi1@example.com',
          firstName: 'Multi1',
          lastName: 'User',
          tenantId: 'test-tenant-1',
          status: 'ACTIVE',
          role: 'STUDENT',
        },
      }),
      this.prisma.user.create({
        data: {
          id: 'multi-user-2',
          email: 'multi2@example.com',
          firstName: 'Multi2',
          lastName: 'User',
          tenantId: 'test-tenant-1',
          status: 'ACTIVE',
          role: 'STUDENT',
        },
      }),
    ]);

    const submissions = await Promise.all([
      this.prisma.submission.create({
        data: {
          id: 'multi-sub-1',
          projectId: project.id,
          userId: users[0].id,
          tenantId: 'test-tenant-1',
          status: 'APPROVED',
          score: 85,
          feedback: 'Good work!',
        },
      }),
      this.prisma.submission.create({
        data: {
          id: 'multi-sub-2',
          projectId: project.id,
          userId: users[1].id,
          tenantId: 'test-tenant-1',
          status: 'APPROVED',
          score: 92,
          feedback: 'Excellent!',
        },
      }),
    ]);

    return { project, users, submissions };
  }

  private async createLeaderboardData(): Promise<any> {
    const result = await this.createUserWithSubmissions();
    if (!this.prisma) throw new Error('Prisma service not available');

    await this.prisma.leaderboard.create({
      data: {
        id: 'scenario-leaderboard',
        userId: result.user.id,
        tenantId: 'test-tenant-1',
        score: 90,
        rank: 1,
      },
    });

    return result;
  }

  private async createAdminUser(): Promise<any> {
    if (!this.prisma) throw new Error('Prisma service not available');

    return this.prisma.user.create({
      data: {
        id: 'admin-user',
        email: 'admin@test.com',
        firstName: 'Admin',
        lastName: 'User',
        tenantId: 'test-tenant-1',
        status: 'ACTIVE',
        role: 'ADMIN',
      },
    });
  }
}
