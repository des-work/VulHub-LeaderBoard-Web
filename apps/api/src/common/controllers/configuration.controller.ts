import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { ConfigurationService } from '../configuration/configuration.service';

@ApiTags('configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private configurationService: ConfigurationService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get configuration overview' })
  @ApiResponse({ status: 200, description: 'Configuration overview retrieved' })
  getConfigurationOverview(): any {
    return this.configurationService.getConfigurationOverview();
  }

  @Get('settings')
  @ApiOperation({ summary: 'Get all settings' })
  @ApiResponse({ status: 200, description: 'Settings retrieved' })
  getAllSettings(): any {
    return this.configurationService.getAllSettings();
  }

  @Get('settings/:key')
  @ApiOperation({ summary: 'Get setting by key' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: 200, description: 'Setting retrieved' })
  getSetting(@Param('key') key: string): any {
    return this.configurationService.getSetting(key);
  }

  @Post('settings')
  @ApiOperation({ summary: 'Create setting' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        key: { type: 'string', description: 'Setting key' },
        value: { type: 'string', description: 'Setting value' },
        description: { type: 'string', description: 'Setting description' },
        category: { type: 'string', description: 'Setting category' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Setting created' })
  createSetting(@Body() setting: any): any {
    return this.configurationService.createSetting(setting);
  }

  @Put('settings/:key')
  @ApiOperation({ summary: 'Update setting' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        value: { type: 'string', description: 'Setting value' },
        description: { type: 'string', description: 'Setting description' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Setting updated' })
  updateSetting(@Param('key') key: string, @Body() update: any): any {
    return this.configurationService.updateSetting(key, update);
  }

  @Delete('settings/:key')
  @ApiOperation({ summary: 'Delete setting' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: 200, description: 'Setting deleted' })
  deleteSetting(@Param('key') key: string): any {
    return this.configurationService.deleteSetting(key);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get setting categories' })
  @ApiResponse({ status: 200, description: 'Categories retrieved' })
  getCategories(): any {
    return this.configurationService.getCategories();
  }

  @Get('history')
  @ApiOperation({ summary: 'Get configuration change history' })
  @ApiResponse({ status: 200, description: 'Change history retrieved' })
  getChangeHistory(): any {
    return this.configurationService.getChangeHistory();
  }

  @Get('history/:key')
  @ApiOperation({ summary: 'Get change history for specific setting' })
  @ApiParam({ name: 'key', description: 'Setting key' })
  @ApiResponse({ status: 200, description: 'Setting history retrieved' })
  getSettingHistory(@Param('key') key: string): any {
    return this.configurationService.getSettingHistory(key);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate configuration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        settings: { type: 'object', description: 'Settings to validate' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Configuration validated' })
  validateConfiguration(@Body() config: any): any {
    return this.configurationService.validateConfiguration(config);
  }

  @Post('backup')
  @ApiOperation({ summary: 'Backup configuration' })
  @ApiResponse({ status: 200, description: 'Configuration backed up' })
  backupConfiguration(): any {
    return this.configurationService.backupConfiguration();
  }

  @Post('restore')
  @ApiOperation({ summary: 'Restore configuration' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        backupId: { type: 'string', description: 'Backup ID to restore' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Configuration restored' })
  restoreConfiguration(@Body() restore: any): any {
    return this.configurationService.restoreConfiguration(restore.backupId);
  }

  @Get('backups')
  @ApiOperation({ summary: 'Get configuration backups' })
  @ApiResponse({ status: 200, description: 'Backups retrieved' })
  getBackups(): any {
    return this.configurationService.getBackups();
  }

  @Get('health')
  @ApiOperation({ summary: 'Get configuration system health' })
  @ApiResponse({ status: 200, description: 'Configuration health retrieved' })
  getConfigurationHealth(): any {
    return this.configurationService.getConfigurationHealth();
  }
}
