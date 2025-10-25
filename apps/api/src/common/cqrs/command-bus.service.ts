import { Injectable, Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Command, CommandHandler, CommandBus } from './command.interface';

@Injectable()
export class CommandBusService implements CommandBus {
  private readonly logger = new Logger(CommandBusService.name);
  private handlers = new Map<string, CommandHandler<any>>();

  /**
   * Register a command handler
   */
  register<T extends Command>(commandType: string, handler: CommandHandler<T>): void {
    this.handlers.set(commandType, handler);
    this.logger.log(`Registered handler for command: ${commandType}`);
  }

  /**
   * Execute a command
   */
  async execute<T extends Command>(command: T): Promise<any> {
    const commandType = command.constructor.name;
    const handler = this.handlers.get(commandType);

    if (!handler) {
      throw new Error(`No handler registered for command: ${commandType}`);
    }

    try {
      this.logger.log(`Executing command: ${commandType}`);
      const result = await handler.handle(command);
      this.logger.log(`Command ${commandType} executed successfully`);
      return result;
    } catch (error) {
      this.logger.error(`Command ${commandType} execution failed:`, error);
      throw error;
    }
  }

  /**
   * Get all registered command types
   */
  getRegisteredCommands(): string[] {
    return Array.from(this.handlers.keys());
  }

  /**
   * Check if a command type is registered
   */
  isRegistered(commandType: string): boolean {
    return this.handlers.has(commandType);
  }

  /**
   * Clear all handlers (useful for testing)
   */
  clearHandlers(): void {
    this.handlers.clear();
    this.logger.log('Cleared all command handlers');
  }
}
