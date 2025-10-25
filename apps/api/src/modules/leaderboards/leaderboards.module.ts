import { Module } from '@nestjs/common';
import { LeaderboardsController } from './infrastructure/leaderboards.controller';
import { LeaderboardsService } from './application/leaderboards.service';
import { LeaderboardsRepository } from './infrastructure/leaderboards.repository';

@Module({
  controllers: [LeaderboardsController],
  providers: [LeaderboardsService, LeaderboardsRepository],
  exports: [LeaderboardsService],
})
export class LeaderboardsModule {}
