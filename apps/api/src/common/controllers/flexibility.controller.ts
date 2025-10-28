import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FeatureFlagsService, FeatureFlag } from '../common/config/feature-flags.service';
import { PluginManagerService, Plugin } from '../common/plugins/plugin-manager.service';
import { ServiceDiscoveryService, ServiceInfo } from '../common/services/service-discovery.service';

@ApiTags('flexibility')
@Controller('flexibility')
export class FlexibilityController {
  constructor(
    private featureFlagsService: FeatureFlagsService,
    private pluginManagerService: PluginManagerService,
    private serviceDiscoveryService: ServiceDiscoveryService,
  ) {}

  // Feature Flags endpoints
  @Get('feature-flags')
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({ status: 200, description: 'Feature flags retrieved successfully' })
  getFeatureFlags(): FeatureFlag[] {
    return this.featureFlagsService.getAllFlags();
  }

  @Get('feature-flags/:name')
  @ApiOperation({ summary: 'Get specific feature flag' })
  @ApiParam({ name: 'name', description: 'Feature flag name' })
  @ApiResponse({ status: 200, description: 'Feature flag retrieved successfully' })
  getFeatureFlag(@Param('name') name: string): FeatureFlag | undefined {
    return this.featureFlagsService.getFlag(name);
  }

  @Post('feature-flags')
  @ApiOperation({ summary: 'Add new feature flag' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 201, description: 'Feature flag created successfully' })
  addFeatureFlag(@Body() flag: FeatureFlag): void {
    this.featureFlagsService.addFlag(flag);
  }

  @Put('feature-flags/:name')
  @ApiOperation({ summary: 'Update feature flag' })
  @ApiParam({ name: 'name', description: 'Feature flag name' })
  @ApiBody({ type: Object })
  @ApiResponse({ status: 200, description: 'Feature flag updated successfully' })
  updateFeatureFlag(
    @Param('name') name: string,
    @Body() updates: Partial<FeatureFlag>
  ): void {
    this.featureFlagsService.updateFlag(name, updates);
  }

  @Delete('feature-flags/:name')
  @ApiOperation({ summary: 'Remove feature flag' })
  @ApiParam({ name: 'name', description: 'Feature flag name' })
  @ApiResponse({ status: 200, description: 'Feature flag removed successfully' })
  removeFeatureFlag(@Param('name') name: string): void {
    this.featureFlagsService.removeFlag(name);
  }

  @Get('feature-flags/:name/check')
  @ApiOperation({ summary: 'Check if feature flag is enabled' })
  @ApiParam({ name: 'name', description: 'Feature flag name' })
  @ApiResponse({ status: 200, description: 'Feature flag status checked' })
  checkFeatureFlag(
    @Param('name') name: string,
    @Query('userId') userId?: string,
    @Query('tenantId') tenantId?: string,
  ): { enabled: boolean } {
    const enabled = this.featureFlagsService.isEnabled(name, {
      userId,
      tenantId,
    });
    return { enabled };
  }

  // Plugin Management endpoints
  @Get('plugins')
  @ApiOperation({ summary: 'Get all plugins' })
  @ApiResponse({ status: 200, description: 'Plugins retrieved successfully' })
  getPlugins(): Plugin[] {
    return this.pluginManagerService.getAllPlugins();
  }

  @Get('plugins/:name')
  @ApiOperation({ summary: 'Get specific plugin' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiResponse({ status: 200, description: 'Plugin retrieved successfully' })
  getPlugin(@Param('name') name: string): Plugin | undefined {
    return this.pluginManagerService.getPlugin(name);
  }

  @Get('plugins/:name/status')
  @ApiOperation({ summary: 'Get plugin status' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiResponse({ status: 200, description: 'Plugin status retrieved' })
  getPluginStatus(@Param('name') name: string): { exists: boolean; enabled: boolean } {
    return this.pluginManagerService.getPluginStatus(name);
  }

  @Get('plugins/:name/hooks')
  @ApiOperation({ summary: 'Get plugin hooks' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiResponse({ status: 200, description: 'Plugin hooks retrieved' })
  getPluginHooks(@Param('name') name: string): string[] {
    return this.pluginManagerService.getPluginHooks(name);
  }

  @Post('plugins/:name/enable')
  @ApiOperation({ summary: 'Enable plugin' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiResponse({ status: 200, description: 'Plugin enabled successfully' })
  async enablePlugin(@Param('name') name: string): Promise<void> {
    await this.pluginManagerService.enablePlugin(name);
  }

  @Post('plugins/:name/disable')
  @ApiOperation({ summary: 'Disable plugin' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiResponse({ status: 200, description: 'Plugin disabled successfully' })
  async disablePlugin(@Param('name') name: string): Promise<void> {
    await this.pluginManagerService.disablePlugin(name);
  }

  @Get('hooks')
  @ApiOperation({ summary: 'Get all available hooks' })
  @ApiResponse({ status: 200, description: 'Hooks retrieved successfully' })
  getAllHooks(): string[] {
    return this.pluginManagerService.getAllHooks();
  }

  // Service Discovery endpoints
  @Get('services')
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Services retrieved successfully' })
  getServices(): ServiceInfo[] {
    return this.serviceDiscoveryService.getAllServices();
  }

  @Get('services/healthy')
  @ApiOperation({ summary: 'Get healthy services' })
  @ApiResponse({ status: 200, description: 'Healthy services retrieved successfully' })
  getHealthyServices(): ServiceInfo[] {
    return this.serviceDiscoveryService.getHealthyServices();
  }

  @Get('services/:name')
  @ApiOperation({ summary: 'Get specific service' })
  @ApiParam({ name: 'name', description: 'Service name' })
  @ApiResponse({ status: 200, description: 'Service retrieved successfully' })
  getService(@Param('name') name: string): ServiceInfo | undefined {
    return this.serviceDiscoveryService.discoverService(name);
  }

  @Get('services/stats')
  @ApiOperation({ summary: 'Get service statistics' })
  @ApiResponse({ status: 200, description: 'Service statistics retrieved' })
  getServiceStats(): {
    total: number;
    healthy: number;
    unhealthy: number;
    services: Array<{
      name: string;
      health: boolean;
      lastHeartbeat: Date | undefined;
    }>;
  } {
    return this.serviceDiscoveryService.getServiceStats();
  }

  @Post('services/:name/health')
  @ApiOperation({ summary: 'Update service health' })
  @ApiParam({ name: 'name', description: 'Service name' })
  @ApiBody({ schema: { type: 'object', properties: { health: { type: 'boolean' } } } })
  @ApiResponse({ status: 200, description: 'Service health updated' })
  updateServiceHealth(
    @Param('name') name: string,
    @Body() body: { health: boolean }
  ): void {
    this.serviceDiscoveryService.updateServiceHealth(name, body.health);
  }

  @Post('services/:name/heartbeat')
  @ApiOperation({ summary: 'Update service heartbeat' })
  @ApiParam({ name: 'name', description: 'Service name' })
  @ApiResponse({ status: 200, description: 'Service heartbeat updated' })
  updateHeartbeat(@Param('name') name: string): void {
    this.serviceDiscoveryService.updateHeartbeat(name);
  }

  @Post('services/cleanup')
  @ApiOperation({ summary: 'Clean up stale services' })
  @ApiResponse({ status: 200, description: 'Stale services cleaned up' })
  cleanupStaleServices(): void {
    this.serviceDiscoveryService.cleanupStaleServices();
  }
}
