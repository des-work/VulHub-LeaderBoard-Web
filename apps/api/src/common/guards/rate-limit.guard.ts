import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException({
        message: 'Too many requests',
        retryAfter: limits.window,
        statusCode: 429,
      }, HttpStatus.TOO_MANY_REQUESTS);
    }
    
    await this.redisService.incr(key);
    return true;
  }
  
  private getRateLimit(endpoint: string) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // Auth endpoints - stricter limits (but more lenient in development)
    if (endpoint.includes('/auth/login') || endpoint.includes('/auth/register')) {
      return isDevelopment 
        ? { max: 50, window: 900 } // 50 attempts per 15 minutes in dev
        : { max: 5, window: 900 }; // 5 attempts per 15 minutes in production
    }
    
    // API endpoints - moderate limits (more lenient in development)
    if (endpoint.includes('/api/')) {
      return isDevelopment
        ? { max: 1000, window: 3600 } // 1000 requests per hour in dev
        : { max: 100, window: 3600 }; // 100 requests per hour in production
    }
    
    // Default limits
    return isDevelopment
      ? { max: 2000, window: 3600 } // 2000 requests per hour in dev
      : { max: 200, window: 3600 }; // 200 requests per hour in production
  }
}
