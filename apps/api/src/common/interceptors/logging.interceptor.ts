import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const { method, url, ip } = request;
    const userAgent = request.get('User-Agent') || '';
    const tenantId = request.headers['x-tenant-id'] as string;
    const userId = (request as any).user?.id;

    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const { statusCode } = response;
          
          this.logger.log(
            `${method} ${url} ${statusCode} ${duration}ms - ${ip} - ${userAgent} ${
              tenantId ? `[tenant: ${tenantId}]` : ''
            } ${userId ? `[user: ${userId}]` : ''}`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          
          this.logger.error(
            `${method} ${url} ${statusCode} ${duration}ms - ${ip} - ${userAgent} ${
              tenantId ? `[tenant: ${tenantId}]` : ''
            } ${userId ? `[user: ${userId}]` : ''} - ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
