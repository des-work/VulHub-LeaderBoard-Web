import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../adapters/database/prisma.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { CreateUserDto, UpdateUserDto, UserProfile } from '@vulhub/schema';
import { EnhancedBaseService } from '../../../common/services/enhanced-base.service';
import { ErrorHandlerService } from '../../../common/errors/error-handler.service';
import { ResilienceService } from '../../../common/resilience/resilience.service';
import { EnhancedValidatorService } from '../../../common/validation/enhanced-validator.service';
import { DynamicConfigService } from '../../../common/config/dynamic-config.service';
import { UserNotFoundError, ValidationError } from '../../../common/errors/domain-error.base';

@Injectable()
export class EnhancedUsersService extends EnhancedBaseService {
  constructor(
    private prisma: PrismaService,
    private usersRepository: UsersRepository,
    errorHandler: ErrorHandlerService,
    resilience: ResilienceService,
    private validator: EnhancedValidatorService,
    private config: DynamicConfigService,
  ) {
    super(usersRepository, errorHandler, resilience);
  }

  /**
   * Create a new user with enhanced validation and resilience
   */
  async create(createUserDto: CreateUserDto, tenantId: string): Promise<UserProfile> {
    return this.executeWithResilience(
      async () => {
        // Enhanced validation
        const validationResult = await this.validator.validateAndSanitize(
          createUserDto,
          this.createUserValidationSchema(),
          { sanitize: true, strict: true }
        );

        if (!validationResult.isValid) {
          throw validationResult.errors[0];
        }

        const sanitizedData = validationResult.sanitizedData || createUserDto;

        // Business rule validation
        await this.validateUserCreationRules(sanitizedData, tenantId);

        // Create user with circuit breaker protection
        const user = await this.usersRepository.create({
          ...sanitizedData,
          tenant: { connect: { id: tenantId } },
        });

        // Audit the operation
        await this.auditOperation('CREATE_USER', user.id, {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }, { operation: 'create', tenantId });

        return this.mapToUserProfile(user);
      },
      {
        operation: 'create',
        tenantId,
        resource: 'user',
        metadata: { email: createUserDto.email }
      },
      {
        useCircuitBreaker: true,
        useRetry: true,
        useRecovery: true,
        retryOptions: { maxAttempts: 3, delay: 1000 },
        circuitBreakerOptions: { failureThreshold: 5, timeout: 30000 }
      }
    );
  }

  /**
   * Get all users with enhanced filtering and pagination
   */
  async findAll(
    tenantId: string, 
    page: number = 1, 
    limit: number = 20,
    filters: {
      status?: string;
      role?: string;
      search?: string;
    } = {}
  ): Promise<{
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
    return this.executeWithResilience(
      async () => {
        // Validate pagination parameters
        const maxLimit = await this.config.get('MAX_PAGE_LIMIT', 100);
        const validatedLimit = Math.min(limit, maxLimit);
        const validatedPage = Math.max(page, 1);

        // Build query with filters
        const whereClause = this.buildUserFilterClause(tenantId, filters);

        const skip = (validatedPage - 1) * validatedLimit;
        const [users, total] = await Promise.all([
          this.usersRepository.findMany({
            where: whereClause,
            skip,
            take: validatedLimit,
            orderBy: { createdAt: 'desc' },
          }),
          this.usersRepository.count({ where: whereClause }),
        ]);

        const userProfiles = users.map(user => this.mapToUserProfile(user));

        return {
          data: userProfiles,
          pagination: {
            page: validatedPage,
            limit: validatedLimit,
            total,
            totalPages: Math.ceil(total / validatedLimit),
            hasNext: validatedPage * validatedLimit < total,
            hasPrev: validatedPage > 1,
          },
        };
      },
      {
        operation: 'findAll',
        tenantId,
        resource: 'users',
        metadata: { page, limit, filters }
      }
    );
  }

