import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    
    // Extract tenant ID from multiple sources
    const tenantId = this.extractTenantId(request);
    
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID is required');
    }
    
    // Validate tenant ID format (should be a valid CUID)
    if (!this.isValidTenantId(tenantId)) {
      throw new UnauthorizedException('Invalid tenant ID format');
    }
    
    // Attach tenant ID to request for use in services
    request['tenantId'] = tenantId;
    
    return true;
  }
  
  private extractTenantId(request: Request): string | null {
    // Priority order: JWT token > header > query param > default
    const authHeader = request.headers.authorization;
    if (authHeader) {
      try {
        const token = authHeader.replace('Bearer ', '');
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        if (payload.tenantId) {
          return payload.tenantId;
        }
      } catch (error) {
        // Continue to other methods if JWT parsing fails
      }
    }
    
    // Check X-Tenant-ID header
    const headerTenantId = request.headers['x-tenant-id'] as string;
    if (headerTenantId) {
      return headerTenantId;
    }
    
    // Check query parameter
    const queryTenantId = request.query.tenantId as string;
    if (queryTenantId) {
      return queryTenantId;
    }
    
    // For development/testing, allow default tenant
    if (process.env.NODE_ENV === 'development') {
      return 'default';
    }
    
    return null;
  }
  
  private isValidTenantId(tenantId: string): boolean {
    // CUID format validation (basic check)
    const cuidRegex = /^c[a-z0-9]{24}$/;
    return cuidRegex.test(tenantId);
  }
}
