import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AuditService } from '../audit/audit.service';

@ApiTags('audit')
@Controller('audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Get audit logs' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({ name: 'userId', required: false, description: 'Filter by user ID' })
  @ApiQuery({ name: 'action', required: false, description: 'Filter by action' })
  @ApiQuery({ name: 'resource', required: false, description: 'Filter by resource' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Audit logs retrieved' })
  async getAuditLogs(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('resource') resource?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return await this.auditService.getAuditLogs({
      page,
      limit,
      userId,
      action,
      resource,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Get audit log by ID' })
  @ApiParam({ name: 'id', description: 'Audit log ID' })
  @ApiResponse({ status: 200, description: 'Audit log retrieved' })
  async getAuditLog(@Param('id') id: string): Promise<any> {
    return await this.auditService.getAuditLog(id);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get audit statistics' })
  @ApiQuery({ name: 'period', required: false, description: 'Time period (day, week, month)' })
  @ApiResponse({ status: 200, description: 'Audit statistics retrieved' })
  async getAuditStats(@Query('period') period: string = 'day'): Promise<any> {
    return await this.auditService.getAuditStats(period);
  }

  @Get('actions')
  @ApiOperation({ summary: 'Get available actions' })
  @ApiResponse({ status: 200, description: 'Available actions retrieved' })
  async getAvailableActions(): Promise<any> {
    return await this.auditService.getAvailableActions();
  }

  @Get('resources')
  @ApiOperation({ summary: 'Get available resources' })
  @ApiResponse({ status: 200, description: 'Available resources retrieved' })
  async getAvailableResources(): Promise<any> {
    return await this.auditService.getAvailableResources();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get users with audit activity' })
  @ApiResponse({ status: 200, description: 'Users with audit activity retrieved' })
  async getUsersWithActivity(): Promise<any> {
    return await this.auditService.getUsersWithActivity();
  }

  @Get('compliance')
  @ApiOperation({ summary: 'Get compliance report' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Compliance report retrieved' })
  async getComplianceReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return await this.auditService.getComplianceReport(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Get('export')
  @ApiOperation({ summary: 'Export audit logs' })
  @ApiQuery({ name: 'format', required: false, description: 'Export format (csv, json)' })
  @ApiQuery({ name: 'startDate', required: false, description: 'Start date (ISO string)' })
  @ApiQuery({ name: 'endDate', required: false, description: 'End date (ISO string)' })
  @ApiResponse({ status: 200, description: 'Audit logs exported' })
  async exportAuditLogs(
    @Query('format') format: string = 'json',
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ): Promise<any> {
    return await this.auditService.exportAuditLogs(
      format,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
    );
  }

  @Post('retention')
  @ApiOperation({ summary: 'Set audit log retention policy' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        retentionDays: { type: 'number', description: 'Number of days to retain logs' },
        archiveBeforeDelete: { type: 'boolean', description: 'Archive before deleting' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Retention policy updated' })
  async setRetentionPolicy(@Body() policy: any): Promise<any> {
    return await this.auditService.setRetentionPolicy(policy);
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Clean up old audit logs' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        olderThanDays: { type: 'number', description: 'Delete logs older than X days' },
        dryRun: { type: 'boolean', description: 'Preview what would be deleted' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cleanup completed' })
  async cleanupOldLogs(@Body() options: any): Promise<any> {
    return await this.auditService.cleanupOldLogs(options);
  }

  @Get('health')
  @ApiOperation({ summary: 'Get audit system health' })
  @ApiResponse({ status: 200, description: 'Audit health retrieved' })
  async getAuditHealth(): Promise<any> {
    return await this.auditService.getAuditHealth();
  }
}
