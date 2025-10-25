export interface DomainEvent {
  readonly eventId: string;
  readonly eventType: string;
  readonly aggregateId: string;
  readonly aggregateType: string;
  readonly eventData: any;
  readonly occurredOn: Date;
  readonly version: number;
  readonly tenantId: string;
}

export interface DomainEventPublisher {
  publish(event: DomainEvent): Promise<void>;
  publishMany(events: DomainEvent[]): Promise<void>;
}

export interface DomainEventSubscriber<T extends DomainEvent = DomainEvent> {
  handle(event: T): Promise<void>;
  subscribedTo(): string[];
}

export interface EventStore {
  saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void>;
  getEvents(aggregateId: string): Promise<DomainEvent[]>;
  getEventsByType(eventType: string, fromDate?: Date, toDate?: Date): Promise<DomainEvent[]>;
}
