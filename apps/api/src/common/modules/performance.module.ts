import { Module } from '@nestjs/common';
import { PerformanceController } from './controllers/performance.controller';
import { QueryPerformanceService } from './performance/query-performance.service';
import { ResponseOptimizerService } from './performance/response-optimizer.service';
import { MemoryManagerService } from './performance/memory-manager.service';

@Module({
  controllers: [PerformanceController],
  providers: [
    QueryPerformanceService,
    ResponseOptimizerService,
    MemoryManagerService,
  ],
  exports: [
    QueryPerformanceService,
    ResponseOptimizerService,
    MemoryManagerService,
  ],
})
export class PerformanceModule {}
