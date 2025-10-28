import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../adapters/database/prisma.service';

export interface DatabaseHealthStatus {
  isHealthy: boolean;
  connectionCount: number;
  responseTime: number;
  lastError?: string;
  timestamp: Date;
}

@Injectable()
export class DatabaseHealthService {
  private readonly logger = new Logger(DatabaseHealthService.name);
  private lastHealthCheck: DatabaseHealthStatus | null = null;

  constructor(private prismaService: PrismaService) {}

  /**
   * Perform comprehensive database health check
   */
  async checkHealth(): Promise<DatabaseHealthStatus> {
    const startTime = Date.now();
    let isHealthy = false;
    let lastError: string | undefined;
    let connectionCount = 0;

    try {
      // Test basic connectivity
      await this.prismaService.$queryRaw`SELECT 1 as test`;
      
      // Get connection count (PostgreSQL specific)
      const connectionResult = await this.prismaService.$queryRaw<[{ count: bigint }]>`
        SELECT count(*) as count 
        FROM pg_stat_activity 
        WHERE state = 'active'
      `;
      connectionCount = Number(connectionResult[0].count);

      // Test write operation
      await this.prismaService.$queryRaw`SELECT NOW() as current_time`;
      
      isHealthy = true;
      this.logger.debug('Database health check passed');
    } catch (error) {
      lastError = error.message;
      this.logger.error('Database health check failed:', error);
    }

    const responseTime = Date.now() - startTime;

    const healthStatus: DatabaseHealthStatus = {
      isHealthy,
      connectionCount,
      responseTime,
      lastError,
      timestamp: new Date(),
    };

    this.lastHealthCheck = healthStatus;
    return healthStatus;
  }

  /**
   * Get cached health status
   */
  getLastHealthCheck(): DatabaseHealthStatus | null {
    return this.lastHealthCheck;
  }

  /**
   * Get database statistics
   */
  async getDatabaseStats(): Promise<{
    totalTables: number;
    totalRows: number;
    databaseSize: string;
    indexUsage: any[];
    slowQueries: any[];
  }> {
    try {
      // Get table count
      const tableCount = await this.prismaService.$queryRaw<[{ count: bigint }]>`
        SELECT count(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;

      // Get total row count across all tables
      const rowCount = await this.prismaService.$queryRaw<[{ count: bigint }]>`
        SELECT SUM(n_tup_ins - n_tup_del) as count
        FROM pg_stat_user_tables
      `;

      // Get database size
      const dbSize = await this.prismaService.$queryRaw<[{ size: string }]>`
        SELECT pg_size_pretty(pg_database_size(current_database())) as size
      `;

      // Get index usage statistics
      const indexUsage = await this.prismaService.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          indexname,
          idx_scan,
          idx_tup_read,
          idx_tup_fetch
        FROM pg_stat_user_indexes
        ORDER BY idx_scan DESC
        LIMIT 10
      `;

      // Get slow queries (if pg_stat_statements is enabled)
      const slowQueries = await this.prismaService.$queryRaw`
        SELECT 
          query,
          calls,
          total_time,
          mean_time,
          rows
        FROM pg_stat_statements
        WHERE mean_time > 1000
        ORDER BY mean_time DESC
        LIMIT 5
      `;

      return {
        totalTables: Number(tableCount[0].count),
        totalRows: Number(rowCount[0].count),
        databaseSize: dbSize[0].size,
        indexUsage: indexUsage as any[],
        slowQueries: slowQueries as any[],
      };
    } catch (error) {
      this.logger.error('Failed to get database statistics:', error);
      return {
        totalTables: 0,
        totalRows: 0,
        databaseSize: 'Unknown',
        indexUsage: [],
        slowQueries: [],
      };
    }
  }

  /**
   * Test database performance
   */
  async performanceTest(): Promise<{
    simpleQuery: number;
    complexQuery: number;
    writeOperation: number;
    transactionTest: number;
  }> {
    const results = {
      simpleQuery: 0,
      complexQuery: 0,
      writeOperation: 0,
      transactionTest: 0,
    };

    try {
      // Simple query test
      const start1 = Date.now();
      await this.prismaService.$queryRaw`SELECT 1`;
      results.simpleQuery = Date.now() - start1;

      // Complex query test
      const start2 = Date.now();
      await this.prismaService.$queryRaw`
        SELECT 
          t.name as tenant_name,
          COUNT(u.id) as user_count,
          COUNT(p.id) as project_count
        FROM tenants t
        LEFT JOIN users u ON t.id = u.tenant_id
        LEFT JOIN projects p ON t.id = p.tenant_id
        GROUP BY t.id, t.name
      `;
      results.complexQuery = Date.now() - start2;

      // Write operation test
      const start3 = Date.now();
      await this.prismaService.$queryRaw`
        CREATE TEMP TABLE test_performance (
          id SERIAL PRIMARY KEY,
          data TEXT
        )
      `;
      await this.prismaService.$queryRaw`
        INSERT INTO test_performance (data) 
        VALUES ('test'), ('data'), ('performance')
      `;
      await this.prismaService.$queryRaw`DROP TABLE test_performance`;
      results.writeOperation = Date.now() - start3;

      // Transaction test
      const start4 = Date.now();
      await this.prismaService.$transaction(async (tx) => {
        await tx.$queryRaw`SELECT 1`;
        await tx.$queryRaw`SELECT 2`;
        await tx.$queryRaw`SELECT 3`;
      });
      results.transactionTest = Date.now() - start4;

    } catch (error) {
      this.logger.error('Performance test failed:', error);
    }

    return results;
  }

  /**
   * Check if database is ready for operations
   */
  async isReady(): Promise<boolean> {
    try {
      const health = await this.checkHealth();
      return health.isHealthy && health.responseTime < 5000; // 5 second timeout
    } catch (error) {
      this.logger.error('Database readiness check failed:', error);
      return false;
    }
  }

  /**
   * Get connection pool status
   */
  async getConnectionPoolStatus(): Promise<{
    activeConnections: number;
    idleConnections: number;
    totalConnections: number;
    maxConnections: number;
  }> {
    try {
      const result = await this.prismaService.$queryRaw<[{
        active: bigint;
        idle: bigint;
        total: bigint;
        max_connections: bigint;
      }]>`
        SELECT 
          COUNT(*) FILTER (WHERE state = 'active') as active,
          COUNT(*) FILTER (WHERE state = 'idle') as idle,
          COUNT(*) as total,
          (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections
        FROM pg_stat_activity
        WHERE datname = current_database()
      `;

      return {
        activeConnections: Number(result[0].active),
        idleConnections: Number(result[0].idle),
        totalConnections: Number(result[0].total),
        maxConnections: Number(result[0].max_connections),
      };
    } catch (error) {
      this.logger.error('Failed to get connection pool status:', error);
      return {
        activeConnections: 0,
        idleConnections: 0,
        totalConnections: 0,
        maxConnections: 0,
      };
    }
  }
}
