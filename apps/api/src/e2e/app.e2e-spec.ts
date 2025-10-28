import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { TestConfigService } from '../../common/testing/test-config.service';
import { TestDatabaseService } from '../../common/testing/test-database.service';
import { TestUtilsService } from '../../common/testing/test-utils.service';

describe('VulHub Leaderboard E2E Tests', () => {
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

  describe('Complete User Journey', () => {
    it('should complete full user lifecycle', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // 1. Create a new user
      const createUserDto = testUtils.generateRandomUser();
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set(headers)
        .send(createUserDto)
        .expect(201);

      const userId = createResponse.body.id;
      expect(userId).toBeDefined();

      // 2. Get the created user
      const getUserResponse = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set(headers)
        .expect(200);

      expect(getUserResponse.body.email).toBe(createUserDto.email);

      // 3. Update the user
      const updateDto = {
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/api/v1/users/${userId}`)
        .set(headers)
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.firstName).toBe(updateDto.firstName);

      // 4. Get user statistics
      const statsResponse = await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}/stats`)
        .set(headers)
        .expect(200);

      expect(statsResponse.body.submissions).toBeDefined();

      // 5. Delete the user
      await request(app.getHttpServer())
        .delete(`/api/v1/users/${userId}`)
        .set(headers)
        .expect(200);

      // 6. Verify user is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/users/${userId}`)
        .set(headers)
        .expect(404);
    });
  });

  describe('Project Management Flow', () => {
    it('should handle complete project lifecycle', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // 1. Create a project
      const createProjectDto = testUtils.generateRandomProject();
      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/projects')
        .set(headers)
        .send(createProjectDto)
        .expect(201);

      const projectId = createResponse.body.id;
      expect(projectId).toBeDefined();

      // 2. Get the project
      const getProjectResponse = await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set(headers)
        .expect(200);

      expect(getProjectResponse.body.name).toBe(createProjectDto.name);

      // 3. Update the project
      const updateDto = {
        name: 'Updated Project Name',
        description: 'Updated description',
      };

      const updateResponse = await request(app.getHttpServer())
        .put(`/api/v1/projects/${projectId}`)
        .set(headers)
        .send(updateDto)
        .expect(200);

      expect(updateResponse.body.name).toBe(updateDto.name);

      // 4. Delete the project
      await request(app.getHttpServer())
        .delete(`/api/v1/projects/${projectId}`)
        .set(headers)
        .expect(200);

      // 5. Verify project is deleted
      await request(app.getHttpServer())
        .get(`/api/v1/projects/${projectId}`)
        .set(headers)
        .expect(404);
    });
  });

  describe('Submission Workflow', () => {
    it('should handle complete submission workflow', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // 1. Create a submission
      const createSubmissionDto = {
        projectId: 'test-project-1',
        userId: 'test-user-1',
        evidenceUrls: ['https://example.com/evidence.jpg'],
      };

      const createResponse = await request(app.getHttpServer())
        .post('/api/v1/submissions')
        .set(headers)
        .send(createSubmissionDto)
        .expect(201);

      const submissionId = createResponse.body.id;
      expect(submissionId).toBeDefined();

      // 2. Get the submission
      const getSubmissionResponse = await request(app.getHttpServer())
        .get(`/api/v1/submissions/${submissionId}`)
        .set(headers)
        .expect(200);

      expect(getSubmissionResponse.body.status).toBe('PENDING');

      // 3. Review the submission
      const reviewDto = {
        status: 'APPROVED',
        score: 85,
        feedback: 'Great work!',
      };

      const reviewResponse = await request(app.getHttpServer())
        .post(`/api/v1/submissions/${submissionId}/review`)
        .set(headers)
        .send(reviewDto)
        .expect(200);

      expect(reviewResponse.body.status).toBe('APPROVED');
      expect(reviewResponse.body.score).toBe(85);

      // 4. Get updated submission
      const updatedSubmissionResponse = await request(app.getHttpServer())
        .get(`/api/v1/submissions/${submissionId}`)
        .set(headers)
        .expect(200);

      expect(updatedSubmissionResponse.body.status).toBe('APPROVED');
      expect(updatedSubmissionResponse.body.score).toBe(85);
    });
  });

  describe('Leaderboard Integration', () => {
    it('should update leaderboard after submission approval', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // 1. Get initial leaderboard
      const initialLeaderboardResponse = await request(app.getHttpServer())
        .get('/api/v1/leaderboards')
        .set(headers)
        .expect(200);

      const initialScores = initialLeaderboardResponse.body.map((entry: any) => entry.score);

      // 2. Approve a submission
      const submissionId = 'test-submission-1';
      const reviewDto = {
        status: 'APPROVED',
        score: 90,
        feedback: 'Excellent work!',
      };

      await request(app.getHttpServer())
        .post(`/api/v1/submissions/${submissionId}/review`)
        .set(headers)
        .send(reviewDto)
        .expect(200);

      // 3. Get updated leaderboard
      const updatedLeaderboardResponse = await request(app.getHttpServer())
        .get('/api/v1/leaderboards')
        .set(headers)
        .expect(200);

      const updatedScores = updatedLeaderboardResponse.body.map((entry: any) => entry.score);

      // 4. Verify leaderboard was updated
      expect(updatedScores).not.toEqual(initialScores);
    });
  });

  describe('Error Handling', () => {
    it('should handle validation errors gracefully', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // Test invalid user creation
      const invalidUserDto = {
        email: 'invalid-email',
        firstName: '',
        lastName: '',
      };

      const response = await request(app.getHttpServer())
        .post('/api/v1/users')
        .set(headers)
        .send(invalidUserDto)
        .expect(400);

      expect(response.body.message).toBeDefined();
    });

    it('should handle not found errors gracefully', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      const response = await request(app.getHttpServer())
        .get('/api/v1/users/non-existent-user')
        .set(headers)
        .expect(404);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('Performance Tests', () => {
    it('should handle concurrent requests', async () => {
      const tenantId = 'test-tenant-1';
      const headers = testUtils.createTestHeaders(undefined, tenantId);

      // Create multiple concurrent requests
      const requests = Array.from({ length: 10 }, (_, i) => {
        const userDto = testUtils.generateRandomUser({
          email: `concurrent${i}@example.com`,
        });

        return request(app.getHttpServer())
          .post('/api/v1/users')
          .set(headers)
          .send(userDto);
      });

      // Wait for all requests to complete
      const responses = await Promise.all(requests);

      // Verify all requests succeeded
      responses.forEach(response => {
        expect(response.status).toBe(201);
        expect(response.body.id).toBeDefined();
      });
    });
  });
});
