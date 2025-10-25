import { Injectable, Logger } from '@nestjs/common';
import { DomainEvent, DomainEventSubscriber } from '../domain-event.interface';
import { 
  SubmissionApprovedEvent, 
  SubmissionRejectedEvent,
  BadgeEarnedEvent,
  UserCreatedEvent 
} from '../domain-event.base';
import { WebSocketGateway } from '../../../ws/websocket.gateway';

@Injectable()
export class NotificationEventSubscriber implements DomainEventSubscriber {
  private readonly logger = new Logger(NotificationEventSubscriber.name);

  constructor(private webSocketGateway: WebSocketGateway) {}

  /**
   * Get the event types this subscriber handles
   */
  subscribedTo(): string[] {
    return [
      'SubmissionApprovedEvent',
      'SubmissionRejectedEvent',
      'BadgeEarnedEvent',
      'UserCreatedEvent',
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
    this.logger.log(`Sending notification for approved submission ${event.aggregateId}`);
    
    const { userId, score, projectName } = event.eventData;
    
    // Send WebSocket notification
    this.webSocketGateway.broadcastSubmissionUpdate(
      event.tenantId,
      event.aggregateId,
      {
        type: 'submission_approved',
        message: `Your submission for ${projectName} has been approved! Score: ${score}`,
        score,
        projectName,
      }
    );

    // Send user-specific notification
    this.webSocketGateway.broadcastUserActivity(
      event.tenantId,
      userId,
      {
        type: 'submission_approved',
        submissionId: event.aggregateId,
        score,
        projectName,
      }
    );
  }

  /**
   * Handle submission rejected event
   */
  private async handleSubmissionRejected(event: SubmissionRejectedEvent): Promise<void> {
    this.logger.log(`Sending notification for rejected submission ${event.aggregateId}`);
    
    const { userId, feedback, projectName } = event.eventData;
    
    // Send WebSocket notification
    this.webSocketGateway.broadcastSubmissionUpdate(
      event.tenantId,
      event.aggregateId,
      {
        type: 'submission_rejected',
        message: `Your submission for ${projectName} has been rejected. Feedback: ${feedback}`,
        feedback,
        projectName,
      }
    );

    // Send user-specific notification
    this.webSocketGateway.broadcastUserActivity(
      event.tenantId,
      userId,
      {
        type: 'submission_rejected',
        submissionId: event.aggregateId,
        feedback,
        projectName,
      }
    );
  }

  /**
   * Handle badge earned event
   */
  private async handleBadgeEarned(event: BadgeEarnedEvent): Promise<void> {
    this.logger.log(`Sending notification for badge earned ${event.aggregateId}`);
    
    const { userId, badgeName, badgeDescription } = event.eventData;
    
    // Send WebSocket notification
    this.webSocketGateway.broadcastBadgeEarned(
      userId,
      {
        badgeId: event.aggregateId,
        badgeName,
        badgeDescription,
        earnedAt: event.occurredOn,
      }
    );

    // Send user-specific notification
    this.webSocketGateway.broadcastUserActivity(
      event.tenantId,
      userId,
      {
        type: 'badge_earned',
        badgeId: event.aggregateId,
        badgeName,
        badgeDescription,
      }
    );
  }

  /**
   * Handle user created event
   */
  private async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    this.logger.log(`Sending welcome notification for new user ${event.aggregateId}`);
    
    const { userId, firstName, lastName } = event.eventData;
    
    // Send welcome notification
    this.webSocketGateway.broadcastUserActivity(
      event.tenantId,
      userId,
      {
        type: 'welcome',
        message: `Welcome to VulHub, ${firstName} ${lastName}!`,
        firstName,
        lastName,
      }
    );

    // Send system message to tenant
    this.webSocketGateway.broadcastSystemMessage(
      event.tenantId,
      `New user ${firstName} ${lastName} has joined!`,
      'info'
    );
  }
}
