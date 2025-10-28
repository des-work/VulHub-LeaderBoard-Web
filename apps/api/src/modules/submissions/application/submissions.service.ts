import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { SubmissionsRepository } from '../infrastructure/submissions.repository';
import { StorageService } from '../../../adapters/storage/storage.service';
import { EmailService } from '../../../adapters/email/email.service';
import { CreateSubmissionDto, UpdateSubmissionDto, SubmissionReviewDto } from '@vulhub/schema';
import { BaseService } from '../../../common/services/base.service';
import { ErrorHandlerService } from '../../../common/errors/error-handler.service';
import { HandleErrors } from '../../../common/decorators/handle-errors.decorator';
import { SubmissionNotFoundError, ValidationError, InvalidSubmissionStatusError } from '../../../common/errors/domain-error.base';

@Injectable()
export class SubmissionsService extends BaseService {
  constructor(
    private submissionsRepository: SubmissionsRepository,
    private storageService: StorageService,
    private emailService: EmailService,
    errorHandler: ErrorHandlerService,
  ) {
    super(submissionsRepository, errorHandler);
  }

  /**
   * Create a new submission
   */
  async create(createSubmissionDto: CreateSubmissionDto, userId: string, tenantId: string) {
    try {
      this.logger.log(`Creating submission for user ${userId}`);

      // Validate project exists and is active
      const project = await this.submissionsRepository.findProject(createSubmissionDto.projectId, tenantId);
      if (!project || !project.isActive) {
        throw new BadRequestException('Project not found or not active');
      }

      // Check if user already has a submission for this project
      const existingSubmission = await this.submissionsRepository.findFirst({
        where: {
          userId,
          projectId: createSubmissionDto.projectId,
          tenantId,
        },
      });

      if (existingSubmission) {
        throw new BadRequestException('Submission already exists for this project');
      }

      // Upload evidence files
      const evidenceUrls: string[] = [];
      if (createSubmissionDto.evidenceUrls) {
        evidenceUrls.push(...createSubmissionDto.evidenceUrls);
      }

      return await this.submissionsRepository.create({
        ...createSubmissionDto,
        user: { connect: { id: userId } },
        tenant: { connect: { id: tenantId } },
        project: { connect: { id: createSubmissionDto.projectId } },
        evidenceUrls,
        status: 'PENDING',
      });
    } catch (error) {
      this.logger.error('Failed to create submission:', error);
      throw error;
    }
  }

