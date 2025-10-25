import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  // TODO: Implement email service
  async sendEmail(to: string, subject: string, content: string): Promise<void> {
    this.logger.log(`Sending email to ${to}: ${subject}`);
  }
}
