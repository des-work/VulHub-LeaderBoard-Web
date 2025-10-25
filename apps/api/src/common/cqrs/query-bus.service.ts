import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Query, QueryHandler, QueryBus } from './command.interface';

@Injectable()
export class QueryBusService implements QueryBus {
  private readonly logger = new Logger(QueryBusService.name);
  private handlers = new Map<string, QueryHandler<any>>();

  /**
   * Register a query handler
   */
  register<T extends Query>(queryType: string, handler: QueryHandler<T>): void {
    this.handlers.set(queryType, handler);
    this.logger.log(`Registered handler for query: ${queryType}`);
  }

  /**
   * Execute a query
   */
  async execute<T extends Query>(query: T): Promise<any> {
    const queryType = query.constructor.name;
    const handler = this.handlers.get(queryType);

    if (!handler) {
      throw new Error(`No handler registered for query: ${queryType}`);
    }

    try {
      this.logger.log(`Executing query: ${queryType}`);
      const result = await handler.handle(query);
      this.logger.log(`Query ${queryType} executed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Query ${queryType} execution failed:`, error);
      throw error;
    }
  }

  /**
   * Get all registered query types
   */
  getRegisteredQueries(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if a query type is registered
   */
  isRegistered(queryType: string): boolean {
    return this.handlers.has(queryType);
  }

  /**
   * Clear all handlers (useful for testing)
   */
  clearHandlers(): void {
    this.handlers.clear();
    this.logger.log('Cleared all query handlers');
  }
}