  /**
   * Get all submissions with pagination and filtering
   */
  async findAll(
    tenantId: string,
    page: number = 1,
    limit: number = 20,
    status?: string,
    projectId?: string,
    userId?: string,
  ) {
    try {
      const skip = (page - 1) * limit;
      
      const where = {
        tenantId,
        ...(status && { status: status as 'PENDING' | 'APPROVED' | 'REJECTED' }),
        ...(projectId && { projectId }),
        ...(userId && { userId }),
      };

      const [submissions, total] = await Promise.all([
        this.submissionsRepository.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            project: {
              select: {
                id: true,
                name: true,
                category: true,
                difficulty: true,
              },
            },
          },
        }),
        this.submissionsRepository.count({ where }),
      ]);

      return {
        data: submissions,
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
      this.logger.error('Failed to get submissions:', error);
      throw error;
    }
  }

  /**
   * Get submission by ID
   */
  async findOne(id: string, tenantId: string) {
    try {
      const submission = await this.submissionsRepository.findUnique({
        where: { id, tenantId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          project: {
            select: {
              id: true,
              name: true,
              description: true,
              category: true,
              difficulty: true,
            },
          },
        },
      });

      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      return submission;
    } catch (error) {
      this.logger.error(`Failed to get submission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update submission
   */
  async update(id: string, updateSubmissionDto: UpdateSubmissionDto, tenantId: string) {
    try {
      const submission = await this.submissionsRepository.findUnique({
        where: { id, tenantId },
      });

      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      if (submission.status === 'APPROVED') {
        throw new BadRequestException('Cannot update approved submission');
      }

      return await this.submissionsRepository.update({
        where: { id, tenantId },
        data: updateSubmissionDto,
      });
    } catch (error) {
      this.logger.error(`Failed to update submission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Review submission (instructor/admin only)
   */
  @HandleErrors('SubmissionsService.review')
  async review(id: string, reviewDto: SubmissionReviewDto, reviewerId: string, tenantId: string) {
    this.validateInput({ id, reviewDto, reviewerId, tenantId }, (data) => {
      if (!data.id || data.id.trim().length === 0) {
        throw new ValidationError('id', 'Submission ID is required');
      }
      if (!data.reviewerId || data.reviewerId.trim().length === 0) {
        throw new ValidationError('reviewerId', 'Reviewer ID is required');
      }
      if (!data.reviewDto.status) {
        throw new ValidationError('status', 'Review status is required');
      }
      if (data.reviewDto.score !== null && (data.reviewDto.score < 0 || data.reviewDto.score > 100)) {
        throw new ValidationError('score', 'Score must be between 0 and 100');
      }
    });

    return this.handleOperation(
      async () => {
        this.logOperationStart('review', { id, reviewerId, tenantId, status: reviewDto.status });
        
        const submission = await this.submissionsRepository.findUnique({
          where: { id, tenantId },
          include: {
            user: true,
            project: true,
          },
        });

        if (!submission) {
          throw new SubmissionNotFoundError(id);
        }

        if (submission.status !== 'PENDING') {
          throw new InvalidSubmissionStatusError(submission.status, reviewDto.status);
        }

        const updatedSubmission = await this.submissionsRepository.update({
          where: { id, tenantId },
          data: {
            status: reviewDto.status,
            score: reviewDto.score,
            feedback: reviewDto.feedback,
            reviewedAt: new Date(),
            reviewedBy: reviewerId,
          },
        });

        // Simplified notification - just log for now
        this.logger.log(`Submission ${id} reviewed as ${reviewDto.status}`);

        this.logOperationSuccess('review', { 
          id, 
          reviewerId, 
          tenantId, 
          status: reviewDto.status,
          score: reviewDto.score 
        });
        
        return updatedSubmission;
      },
      'SubmissionsService.review',
      { id, reviewerId, tenantId, status: reviewDto.status }
    );
  }

  /**
   * Delete submission
   */
  async remove(id: string, tenantId: string) {
    try {
      const submission = await this.submissionsRepository.findUnique({
        where: { id, tenantId },
      });

      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      if (submission.status === 'APPROVED') {
        throw new BadRequestException('Cannot delete approved submission');
      }

      return await this.submissionsRepository.delete({
        where: { id, tenantId },
      });
    } catch (error) {
      this.logger.error(`Failed to delete submission ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get user's submissions
   */
  async findByUser(userId: string, tenantId: string) {
    try {
      return await this.submissionsRepository.findMany({
        where: { userId, tenantId },
        orderBy: { createdAt: 'desc' },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              category: true,
              difficulty: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get user submissions for ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get project submissions
   */
  async findByProject(projectId: string, tenantId: string) {
    try {
      return await this.submissionsRepository.findMany({
        where: { projectId, tenantId },
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Failed to get project submissions for ${projectId}:`, error);
      throw error;
    }
  }

  /**
   * Get submission statistics
   */
  async getStats(tenantId: string) {
    try {
      const [total, pending, approved, rejected] = await Promise.all([
        this.submissionsRepository.count({ where: { tenantId } }),
        this.submissionsRepository.count({ where: { tenantId, status: 'PENDING' } }),
        this.submissionsRepository.count({ where: { tenantId, status: 'APPROVED' } }),
        this.submissionsRepository.count({ where: { tenantId, status: 'REJECTED' } }),
      ]);

      return {
        total,
        pending,
        approved,
        rejected,
        approvalRate: total > 0 ? (approved / total) * 100 : 0,
      };
    } catch (error) {
      this.logger.error('Failed to get submission stats:', error);
      throw error;
    }
  }
}
