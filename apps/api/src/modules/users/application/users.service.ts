import { Injectable, NotFoundException, Logger } from '@nestjs/common';
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
        
        this.logOperationSuccess('create', { userId: user.id, tenantId });
        return user;
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

        const result = {
          data: users,
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

        this.logOperationSuccess('findOne', { id, tenantId, email: user.email });
        return user;
      },
      'UsersService.findOne',
      { id, tenantId }
    );
  }

  /**
   * Update user
   */
  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id, tenantId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.usersRepository.update({
        where: { id, tenantId },
        data: updateUserDto,
      });
    } catch (error) {
      this.logger.error(`Failed to update user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete user
   */
  async remove(id: string, tenantId: string) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id, tenantId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.usersRepository.delete({
        where: { id, tenantId },
      });
    } catch (error) {
      this.logger.error(`Failed to delete user ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(id: string, tenantId: string): Promise<UserProfile> {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id, tenantId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return {
        ...user,
        status: user.status as any,
        role: user.role as any,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.createdAt.toISOString(), // Using createdAt as fallback
        email: '', // Add required fields
        tenantId: tenantId,
        lastLoginAt: null,
        preferences: null,
      };
    } catch (error) {
      this.logger.error(`Failed to get user profile ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update user preferences
   */
  async updatePreferences(id: string, preferences: any, tenantId: string) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id, tenantId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      return await this.usersRepository.update({
        where: { id, tenantId },
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
  async getStats(id: string, tenantId: string) {
    try {
      const user = await this.usersRepository.findUnique({
        where: { id, tenantId },
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const [submissionCount, projectCount] = await Promise.all([
        this.prisma.submission.count({
          where: { userId: id, tenantId },
        }),
        this.prisma.project.count({
          where: { tenantId },
        }),
      ]);

      return {
        submissions: submissionCount,
        totalProjects: projectCount,
        lastLogin: user.lastLoginAt,
      };
    } catch (error) {
      this.logger.error(`Failed to get user stats ${id}:`, error);
      throw error;
    }
  }
}
