import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../modules/users/application/users.service';
import { UsersRepository } from '../../modules/users/infrastructure/users.repository';
import { PrismaService } from '../../adapters/database/prisma.service';
import { ErrorHandlerService } from '../errors/error-handler.service';
import { TestConfigService } from '../testing/test-config.service';
import { TestDatabaseService } from '../testing/test-database.service';
import { TestUtilsService } from '../testing/test-utils.service';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: UsersRepository;
  let testConfig: TestConfigService;
  let testDb: TestDatabaseService;
  let testUtils: TestUtilsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        PrismaService,
        ErrorHandlerService,
        TestConfigService,
        TestDatabaseService,
        TestUtilsService,
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    testConfig = module.get<TestConfigService>(TestConfigService);
    testDb = module.get<TestDatabaseService>(TestDatabaseService);
    testUtils = module.get<TestUtilsService>(TestUtilsService);
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      // Arrange
      const createUserDto = testUtils.generateRandomUser();
      const tenantId = 'test-tenant-1';

      // Act
      const result = await service.create(createUserDto, tenantId);

      // Assert
      expect(result).toBeDefined();
      expect(result.email).toBe(createUserDto.email);
      expect(result.firstName).toBe(createUserDto.firstName);
      expect(result.lastName).toBe(createUserDto.lastName);
      expect(result.tenantId).toBe(tenantId);
    });

    it('should throw validation error for invalid email', async () => {
      // Arrange
      const createUserDto = {
        ...testUtils.generateRandomUser(),
        email: 'invalid-email',
      };
      const tenantId = 'test-tenant-1';

      // Act & Assert
      await expect(service.create(createUserDto, tenantId)).rejects.toThrow();
    });

    it('should throw validation error for missing firstName', async () => {
      // Arrange
      const createUserDto = {
        ...testUtils.generateRandomUser(),
        firstName: '',
      };
      const tenantId = 'test-tenant-1';

      // Act & Assert
      await expect(service.create(createUserDto, tenantId)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      // Arrange
      const tenantId = 'test-tenant-1';
      const page = 1;
      const limit = 10;

      // Act
      const result = await service.findAll(tenantId, page, limit);

      // Assert
      expect(result).toBeDefined();
      expect(result.data).toBeInstanceOf(Array);
      expect(result.pagination).toBeDefined();
      expect(result.pagination.page).toBe(page);
      expect(result.pagination.limit).toBe(limit);
    });

    it('should throw validation error for invalid page', async () => {
      // Arrange
      const tenantId = 'test-tenant-1';
      const page = 0; // Invalid page
      const limit = 10;

      // Act & Assert
      await expect(service.findAll(tenantId, page, limit)).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return user by ID', async () => {
      // Arrange
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      // Act
      const result = await service.findOne(userId, tenantId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
      expect(result.tenantId).toBe(tenantId);
    });

    it('should throw error for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';

      // Act & Assert
      await expect(service.findOne(userId, tenantId)).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';
      const updateDto = {
        firstName: 'Updated First Name',
        lastName: 'Updated Last Name',
      };

      // Act
      const result = await service.update(userId, updateDto, tenantId);

      // Assert
      expect(result).toBeDefined();
      expect(result.firstName).toBe(updateDto.firstName);
      expect(result.lastName).toBe(updateDto.lastName);
    });

    it('should throw error for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';
      const updateDto = { firstName: 'Updated' };

      // Act & Assert
      await expect(service.update(userId, updateDto, tenantId)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      // Act
      const result = await service.remove(userId, tenantId);

      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBe(userId);
    });

    it('should throw error for non-existent user', async () => {
      // Arrange
      const userId = 'non-existent-user';
      const tenantId = 'test-tenant-1';

      // Act & Assert
      await expect(service.remove(userId, tenantId)).rejects.toThrow();
    });
  });

  describe('getStats', () => {
    it('should return user statistics', async () => {
      // Arrange
      const userId = 'test-user-1';
      const tenantId = 'test-tenant-1';

      // Act
      const result = await service.getStats(userId, tenantId);

      // Assert
      expect(result).toBeDefined();
      expect(result.submissions).toBeDefined();
      expect(typeof result.submissions).toBe('number');
    });
  });
});
