import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './app.module';
import { PrismaService } from './adapters/database/prisma.service';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ErrorHandlerService } from './common/errors/error-handler.service';

describe('App (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same configuration as main.ts
    app.useGlobalPipes(new ValidationPipe({
      transformOptions: { enableImplicitConversion: true },
    }));

    const errorHandler = app.get(ErrorHandlerService);
    app.useGlobalFilters(new HttpExceptionFilter(errorHandler));
    app.useGlobalInterceptors(
      new LoggingInterceptor(),
      new TransformInterceptor(),
    );

    await app.init();

    prisma = app.get(PrismaService);
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    // Clean and seed database before each test
    await cleanDatabase(prisma);
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Endpoints', () => {
    describe('GET /health', () => {
      it('should return basic health status', async () => {
        const response = await request(server)
          .get('/health')
          .expect(200);

        expect(response.body.status).toBe('ok');
        expect(response.body.uptime).toBeDefined();
        expect(response.body.version).toBeDefined();
        expect(response.body.environment).toBeDefined();
      });
    });

    describe('GET /ready', () => {
      it('should return readiness status', async () => {
        const response = await request(server)
          .get('/ready')
          .expect(200);

        expect(response.body.status).toBe('ready');
        expect(response.body.uptime).toBeDefined();
      });
    });

    describe('GET /api/v1/health', () => {
      it('should return health check with database status', async () => {
        const response = await request(server)
          .get('/api/v1/health')
          .expect(200);

        expect(response.body.status).toBe('ok');
        expect(response.body.info).toBeDefined();
        expect(response.body.details).toBeDefined();
      });
    });

    describe('GET /api/v1/health/detailed', () => {
      it('should return comprehensive health status', async () => {
        const response = await request(server)
          .get('/api/v1/health/detailed')
          .expect(200);

        expect(response.body.status).toBeDefined();
        expect(response.body.timestamp).toBeDefined();
        expect(response.body.uptime).toBeDefined();
        expect(response.body.checks).toBeDefined();
        expect(response.body.checks.database).toBeDefined();
        expect(response.body.checks.redis).toBeDefined();
        expect(response.body.checks.memory).toBeDefined();
      });
    });

    describe('GET /api/v1/health/config', () => {
      it('should return configuration validation status', async () => {
        const response = await request(server)
          .get('/api/v1/health/config')
          .expect(200);

        expect(response.body.isValid).toBeDefined();
        expect(response.body.errors).toBeDefined();
        expect(response.body.warnings).toBeDefined();
        expect(response.body.recommendations).toBeDefined();
      });
    });

    describe('GET /api/v1/health/metrics', () => {
      it('should return application metrics', async () => {
        const response = await request(server)
          .get('/api/v1/health/metrics')
          .expect(200);

        expect(response.body.memory).toBeDefined();
        expect(response.body.uptime).toBeDefined();
        expect(response.body.pid).toBeDefined();
        expect(response.body.nodeVersion).toBeDefined();
      });
    });
  });

  describe('API Endpoints', () => {
    let accessToken: string;
    let testUser: any;

    beforeEach(async () => {
      // Register and login a test user for authenticated requests
      const registerData = {
        email: 'e2e-test@example.com',
        firstName: 'E2E',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const registerResponse = await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      accessToken = registerResponse.body.data.accessToken;
      testUser = registerResponse.body.data.user;
    });

    describe('Authentication Flow', () => {
      it('should complete full authentication flow', async () => {
        // 1. Register
        const registerData = {
          email: 'full-flow@example.com',
          firstName: 'Full',
          lastName: 'Flow',
          password: 'SecurePass123!',
          confirmPassword: 'SecurePass123!',
        };

        const registerResponse = await request(server)
          .post('/api/v1/auth/register')
          .send(registerData)
          .expect(201);

        expect(registerResponse.body.data.accessToken).toBeDefined();
        expect(registerResponse.body.data.refreshToken).toBeDefined();

        const flowAccessToken = registerResponse.body.data.accessToken;
        const flowRefreshToken = registerResponse.body.data.refreshToken;

        // 2. Get profile
        const profileResponse = await request(server)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${flowAccessToken}`)
          .expect(200);

        expect(profileResponse.body.data.email).toBe('full-flow@example.com');

        // 3. Refresh token
        const refreshResponse = await request(server)
          .post('/api/v1/auth/refresh')
          .send({ refreshToken: flowRefreshToken })
          .expect(200);

        expect(refreshResponse.body.data.accessToken).toBeDefined();
        expect(refreshResponse.body.data.refreshToken).toBeDefined();

        const newAccessToken = refreshResponse.body.data.accessToken;

        // 4. Logout
        await request(server)
          .post('/api/v1/auth/logout')
          .set('Authorization', `Bearer ${newAccessToken}`)
          .send({ refreshToken: refreshResponse.body.data.refreshToken })
          .expect(200);

        // 5. Verify logout - should not be able to access protected endpoint
        await request(server)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${newAccessToken}`)
          .expect(401);
      });
    });

    describe('User Management', () => {
      it('should get user profile', async () => {
        const response = await request(server)
          .get('/api/v1/auth/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data.id).toBe(testUser.id);
        expect(response.body.data.email).toBe(testUser.email);
      });

      it('should update user profile', async () => {
        const updateData = {
          firstName: 'Updated',
          lastName: 'Name',
        };

        const response = await request(server)
          .patch('/api/v1/auth/me')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updateData)
          .expect(200);

        expect(response.body.data.firstName).toBe('Updated');
        expect(response.body.data.lastName).toBe('Name');
      });
    });

    describe('Projects', () => {
      it('should get projects list', async () => {
        const response = await request(server)
          .get('/api/v1/projects')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should create a project', async () => {
        const projectData = {
          name: 'E2E Test Project',
          description: 'Created during E2E testing',
          category: 'WEB',
          difficulty: 'EASY',
          points: 50,
          tags: ['e2e', 'test'],
        };

        const response = await request(server)
          .post('/api/v1/projects')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(projectData)
          .expect(201);

        expect(response.body.data.name).toBe('E2E Test Project');
        expect(response.body.data.description).toBe('Created during E2E testing');
        expect(response.body.data.category).toBe('WEB');
      });

      it('should validate project creation', async () => {
        const invalidData = {
          name: '', // Invalid: empty name
          category: 'INVALID_CATEGORY',
        };

        const response = await request(server)
          .post('/api/v1/projects')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body).toHaveValidationErrors();
      });
    });

    describe('Submissions', () => {
      let projectId: string;

      beforeEach(async () => {
        // Create a test project for submissions
        const projectData = {
          name: 'Submission Test Project',
          description: 'Project for testing submissions',
          category: 'WEB',
          difficulty: 'EASY',
          points: 100,
          tags: ['test'],
        };

        const projectResponse = await request(server)
          .post('/api/v1/projects')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(projectData)
          .expect(201);

        projectId = projectResponse.body.data.id;
      });

      it('should create a submission', async () => {
        const submissionData = {
          projectId,
          evidenceUrls: ['https://example.com/evidence1.jpg'],
          notes: 'Test submission evidence',
        };

        const response = await request(server)
          .post('/api/v1/submissions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(submissionData)
          .expect(201);

        expect(response.body.data.projectId).toBe(projectId);
        expect(response.body.data.status).toBe('PENDING');
        expect(response.body.data.evidenceUrls).toContain('https://example.com/evidence1.jpg');
      });

      it('should get user submissions', async () => {
        // Create a submission first
        const submissionData = {
          projectId,
          evidenceUrls: ['https://example.com/evidence.jpg'],
        };

        await request(server)
          .post('/api/v1/submissions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(submissionData)
          .expect(201);

        // Get submissions
        const response = await request(server)
          .get('/api/v1/submissions')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data.length).toBeGreaterThan(0);
      });

      it('should validate submission data', async () => {
        const invalidData = {
          projectId: 'non-existent-project-id',
          evidenceUrls: [], // Invalid: empty evidence
        };

        const response = await request(server)
          .post('/api/v1/submissions')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(invalidData)
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body).toHaveValidationErrors();
      });
    });

    describe('Leaderboard', () => {
      it('should get leaderboard', async () => {
        const response = await request(server)
          .get('/api/v1/leaderboard')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      });

      it('should support pagination', async () => {
        const response = await request(server)
          .get('/api/v1/leaderboard?page=1&limit=10')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(response.body).toBePaginatedResponse();
      });
    });

    describe('Badges', () => {
      it('should get user badges', async () => {
        const response = await request(server)
          .get('/api/v1/badges')
          .set('Authorization', `Bearer ${accessToken}`)
          .expect(200);

        expect(response.body.data).toBeDefined();
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle 404 errors gracefully', async () => {
      const response = await request(server)
        .get('/api/v1/non-existent-endpoint')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Not Found');
      expect(response.body.message).toBeDefined();
    });

    it('should handle validation errors', async () => {
      const response = await request(server)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveValidationErrors();
      expect(response.body.errors).toBeDefined();
    });

    it('should handle authentication errors', async () => {
      const response = await request(server)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });

    it('should handle malformed JSON', async () => {
      const response = await request(server)
        .post('/api/v1/auth/login')
        .set('Content-Type', 'application/json')
        .send('{invalid json}')
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Security', () => {
    it('should include security headers', async () => {
      const response = await request(server)
        .get('/api/v1/health')
        .expect(200);

      // Check security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-request-id']).toBeDefined();
    });

    it('should prevent SQL injection attempts', async () => {
      const maliciousData = {
        email: "'; DROP TABLE users; --",
        firstName: 'Hacker',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(maliciousData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should validate request size limits', async () => {
      const largeData = {
        email: 'large@example.com',
        firstName: 'Large',
        lastName: 'Data',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
        // Add large payload to test size limits
        notes: 'x'.repeat(100000), // 100KB of data
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(largeData)
        .expect(response => {
          // Should either succeed (if under limit) or fail with appropriate error
          expect([200, 413, 400]).toContain(response.status);
        });
    });
  });

  describe('Performance', () => {
    it('should respond within reasonable time', async () => {
      const startTime = Date.now();

      await request(server)
        .get('/api/v1/health')
        .expect(200);

      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(1000); // Should respond within 1 second
    });

    it('should handle concurrent requests', async () => {
      const promises = Array(10).fill().map(() =>
        request(server)
          .get('/api/v1/health')
          .expect(200)
      );

      const responses = await Promise.all(promises);

      responses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
      });
    });
  });

  describe('API Documentation', () => {
    it('should serve Swagger documentation', async () => {
      const response = await request(server)
        .get('/api/docs')
        .expect(200);

      expect(response.text).toContain('swagger');
      expect(response.text).toContain('VulHub Leaderboard API');
    });
  });
});

// Helper functions
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

async function seedDatabase(prisma: PrismaService) {
  // Create test tenant
  await prisma.tenant.create({
    data: {
      id: 'test-tenant-id',
      name: 'Test Tenant',
      domain: 'test.example.com',
      isActive: true,
    },
  });

  // Create test admin user
  await prisma.user.create({
    data: {
      id: 'admin-user-id',
      email: 'admin@test.com',
      firstName: 'Admin',
      lastName: 'User',
      tenantId: 'test-tenant-id',
      status: 'ACTIVE',
      role: 'ADMIN',
    },
  });
}
