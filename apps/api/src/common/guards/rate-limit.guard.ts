import { Injectable, CanActivate, ExecutionContext, TooManyRequestsException } from '@nestjs/common';
import { RedisService } from '../../adapters/redis/redis.service';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private redisService: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip || request.connection.remoteAddress;
    const endpoint = request.route?.path || request.url;
    
    // Different rate limits for different endpoints
    const limits = this.getRateLimit(endpoint);
    
    const key = `rate_limit:${ip}:${endpoint}`;
    const current = await this.redisService.get(key);
    
    if (!current) {
      await this.redisService.setex(key, limits.window, '1');
      return true;
    }
    
    const count = parseInt(current);
    if (count >= limits.max) {
      throw new TooManyRequestsException({
        message: 'Too many requests',
        retryAfter: limits.window,
        statusCode: 429,
      });
    }
    
    await this.redisService.incr(key);
    return true;
  }
  
  private getRateLimit(endpoint: string) {
    // Auth endpoints - stricter limits
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      return { max: 5, window: 900 }; // 5 attempts per 15 minutes
    }
    
    // API endpoints - moderate limits
    if (endpoint.includes('/api/')) {
      return { max: 100, window: 3600 }; // 100 requests per hour
    }
    
    // Default limits
    return { max: 200, window: 3600 }; // 200 requests per hour
  }
}
