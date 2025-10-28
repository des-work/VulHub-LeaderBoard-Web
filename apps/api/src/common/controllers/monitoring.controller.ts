import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { MonitoringService } from '../monitoring/monitoring.service';

@ApiTags('monitoring')
@Controller('monitoring')
export class MonitoringController {
  constructor(private monitoringService: MonitoringService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get monitoring overview' })
  @ApiResponse({ status: 200, description: 'Monitoring overview retrieved' })
  getMonitoringOverview(): any {
    return this.monitoringService.getMonitoringOverview();
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get all metrics' })
  @ApiResponse({ status: 200, description: 'Metrics retrieved' })
  getAllMetrics(): any {
    return this.monitoringService.getAllMetrics();
  }

  @Get('metrics/:name')
  @ApiOperation({ summary: 'Get specific metric' })
  @ApiParam({ name: 'name', description: 'Metric name' })
  @ApiResponse({ status: 200, description: 'Metric retrieved' })
  getMetric(@Param('name') name: string): any {
    return this.monitoringService.getMetric(name);
  }

  @Get('alerts')
  @ApiOperation({ summary: 'Get active alerts' })
  @ApiResponse({ status: 200, description: 'Active alerts retrieved' })
  getActiveAlerts(): any {
    return this.monitoringService.getActiveAlerts();
  }

  @Get('alerts/history')
  @ApiOperation({ summary: 'Get alert history' })
  @ApiResponse({ status: 200, description: 'Alert history retrieved' })
  getAlertHistory(): any {
    return this.monitoringService.getAlertHistory();
  }

  @Post('alerts/:id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert acknowledged' })
  acknowledgeAlert(@Param('id') id: string): any {
    return this.monitoringService.acknowledgeAlert(id);
  }

  @Post('alerts/:id/resolve')
  @ApiOperation({ summary: 'Resolve alert' })
  @ApiParam({ name: 'id', description: 'Alert ID' })
  @ApiResponse({ status: 200, description: 'Alert resolved' })
  resolveAlert(@Param('id') id: string): any {
    return this.monitoringService.resolveAlert(id);
  }

  @Get('dashboards')
  @ApiOperation({ summary: 'Get available dashboards' })
  @ApiResponse({ status: 200, description: 'Dashboards retrieved' })
  getDashboards(): any {
    return this.monitoringService.getDashboards();
  }

  @Get('dashboards/:id')
  @ApiOperation({ summary: 'Get dashboard by ID' })
  @ApiParam({ name: 'id', description: 'Dashboard ID' })
  @ApiResponse({ status: 200, description: 'Dashboard retrieved' })
  getDashboard(@Param('id') id: string): any {
    return this.monitoringService.getDashboard(id);
  }

  @Post('dashboards')
  @ApiOperation({ summary: 'Create dashboard' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Dashboard name' },
        description: { type: 'string', description: 'Dashboard description' },
        widgets: { type: 'array', description: 'Dashboard widgets' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Dashboard created' })
  createDashboard(@Body() dashboard: any): any {
    return this.monitoringService.createDashboard(dashboard);
  }

  @Get('reports')
  @ApiOperation({ summary: 'Get available reports' })
  @ApiResponse({ status: 200, description: 'Reports retrieved' })
  getReports(): any {
    return this.monitoringService.getReports();
  }

  @Get('reports/:id')
  @ApiOperation({ summary: 'Get report by ID' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report retrieved' })
  getReport(@Param('id') id: string): any {
    return this.monitoringService.getReport(id);
  }

  @Post('reports/:id/generate')
  @ApiOperation({ summary: 'Generate report' })
  @ApiParam({ name: 'id', description: 'Report ID' })
  @ApiResponse({ status: 200, description: 'Report generated' })
  generateReport(@Param('id') id: string): any {
    return this.monitoringService.generateReport(id);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get monitoring system health' })
  @ApiResponse({ status: 200, description: 'Monitoring health retrieved' })
  getMonitoringHealth(): any {
    return this.monitoringService.getMonitoringHealth();
  }

  @Post('test-alert')
  @ApiOperation({ summary: 'Test alert system' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Test message' },
        severity: { type: 'string', description: 'Alert severity' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Test alert sent' })
  testAlert(@Body() testAlert: any): any {
    return this.monitoringService.testAlert(testAlert);
  }
}
