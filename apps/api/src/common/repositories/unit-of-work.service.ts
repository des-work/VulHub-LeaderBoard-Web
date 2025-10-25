import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { UnitOfWork } from './repository.interface';
import { DomainEventPublisherService } from '../events/domain-event-publisher.service';

@Injectable()
export class UnitOfWorkService implements UnitOfWork {
  private readonly logger = new Logger(UnitOfWorkService.name);
  private _isActive = false;
  private _transaction: any = null;

  constructor(
    private prisma: PrismaService,
    private eventPublisher: DomainEventPublisherService,
  ) {}

  /**
   * Begin a new transaction
   */
  async begin(): Promise<void> {
    if (this._isActive) {
      throw new Error('Transaction is already active');
    }

    try {
      this._transaction = await this.prisma.$transaction(async (tx) => {
        this._isActive = true;
        this.logger.log('Transaction started');
        return tx;
      });
    } catch (error) {
      this.logger.error('Failed to begin transaction:', error);
      throw error;
    }
  }

  /**
   * Commit the current transaction
   */
  async commit(): Promise<void> {
    if (!this._isActive) {
      throw new Error('No active transaction to commit');
    }

    try {
      // Publish any pending domain events
      await this.eventPublisher.publishMany([]);
      
      this._isActive = false;
      this._transaction = null;
      this.logger.log('Transaction committed');
    } catch (error) {
      this.logger.error('Failed to commit transaction:', error);
      await this.rollback();
      throw error;
    }
  }

  /**
   * Rollback the current transaction
   */
  async rollback(): Promise<void> {
    if (!this._isActive) {
      this.logger.warn('No active transaction to rollback');
      return;
    }

    try {
      this._isActive = false;
      this._transaction = null;
      this.logger.log('Transaction rolled back');
    } catch (error) {
      this.logger.error('Failed to rollback transaction:', error);
      throw error;
    }
  }

  /**
   * Check if transaction is active
   */
  isActive(): boolean {
    return this._isActive;
  }

  /**
   * Get the current transaction context
   */
  getTransaction() {
    if (!this._isActive) {
      throw new Error('No active transaction');
    }
    return this._transaction;
  }

  /**
   * Execute a function within a transaction
   */
  async executeInTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    if (this._isActive) {
      // If already in a transaction, execute directly
      return await fn(this._transaction);
    }

    // Start new transaction
    await this.begin();
    
    try {
      const result = await fn(this._transaction);
      await this.commit();
      return result;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Execute multiple operations atomically
   */
  async executeAtomically<T>(operations: Array<(tx: any) => Promise<any>>): Promise<T[]> {
    return await this.executeInTransaction(async (tx) => {
      const results: any[] = [];
      
      for (const operation of operations) {
        const result = await operation(tx);
        results.push(result);
      }
      
      return results;
    });
  }
}
