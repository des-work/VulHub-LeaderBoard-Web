import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { CacheService } from '../services/cache.service';
import { PerformanceService } from '../services/performance.service';
import { DomainEventPublisherService } from '../events/domain-event-publisher.service';
import { EventStoreService } from '../events/event-store.service';

export class TestUtils {
  /**
   * Create a test module with mocked dependencies
   */
  static async createTestModule(providers: any[] = []): Promise<TestingModule> {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      submission: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      badge: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      userBadge: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      leaderboard: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      eventStore: {
        findMany: jest.fn(),
        create: jest.fn(),
        count: jest.fn(),
      },
      $queryRaw: jest.fn(),
      $transaction: jest.fn(),
      $connect: jest.fn(),
      $disconnect: jest.fn(),
    };

    const mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
      setex: jest.fn(),
      del: jest.fn(),
      keys: jest.fn(),
      exists: jest.fn(),
      incr: jest.fn(),
      ping: jest.fn(),
    };

    const mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn(),
      getOrSet: jest.fn(),
      delPattern: jest.fn(),
      invalidatePattern: jest.fn(),
    };

    const mockPerformanceService = {
      recordMetrics: jest.fn(),
      getCurrentMetrics: jest.fn(),
      getPerformanceSummary: jest.fn(),
      getPerformanceTrends: jest.fn(),
    };

    const mockEventPublisher = {
      publish: jest.fn(),
      publishMany: jest.fn(),
      registerSubscriber: jest.fn(),
    };

    const mockEventStore = {
      saveEvents: jest.fn(),
      getEvents: jest.fn(),
      getEventsByType: jest.fn(),
      getEventsByTenant: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        ...providers,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: RedisService, useValue: mockRedisService },
        { provide: CacheService, useValue: mockCacheService },
        { provide: PerformanceService, useValue: mockPerformanceService },
        { provide: DomainEventPublisherService, useValue: mockEventPublisher },
        { provide: EventStoreService, useValue: mockEventStore },
      ],
    }).compile();

    return module;
  }

  /**
   * Create test data factories
   */
  static createTestUser(overrides: any = {}) {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User',
      tenantId: 'test-tenant-id',
      status: 'ACTIVE',
      role: 'STUDENT',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createTestProject(overrides: any = {}) {
    return {
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
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createTestSubmission(overrides: any = {}) {
    return {
      id: 'test-submission-id',
      projectId: 'test-project-id',
      userId: 'test-user-id',
      tenantId: 'test-tenant-id',
      status: 'PENDING',
      score: null,
      feedback: null,
      evidenceUrls: [],
      submittedAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  static createTestBadge(overrides: any = {}) {
    return {
      id: 'test-badge-id',
      name: 'Test Badge',
      description: 'Test badge description',
      icon: 'test-icon.png',
      category: 'ACHIEVEMENT',
      difficulty: 'EASY',
      criteria: { type: 'submission_count', value: 5 },
      isActive: true,
      tenantId: 'test-tenant-id',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    };
  }

  /**
   * Create test domain events
   */
  static createTestDomainEvent(type: string, overrides: any = {}) {
    return {
      eventId: 'test-event-id',
      eventType: type,
      aggregateId: 'test-aggregate-id',
      aggregateType: 'Test',
      eventData: { test: 'data' },
      occurredOn: new Date(),
      version: 1,
      tenantId: 'test-tenant-id',
      ...overrides,
    };
  }

  /**
   * Mock Prisma responses
   */
  static mockPrismaResponse(service: any, method: string, response: any) {
    service[method].mockResolvedValue(response);
  }

  /**
   * Mock Redis responses
   */
  static mockRedisResponse(service: any, method: string, response: any) {
    service[method].mockResolvedValue(response);
  }

  /**
   * Create test database transaction
   */
  static createTestTransaction() {
    return {
      user: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      project: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      submission: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      badge: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      userBadge: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      leaderboard: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      eventStore: {
        findMany: jest.fn(),
        create: jest.fn(),
      },
      $queryRaw: jest.fn(),
    };
  }

  /**
   * Create test error scenarios
   */
  static createTestError(type: string, message: string) {
    const error = new Error(message);
    error.name = type;
    return error;
  }

  /**
   * Create test performance metrics
   */
  static createTestMetrics() {
    return {
      responseTime: 150,
      memoryUsage: 50 * 1024 * 1024, // 50MB
      cpuUsage: 25,
      errorRate: 0.01,
      throughput: 100,
    };
  }

  /**
   * Create test cache data
   */
  static createTestCacheData(key: string, value: any, ttl: number = 3600) {
    return {
      key,
      value,
      ttl,
      timestamp: new Date(),
    };
  }

  /**
   * Create test WebSocket client
   */
  static createTestWebSocketClient() {
    return {
      id: 'test-client-id',
      userId: 'test-user-id',
      tenantId: 'test-tenant-id',
      join: jest.fn(),
      leave: jest.fn(),
      emit: jest.fn(),
      disconnect: jest.fn(),
    };
  }

  /**
   * Create test HTTP request
   */
  static createTestRequest(overrides: any = {}) {
    return {
      method: 'GET',
      url: '/api/test',
      headers: {
        'content-type': 'application/json',
        'authorization': 'Bearer test-token',
      },
      body: {},
      params: {},
      query: {},
      user: {
        id: 'test-user-id',
        email: 'test@example.com',
        tenantId: 'test-tenant-id',
      },
      ...overrides,
    };
  }

  /**
   * Create test HTTP response
   */
  static createTestResponse() {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      send: jest.fn().mockReturnThis(),
      setHeader: jest.fn().mockReturnThis(),
      getHeader: jest.fn(),
    };
  }

  /**
   * Create test context
   */
  static createTestContext(overrides: any = {}) {
    return {
      userId: 'test-user-id',
      tenantId: 'test-tenant-id',
      operation: 'test-operation',
      resource: 'test-resource',
      metadata: { test: 'data' },
      ...overrides,
    };
  }

  /**
   * Wait for async operations
   */
  static async waitFor(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Create test environment variables
   */
  static createTestEnv() {
    return {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      REDIS_HOST: 'localhost',
      REDIS_PORT: '6379',
      JWT_SECRET: 'test-secret',
      JWT_EXPIRES_IN: '1h',
      CORS_ORIGIN: 'http://localhost:3000',
    };
  }
}
