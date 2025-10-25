import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { PrismaService } from '../../adapters/database/prisma.service';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private prisma: PrismaService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.prisma.isHealthy();
      
      if (isHealthy) {
        return this.getStatus(key, true, { message: 'Database is healthy' });
      } else {
        throw new HealthCheckError('Database health check failed', this.getStatus(key, false));
      }
    } catch (error) {
      throw new HealthCheckError('Database health check failed', this.getStatus(key, false, { error: error.message }));
    }
  }
}
