import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto, UpdateUserDto, UserProfile } from '@vulhub/schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private prisma: PrismaService,
    private usersRepository: UsersRepository,
  ) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto, tenantId: string) {
    try {
      return await this.usersRepository.create({
        ...createUserDto,
        tenantId,
      });
    } catch (error) {
      this.logger.error('Failed to create user:', error);
      throw error;
    }
  }

  /**
   * Get all users for a tenant
   */
  async findAll(tenantId: string, page: number = 1, limit: number = 20) {
    try {
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

      return {
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
    } catch (error) {
      this.logger.error('Failed to get users:', error);
      throw error;
    }
  }

  /**
   * Get user by ID
   */
  async findOne(id: string, tenantId: string) {
    try {
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
        throw new NotFoundException('User not found');
      }

      return user;
    } catch (error) {
      this.logger.error(`Failed to get user ${id}:`, error);
      throw error;
    }
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

      return user;
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
            ...user.preferences,
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
