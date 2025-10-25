import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent, DomainEventPublisher, DomainEventSubscriber } from './domain-event.interface';
import { EventStore } from './event-store.service';

@Injectable()
export class DomainEventPublisherService implements DomainEventPublisher {
  private readonly logger = new Logger(DomainEventPublisherService.name);
  private subscribers: Map<string, DomainEventSubscriber[]> = new Map();

  constructor(private eventStore: EventStore) {}

  /**
   * Register an event subscriber
   */
  registerSubscriber(subscriber: DomainEventSubscriber) {
    const eventTypes = subscriber.subscribedTo();
    
    eventTypes.forEach(eventType => {
      if (!this.subscribers.has(eventType)) {
        this.subscribers.set(eventType, []);
      }
      this.subscribers.get(eventType)!.push(subscriber);
    });

    this.logger.log(`Registered subscriber for events: ${eventTypes.join(', ')}`);
  }

  /**
   * Publish a single domain event
   */
  async publish(event: DomainEvent): Promise<void> {
    try {
      // Store the event
      await this.eventStore.saveEvents(event.aggregateId, [event], event.version);

      // Notify subscribers
      await this.notifySubscribers(event);

      this.logger.log(`Published event: ${event.eventType} for aggregate: ${event.aggregateId}`);
    } catch (error) {
      this.logger.error(`Failed to publish event ${event.eventType}:`, error);
      throw error;
    }
  }

  /**
   * Publish multiple domain events
   */
  async publishMany(events: DomainEvent[]): Promise<void> {
    try {
      // Group events by aggregate
      const eventsByAggregate = new Map<string, DomainEvent[]>();
      
      events.forEach(event => {
        if (!eventsByAggregate.has(event.aggregateId)) {
          eventsByAggregate.set(event.aggregateId, []);
        }
        eventsByAggregate.get(event.aggregateId)!.push(event);
      });

      // Store events for each aggregate
      for (const [aggregateId, aggregateEvents] of eventsByAggregate) {
        const sortedEvents = aggregateEvents.sort((a, b) => a.version - b.version);
        const latestVersion = sortedEvents[sortedEvents.length - 1].version;
        
        await this.eventStore.saveEvents(aggregateId, sortedEvents, latestVersion);
      }

      // Notify subscribers for each event
      for (const event of events) {
        await this.notifySubscribers(event);
      }

      this.logger.log(`Published ${events.length} events`);
    } catch (error) {
      this.logger.error(`Failed to publish multiple events:`, error);
      throw error;
    }
  }

  /**
   * Notify subscribers of an event
   */
  private async notifySubscribers(event: DomainEvent): Promise<void> {
    const subscribers = this.subscribers.get(event.eventType) || [];
    
    const notifications = subscribers.map(async (subscriber) => {
      try {
        await subscriber.handle(event);
        this.logger.debug(`Event ${event.eventType} handled by subscriber`);
      } catch (error) {
        this.logger.error(`Subscriber failed to handle event ${event.eventType}:`, error);
        // Don't throw here to allow other subscribers to process
      }
    });

    await Promise.allSettled(notifications);
  }

  /**
   * Get all registered subscribers
   */
  getSubscribers(): Map<string, DomainEventSubscriber[]> {
    return new Map(this.subscribers);
  }

  /**
   * Clear all subscribers (useful for testing)
   */
  clearSubscribers(): void {
    this.subscribers.clear();
    this.logger.log('Cleared all event subscribers');
  }
}
