import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['error'],
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.warn('⚠️ Database connection failed - running in development mode');
      this.logger.warn(`Database error: ${error.message}`);
      // Don't throw error in development - allow API to start
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Database disconnected successfully');
    } catch (error) {
      this.logger.error('❌ Database disconnection failed:', error);
    }
  }

  /**
   * Get tenant-scoped Prisma client
   */
  withTenant(tenantId: string) {
    return this.$extends({
      query: {
        $allOperations({ model, operation, args, query }) {
          // Add tenant filter to all queries except for Tenant model
          if (model !== 'Tenant' && args.where) {
            args.where.tenantId = tenantId;
          } else if (model !== 'Tenant') {
            args.where = { tenantId };
          }
          return query(args);
        },
      },
    });
  }

  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}