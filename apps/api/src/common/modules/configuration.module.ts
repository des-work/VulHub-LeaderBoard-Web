import { Module } from '@nestjs/common';
import { ConfigurationController } from './controllers/configuration.controller';
import { ConfigurationService } from './configuration/configuration.service';

@Module({
  controllers: [ConfigurationController],
  providers: [ConfigurationService],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