  /**
   * Get user by ID with enhanced error handling
   */
  async findOne(id: string, tenantId: string): Promise<UserProfile> {
    return this.executeWithResilience(
      async () => {
        // Validate input
        const validationResult = await this.validator.validateCommon(
          { id, tenantId },
          ['id', 'tenantId']
        );

        if (!validationResult.isValid) {
          throw validationResult.errors[0];
        }

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

        return this.mapToUserProfile(user);
      },
      {
        operation: 'findOne',
        tenantId,
        resource: 'user',
        metadata: { userId: id }
      }
    );
  }

  /**
   * Update user with enhanced validation
   */
  async update(id: string, updateUserDto: UpdateUserDto, tenantId: string): Promise<UserProfile> {
    return this.executeWithResilience(
      async () => {
        // Validate input
        const validationResult = await this.validator.validateAndSanitize(
          updateUserDto,
          this.updateUserValidationSchema(),
          { sanitize: true, strict: true }
        );

        if (!validationResult.isValid) {
          throw validationResult.errors[0];
        }

        const sanitizedData = validationResult.sanitizedData || updateUserDto;

        // Check if user exists
        const existingUser = await this.usersRepository.findUnique({ 
          where: { id, tenantId } 
        });
        
        if (!existingUser) {
          throw new UserNotFoundError(id);
        }

        // Business rule validation
        await this.validateUserUpdateRules(sanitizedData, existingUser);

        const updatedUser = await this.usersRepository.update({
          where: { id, tenantId },
          data: {
            ...sanitizedData,
            preferences: sanitizedData.preferences
              ? {
                  ...(existingUser.preferences as Record<string, any> || {}),
                  ...sanitizedData.preferences,
                }
              : existingUser.preferences,
          },
        });

        // Audit the operation
        await this.auditOperation('UPDATE_USER', id, {
          changes: sanitizedData,
          previousValues: {
            email: existingUser.email,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            status: existingUser.status,
            role: existingUser.role
          }
        }, { operation: 'update', tenantId });

        return this.mapToUserProfile(updatedUser);
      },
      {
        operation: 'update',
        tenantId,
        resource: 'user',
        metadata: { userId: id, updateData: updateUserDto }
      }
    );
  }

  /**
   * Delete user with enhanced safety checks
   */
  async remove(id: string, tenantId: string): Promise<UserProfile> {
    return this.executeWithResilience(
      async () => {
        // Validate input
        const validationResult = await this.validator.validateCommon(
          { id, tenantId },
          ['id', 'tenantId']
        );

        if (!validationResult.isValid) {
          throw validationResult.errors[0];
        }

        const user = await this.usersRepository.findUnique({ 
          where: { id, tenantId } 
        });
        
        if (!user) {
          throw new UserNotFoundError(id);
        }

        // Business rule validation - check if user can be deleted
        await this.validateUserDeletionRules(user);

        const deletedUser = await this.usersRepository.delete({ 
          where: { id, tenantId } 
        });

        // Audit the operation
        await this.auditOperation('DELETE_USER', id, {
          deletedUser: {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          }
        }, { operation: 'remove', tenantId });

        return this.mapToUserProfile(deletedUser);
      },
      {
        operation: 'remove',
        tenantId,
        resource: 'user',
        metadata: { userId: id }
      }
    );
  }

  /**
   * Get user statistics with caching
   */
  async getStats(userId: string, tenantId: string): Promise<any> {
    return this.executeWithResilience(
      async () => {
        const cacheKey = `user_stats:${userId}:${tenantId}`;
        
        // Try to get from cache first
        const cachedStats = await this.resilience.executeWithCircuitBreaker(
          'cache-service',
          async () => {
            // This would be implemented with actual cache service
            return null;
          },
          async () => {
            // Fallback to database
            const stats = await this.prisma.submission.count({
              where: { userId, tenantId },
            });
            
            return {
              submissions: stats,
              totalProjects: 0,
              lastLogin: null,
            };
          }
        );

        return cachedStats;
      },
      {
        operation: 'getStats',
        tenantId,
        resource: 'user',
        metadata: { userId }
      }
    );
  }

