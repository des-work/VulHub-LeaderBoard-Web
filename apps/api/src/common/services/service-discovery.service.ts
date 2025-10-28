import { Injectable, Logger } from '@nestjs/common';

export interface ServiceInfo {
  name: string;
  version: string;
  host: string;
  port: number;
  health: boolean;
  metadata?: Record<string, any>;
  lastHeartbeat?: Date;
}

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name);
  private services = new Map<string, ServiceInfo>();

  /**
   * Register a service
   */
  registerService(service: ServiceInfo): void {
    const serviceWithHeartbeat = {
      ...service,
      lastHeartbeat: new Date(),
    };
    
    this.services.set(service.name, serviceWithHeartbeat);
    this.logger.log(`Service '${service.name}' registered at ${service.host}:${service.port}`);
  }

  /**
   * Discover a service
   */
  discoverService(name: string): ServiceInfo | undefined {
    return this.services.get(name);
  }

  /**
   * Get all services
   */
  getAllServices(): ServiceInfo[] {
    return Array.from(this.services.values());
  }

  /**
   * Get healthy services
   */
  getHealthyServices(): ServiceInfo[] {
    return Array.from(this.services.values()).filter(service => service.health);
  }

  /**
   * Get services by metadata
   */
  getServicesByMetadata(key: string, value: any): ServiceInfo[] {
    return Array.from(this.services.values()).filter(
      service => service.metadata?.[key] === value
    );
  }

  /**
   * Unregister a service
   */
  unregisterService(name: string): void {
    if (this.services.delete(name)) {
      this.logger.log(`Service '${name}' unregistered`);
    }
  }

  /**
   * Update service health
   */
  updateServiceHealth(name: string, health: boolean): void {
    const service = this.services.get(name);
    if (service) {
      service.health = health;
      service.lastHeartbeat = new Date();
      this.logger.log(`Service '${name}' health updated: ${health}`);
    }
  }

  /**
   * Update service heartbeat
   */
  updateHeartbeat(name: string): void {
    const service = this.services.get(name);
    if (service) {
      service.lastHeartbeat = new Date();
      this.logger.debug(`Service '${name}' heartbeat updated`);
    }
  }

  /**
   * Check service health
   */
  async checkServiceHealth(name: string): Promise<boolean> {
    const service = this.services.get(name);
    if (!service) {
      return false;
    }

    try {
      // Simple health check - could be enhanced with actual HTTP calls
      const now = new Date();
      const lastHeartbeat = service.lastHeartbeat || new Date(0);
      const timeDiff = now.getTime() - lastHeartbeat.getTime();
      
      // Consider service unhealthy if no heartbeat for 5 minutes
      const isHealthy = timeDiff < 5 * 60 * 1000;
      
      if (service.health !== isHealthy) {
        this.updateServiceHealth(name, isHealthy);
      }
      
      return isHealthy;
    } catch (error) {
      this.logger.error(`Health check failed for service '${name}':`, error);
      return false;
    }
  }

  /**
   * Get service statistics
   */
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
    const allServices = this.getAllServices();
    const healthyServices = allServices.filter(s => s.health);
    
    return {
      total: allServices.length,
      healthy: healthyServices.length,
      unhealthy: allServices.length - healthyServices.length,
      services: allServices.map(s => ({
        name: s.name,
        health: s.health,
        lastHeartbeat: s.lastHeartbeat,
      })),
    };
  }

  /**
   * Clean up stale services
   */
  cleanupStaleServices(): void {
    const now = new Date();
    const staleThreshold = 10 * 60 * 1000; // 10 minutes
    
    for (const [name, service] of this.services.entries()) {
      const lastHeartbeat = service.lastHeartbeat || new Date(0);
      const timeDiff = now.getTime() - lastHeartbeat.getTime();
      
      if (timeDiff > staleThreshold) {
        this.logger.warn(`Removing stale service '${name}' (last heartbeat: ${lastHeartbeat})`);
        this.services.delete(name);
      }
    }
  }

  /**
   * Register internal services
   */
  registerInternalServices(): void {
    // Register API service
    this.registerService({
      name: 'vulhub-api',
      version: '1.0.0',
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '4000'),
      health: true,
      metadata: {
        type: 'api',
        environment: process.env.NODE_ENV || 'development',
      },
    });

    // Register WebSocket service
    this.registerService({
      name: 'vulhub-websocket',
      version: '1.0.0',
      host: process.env.HOST || 'localhost',
      port: parseInt(process.env.PORT || '4000'),
      health: true,
      metadata: {
        type: 'websocket',
        environment: process.env.NODE_ENV || 'development',
      },
    });

    this.logger.log('Internal services registered');
  }
}
