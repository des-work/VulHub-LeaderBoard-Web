import { DomainEvent } from '../events/domain-event.interface';

export abstract class AggregateRoot {
  private _domainEvents: DomainEvent[] = [];
  private _version: number = 0;

  protected constructor(
    public readonly id: string,
    public readonly tenantId: string
  ) {}

  /**
   * Get the current version of the aggregate
   */
  get version(): number {
    return this._version;
  }

  /**
   * Get all uncommitted domain events
   */
  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents];
  }

  /**
   * Clear all uncommitted domain events
   */
  clearEvents(): void {
    this._domainEvents = [];
  }

  /**
   * Add a domain event to the aggregate
   */
  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
    this._version++;
  }

  /**
   * Check if the aggregate has uncommitted events
   */
  hasUncommittedEvents(): boolean {
    return this._domainEvents.length > 0;
  }

  /**
   * Get the number of uncommitted events
   */
  getUncommittedEventCount(): number {
    return this._domainEvents.length;
  }

  /**
   * Mark events as committed (called after successful persistence)
   */
  markEventsAsCommitted(): void {
    this._domainEvents = [];
  }

  /**
   * Apply a domain event to the aggregate
   */
  protected apply(event: DomainEvent): void {
    this.addDomainEvent(event);
    this.when(event);
  }

  /**
   * Handle domain event (to be implemented by concrete aggregates)
   */
  protected abstract when(event: DomainEvent): void;

  /**
   * Validate business rules (to be implemented by concrete aggregates)
   */
  protected abstract validateBusinessRules(): void;

  /**
   * Get the aggregate type
   */
  abstract get aggregateType(): string;
}
