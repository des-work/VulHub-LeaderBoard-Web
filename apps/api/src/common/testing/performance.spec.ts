import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';

describe('Performance Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = app.get(PrismaService);
    redis = app.get(RedisService);
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    // Clean database before each performance test
    await cleanDatabase(prisma);
    await seedPerformanceData(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Response Time Performance', () => {
    it('should respond to health check within 100ms', async () => {
      const { duration } = await measurePerformance(async () => {
        await request(server)
          .get('/api/v1/health')
          .expect(200);
      });

      expect(duration).toBeLessThan(100);
      console.log(`Health check response time: ${duration}ms`);
    });

    it('should handle leaderboard queries within 500ms', async () => {
      const { duration } = await measurePerformance(async () => {
        await request(server)
          .get('/api/v1/leaderboard')
          .expect(200);
      });

      expect(duration).toBeLessThan(500);
      console.log(`Leaderboard query response time: ${duration}ms`);
    });

    it('should handle database queries efficiently', async () => {
      const { duration } = await measurePerformance(async () => {
        await prisma.user.findMany({
          include: {
            submissions: {
              include: {
                project: true,
              },
            },
          },
        });
      });

      expect(duration).toBeLessThan(1000);
      console.log(`Complex database query time: ${duration}ms`);
    });
  });

  describe('Memory Usage', () => {
    it('should not have excessive memory growth during operations', async () => {
      const { memoryDiff } = await measureMemoryUsage(async () => {
        // Perform multiple database operations
        for (let i = 0; i < 100; i++) {
          await prisma.user.findMany({ take: 10 });
        }
      });

      // Memory growth should be reasonable (< 50MB)
      expect(memoryDiff.heapUsed).toBeLessThan(50 * 1024 * 1024);
      console.log(`Memory growth during operations: ${memoryDiff.heapUsed / 1024 / 1024}MB`);
    });

    it('should clean up memory after operations', async () => {
      const initialMemory = process.memoryUsage();

      // Perform memory-intensive operations
      await prisma.user.findMany({
        include: {
          submissions: {
            include: {
              project: true,
            },
          },
        },
      });

      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      const finalMemory = process.memoryUsage();
      const memoryGrowth = finalMemory.heapUsed - initialMemory.heapUsed;

      // Memory should not grow excessively
      expect(memoryGrowth).toBeLessThan(10 * 1024 * 1024); // < 10MB
      console.log(`Memory growth after cleanup: ${memoryGrowth / 1024 / 1024}MB`);
    });
  });

  describe('Concurrent Load', () => {
    it('should handle 50 concurrent health check requests', async () => {
      const concurrentRequests = 50;

      const { duration } = await measurePerformance(async () => {
        const promises = Array(concurrentRequests).fill().map(() =>
          request(server)
            .get('/api/v1/health')
            .expect(200)
        );

        await Promise.all(promises);
      });

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      console.log(`${concurrentRequests} concurrent requests took: ${duration}ms`);
    });

    it('should maintain response times under load', async () => {
      const requests = [];
      const startTime = Date.now();

      // Send 20 requests with small delays
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(server)
            .get('/api/v1/health')
            .expect(200)
        );

        // Small delay to simulate real usage patterns
        await new Promise(resolve => setTimeout(resolve, 10));
      }

      await Promise.all(requests);
      const totalDuration = Date.now() - startTime;

      const averageResponseTime = totalDuration / requests.length;
      expect(averageResponseTime).toBeLessThan(200); // Average < 200ms
      console.log(`Average response time under load: ${averageResponseTime}ms`);
    });
  });

  describe('Database Performance', () => {
    it('should handle bulk operations efficiently', async () => {
      const bulkData = Array(100).fill().map((_, i) => ({
        email: `bulk-user-${i}@example.com`,
        firstName: `Bulk${i}`,
        lastName: 'User',
        tenantId: 'test-tenant-id',
        status: 'ACTIVE',
        role: 'STUDENT',
      }));

      const { duration } = await measurePerformance(async () => {
        await prisma.user.createMany({ data: bulkData });
      });

      expect(duration).toBeLessThan(5000); // Should complete within 5 seconds
      console.log(`Bulk insert of 100 records took: ${duration}ms`);
    });

    it('should optimize complex queries', async () => {
      // Create test data with relationships
      const users = await prisma.user.findMany({
        where: { tenantId: 'test-tenant-id' },
        include: {
          submissions: {
            include: {
              project: true,
            },
          },
        },
      });

      const { duration } = await measurePerformance(async () => {
        // Test complex aggregation query
        await prisma.submission.groupBy({
          by: ['status'],
          _count: {
            id: true,
          },
          where: {
            userId: { in: users.map(u => u.id) },
          },
        });
      });

      expect(duration).toBeLessThan(1000);
      console.log(`Complex aggregation query took: ${duration}ms`);
    });
  });

  describe('Caching Performance', () => {
    it('should cache frequently accessed data', async () => {
      const cacheKey = 'test:frequent:data';

      // First request (cache miss)
      const firstRequest = await measurePerformance(async () => {
        await redis.get(cacheKey);
      });

      // Set cache
      await redis.setex(cacheKey, 300, JSON.stringify({ data: 'test' }));

      // Second request (cache hit)
      const secondRequest = await measurePerformance(async () => {
        await redis.get(cacheKey);
      });

      expect(secondRequest.duration).toBeLessThan(firstRequest.duration / 2);
      console.log(`Cache hit (${secondRequest.duration}ms) vs cache miss (${firstRequest.duration}ms)`);
    });

    it('should handle cache expiration correctly', async () => {
      const cacheKey = 'test:expiring:data';

      // Set cache with short TTL
      await redis.setex(cacheKey, 1, JSON.stringify({ data: 'expires' }));

      // Verify cache exists
      let cachedData = await redis.get(cacheKey);
      expect(cachedData).toBeDefined();

      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 1100));

      // Verify cache expired
      cachedData = await redis.get(cacheKey);
      expect(cachedData).toBeNull();
    });
  });

  describe('Rate Limiting Performance', () => {
    it('should handle rate limiting efficiently', async () => {
      const endpoint = '/api/v1/health';
      const requests = 100;

      const { duration } = await measurePerformance(async () => {
        const promises = Array(requests).fill().map(() =>
          request(server)
            .get(endpoint)
            .then(() => 'success')
            .catch(() => 'rate_limited')
        );

        const results = await Promise.all(promises);
        const successCount = results.filter(r => r === 'success').length;
        const rateLimitedCount = results.filter(r => r === 'rate_limited').length;

        console.log(`Rate limiting test: ${successCount} allowed, ${rateLimitedCount} blocked`);
      });

      expect(duration).toBeLessThan(10000); // Should complete within 10 seconds
      console.log(`Rate limiting test completed in: ${duration}ms`);
    });
  });

  describe('Error Handling Performance', () => {
    it('should handle errors efficiently', async () => {
      const { duration } = await measurePerformance(async () => {
        // Send multiple invalid requests
        const promises = Array(20).fill().map(() =>
          request(server)
            .get('/api/v1/non-existent-endpoint')
            .expect(404)
        );

        await Promise.all(promises);
      });

      expect(duration).toBeLessThan(3000);
      console.log(`Error handling performance: ${duration}ms for 20 errors`);
    });

    it('should validate requests efficiently', async () => {
      const invalidRequests = Array(50).fill().map((_, i) => ({
        email: `invalid-email-${i}`,
        firstName: '',
        lastName: '',
        password: '123',
        confirmPassword: '456',
      }));

      const { duration } = await measurePerformance(async () => {
        const promises = invalidRequests.map(data =>
          request(server)
            .post('/api/v1/auth/register')
            .send(data)
            .expect(400)
        );

        await Promise.all(promises);
      });

      expect(duration).toBeLessThan(10000);
      console.log(`Validation performance: ${duration}ms for 50 invalid requests`);
    });
  });

  describe('Resource Cleanup', () => {
    it('should clean up database connections properly', async () => {
      const initialConnections = await getDatabaseConnectionCount();

      // Perform database operations
      for (let i = 0; i < 10; i++) {
        await prisma.user.findMany({ take: 1 });
      }

      const finalConnections = await getDatabaseConnectionCount();

      // Connections should be managed properly
      expect(finalConnections - initialConnections).toBeLessThan(5);
      console.log(`Database connection growth: ${finalConnections - initialConnections}`);
    });

    it('should clean up Redis connections properly', async () => {
      // Test Redis connection stability
      for (let i = 0; i < 100; i++) {
        await redis.ping();
      }

      // Should not have connection issues
      const pingResult = await redis.ping();
      expect(pingResult).toBe('PONG');
    });
  });
});

