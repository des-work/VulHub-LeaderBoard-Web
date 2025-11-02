import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { HttpExceptionFilter } from '../../common/filters/http-exception.filter';
import { LoggingInterceptor } from '../../common/interceptors/logging.interceptor';
import { TransformInterceptor } from '../../common/interceptors/transform.interceptor';
import { ErrorHandlerService } from '../../common/errors/error-handler.service';

describe('AuthModule (Integration)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redis: RedisService;
  let server: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    // Apply the same pipes, filters, and interceptors as main.ts
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
    redis = app.get(RedisService);
    server = app.getHttpServer();
  });

  beforeEach(async () => {
    // Clean database before each test
    await cleanDatabase(prisma);
    await seedDatabase(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user.email).toBe('newuser@example.com');
      expect(response.body.data.user.firstName).toBe('New');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'test@example.com',
        // Missing firstName, lastName, password, confirmPassword
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveValidationErrors();
    });

    it('should validate email format', async () => {
      const invalidData = {
        email: 'invalid-email',
        firstName: 'Test',
        lastName: 'User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should validate password strength', async () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: '123', // Too short
        confirmPassword: '123',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should validate password confirmation', async () => {
      const invalidData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'SecurePass123!',
        confirmPassword: 'DifferentPass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('match');
    });

    it('should prevent duplicate email registration', async () => {
      // First registration
      const registerData = {
        email: 'duplicate@example.com',
        firstName: 'First',
        lastName: 'User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      // Second registration with same email
      const duplicateData = {
        email: 'duplicate@example.com',
        firstName: 'Second',
        lastName: 'User',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/register')
        .send(duplicateData)
        .expect(409); // Conflict

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Conflict');
    });
  });

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // Register a test user for login tests
      const registerData = {
        email: 'login@example.com',
        firstName: 'Login',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);
    });

    it('should login successfully with correct credentials', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.user.email).toBe('login@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should return valid JWT tokens', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.data.accessToken).toBeValidJWT();
      expect(response.body.data.refreshToken).toBeValidJWT();
    });

    it('should validate required fields', async () => {
      const invalidData = {
        email: 'login@example.com',
        // Missing password
      };

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveValidationErrors();
    });

    it('should reject invalid email', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'SecurePass123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });

    it('should reject wrong password', async () => {
      const loginData = {
        email: 'login@example.com',
        password: 'WrongPassword123!',
      };

      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });
  });

  describe('POST /auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      // Register and login to get refresh token
      const registerData = {
        email: 'refresh@example.com',
        firstName: 'Refresh',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      const loginData = {
        email: 'refresh@example.com',
        password: 'SecurePass123!',
      };

      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should refresh tokens with valid refresh token', async () => {
      const response = await request(server)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.accessToken).toBeValidJWT();
      expect(response.body.data.refreshToken).toBeValidJWT();
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(server)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });

    it('should validate required refresh token', async () => {
      const response = await request(server)
        .post('/api/v1/auth/refresh')
        .send({}) // Missing refreshToken
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveValidationErrors();
    });
  });

  describe('POST /auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      // Register and login to get tokens
      const registerData = {
        email: 'logout@example.com',
        firstName: 'Logout',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      const loginData = {
        email: 'logout@example.com',
        password: 'SecurePass123!',
      };

      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      accessToken = loginResponse.body.data.accessToken;
      refreshToken = loginResponse.body.data.refreshToken;
    });

    it('should logout successfully', async () => {
      const response = await request(server)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .post('/api/v1/auth/logout')
        .send({ refreshToken })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });

    it('should invalidate refresh token', async () => {
      // Logout first
      await request(server)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ refreshToken })
        .expect(200);

      // Try to refresh with the same token
      const refreshResponse = await request(server)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken })
        .expect(401);

      expect(refreshResponse.body.success).toBe(false);
    });
  });

  describe('GET /auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      // Register and login to get access token
      const registerData = {
        email: 'profile@example.com',
        firstName: 'Profile',
        lastName: 'Test',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      const loginData = {
        email: 'profile@example.com',
        password: 'SecurePass123!',
      };

      const loginResponse = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      accessToken = loginResponse.body.data.accessToken;
    });

    it('should return user profile', async () => {
      const response = await request(server)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
      expect(response.body.data.email).toBe('profile@example.com');
      expect(response.body.data.firstName).toBe('Profile');
      expect(response.body.data.lastName).toBe('Test');
    });

    it('should require authentication', async () => {
      const response = await request(server)
        .get('/api/v1/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });

    it('should reject expired tokens', async () => {
      // Mock an expired token by using an invalid one
      const response = await request(server)
        .get('/api/v1/auth/me')
        .set('Authorization', 'Bearer invalid-expired-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body).toHaveErrorCode('Unauthorized');
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const loginData = {
        email: 'ratelimit@example.com',
        password: 'SecurePass123!',
      };

      // Register first
      const registerData = {
        email: 'ratelimit@example.com',
        firstName: 'Rate',
        lastName: 'Limit',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      // Login request should include rate limit headers
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.headers).toHaveRateLimitHeaders();
    });

    it('should enforce rate limits for login attempts', async () => {
      const loginData = {
        email: 'ratelimit@example.com',
        password: 'WrongPassword123!',
      };

      // Register first
      const registerData = {
        email: 'ratelimit@example.com',
        firstName: 'Rate',
        lastName: 'Limit',
        password: 'SecurePass123!',
        confirmPassword: 'SecurePass123!',
      };

      await request(server)
        .post('/api/v1/auth/register')
        .send(registerData)
        .expect(201);

      // Make multiple failed login attempts
      for (let i = 0; i < 10; i++) {
        await request(server)
          .post('/api/v1/auth/login')
          .send(loginData)
          .expect(i < 5 ? 401 : 429); // First 5 should fail with 401, rest with 429
      }
    }, 60000); // Increase timeout for rate limiting test
  });

  describe('Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(server)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password',
        })
        .expect(401);

      // Check for common security headers
      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBeDefined();
      expect(response.headers['x-request-id']).toBeDefined();
      expect(response.headers['x-response-time']).toBeDefined();
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
}
