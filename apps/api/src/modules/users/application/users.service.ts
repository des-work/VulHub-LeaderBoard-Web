import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto, UpdateUserDto, UserProfile } from '@vulhub/schema';
import { BaseService } from '../../../common/services/base.service';
import { ErrorHandlerService } from '../../../common/errors/error-handler.service';
import { HandleErrors } from '../../../common/decorators/handle-errors.decorator';
import { UserNotFoundError, ValidationError } from '../../../common/errors/domain-error.base';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    private prisma: PrismaService,
    private usersRepository: UsersRepository,
    errorHandler: ErrorHandlerService,
  ) {
    super(usersRepository, errorHandler);
  }

  /**
   * Create a new user
   */
  @HandleErrors('UsersService.create')
  async create(createUserDto: CreateUserDto, tenantId: string): Promise<UserProfile> {
    this.validateInput(createUserDto, (data) => {
      if (!data.email || !data.email.includes('@')) {
        throw new ValidationError('email', 'Invalid email format');
      }
      if (!data.firstName || data.firstName.trim().length === 0) {
        throw new ValidationError('firstName', 'First name is required');
      }
      if (!data.lastName || data.lastName.trim().length === 0) {
        throw new ValidationError('lastName', 'Last name is required');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('create', { tenantId, email: createUserDto.email });
        
         const user = await this.usersRepository.create({
           ...createUserDto,
           tenant: { connect: { id: tenantId } },
         });
         
         // Map Prisma user to UserProfile
         const userProfile: UserProfile = {
           id: user.id,
           email: user.email,
           firstName: user.firstName,
           lastName: user.lastName,
           avatarUrl: user.avatarUrl || '',
           status: user.status as any,
           role: user.role as any,
           tenantId: user.tenantId,
           preferences: user.preferences as Record<string, any> || {},
           lastLoginAt: user.lastLoginAt?.toISOString() || '',
           createdAt: user.createdAt.toISOString(),
           updatedAt: user.updatedAt.toISOString(),
         };
         
         this.logOperationSuccess('create', { userId: user.id, tenantId });
         return userProfile;
      },
      'UsersService.create',
      { tenantId, email: createUserDto.email }
    );
  }

  /**
   * Get all users for a tenant
   */
  @HandleErrors('UsersService.findAll')
  async findAll(tenantId: string, page: number = 1, limit: number = 20): Promise<{
    data: UserProfile[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  }> {
    this.validateInput({ page, limit }, (data) => {
      if (data.page < 1) {
        throw new ValidationError('page', 'Page must be greater than 0');
      }
      if (data.limit < 1 || data.limit > 100) {
        throw new ValidationError('limit', 'Limit must be between 1 and 100');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('findAll', { tenantId, page, limit });
        
         const skip = (page - 1) * limit;
         const [users, total] = await Promise.all([
           this.usersRepository.findMany({
             where: { tenantId },
             skip,
             take: limit,
             orderBy: { createdAt: 'desc' },
           }),
           this.usersRepository.count({ where: { tenantId } }),
         ]);

         // Map Prisma users to UserProfile
         const userProfiles: UserProfile[] = users.map(user => ({
           id: user.id,
           email: user.email,
           firstName: user.firstName,
           lastName: user.lastName,
           avatarUrl: user.avatarUrl || '',
           status: user.status as any,
           role: user.role as any,
           tenantId: user.tenantId,
           preferences: user.preferences as Record<string, any> || {},
           lastLoginAt: user.lastLoginAt?.toISOString() || '',
           createdAt: user.createdAt.toISOString(),
           updatedAt: user.updatedAt.toISOString(),
         }));

         const result = {
           data: userProfiles,
           pagination: {
             page,
             limit,
             total,
             totalPages: Math.ceil(total / limit),
             hasNext: page * limit < total,
             hasPrev: page > 1,
           },
         };
         
         this.logOperationSuccess('findAll', { tenantId, count: users.length, total });
         return result;
      },
      'UsersService.findAll',
      { tenantId, page, limit }
    );
  }

  /**
   * Get user by ID
   */
  @HandleErrors('UsersService.findOne')
  async findOne(id: string, tenantId: string): Promise<UserProfile> {
    this.validateInput({ id, tenantId }, (data) => {
      if (!data.id || data.id.trim().length === 0) {
        throw new ValidationError('id', 'User ID is required');
      }
      if (!data.tenantId || data.tenantId.trim().length === 0) {
        throw new ValidationError('tenantId', 'Tenant ID is required');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('findOne', { id, tenantId });
        
         const user = await this.usersRepository.findUnique({
           where: { id, tenantId },
           include: {
             tenant: {
               select: {
                 id: true,
                 name: true,
                 domain: true,
               },
             },
           },
         });

         if (!user) {
           throw new UserNotFoundError(id);
         }

         // Map Prisma user to UserProfile
         const userProfile: UserProfile = {
           id: user.id,
           email: user.email,
           firstName: user.firstName,
           lastName: user.lastName,
           avatarUrl: user.avatarUrl || '',
           status: user.status as any,
           role: user.role as any,
           tenantId: user.tenantId,
           preferences: user.preferences as Record<string, any> || {},
           lastLoginAt: user.lastLoginAt?.toISOString() || '',
           createdAt: user.createdAt.toISOString(),
           updatedAt: user.updatedAt.toISOString(),
         };

         this.logOperationSuccess('findOne', { id, tenantId, email: user.email });
         return userProfile;
      },
      'UsersService.findOne',
      { id, tenantId }
    );
  }

  /**
   * Update user
   */
  @HandleErrors('UsersService.update')
  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<UserProfile> {
    this.validateInput({ id, updateUserDto, tenantId }, (data) => {
      if (!data.id || data.id.trim().length === 0) {
        throw new ValidationError('id', 'User ID is required');
      }
      if (!data.tenantId || data.tenantId.trim().length === 0) {
        throw new ValidationError('tenantId', 'Tenant ID is required');
      }
      if (Object.keys(data.updateUserDto).length === 0) {
        throw new ValidationError('updateUserDto', 'Update data cannot be empty');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('update', { id, tenantId, updateData: updateUserDto });
        
        const user = await this.usersRepository.findUnique({ where: { id, tenantId } });
        if (!user) {
          throw new UserNotFoundError(id);
        }

        const updatedUser = await this.usersRepository.update({
          where: { id, tenantId },
          data: {
            ...updateUserDto,
            preferences: updateUserDto.preferences
              ? {
                  ...(user.preferences as Record<string, any> || {}),
                  ...updateUserDto.preferences,
                }
              : user.preferences,
          },
        });

        // Map Prisma user to UserProfile
        const userProfile: UserProfile = {
          id: updatedUser.id,
          email: updatedUser.email,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          avatarUrl: updatedUser.avatarUrl || '',
          status: updatedUser.status as any,
          role: updatedUser.role as any,
          tenantId: updatedUser.tenantId,
          preferences: updatedUser.preferences as Record<string, any> || {},
          lastLoginAt: updatedUser.lastLoginAt?.toISOString() || '',
          createdAt: updatedUser.createdAt.toISOString(),
          updatedAt: updatedUser.updatedAt.toISOString(),
        };
        
        this.logOperationSuccess('update', { id, tenantId, email: updatedUser.email });
        return userProfile;
      },
      'UsersService.update',
      { id, tenantId, updateData: updateUserDto }
    );
  }

  /**
   * Delete user
   */
  @HandleErrors('UsersService.remove')
  async remove(id: string, tenantId: string): Promise<UserProfile> {
    this.validateInput({ id, tenantId }, (data) => {
      if (!data.id || data.id.trim().length === 0) {
        throw new ValidationError('id', 'User ID is required');
      }
      if (!data.tenantId || data.tenantId.trim().length === 0) {
        throw new ValidationError('tenantId', 'Tenant ID is required');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('remove', { id, tenantId });
        
        const user = await this.usersRepository.findUnique({ where: { id, tenantId } });
        if (!user) {
          throw new UserNotFoundError(id);
        }

        const deletedUser = await this.usersRepository.delete({ where: { id, tenantId } });

        // Map Prisma user to UserProfile
        const userProfile: UserProfile = {
          id: deletedUser.id,
          email: deletedUser.email,
          firstName: deletedUser.firstName,
          lastName: deletedUser.lastName,
          avatarUrl: deletedUser.avatarUrl || '',
          status: deletedUser.status as any,
          role: deletedUser.role as any,
          tenantId: deletedUser.tenantId,
          preferences: deletedUser.preferences as Record<string, any> || {},
          lastLoginAt: deletedUser.lastLoginAt?.toISOString() || '',
          createdAt: deletedUser.createdAt.toISOString(),
          updatedAt: deletedUser.updatedAt.toISOString(),
        };
        
        this.logOperationSuccess('remove', { id, tenantId, email: deletedUser.email });
        return userProfile;
      },
      'UsersService.remove',
      { id, tenantId }
    );
  }

  /**
   * Get user profile
   */
  @HandleErrors('UsersService.getProfile')
  async getProfile(id: string, tenantId: string): Promise<UserProfile> {
    this.validateInput({ id, tenantId }, (data) => {
      if (!data.id || data.id.trim().length === 0) {
        throw new ValidationError('id', 'User ID is required');
      }
      if (!data.tenantId || data.tenantId.trim().length === 0) {
        throw new ValidationError('tenantId', 'Tenant ID is required');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('getProfile', { id, tenantId });
        
        const user = await this.usersRepository.findUnique({ where: { id, tenantId } });
        if (!user) {
          throw new UserNotFoundError(id);
        }

        // Map Prisma user to UserProfile
        const userProfile: UserProfile = {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl || '',
          status: user.status as any,
          role: user.role as any,
          tenantId: user.tenantId,
          preferences: user.preferences as Record<string, any> || {},
          lastLoginAt: user.lastLoginAt?.toISOString() || '',
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        };

        this.logOperationSuccess('getProfile', { id, tenantId, email: user.email });
        return userProfile;
      },
      'UsersService.getProfile',
      { id, tenantId }
    );
  }

  /**
   * Update user preferences
   */
  async updatePreferences(id: string, preferences: any) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.usersRepository.update({
        where: { id },
        data: {
          preferences: {
            ...(user.preferences as Record<string, any> || {}),
            ...preferences,
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to update user preferences ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get user statistics
   */
  @HandleErrors('UsersService.getStats')
  async getStats(userId: string): Promise<any> {
    this.validateInput({ userId }, (data) => {
      if (!data.userId || data.userId.trim().length === 0) {
        throw new ValidationError('userId', 'User ID is required');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('getStats', { userId });
        
        const stats = await this.prisma.submission.count({
          where: { userId },
        });
        
        return {
          submissions: stats,
          totalProjects: 0,
          lastLogin: null,
        };
      },
      'UsersService.getStats',
      { userId }
    );
  }
}
