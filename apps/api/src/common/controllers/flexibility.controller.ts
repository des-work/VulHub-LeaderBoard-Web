import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { FeatureFlagsService } from '../config/feature-flags.service';
import { PluginManagerService } from '../plugins/plugin-manager.service';
import { ServiceDiscoveryService } from '../services/service-discovery.service';

@ApiTags('flexibility')
@Controller('flexibility')
export class FlexibilityController {
  constructor(
    private featureFlags: FeatureFlagsService,
    private pluginManager: PluginManagerService,
    private serviceDiscovery: ServiceDiscoveryService,
  ) {}

  @Get('feature-flags')
  @ApiOperation({ summary: 'Get all feature flags' })
  @ApiResponse({ status: 200, description: 'Feature flags retrieved' })
  getFeatureFlags(): any {
    return this.featureFlags.getAllFlags();
  }

  @Post('feature-flags/:flag')
  @ApiOperation({ summary: 'Set feature flag' })
  @ApiParam({ name: 'flag', description: 'Feature flag name' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean', description: 'Flag enabled status' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Feature flag updated' })
  setFeatureFlag(@Param('flag') flag: string, @Body() body: any): any {
    this.featureFlags.setFlag(flag, body.enabled);
    return { flag, enabled: body.enabled };
  }

  @Get('plugins')
  @ApiOperation({ summary: 'Get all plugins' })
  @ApiResponse({ status: 200, description: 'Plugins retrieved' })
  getPlugins(): any {
    return this.pluginManager.getAllPlugins().map(plugin => ({
      name: plugin.name,
      initialized: true,
    }));
  }

  @Post('plugins/:name/execute')
  @ApiOperation({ summary: 'Execute plugin hook' })
  @ApiParam({ name: 'name', description: 'Plugin name' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        hook: { type: 'string', description: 'Hook name' },
        data: { type: 'object', description: 'Hook data' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Hook executed' })
  async executePluginHook(@Param('name') name: string, @Body() body: any): Promise<any> {
    const plugin = this.pluginManager.getPlugin(name);
    if (!plugin || !plugin.executeHook) {
      throw new Error(`Plugin ${name} not found or does not support hooks`);
    }
    return await plugin.executeHook(body.hook, body.data);
  }

  @Get('services')
  @ApiOperation({ summary: 'Get all services' })
  @ApiResponse({ status: 200, description: 'Services retrieved' })
  getServices(): any {
    return this.serviceDiscovery.getAllServices();
  }

  @Get('services/healthy')
  @ApiOperation({ summary: 'Get healthy services' })
  @ApiResponse({ status: 200, description: 'Healthy services retrieved' })
  getHealthyServices(): any {
    return this.serviceDiscovery.getHealthyServices();
  }

  @Post('services/:name/heartbeat')
  @ApiOperation({ summary: 'Send service heartbeat' })
  @ApiParam({ name: 'name', description: 'Service name' })
  @ApiResponse({ status: 200, description: 'Heartbeat sent' })
  sendHeartbeat(@Param('name') name: string): any {
    this.serviceDiscovery.heartbeat(name);
    return { message: `Heartbeat sent for service ${name}` };
  }
}