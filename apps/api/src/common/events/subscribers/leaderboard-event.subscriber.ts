import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent, DomainEventSubscriber } from '../domain-event.interface';
import { 
  SubmissionApprovedEvent, 
  SubmissionRejectedEvent,
  BadgeEarnedEvent,
  UserCreatedEvent,
  UserUpdatedEvent 
} from '../domain-event.base';
import { LeaderboardsService } from '../../../modules/leaderboards/application/leaderboards.service';

@Injectable()
export class LeaderboardEventSubscriber implements DomainEventSubscriber {
  private readonly logger = new Logger(LeaderboardEventSubscriber.name);

  constructor(private leaderboardsService: LeaderboardsService) {}

  /**
   * Get the event types this subscriber handles
   */
  subscribedTo(): string[] {
    return [
      'SubmissionApprovedEvent',
      'SubmissionRejectedEvent',
      'BadgeEarnedEvent',
      'UserCreatedEvent',
      'UserUpdatedEvent',
    ];
  }

  /**
   * Handle domain events
   */
  async handle(event: DomainEvent): Promise<void> {
    try {
      switch (event.eventType) {
        case 'SubmissionApprovedEvent':
          await this.handleSubmissionApproved(event as SubmissionApprovedEvent);
          break;
        case 'SubmissionRejectedEvent':
          await this.handleSubmissionRejected(event as SubmissionRejectedEvent);
          break;
        case 'BadgeEarnedEvent':
          await this.handleBadgeEarned(event as BadgeEarnedEvent);
          break;
        case 'UserCreatedEvent':
          await this.handleUserCreated(event as UserCreatedEvent);
          break;
        case 'UserUpdatedEvent':
          await this.handleUserUpdated(event as UserUpdatedEvent);
          break;
        default:
          this.logger.warn(`Unhandled event type: ${event.eventType}`);
      }
    } catch (error) {
      this.logger.error(`Failed to handle event ${event.eventType}:`, error);
      throw error;
    }
  }

  /**
   * Handle submission approved event
   */
  private async handleSubmissionApproved(event: SubmissionApprovedEvent): Promise<void> {
    this.logger.log(`Handling submission approved event for submission ${event.aggregateId}`);
    
    // Update leaderboard when a submission is approved
    await this.leaderboardsService.updateLeaderboardOnSubmission(
      event.aggregateId,
      event.tenantId
    );
  }

  /**
   * Handle submission rejected event
   */
  private async handleSubmissionRejected(event: SubmissionRejectedEvent): Promise<void> {
    this.logger.log(`Handling submission rejected event for submission ${event.aggregateId}`);
    
    // Update leaderboard when a submission is rejected
    await this.leaderboardsService.updateLeaderboardOnSubmission(
      event.aggregateId,
      event.tenantId
    );
  }

  /**
   * Handle badge earned event
   */
  private async handleBadgeEarned(event: BadgeEarnedEvent): Promise<void> {
    this.logger.log(`Handling badge earned event for user ${event.aggregateId}`);
    
    // Update leaderboard when a badge is earned
    await this.leaderboardsService.updateLeaderboardOnSubmission(
      event.aggregateId,
      event.tenantId
    );
  }

  /**
   * Handle user created event
   */
  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    this.logger.log(`Handling user created event for user ${event.aggregateId}`);
    
    // Initialize user in leaderboard
    await this.leaderboardsService.updateLeaderboardOnSubmission(
      event.aggregateId,
      event.tenantId
    );
  }

  /**
   * Handle user updated event
   */
  private async handleUserUpdated(event: UserUpdatedEvent): Promise<void> {
    this.logger.log(`Handling user updated event for user ${event.aggregateId}`);
    
    // Update leaderboard when user is updated
    await this.leaderboardsService.updateLeaderboardOnSubmission(
      event.aggregateId,
      event.tenantId
    );
  }
}
