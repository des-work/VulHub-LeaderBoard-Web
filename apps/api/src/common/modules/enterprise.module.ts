import { Module } from '@nestjs/common';
import { PerformanceModule } from './performance.module';
import { AuditModule } from './audit.module';
import { MonitoringModule } from './monitoring.module';
import { ConfigurationModule } from './configuration.module';
import { AdminModule } from './admin.module';

@Module({
  imports: [
    PerformanceModule,
    AuditModule,
    MonitoringModule,
    ConfigurationModule,
    AdminModule,
  ],
  exports: [
    PerformanceModule,
    AuditModule,
    MonitoringModule,
    ConfigurationModule,
    AdminModule,
  ],
})
export class EnterpriseModule {}
