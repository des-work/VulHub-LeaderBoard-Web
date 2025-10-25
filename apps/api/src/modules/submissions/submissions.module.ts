import { Module } from '@nestjs/common';
import { SubmissionsController } from './infrastructure/submissions.controller';
import { SubmissionsService } from './application/submissions.service';
import { SubmissionsRepository } from './infrastructure/submissions.repository';

@Module({
  controllers: [SubmissionsController],
  providers: [SubmissionsService, SubmissionsRepository],
  exports: [SubmissionsService],
})
export class SubmissionsModule {}
