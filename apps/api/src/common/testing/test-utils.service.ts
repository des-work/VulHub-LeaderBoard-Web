import { Injectable, Logger } from '@nestjs/common';
import { TestConfigService } from './test-config.service';

@Injectable()
export class TestUtilsService {
  private readonly logger = new Logger(TestUtilsService.name);

  constructor(private testConfig: TestConfigService) {}

  /**
   * Generate test JWT token
   */
  generateTestToken(userId: string, tenantId: string): string {
    // In a real implementation, this would generate a proper JWT
    // For testing, we'll return a mock token
    return `test-token-${userId}-${tenantId}`;
  }

  /**
   * Create test request headers
   */
  createTestHeaders(userId?: string, tenantId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (userId && tenantId) {
      headers['Authorization'] = `Bearer ${this.generateTestToken(userId, tenantId)}`;
      headers['X-Tenant-ID'] = tenantId;
    }

    return headers;
  }

  /**
   * Generate random test data
   */
  generateRandomUser(overrides: any = {}): any {
    const randomId = Math.random().toString(36).substring(7);
    return {
      id: `test-user-${randomId}`,
      email: `test${randomId}@example.com`,
      firstName: 'Test',
      lastName: 'User',
      role: 'STUDENT',
      status: 'ACTIVE',
      tenantId: 'test-tenant-1',
      ...overrides,
    };
  }

  generateRandomProject(overrides: any = {}): any {
    const randomId = Math.random().toString(36).substring(7);
    return {
      id: `test-project-${randomId}`,
      name: `Test Project ${randomId}`,
      description: 'A test project',
      category: 'Web Application',
      difficulty: 'Easy',
      points: 100,
      isActive: true,
      isPublic: true,
      tenantId: 'test-tenant-1',
      ...overrides,
    };
  }

  /**
   * Wait for async operation
   */
  async wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retry operation with exponential backoff
   */
  async retry<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    baseDelay: number = 1000,
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxAttempts) {
          throw lastError;
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await this.wait(delay);
      }
    }

    throw lastError!;
  }

  /**
   * Mock external service responses
   */
  createMockResponse(data: any, status: number = 200): any {
    return {
      status,
      data,
      headers: {},
    };
  }

  /**
   * Validate test response structure
   */
  validateResponse(response: any, expectedFields: string[]): boolean {
    if (!response || typeof response !== 'object') {
      return false;
    }

    return expectedFields.every(field => field in response);
  }

  /**
   * Clean up test files
   */
  async cleanupTestFiles(filePaths: string[]): Promise<void> {
    // In a real implementation, this would delete files
    this.logger.log(`Cleaning up ${filePaths.length} test files`);
  }
}
