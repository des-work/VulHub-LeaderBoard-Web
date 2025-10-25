import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';
import { RedisService } from '../../adapters/redis/redis.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private redis: RedisService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.redis.isHealthy();
      
      if (isHealthy) {
        return this.getStatus(key, true, { message: 'Redis is healthy' });
      } else {
        throw new HealthCheckError('Redis health check failed', this.getStatus(key, false));
      }
    } catch (error) {
      throw new HealthCheckError('Redis health check failed', this.getStatus(key, false, { error: error.message }));
    }
  }
}
