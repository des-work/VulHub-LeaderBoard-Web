import { Module } from '@nestjs/common';
import { LeaderboardsController } from './infrastructure/leaderboards.controller';
import { LeaderboardsService } from './application/leaderboards.service';
import { LeaderboardsRepository } from './infrastructure/leaderboards.repository';
import { CacheService } from '../../common/services/cache.service';
import { QueryOptimizerService } from '../../common/services/query-optimizer.service';
import { RedisModule } from '../../adapters/redis/redis.module';
import { WebSocketModule } from '../../ws/websocket.module';

@Module({
  imports: [RedisModule, WebSocketModule],
  controllers: [LeaderboardsController],
  providers: [
    LeaderboardsService, 
    LeaderboardsRepository,
    CacheService,
    QueryOptimizerService,
  ],
  exports: [LeaderboardsService, CacheService, QueryOptimizerService],
})
export class LeaderboardsModule {}
