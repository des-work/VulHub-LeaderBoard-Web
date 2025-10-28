import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FeatureFlagsService } from '../common/config/feature-flags.service';
import { PluginManagerService } from '../common/plugins/plugin-manager.service';
import { ServiceDiscoveryService } from '../common/services/service-discovery.service';
import { AnalyticsPlugin } from '../plugins/analytics.plugin';
import { FlexibilityController } from '../common/controllers/flexibility.controller';

@Module({
  imports: [ConfigModule],
  controllers: [FlexibilityController],
  providers: [
    FeatureFlagsService,
    PluginManagerService,
    ServiceDiscoveryService,
    AnalyticsPlugin,
  ],
  exports: [
    FeatureFlagsService,
    PluginManagerService,
    ServiceDiscoveryService,
    AnalyticsPlugin,
  ],
})
export class FlexibilityModule {}
