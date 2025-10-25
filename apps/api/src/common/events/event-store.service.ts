import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../adapters/database/prisma.service';
import { DomainEvent, EventStore } from './domain-event.interface';

@Injectable()
export class EventStoreService implements EventStore {
  private readonly logger = new Logger(EventStoreService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Save domain events for an aggregate
   */
  async saveEvents(aggregateId: string, events: DomainEvent[], expectedVersion: number): Promise<void> {
    try {
      // Check current version
      const currentVersion = await this.getCurrentVersion(aggregateId);
      
      if (currentVersion !== expectedVersion) {
        throw new Error(`Concurrency conflict: expected version ${expectedVersion}, but current version is ${currentVersion}`);
      }

      // Save events
      for (const event of events) {
        await this.prisma.eventStore.create({
          data: {
            eventId: event.eventId,
            eventType: event.eventType,
            aggregateId: event.aggregateId,
            aggregateType: event.aggregateType,
            eventData: event.eventData,
            occurredOn: event.occurredOn,
            version: event.version,
            tenantId: event.tenantId,
          },
        });
      }

      this.logger.log(`Saved ${events.length} events for aggregate ${aggregateId}`);
    } catch (error) {
      this.logger.error(`Failed to save events for aggregate ${aggregateId}:`, error);
      throw error;
    }
  }

  /**
   * Get all events for an aggregate
   */
  async getEvents(aggregateId: string): Promise<DomainEvent[]> {
    try {
      const events = await this.prisma.eventStore.findMany({
        where: { aggregateId },
        orderBy: { version: 'asc' },
      });

      return events.map(this.mapToDomainEvent);
    } catch (error) {
      this.logger.error(`Failed to get events for aggregate ${aggregateId}:`, error);
      throw error;
    }
  }

  /**
   * Get events by type within a date range
   */
  async getEventsByType(eventType: string, fromDate?: Date, toDate?: Date): Promise<DomainEvent[]> {
    try {
      const where: any = { eventType };
      
      if (fromDate || toDate) {
        where.occurredOn = {};
        if (fromDate) where.occurredOn.gte = fromDate;
        if (toDate) where.occurredOn.lte = toDate;
      }

      const events = await this.prisma.eventStore.findMany({
        where,
        orderBy: { occurredOn: 'asc' },
      });

      return events.map(this.mapToDomainEvent);
    } catch (error) {
      this.logger.error(`Failed to get events by type ${eventType}:`, error);
      throw error;
    }
  }

  /**
   * Get events for a tenant
   */
  async getEventsByTenant(tenantId: string, fromDate?: Date, toDate?: Date): Promise<DomainEvent[]> {
    try {
      const where: any = { tenantId };
      
      if (fromDate || toDate) {
        where.occurredOn = {};
        if (fromDate) where.occurredOn.gte = fromDate;
        if (toDate) where.occurredOn.lte = toDate;
      }

      const events = await this.prisma.eventStore.findMany({
        where,
        orderBy: { occurredOn: 'asc' },
      });

      return events.map(this.mapToDomainEvent);
    } catch (error) {
      this.logger.error(`Failed to get events for tenant ${tenantId}:`, error);
      throw error;
    }
  }

  /**
   * Get current version of an aggregate
   */
  private async getCurrentVersion(aggregateId: string): Promise<number> {
    const latestEvent = await this.prisma.eventStore.findFirst({
      where: { aggregateId },
      orderBy: { version: 'desc' },
      select: { version: true },
    });

    return latestEvent?.version || 0;
  }

  /**
   * Map database event to domain event
   */
  private mapToDomainEvent(dbEvent: any): DomainEvent {
    return {
      eventId: dbEvent.eventId,
      eventType: dbEvent.eventType,
      aggregateId: dbEvent.aggregateId,
      aggregateType: dbEvent.aggregateType,
      eventData: dbEvent.eventData,
      occurredOn: dbEvent.occurredOn,
      version: dbEvent.version,
      tenantId: dbEvent.tenantId,
    };
  }

  /**
   * Get event statistics
   */
  async getEventStatistics(tenantId?: string) {
    try {
      const where = tenantId ? { tenantId } : {};
      
      const totalEvents = await this.prisma.eventStore.count({ where });
      
      const eventsByType = await this.prisma.eventStore.groupBy({
        by: ['eventType'],
        where,
        _count: { eventType: true },
      });

      const recentEvents = await this.prisma.eventStore.findMany({
        where,
        orderBy: { occurredOn: 'desc' },
        take: 10,
        select: {
          eventType: true,
          occurredOn: true,
          aggregateId: true,
        },
      });

      return {
        totalEvents,
        eventsByType: eventsByType.map(e => ({
          eventType: e.eventType,
          count: e._count.eventType,
        })),
        recentEvents,
      };
    } catch (error) {
      this.logger.error('Failed to get event statistics:', error);
      throw error;
    }
  }
}
