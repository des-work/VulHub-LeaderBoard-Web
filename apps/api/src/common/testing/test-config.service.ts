import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface TestConfig {
  environment: 'test' | 'development' | 'production';
  database: {
    url: string;
    resetOnStart: boolean;
    seedData: boolean;
  };
  redis: {
    host: string;
    port: number;
    db: number;
  };
  api: {
    baseUrl: string;
    timeout: number;
  };
  testData: {
    users: any[];
    projects: any[];
    submissions: any[];
  };
}

@Injectable()
export class TestConfigService {
  private readonly logger = new Logger(TestConfigService.name);
  private config: TestConfig;

  constructor(private configService: ConfigService) {
    this.validateTestEnvironment();
    this.loadTestConfig();
  }

  /**
   * Validate that we're running in a proper test environment
   */
  private validateTestEnvironment(): void {
    const nodeEnv = process.env.NODE_ENV;
    if (nodeEnv !== 'test') {
      this.logger.warn(`Running tests in ${nodeEnv} environment. Consider setting NODE_ENV=test`);
    }

    // Check for test-specific environment variables
    const requiredVars = ['DATABASE_URL'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);

    if (missingVars.length > 0) {
      this.logger.warn(`Missing test environment variables: ${missingVars.join(', ')}`);
    }
  }

  private loadTestConfig(): void {
    this.config = {
      environment: this.configService.get('NODE_ENV', 'test') as any,
      database: {
        url: this.configService.get('TEST_DATABASE_URL', 'postgresql://test:test@localhost:5432/vulhub_test'),
        resetOnStart: this.configService.get('TEST_DB_RESET_ON_START', 'true') === 'true',
        seedData: this.configService.get('TEST_DB_SEED_DATA', 'true') === 'true',
      },
      redis: {
        host: this.configService.get('TEST_REDIS_HOST', 'localhost'),
        port: parseInt(this.configService.get('TEST_REDIS_PORT', '6379')),
        db: parseInt(this.configService.get('TEST_REDIS_DB', '1')),
      },
      api: {
        baseUrl: this.configService.get('TEST_API_BASE_URL', 'http://localhost:4000'),
        timeout: parseInt(this.configService.get('TEST_API_TIMEOUT', '30000')),
      },
      testData: {
        users: this.getTestUsers(),
        projects: this.getTestProjects(),
        submissions: this.getTestSubmissions(),
      },
    };

    this.logger.log('Test configuration loaded successfully');
  }

  getConfig(): TestConfig {
    return this.config;
  }

  getDatabaseConfig() {
    return this.config.database;
  }

  getRedisConfig() {
    return this.config.redis;
  }

  getApiConfig() {
    return this.config.api;
  }

  getTestData() {
    return this.config.testData;
  }

  private getTestUsers(): any[] {
    return [
      {
        id: 'test-user-1',
        email: 'test1@example.com',
        firstName: 'Test',
        lastName: 'User1',
        role: 'STUDENT',
        status: 'ACTIVE',
        tenantId: 'test-tenant-1',
      },
      {
        id: 'test-user-2',
        email: 'test2@example.com',
        firstName: 'Test',
        lastName: 'User2',
        role: 'INSTRUCTOR',
        status: 'ACTIVE',
        tenantId: 'test-tenant-1',
      },
      {
        id: 'test-user-3',
        email: 'test3@example.com',
        firstName: 'Test',
        lastName: 'User3',
        role: 'ADMIN',
        status: 'ACTIVE',
        tenantId: 'test-tenant-1',
      },
    ];
  }

  private getTestProjects(): any[] {
    return [
      {
        id: 'test-project-1',
        name: 'Test Project 1',
        description: 'A test project for unit testing',
        category: 'Web Application',
        difficulty: 'Easy',
        points: 100,
        isActive: true,
        isPublic: true,
        tenantId: 'test-tenant-1',
      },
      {
        id: 'test-project-2',
        name: 'Test Project 2',
        description: 'Another test project for integration testing',
        category: 'Network Security',
        difficulty: 'Medium',
        points: 200,
        isActive: true,
        isPublic: true,
        tenantId: 'test-tenant-1',
      },
    ];
  }

  private getTestSubmissions(): any[] {
    return [
      {
        id: 'test-submission-1',
        projectId: 'test-project-1',
        userId: 'test-user-1',
        status: 'PENDING',
        evidenceUrls: ['https://example.com/evidence1.jpg'],
        tenantId: 'test-tenant-1',
      },
      {
        id: 'test-submission-2',
        projectId: 'test-project-2',
        userId: 'test-user-1',
        status: 'APPROVED',
        score: 85,
        feedback: 'Good work!',
        tenantId: 'test-tenant-1',
      },
    ];
  }
}