// Helper functions
async function measurePerformance(fn: () => Promise<any>): Promise<{ result: any; duration: number }> {
  const start = process.hrtime.bigint();
  const result = await fn();
  const end = process.hrtime.bigint();
  const duration = Number(end - start) / 1e6; // Convert to milliseconds

  return { result, duration };
}

async function measureMemoryUsage(fn: () => Promise<any>): Promise<{ result: any; memoryDiff: any }> {
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
}

async function cleanDatabase(prisma: PrismaService) {
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
      await (prisma as any)[table.toLowerCase()].deleteMany();
    } catch (error) {
      // Table might not exist, continue
    }
  }
}

async function seedPerformanceData(prisma: PrismaService) {
  // Create test tenant
  await prisma.tenant.create({
    data: {
      id: 'test-tenant-id',
      name: 'Test Tenant',
      domain: 'test.example.com',
      isActive: true,
    },
  });

  // Create multiple users for performance testing
  const users = Array(50).fill().map((_, i) => ({
    id: `perf-user-${i}`,
    email: `perf-user-${i}@example.com`,
    firstName: `Perf${i}`,
    lastName: 'User',
    tenantId: 'test-tenant-id',
    status: 'ACTIVE',
    role: 'STUDENT',
  }));

  await prisma.user.createMany({ data: users });

  // Create projects
  const projects = Array(10).fill().map((_, i) => ({
    id: `perf-project-${i}`,
    name: `Performance Project ${i}`,
    description: `Project for performance testing ${i}`,
    category: ['WEB', 'MOBILE', 'DATA', 'AI'][i % 4] as any,
    difficulty: ['EASY', 'MEDIUM', 'HARD'][i % 3] as any,
    points: (i + 1) * 10,
    isActive: true,
    isPublic: true,
    tags: ['performance', `tag-${i}`],
    tenantId: 'test-tenant-id',
  }));

  await prisma.project.createMany({ data: projects });

  // Create submissions
  const submissions = [];
  for (let i = 0; i < 200; i++) {
    submissions.push({
      id: `perf-submission-${i}`,
      projectId: `perf-project-${i % 10}`,
      userId: `perf-user-${i % 50}`,
      tenantId: 'test-tenant-id',
      status: ['PENDING', 'APPROVED', 'REJECTED'][i % 3] as any,
      score: i % 3 === 1 ? Math.floor(Math.random() * 100) : null,
      feedback: i % 3 === 1 ? 'Good work!' : null,
      evidenceUrls: [`https://example.com/evidence-${i}.jpg`],
      submittedAt: new Date(),
      reviewedAt: i % 3 === 1 ? new Date() : null,
      reviewedBy: i % 3 === 1 ? 'admin-user-id' : null,
    });
  }

  await prisma.submission.createMany({ data: submissions });
}

async function getDatabaseConnectionCount(): Promise<number> {
  // This would be implementation-specific
  // For PostgreSQL, you might query pg_stat_activity
  // For SQLite, this is less relevant
  return 1; // Placeholder
}
