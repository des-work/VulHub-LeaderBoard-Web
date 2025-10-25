import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('app.database.url'),
        },
      },
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ],
    });

    // Log database queries in development
    if (this.configService.get('app.nodeEnv') === 'development') {
      this.$on('query', (e) => {
        this.logger.debug(`Query: ${e.query}`);
        this.logger.debug(`Params: ${e.params}`);
        this.logger.debug(`Duration: ${e.duration}ms`);
      });
    }

    // Log database errors
    this.$on('error', (e) => {
      this.logger.error('Database error:', e);
    });

    // Log database info
    this.$on('info', (e) => {
      this.logger.log(`Database info: ${e.message}`);
    });

    // Log database warnings
    this.$on('warn', (e) => {
      this.logger.warn(`Database warning: ${e.message}`);
    });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Database connected successfully');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
      this.logger.log('✅ Database disconnected successfully');
    } catch (error) {
      this.logger.error('❌ Error disconnecting from database:', error);
    }
  }

  /**
   * Get a tenant-scoped Prisma client
   */
  getTenantClient(tenantId: string) {
    return this.$extends({
      query: {
        $allModels: {
          async $allOperations({ model, operation, args, query }) {
            // Add tenant filter to all queries
            if (args.where) {
              args.where.tenantId = tenantId;
            } else {
              args.where = { tenantId };
            }
            return query(args);
          },
        },
      },
    });
  }

  /**
   * Execute a transaction with tenant context
   */
  async executeWithTenant<T>(
    tenantId: string,
    fn: (tx: any) => Promise<T>,
  ): Promise<T> {
    const tenantClient = this.getTenantClient(tenantId);
    return tenantClient.$transaction(fn);
  }

  /**
   * Health check for database connection
   */
  async isHealthy(): Promise<boolean> {
    try {
      await this.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      this.logger.error('Database health check failed:', error);
      return false;
    }
  }
}
