import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { TestConfigService } from '../../common/testing/test-config.service';
import { TestDatabaseService } from '../../common/testing/test-database.service';
import { TestUtilsService } from '../../common/testing/test-utils.service';

describe('Users Integration Tests', () => {
  let app: INestApplication;
  let testConfig: TestConfigService;
  let testDb: TestDatabaseService;
  let testUtils: TestUtilsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    
    testConfig = moduleFixture.get<TestConfigService>(TestConfigService);
    testDb = moduleFixture.get<TestDatabaseService>(TestDatabaseService);
    testUtils = moduleFixture.get<TestUtilsService>(TestUtilsService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await testDb.setupTestDatabase();
  });

  afterEach(async () => {
    await testDb.cleanupTestDatabase();
  });

  describe('POST /api/v1/users', () => {
    it('should create a new user', async () => {
      const createUserDto = testUtils.generateRandomUser();
      const tenantId = 'test-tenant-1';

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .send(createUserDto)
        .expect(201);

      expect(response.body).toBeDefined();
      expect(response.body.email).toBe(createUserDto.email);
      expect(response.body.firstName).toBe(createUserDto.firstName);
      expect(response.body.lastName).toBe(createUserDto.lastName);
    });

    it('should return 400 for invalid email', async () => {
      const createUserDto = {
        ...testUtils.generateRandomUser(),
        email: 'invalid-email',
      };
      const tenantId = 'test-tenant-1';

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for missing required fields', async () => {
      const createUserDto = {
        email: 'test@example.com',
        // Missing firstName and lastName
      };
      const tenantId = 'test-tenant-1';

      await request(app.getHttpServer())
        .post('/api/v1/users')
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /api/v1/users', () => {
    it('should return paginated users', async () => {
      const tenantId = 'test-tenant-1';

      const response = await request(app.getHttpServer())
        .get('/api/v1/users')
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(20);
    });

    it('should return 400 for invalid page parameter', async () => {
      const tenantId = 'test-tenant-1';

      await request(app.getHttpServer())
        .get('/api/v1/users?page=0')
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(400);
    });
  });

  describe('GET /api/v1/users/:id', () => {
    it('should return user by ID', async () => {
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
      expect(response.body.tenantId).toBe(tenantId);
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';

      await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(404);
    });
  });

  describe('PUT /api/v1/users/:id', () => {
    it('should update user successfully', async () => {
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';
      const updateDto = {
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      };

      const response = await request(app.getHttpServer())
        .put(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .send(updateDto)
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.firstName).toBe(updateDto.firstName);
      expect(response.body.lastName).toBe(updateDto.lastName);
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';
      const updateDto = { firstName: 'Updated' };

      await request(app.getHttpServer())
        .put(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .send(updateDto)
        .expect(404);
    });
  });

  describe('DELETE /api/v1/users/:id', () => {
    it('should delete user successfully', async () => {
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      const response = await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.id).toBe(userId);
    });

    it('should return 404 for non-existent user', async () => {
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';

      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(404);
    });
  });

  describe('GET /api/v1/users/:id/stats', () => {
    it('should return user statistics', async () => {
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      const response = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/stats`)
        .set(testUtils.createTestHeaders(undefined, tenantId))
        .expect(200);

      expect(response.body).toBeDefined();
      expect(response.body.submissions).toBeDefined();
      expect(typeof response.body.submissions).toBe('number');
    });
  });
});
