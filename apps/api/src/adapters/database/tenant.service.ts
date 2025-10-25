import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Tenant } from '@prisma/client';

@Injectable()
export class TenantService {
  private readonly logger = new Logger(TenantService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Get tenant by ID
   */
  async findById(id: string): Promise<Tenant | null> {
    try {
      return await this.prisma.tenant.findUnique({
        where: { id },
      });
    } catch (error) {
      this.logger.error(`Failed to find tenant by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Get tenant by domain
   */
  async findByDomain(domain: string): Promise<Tenant | null> {
    try {
      return await this.prisma.tenant.findUnique({
        where: { domain },
      });
    } catch (error) {
      this.logger.error(`Failed to find tenant by domain ${domain}:`, error);
      throw error;
    }
  }

  /**
   * Create a new tenant
   */
  async create(data: {
    name: string;
    domain: string;
    settings?: any;
  }): Promise<Tenant> {
    try {
      return await this.prisma.tenant.create({
        data: {
          name: data.name,
          domain: data.domain,
          settings: data.settings || {},
        },
      });
    } catch (error) {
      this.logger.error('Failed to create tenant:', error);
      throw error;
    }
  }

  /**
   * Update tenant settings
   */
  async updateSettings(tenantId: string, settings: any): Promise<Tenant> {
    try {
      return await this.prisma.tenant.update({
        where: { id: tenantId },
        data: { settings },
      });
    } catch (error) {
      this.logger.error(`Failed to update tenant settings for ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Validate tenant access
   */
  async validateAccess(tenantId: string, userId: string): Promise<boolean> {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: userId,
          tenantId,
          status: 'ACTIVE',
        },
      });
      return !!user;
    } catch (error) {
      this.logger.error(`Failed to validate tenant access for ${tenantId}:`, error);
      return false;
    }
  }

  /**
   * Get tenant statistics
   */
  async getStats(tenantId: string) {
    try {
      const [userCount, projectCount, submissionCount] = await Promise.all([
        this.prisma.user.count({ where: { tenantId } }),
        this.prisma.project.count({ where: { tenantId } }),
        this.prisma.submission.count({ where: { tenantId } }),
      ]);

      return {
        users: userCount,
        projects: projectCount,
        submissions: submissionCount,
      };
    } catch (error) {
      this.logger.error(`Failed to get tenant stats for ${tenantId}:`, error);
      throw error;
    }
  }
}
