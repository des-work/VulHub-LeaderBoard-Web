import 'reflect-metadata';
import { TestUtils } from './test-utils';

// Increase Jest timeout for integration tests
jest.setTimeout(30000);

// Setup global test environment
beforeAll(async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./test.db';
  process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost';
  process.env.REDIS_PORT = process.env.REDIS_PORT || '6379';
  process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret-key';
  process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret-key';

  // Global test setup
  console.log('🧪 Setting up test environment...');
});

// Cleanup after all tests
afterAll(async () => {
  console.log('🧹 Cleaning up test environment...');

  // Reset environment variables
  delete process.env.NODE_ENV;
  delete process.env.DATABASE_URL;
  delete process.env.REDIS_HOST;
  delete process.env.REDIS_PORT;
  delete process.env.JWT_SECRET;
  delete process.env.JWT_REFRESH_SECRET;
});

// Setup for each test file
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset modules to ensure clean state
  jest.resetModules();

  // Clear console spies if any
  if (console.log['mockRestore']) {
    console.log.mockRestore();
  }
  if (console.error['mockRestore']) {
    console.error.mockRestore();
  }
  if (console.warn['mockRestore']) {
    console.warn.mockRestore();
  }
});

// Custom matchers
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid UUID`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid UUID`,
        pass: false,
      };
    }
  },

  toBeValidEmail(received) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pass = emailRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid email`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid email`,
        pass: false,
      };
    }
  },

  toBeValidDate(received) {
    const pass = received instanceof Date && !isNaN(received.getTime());

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid Date`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid Date`,
        pass: false,
      };
    }
  },

  toBeValidJWT(received) {
    // Basic JWT structure validation (header.payload.signature)
    const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
    const pass = typeof received === 'string' && jwtRegex.test(received);

    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },

  toHaveStatus(received, expectedStatus) {
    const pass = received.status === expectedStatus;

    if (pass) {
      return {
        message: () => `expected response not to have status ${expectedStatus}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have status ${expectedStatus}, but got ${received.status}`,
        pass: false,
      };
    }
  },

  toHaveErrorCode(received, expectedCode) {
    const pass = received.error === expectedCode;

    if (pass) {
      return {
        message: () => `expected response not to have error code ${expectedCode}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have error code ${expectedCode}, but got ${received.error}`,
        pass: false,
      };
    }
  },

  toHaveValidationErrors(received) {
    const pass = received.errors && Array.isArray(received.errors) && received.errors.length > 0;

    if (pass) {
      return {
        message: () => `expected response not to have validation errors`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have validation errors`,
        pass: false,
      };
    }
  },

  toBePaginatedResponse(received) {
    const hasData = Array.isArray(received.data);
    const hasPagination = received.pagination &&
                        typeof received.pagination === 'object' &&
                        typeof received.pagination.page === 'number' &&
                        typeof received.pagination.limit === 'number' &&
                        typeof received.pagination.total === 'number';

    const pass = hasData && hasPagination;

    if (pass) {
      return {
        message: () => `expected response not to be paginated`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to be paginated with data array and pagination object`,
        pass: false,
      };
    }
  },

  toHaveRateLimitHeaders(received) {
    const hasLimit = received.headers['x-ratelimit-limit'];
    const hasRemaining = received.headers['x-ratelimit-remaining'];
    const hasReset = received.headers['x-ratelimit-reset'];

    const pass = hasLimit && hasRemaining && hasReset;

    if (pass) {
      return {
        message: () => `expected response not to have rate limit headers`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected response to have rate limit headers (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)`,
        pass: false,
      };
    }
  },
});

// Global test utilities
global.testUtils = TestUtils;

// Performance testing utilities
global.measurePerformance = async (fn: () => Promise<any>) => {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1e6; // Convert to milliseconds

  return { result, duration };
};

// Memory usage testing utilities
global.measureMemoryUsage = async (fn: () => Promise<any>) => {
  const startMemory = process.memoryUsage();
  const result = await fn();
  const endMemory = process.memoryUsage();

  const memoryDiff = {
    heapUsed: endMemory.heapUsed - startMemory.heapUsed,
    heapTotal: endMemory.heapTotal - startMemory.heapTotal,
    external: endMemory.external - startMemory.external,
    rss: endMemory.rss - startMemory.rss,
  };

  return { result, memoryDiff };
};

// Mock factories
global.createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  role: 'STUDENT',
  status: 'ACTIVE',
  tenantId: 'test-tenant-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

global.createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  description: 'Test project description',
  category: 'WEB',
  difficulty: 'EASY',
  points: 100,
  isActive: true,
  isPublic: true,
  tags: ['test'],
  tenantId: 'test-tenant-id',
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

global.createMockSubmission = (overrides = {}) => ({
  id: 'test-submission-id',
  projectId: 'test-project-id',
  userId: 'test-user-id',
  tenantId: 'test-tenant-id',
  status: 'PENDING',
  score: null,
  feedback: null,
  evidenceUrls: [],
  submittedAt: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

// Test database helpers
global.cleanDatabase = async (prisma) => {
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

  for (const table of tables) {
    try {
      await prisma[table.toLowerCase()].deleteMany();
    } catch (error) {
      // Table might not exist, continue
    }
  }
};

global.seedDatabase = async (prisma) => {
  // Create test tenant
  await prisma.tenant.create({
    data: {
      id: 'test-tenant-id',
      name: 'Test Tenant',
      domain: 'test.example.com',
      isActive: true,
    },
  });

  // Create test user
  await prisma.user.create({
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

  // Create test project
  await prisma.project.create({
    data: {
      id: 'test-project-id',
      name: 'Test Project',
      description: 'Test project description',
      category: 'WEB',
      difficulty: 'EASY',
      points: 100,
      isActive: true,
      isPublic: true,
      tags: ['test'],
      tenantId: 'test-tenant-id',
    },
  });
};