  /**
   * Validate business rules for user creation
   */
  protected async validateBusinessRules(entity: any, operation: string): Promise<void> {
    switch (operation) {
      case 'create':
        await this.validateUserCreationRules(entity, entity.tenantId);
        break;
      case 'update':
        await this.validateUserUpdateRules(entity, entity.existingUser);
        break;
      case 'delete':
        await this.validateUserDeletionRules(entity);
        break;
    }
  }

  /**
   * Get recovery strategies for user operations
   */
  protected getRecoveryStrategies(): any[] {
    return [
      {
        canRecover: (errorReport) => 
          errorReport.error.message.includes('email') && 
          errorReport.error.message.includes('unique'),
        recover: async (errorReport) => {
          this.logger.log('Attempting email conflict recovery');
          // Could suggest alternative email or handle duplicate gracefully
          throw new Error('Email already exists - recovery not implemented');
        },
        priority: 5
      }
    ];
  }

  private createUserValidationSchema() {
    return this.validator.createSchema<CreateUserDto>()
      .required('email', (value) => this.validator.validateEmail(value), 'Invalid email format')
      .required('firstName', (value) => typeof value === 'string' && value.trim().length >= 2, 'First name must be at least 2 characters')
      .required('lastName', (value) => typeof value === 'string' && value.trim().length >= 2, 'Last name must be at least 2 characters')
      .optional('password', (value) => !value || this.validator.validatePassword(value).isValid, 'Password does not meet requirements')
      .sanitize('email', (value) => this.validator.sanitizeString(value).toLowerCase())
      .sanitize('firstName', (value) => this.validator.sanitizeString(value))
      .sanitize('lastName', (value) => this.validator.sanitizeString(value))
      .build();
  }

  private updateUserValidationSchema() {
    return this.validator.createSchema<UpdateUserDto>()
      .optional('email', (value) => !value || this.validator.validateEmail(value), 'Invalid email format')
      .optional('firstName', (value) => !value || (typeof value === 'string' && value.trim().length >= 2), 'First name must be at least 2 characters')
      .optional('lastName', (value) => !value || (typeof value === 'string' && value.trim().length >= 2), 'Last name must be at least 2 characters')
      .sanitize('email', (value) => value ? this.validator.sanitizeString(value).toLowerCase() : value)
      .sanitize('firstName', (value) => value ? this.validator.sanitizeString(value) : value)
      .sanitize('lastName', (value) => value ? this.validator.sanitizeString(value) : value)
      .build();
  }

  private buildUserFilterClause(tenantId: string, filters: any) {
    const where: any = { tenantId };

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: 'insensitive' } },
        { lastName: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return where;
  }

  private async validateUserCreationRules(data: CreateUserDto, tenantId: string): Promise<void> {
    // Check if email already exists in tenant
    const existingUser = await this.usersRepository.findUnique({
      where: {
        email_tenantId: {
          email: data.email,
          tenantId
        }
      }
    });

    if (existingUser) {
      throw new ValidationError('email', 'Email already exists in this tenant');
    }

    // Additional business rules can be added here
  }

  private async validateUserUpdateRules(data: UpdateUserDto, existingUser: any): Promise<void> {
    // If email is being changed, check for conflicts
    if (data.email && data.email !== existingUser.email) {
      const conflictingUser = await this.usersRepository.findUnique({
        where: {
          email_tenantId: {
            email: data.email,
            tenantId: existingUser.tenantId
          }
        }
      });

      if (conflictingUser) {
        throw new ValidationError('email', 'Email already exists in this tenant');
      }
    }
  }

  private async validateUserDeletionRules(user: any): Promise<void> {
    // Check if user has active submissions
    const activeSubmissions = await this.prisma.submission.count({
      where: {
        userId: user.id,
        status: 'PENDING'
      }
    });

    if (activeSubmissions > 0) {
      throw new ValidationError('user', 'Cannot delete user with pending submissions');
    }

    // Additional deletion rules can be added here
  }

  private mapToUserProfile(user: any): UserProfile {
    return {
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
  }
}
