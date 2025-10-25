import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { SubmissionsRepository } from '../infrastructure/submissions.repository';
import { StorageService } from '../../../adapters/storage/storage.service';
import { EmailService } from '../../../adapters/email/email.service';
import { CreateSubmissionDto, UpdateSubmissionDto, SubmissionReviewDto } from '@vulhub/schema';

@Injectable()
export class SubmissionsService {
  private readonly logger = new Logger(SubmissionsService.name);

  constructor(
    private submissionsRepository: SubmissionsRepository,
    private storageService: StorageService,
    private emailService: EmailService,
  ) {}

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
      if (createSubmissionDto.evidenceFiles) {
        for (const file of createSubmissionDto.evidenceFiles) {
          const url = await this.storageService.uploadFile(file);
          evidenceUrls.push(url);
        }
      }

      return await this.submissionsRepository.create({
        ...createSubmissionDto,
        userId,
        tenantId,
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
        ...(status && { status }),
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
  async review(id: string, reviewDto: SubmissionReviewDto, reviewerId: string, tenantId: string) {
    try {
      const submission = await this.submissionsRepository.findUnique({
        where: { id, tenantId },
        include: {
          user: true,
          project: true,
        },
      });

      if (!submission) {
        throw new NotFoundException('Submission not found');
      }

      if (submission.status !== 'PENDING') {
        throw new BadRequestException('Submission is not pending review');
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

      return updatedSubmission;
    } catch (error) {
      this.logger.error(`Failed to review submission ${id}:`, error);
      throw error;
    }
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
