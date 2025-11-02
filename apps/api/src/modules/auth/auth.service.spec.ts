import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './application/auth.service';
import { PrismaService } from '../../adapters/database/prisma.service';
import { RedisService } from '../../adapters/redis/redis.service';
import { ConfigService } from '@nestjs/config';
import { TestUtils } from '../../common/testing/test-utils';
import { DomainError } from '../../common/errors/domain-error.base';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let redis: RedisService;
  let config: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await TestUtils.createTestModule([
      AuthService,
    ]);

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    redis = module.get<RedisService>(RedisService);
    config = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    it('should validate user with correct credentials', async () => {
      const mockUser = TestUtils.createTestUser({
        email: 'test@example.com',
        passwordHash: 'hashed_password',
      });

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'update', mockUser);

      // Mock bcrypt compare (we'll test the actual logic)
      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await service.validateUser('test@example.com', 'password', 'test-tenant');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          email_tenantId: {
            email: 'test@example.com',
            tenantId: 'test-tenant',
          },
        },
      });
    });

    it('should throw error for invalid credentials', async () => {
      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', null);

      await expect(
        service.validateUser('invalid@example.com', 'password', 'test-tenant')
      ).rejects.toThrow(DomainError);
    });

    it('should throw error for inactive user', async () => {
      const mockUser = TestUtils.createTestUser({
        status: 'INACTIVE',
      });

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      await expect(
        service.validateUser('test@example.com', 'password', 'test-tenant')
      ).rejects.toThrow(DomainError);
    });

    it('should throw error for wrong password', async () => {
      const mockUser = TestUtils.createTestUser();

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpassword', 'test-tenant')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('register', () => {
    it('should register new user successfully', async () => {
      const registerData = {
        email: 'newuser@example.com',
        firstName: 'New',
        lastName: 'User',
        password: 'password123',
      };

      const mockUser = TestUtils.createTestUser({
        ...registerData,
        id: 'new-user-id',
        passwordHash: 'hashed_password',
      });

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', null);
      TestUtils.mockPrismaResponse(prisma.user, 'create', mockUser);

      const result = await service.register(registerData, 'test-tenant');

      expect(result).toBeDefined();
      expect(result.email).toBe('newuser@example.com');
      expect(result.firstName).toBe('New');
      expect(prisma.user.create).toHaveBeenCalled();
    });

    it('should throw error for existing email', async () => {
      const registerData = {
        email: 'existing@example.com',
        firstName: 'Existing',
        lastName: 'User',
        password: 'password123',
      };

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', TestUtils.createTestUser());

      await expect(
        service.register(registerData, 'test-tenant')
      ).rejects.toThrow(DomainError);
    });

    it('should validate email format', async () => {
      const registerData = {
        email: 'invalid-email',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      };

      await expect(
        service.register(registerData, 'test-tenant')
      ).rejects.toThrow(DomainError);
    });

    it('should validate password strength', async () => {
      const registerData = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: '123', // Too short
      };

      await expect(
        service.register(registerData, 'test-tenant')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('login', () => {
    it('should login user and return tokens', async () => {
      const mockUser = TestUtils.createTestUser();
      const mockTokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'update', mockUser);
      TestUtils.mockRedisResponse(redis, 'setex', 'OK');

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      // Mock JWT service
      const jwtService = { sign: jest.fn() };
      jwtService.sign.mockReturnValueOnce('access_token');
      jwtService.sign.mockReturnValueOnce('refresh_token');

      const result = await service.login('test@example.com', 'password', 'test-tenant');

      expect(result).toBeDefined();
      expect(result.accessToken).toBe('access_token');
      expect(result.refreshToken).toBe('refresh_token');
      expect(result.user.email).toBe('test@example.com');
    });

    it('should update last login timestamp', async () => {
      const mockUser = TestUtils.createTestUser();
      const updatedUser = { ...mockUser, lastLoginAt: new Date() };

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'update', updatedUser);

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      await service.login('test@example.com', 'password', 'test-tenant');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: mockUser.id },
        data: expect.objectContaining({
          lastLoginAt: expect.any(Date),
        }),
      });
    });
  });

  describe('refreshToken', () => {
    it('should refresh access token with valid refresh token', async () => {
      const mockUser = TestUtils.createTestUser();
      const mockTokens = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
      };

      TestUtils.mockRedisResponse(redis, 'get', 'user_id');
      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      const result = await service.refreshToken('valid_refresh_token');

      expect(result).toBeDefined();
      expect(result.accessToken).toBeDefined();
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw error for invalid refresh token', async () => {
      TestUtils.mockRedisResponse(redis, 'get', null);

      await expect(
        service.refreshToken('invalid_refresh_token')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('logout', () => {
    it('should invalidate refresh token', async () => {
      TestUtils.mockRedisResponse(redis, 'del', 1);

      await service.logout('refresh_token');

      expect(redis.del).toHaveBeenCalledWith('refresh_token');
    });

    it('should handle logout gracefully', async () => {
      TestUtils.mockRedisResponse(redis, 'del', 0);

      // Should not throw error
      await expect(service.logout('refresh_token')).resolves.toBeUndefined();
    });
  });

  describe('changePassword', () => {
    it('should change password successfully', async () => {
      const mockUser = TestUtils.createTestUser();

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'update', { ...mockUser, passwordHash: 'new_hash' });

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('new_hash');

      await service.changePassword('test-user-id', 'old_password', 'new_password');

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'test-user-id' },
        data: expect.objectContaining({
          passwordHash: 'new_hash',
        }),
      });
    });

    it('should throw error for wrong old password', async () => {
      const mockUser = TestUtils.createTestUser();

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      const bcrypt = require('bcrypt');
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        service.changePassword('test-user-id', 'wrong_old_password', 'new_password')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('validateSession', () => {
    it('should validate active session', async () => {
      const mockUser = TestUtils.createTestUser();

      TestUtils.mockRedisResponse(redis, 'get', 'user_id');
      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      const result = await service.validateSession('session_token');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
    });

    it('should throw error for expired session', async () => {
      TestUtils.mockRedisResponse(redis, 'get', null);

      await expect(
        service.validateSession('expired_session_token')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('getUserProfile', () => {
    it('should return user profile', async () => {
      const mockUser = TestUtils.createTestUser();

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);

      const result = await service.getUserProfile('test-user-id');

      expect(result).toBeDefined();
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('Test');
    });

    it('should throw error for non-existent user', async () => {
      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', null);

      await expect(
        service.getUserProfile('non-existent-user')
      ).rejects.toThrow(DomainError);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUser = TestUtils.createTestUser();
      const updateData = {
        firstName: 'Updated',
        lastName: 'Name',
      };
      const updatedUser = { ...mockUser, ...updateData };

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'update', updatedUser);

      const result = await service.updateProfile('test-user-id', updateData);

      expect(result).toBeDefined();
      expect(result.firstName).toBe('Updated');
      expect(result.lastName).toBe('Name');
    });

    it('should validate email uniqueness on update', async () => {
      const mockUser = TestUtils.createTestUser();
      const updateData = {
        email: 'existing@example.com',
      };

      TestUtils.mockPrismaResponse(prisma.user, 'findUnique', mockUser);
      TestUtils.mockPrismaResponse(prisma.user, 'count', 1); // Email already exists

      await expect(
        service.updateProfile('test-user-id', updateData)
      ).rejects.toThrow(DomainError);
    });
  });
});
