import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { AdminService } from '../admin/admin.service';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('overview')
  @ApiOperation({ summary: 'Get admin overview' })
  @ApiResponse({ status: 200, description: 'Admin overview retrieved' })
  getAdminOverview(): any {
    return this.adminService.getAdminOverview();
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Users retrieved' })
  getAllUsers(): any {
    return this.adminService.getAllUsers();
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'User retrieved' })
  getUser(@Param('id') id: string): any {
    return this.adminService.getUser(id);
  }

  @Put('users/:id/role')
  @ApiOperation({ summary: 'Update user role' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        role: { type: 'string', description: 'New role' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User role updated' })
  updateUserRole(@Param('id') id: string, @Body() update: any): any {
    return this.adminService.updateUserRole(id, update.role);
  }

  @Put('users/:id/status')
  @ApiOperation({ summary: 'Update user status' })
  @ApiParam({ name: 'id', description: 'User ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', description: 'New status' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'User status updated' })
  updateUserStatus(@Param('id') id: string, @Body() update: any): any {
    return this.adminService.updateUserStatus(id, update.status);
  }

  @Get('tenants')
  @ApiOperation({ summary: 'Get all tenants' })
  @ApiResponse({ status: 200, description: 'Tenants retrieved' })
  getAllTenants(): any {
    return this.adminService.getAllTenants();
  }

  @Get('tenants/:id')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant retrieved' })
  getTenant(@Param('id') id: string): any {
    return this.adminService.getTenant(id);
  }

  @Post('tenants')
  @ApiOperation({ summary: 'Create tenant' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tenant name' },
        domain: { type: 'string', description: 'Tenant domain' },
        settings: { type: 'object', description: 'Tenant settings' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tenant created' })
  createTenant(@Body() tenant: any): any {
    return this.adminService.createTenant(tenant);
  }

  @Put('tenants/:id')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Tenant name' },
        domain: { type: 'string', description: 'Tenant domain' },
        settings: { type: 'object', description: 'Tenant settings' },
        isActive: { type: 'boolean', description: 'Tenant active status' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Tenant updated' })
  updateTenant(@Param('id') id: string, @Body() update: any): any {
    return this.adminService.updateTenant(id, update);
  }

  @Delete('tenants/:id')
  @ApiOperation({ summary: 'Delete tenant' })
  @ApiParam({ name: 'id', description: 'Tenant ID' })
  @ApiResponse({ status: 200, description: 'Tenant deleted' })
  deleteTenant(@Param('id') id: string): any {
    return this.adminService.deleteTenant(id);
  }

  @Get('system/health')
  @ApiOperation({ summary: 'Get system health' })
  @ApiResponse({ status: 200, description: 'System health retrieved' })
  getSystemHealth(): any {
    return this.adminService.getSystemHealth();
  }

  @Get('system/stats')
  @ApiOperation({ summary: 'Get system statistics' })
  @ApiResponse({ status: 200, description: 'System stats retrieved' })
  getSystemStats(): any {
    return this.adminService.getSystemStats();
  }

  @Get('system/logs')
  @ApiOperation({ summary: 'Get system logs' })
  @ApiResponse({ status: 200, description: 'System logs retrieved' })
  getSystemLogs(): any {
    return this.adminService.getSystemLogs();
  }

  @Post('system/maintenance')
  @ApiOperation({ summary: 'Start maintenance mode' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', description: 'Maintenance message' },
        duration: { type: 'number', description: 'Duration in minutes' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Maintenance mode started' })
  startMaintenanceMode(@Body() maintenance: any): any {
    return this.adminService.startMaintenanceMode(maintenance);
  }

  @Post('system/maintenance/stop')
  @ApiOperation({ summary: 'Stop maintenance mode' })
  @ApiResponse({ status: 200, description: 'Maintenance mode stopped' })
  stopMaintenanceMode(): any {
    return this.adminService.stopMaintenanceMode();
  }

  @Get('maintenance/status')
  @ApiOperation({ summary: 'Get maintenance status' })
  @ApiResponse({ status: 200, description: 'Maintenance status retrieved' })
  getMaintenanceStatus(): any {
    return this.adminService.getMaintenanceStatus();
  }

  @Get('security/events')
  @ApiOperation({ summary: 'Get security events' })
  @ApiResponse({ status: 200, description: 'Security events retrieved' })
  getSecurityEvents(): any {
    return this.adminService.getSecurityEvents();
  }

  @Get('security/threats')
  @ApiOperation({ summary: 'Get security threats' })
  @ApiResponse({ status: 200, description: 'Security threats retrieved' })
  getSecurityThreats(): any {
    return this.adminService.getSecurityThreats();
  }

  @Post('security/block/:ip')
  @ApiOperation({ summary: 'Block IP address' })
  @ApiParam({ name: 'ip', description: 'IP address to block' })
  @ApiResponse({ status: 200, description: 'IP address blocked' })
  blockIpAddress(@Param('ip') ip: string): any {
    return this.adminService.blockIpAddress(ip);
  }

  @Post('security/unblock/:ip')
  @ApiOperation({ summary: 'Unblock IP address' })
  @ApiParam({ name: 'ip', description: 'IP address to unblock' })
  @ApiResponse({ status: 200, description: 'IP address unblocked' })
  unblockIpAddress(@Param('ip') ip: string): any {
    return this.adminService.unblockIpAddress(ip);
  }

  @Get('security/blocked')
  @ApiOperation({ summary: 'Get blocked IP addresses' })
  @ApiResponse({ status: 200, description: 'Blocked IPs retrieved' })
  getBlockedIpAddresses(): any {
    return this.adminService.getBlockedIpAddresses();
  }

  @Get('backups')
  @ApiOperation({ summary: 'Get system backups' })
  @ApiResponse({ status: 200, description: 'Backups retrieved' })
  getBackups(): any {
    return this.adminService.getBackups();
  }

  @Post('backups/create')
  @ApiOperation({ summary: 'Create system backup' })
  @ApiResponse({ status: 200, description: 'Backup created' })
  createBackup(): any {
    return this.adminService.createBackup();
  }

  @Post('backups/:id/restore')
  @ApiOperation({ summary: 'Restore from backup' })
  @ApiParam({ name: 'id', description: 'Backup ID' })
  @ApiResponse({ status: 200, description: 'Backup restored' })
  restoreBackup(@Param('id') id: string): any {
    return this.adminService.restoreBackup(id);
  }

  @Delete('backups/:id')
  @ApiOperation({ summary: 'Delete backup' })
  @ApiParam({ name: 'id', description: 'Backup ID' })
  @ApiResponse({ status: 200, description: 'Backup deleted' })
  deleteBackup(@Param('id') id: string): any {
    return this.adminService.deleteBackup(id);
  }
}
