import { v4 as uuidv4 } from 'uuid';
import { DomainEvent } from './domain-event.interface';

export abstract class DomainEventBase implements DomainEvent {
  public readonly eventId: string;
  public readonly eventType: string;
  public readonly aggregateId: string;
  public readonly aggregateType: string;
  public readonly eventData: any;
  public readonly occurredOn: Date;
  public readonly version: number;
  public readonly tenantId: string;

  constructor(
    aggregateId: string,
    aggregateType: string,
    eventData: any,
    tenantId: string,
    version: number = 1
  ) {
    this.eventId = uuidv4();
    this.eventType = this.constructor.name;
    this.aggregateId = aggregateId;
    this.aggregateType = aggregateType;
    this.eventData = eventData;
    this.occurredOn = new Date();
    this.version = version;
    this.tenantId = tenantId;
  }
}

// User Domain Events
export class UserCreatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'User', eventData, tenantId);
  }
}

export class UserUpdatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'User', eventData, tenantId);
  }
}

export class UserLoggedInEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'User', eventData, tenantId);
  }
}

export class UserLoggedOutEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'User', eventData, tenantId);
  }
}

// Project Domain Events
export class ProjectCreatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Project', eventData, tenantId);
  }
}

export class ProjectUpdatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Project', eventData, tenantId);
  }
}

export class ProjectActivatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Project', eventData, tenantId);
  }
}

export class ProjectDeactivatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Project', eventData, tenantId);
  }
}

// Submission Domain Events
export class SubmissionCreatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Submission', eventData, tenantId);
  }
}

export class SubmissionReviewedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Submission', eventData, tenantId);
  }
}

export class SubmissionApprovedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Submission', eventData, tenantId);
  }
}

export class SubmissionRejectedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Submission', eventData, tenantId);
  }
}

// Badge Domain Events
export class BadgeCreatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Badge', eventData, tenantId);
  }
}

export class BadgeEarnedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Badge', eventData, tenantId);
  }
}

export class BadgeAssignedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Badge', eventData, tenantId);
  }
}

// Leaderboard Domain Events
export class LeaderboardUpdatedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Leaderboard', eventData, tenantId);
  }
}

export class UserRankChangedEvent extends DomainEventBase {
  constructor(aggregateId: string, eventData: any, tenantId: string) {
    super(aggregateId, 'Leaderboard', eventData, tenantId);
  }
}
