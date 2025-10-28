import { Module } from '@nestjs/common';
import { AuditController } from './controllers/audit.controller';
import { AuditService } from './audit/audit.service';

@Module({
  controllers: [AuditController],
  providers: [AuditService],
  exports: [AuditService],
})
export class AuditModule {}
