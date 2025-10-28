import { Module } from '@nestjs/common';
import { MonitoringController } from './controllers/monitoring.controller';
import { MonitoringService } from './monitoring/monitoring.service';

@Module({
  controllers: [MonitoringController],
  providers: [MonitoringService],
  exports: [MonitoringService],
})
export class MonitoringModule {}
