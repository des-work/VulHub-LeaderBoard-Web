# 🔧 **Phase 4: Flexibility & Extensibility Enhancement**

**Status**: ✅ **IN PROGRESS**  
**Focus**: Improve modularity, configuration management, and extensibility  
**Goal**: Create a highly flexible and extensible architecture

---

## 🎯 **Phase 4 Objectives**

### **4.1 Enhanced Configuration Management**
- **Environment-Specific Configs**: Development, staging, production configurations
- **Feature Flags**: Runtime feature toggling without deployments
- **Configuration Validation**: Advanced validation with custom rules
- **Hot Reloading**: Configuration changes without service restarts

### **4.2 Plugin Architecture**
- **Plugin System**: Extensible plugin architecture for custom features
- **Hook System**: Event-driven hooks for extending functionality
- **Dynamic Loading**: Runtime plugin loading and unloading
- **Plugin Marketplace**: Standardized plugin interface

### **4.3 Modular Architecture**
- **Service Discovery**: Dynamic service registration and discovery
- **Dependency Injection**: Enhanced DI with conditional providers
- **Module Federation**: Microservices-ready module system
- **API Versioning**: Flexible API versioning strategy

---

## 🚀 **Implementation Plan**

### **Step 1: Enhanced Configuration Management**

#### **1.1 Environment-Specific Configuration**
```typescript
// apps/api/src/config/environments/development.config.ts
import { registerAs } from '@nestjs/config';

export const developmentConfig = registerAs('development', () => ({
  database: {
    url: process.env.DATABASE_URL || 'postgresql://vulhub:password@localhost:5432/vulhub_dev',
    logging: true,
    synchronize: false,
  },
  redis: {
    host: 'localhost',
    port: 6379,
    password: undefined,
  },
  features: {
    enableWebSockets: true,
    enableEmailNotifications: false,
    enableFileUploads: true,
    enableAuditLogging: true,
  },
  monitoring: {
    enableMetrics: true,
    logLevel: 'debug',
  },
}));

// apps/api/src/config/environments/production.config.ts
export const productionConfig = registerAs('production', () => ({
  database: {
    url: process.env.DATABASE_URL,
    logging: false,
    synchronize: false,
    ssl: true,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    tls: process.env.REDIS_TLS === 'true',
  },
  features: {
    enableWebSockets: process.env.ENABLE_WEBSOCKETS === 'true',
    enableEmailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    enableFileUploads: process.env.ENABLE_FILE_UPLOADS === 'true',
    enableAuditLogging: process.env.ENABLE_AUDIT_LOGGING === 'true',
  },
  monitoring: {
    enableMetrics: process.env.ENABLE_METRICS === 'true',
    logLevel: process.env.LOG_LEVEL || 'info',
  },
}));
```

#### **1.2 Feature Flags System**
```typescript
// apps/api/src/common/config/feature-flags.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FeatureFlag {
  name: string;
  enabled: boolean;
  description: string;
  rolloutPercentage?: number;
  targetUsers?: string[];
  targetTenants?: string[];
  conditions?: Record<string, any>;
}

@Injectable()
export class FeatureFlagsService {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private flags = new Map<string, FeatureFlag>();

  constructor(private configService: ConfigService) {
    this.loadFeatureFlags();
  }

  /**
   * Check if a feature flag is enabled
   */
  isEnabled(flagName: string, context?: {
    userId?: string;
    tenantId?: string;
    userAgent?: string;
    [key: string]: any;
  }): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) {
      this.logger.warn(`Feature flag '${flagName}' not found`);
      return false;
    }

    // Check basic enabled status
    if (!flag.enabled) {
      return false;
    }

    // Check rollout percentage
    if (flag.rolloutPercentage && context?.userId) {
      const hash = this.hashUserId(context.userId);
      if (hash > flag.rolloutPercentage) {
        return false;
      }
    }

    // Check target users
    if (flag.targetUsers && context?.userId) {
      if (!flag.targetUsers.includes(context.userId)) {
        return false;
      }
    }

    // Check target tenants
    if (flag.targetTenants && context?.tenantId) {
      if (!flag.targetTenants.includes(context.tenantId)) {
        return false;
      }
    }

    // Check custom conditions
    if (flag.conditions) {
      for (const [key, value] of Object.entries(flag.conditions)) {
        if (context?.[key] !== value) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Update feature flag
   */
  updateFlag(flagName: string, updates: Partial<FeatureFlag>): void {
    const existingFlag = this.flags.get(flagName);
    if (existingFlag) {
      const updatedFlag = { ...existingFlag, ...updates };
      this.flags.set(flagName, updatedFlag);
      this.logger.log(`Feature flag '${flagName}' updated`);
    }
  }

  /**
   * Get all feature flags
   */
  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }

  private loadFeatureFlags(): void {
    // Load from environment variables
    const flags = this.configService.get('FEATURE_FLAGS', '{}');
    try {
      const parsedFlags = JSON.parse(flags);
      for (const [name, config] of Object.entries(parsedFlags)) {
        this.flags.set(name, config as FeatureFlag);
      }
    } catch (error) {
      this.logger.error('Failed to parse feature flags:', error);
    }

    // Load default flags
    this.loadDefaultFlags();
  }

  private loadDefaultFlags(): void {
    const defaultFlags: FeatureFlag[] = [
      {
        name: 'enable_websockets',
        enabled: true,
        description: 'Enable WebSocket real-time features',
      },
      {
        name: 'enable_email_notifications',
        enabled: false,
        description: 'Enable email notifications',
      },
      {
        name: 'enable_file_uploads',
        enabled: true,
        description: 'Enable file upload functionality',
      },
      {
        name: 'enable_audit_logging',
        enabled: true,
        description: 'Enable comprehensive audit logging',
      },
      {
        name: 'enable_advanced_analytics',
        enabled: false,
        description: 'Enable advanced analytics features',
        rolloutPercentage: 50,
      },
    ];

    for (const flag of defaultFlags) {
      if (!this.flags.has(flag.name)) {
        this.flags.set(flag.name, flag);
      }
    }
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 100;
  }
}
```

#### **1.3 Enhanced Configuration Validation**
```typescript
// apps/api/src/common/config/config-validator.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface ValidationRule {
  validator: (value: any) => boolean;
  errorMessage: string;
  required?: boolean;
  type?: string;
}

@Injectable()
export class ConfigValidatorService {
  private readonly logger = new Logger(ConfigValidatorService.name);
  private rules = new Map<string, ValidationRule[]>();

  constructor() {
    this.setupDefaultRules();
  }

  /**
   * Add validation rule for a configuration key
   */
  addRule(key: string, rule: ValidationRule): void {
    if (!this.rules.has(key)) {
      this.rules.set(key, []);
    }
    this.rules.get(key)!.push(rule);
  }

  /**
   * Validate configuration value
   */
  validate(key: string, value: any): { isValid: boolean; errors: string[] } {
    const rules = this.rules.get(key) || [];
    const errors: string[] = [];

    for (const rule of rules) {
      if (rule.required && (value === undefined || value === null)) {
        errors.push(`${key} is required`);
        continue;
      }

      if (value !== undefined && value !== null && !rule.validator(value)) {
        errors.push(`${key}: ${rule.errorMessage}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate all configuration
   */
  validateAll(config: Record<string, any>): { isValid: boolean; errors: Record<string, string[]> } {
    const errors: Record<string, string[]> = {};
    let isValid = true;

    for (const [key, value] of Object.entries(config)) {
      const validation = this.validate(key, value);
      if (!validation.isValid) {
        errors[key] = validation.errors;
        isValid = false;
      }
    }

    return { isValid, errors };
  }

  private setupDefaultRules(): void {
    // Database URL validation
    this.addRule('DATABASE_URL', {
      validator: (value) => typeof value === 'string' && value.startsWith('postgresql://'),
      errorMessage: 'Must be a valid PostgreSQL connection string',
      required: true,
    });

    // JWT Secret validation
    this.addRule('JWT_SECRET', {
      validator: (value) => typeof value === 'string' && value.length >= 32,
      errorMessage: 'Must be at least 32 characters long',
      required: true,
    });

    // Port validation
    this.addRule('PORT', {
      validator: (value) => typeof value === 'number' && value > 0 && value < 65536,
      errorMessage: 'Must be a valid port number (1-65535)',
      required: true,
    });

    // Redis configuration validation
    this.addRule('REDIS_HOST', {
      validator: (value) => typeof value === 'string' && value.length > 0,
      errorMessage: 'Must be a valid hostname',
      required: true,
    });

    this.addRule('REDIS_PORT', {
      validator: (value) => typeof value === 'number' && value > 0 && value < 65536,
      errorMessage: 'Must be a valid port number',
      required: true,
    });

    // Email configuration validation
    this.addRule('SMTP_HOST', {
      validator: (value) => typeof value === 'string' && value.includes('.'),
      errorMessage: 'Must be a valid SMTP hostname',
      required: false,
    });

    this.addRule('SMTP_PORT', {
      validator: (value) => typeof value === 'number' && value > 0 && value < 65536,
      errorMessage: 'Must be a valid SMTP port number',
      required: false,
    });
  }
}
```

### **Step 2: Plugin Architecture**

#### **2.1 Plugin Interface**
```typescript
// apps/api/src/common/plugins/plugin.interface.ts
export interface Plugin {
  name: string;
  version: string;
  description: string;
  dependencies?: string[];
  
  initialize(): Promise<void>;
  destroy(): Promise<void>;
  
  // Lifecycle hooks
  onInstall?(): Promise<void>;
  onUninstall?(): Promise<void>;
  onEnable?(): Promise<void>;
  onDisable?(): Promise<void>;
}

export interface PluginHook {
  name: string;
  execute<T>(data: T, context?: any): Promise<T>;
}

export interface PluginManager {
  registerPlugin(plugin: Plugin): Promise<void>;
  unregisterPlugin(name: string): Promise<void>;
  getPlugin(name: string): Plugin | undefined;
  getAllPlugins(): Plugin[];
  
  registerHook(hookName: string, plugin: Plugin, hook: PluginHook): void;
  executeHook<T>(hookName: string, data: T, context?: any): Promise<T>;
}
```

#### **2.2 Plugin Manager Service**
```typescript
// apps/api/src/common/plugins/plugin-manager.service.ts
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PluginManagerService implements PluginManager {
  private readonly logger = new Logger(PluginManagerService.name);
  private plugins = new Map<string, Plugin>();
  private hooks = new Map<string, Map<string, PluginHook>>();

  /**
   * Register a plugin
   */
  async registerPlugin(plugin: Plugin): Promise<void> {
    try {
      // Check dependencies
      if (plugin.dependencies) {
        for (const dep of plugin.dependencies) {
          if (!this.plugins.has(dep)) {
            throw new Error(`Plugin '${plugin.name}' requires dependency '${dep}' which is not installed`);
          }
        }
      }

      // Initialize plugin
      await plugin.initialize();
      
      // Run install hook
      if (plugin.onInstall) {
        await plugin.onInstall();
      }

      this.plugins.set(plugin.name, plugin);
      this.logger.log(`Plugin '${plugin.name}' registered successfully`);
    } catch (error) {
      this.logger.error(`Failed to register plugin '${plugin.name}':`, error);
      throw error;
    }
  }

  /**
   * Unregister a plugin
   */
  async unregisterPlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    try {
      // Run uninstall hook
      if (plugin.onUninstall) {
        await plugin.onUninstall();
      }

      // Destroy plugin
      await plugin.destroy();

      // Remove hooks
      for (const [hookName, hookMap] of this.hooks.entries()) {
        hookMap.delete(name);
        if (hookMap.size === 0) {
          this.hooks.delete(hookName);
        }
      }

      this.plugins.delete(name);
      this.logger.log(`Plugin '${name}' unregistered successfully`);
    } catch (error) {
      this.logger.error(`Failed to unregister plugin '${name}':`, error);
      throw error;
    }
  }

  /**
   * Get plugin by name
   */
  getPlugin(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all plugins
   */
  getAllPlugins(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Register a hook
   */
  registerHook(hookName: string, plugin: Plugin, hook: PluginHook): void {
    if (!this.hooks.has(hookName)) {
      this.hooks.set(hookName, new Map());
    }
    
    this.hooks.get(hookName)!.set(plugin.name, hook);
    this.logger.log(`Hook '${hookName}' registered for plugin '${plugin.name}'`);
  }

  /**
   * Execute a hook
   */
  async executeHook<T>(hookName: string, data: T, context?: any): Promise<T> {
    const hookMap = this.hooks.get(hookName);
    if (!hookMap || hookMap.size === 0) {
      return data;
    }

    let result = data;
    
    for (const [pluginName, hook] of hookMap) {
      try {
        result = await hook.execute(result, context);
        this.logger.debug(`Hook '${hookName}' executed by plugin '${pluginName}'`);
      } catch (error) {
        this.logger.error(`Hook '${hookName}' failed in plugin '${pluginName}':`, error);
        // Continue with other hooks
      }
    }

    return result;
  }

  /**
   * Enable a plugin
   */
  async enablePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (plugin.onEnable) {
      await plugin.onEnable();
    }
    
    this.logger.log(`Plugin '${name}' enabled`);
  }

  /**
   * Disable a plugin
   */
  async disablePlugin(name: string): Promise<void> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      throw new Error(`Plugin '${name}' not found`);
    }

    if (plugin.onDisable) {
      await plugin.onDisable();
    }
    
    this.logger.log(`Plugin '${name}' disabled`);
  }
}
```

#### **2.3 Example Plugin Implementation**
```typescript
// apps/api/src/plugins/analytics.plugin.ts
import { Injectable } from '@nestjs/common';
import { Plugin, PluginHook } from '../common/plugins/plugin.interface';

@Injectable()
export class AnalyticsPlugin implements Plugin {
  name = 'analytics';
  version = '1.0.0';
  description = 'Advanced analytics and reporting plugin';
  dependencies = [];

  async initialize(): Promise<void> {
    console.log('Analytics plugin initialized');
  }

  async destroy(): Promise<void> {
    console.log('Analytics plugin destroyed');
  }

  async onInstall(): Promise<void> {
    console.log('Analytics plugin installed');
  }

  async onUninstall(): Promise<void> {
    console.log('Analytics plugin uninstalled');
  }

  async onEnable(): Promise<void> {
    console.log('Analytics plugin enabled');
  }

  async onDisable(): Promise<void> {
    console.log('Analytics plugin disabled');
  }

  // Hook implementations
  getUserAnalyticsHook(): PluginHook {
    return {
      name: 'user.analytics',
      execute: async (data: any, context?: any) => {
        // Add analytics data to user data
        return {
          ...data,
          analytics: {
            lastLogin: new Date(),
            sessionCount: 1,
            featureUsage: {},
          },
        };
      },
    };
  }

  getSubmissionAnalyticsHook(): PluginHook {
    return {
      name: 'submission.analytics',
      execute: async (data: any, context?: any) => {
        // Track submission analytics
        console.log('Tracking submission analytics:', data);
        return data;
      },
    };
  }
}
```

### **Step 3: Enhanced Module System**

#### **3.1 Dynamic Module Registration**
```typescript
// apps/api/src/common/modules/dynamic-module.service.ts
import { Injectable, Logger, DynamicModule, Module } from '@nestjs/common';

export interface ModuleConfig {
  name: string;
  imports?: any[];
  providers?: any[];
  controllers?: any[];
  exports?: any[];
  global?: boolean;
}

@Injectable()
export class DynamicModuleService {
  private readonly logger = new Logger(DynamicModuleService.name);
  private registeredModules = new Map<string, ModuleConfig>();

  /**
   * Register a dynamic module
   */
  registerModule(config: ModuleConfig): DynamicModule {
    this.registeredModules.set(config.name, config);
    this.logger.log(`Dynamic module '${config.name}' registered`);

    return {
      module: class DynamicModule {},
      imports: config.imports || [],
      providers: config.providers || [],
      controllers: config.controllers || [],
      exports: config.exports || [],
      global: config.global || false,
    };
  }

  /**
   * Get module configuration
   */
  getModuleConfig(name: string): ModuleConfig | undefined {
    return this.registeredModules.get(name);
  }

  /**
   * Get all registered modules
   */
  getAllModules(): ModuleConfig[] {
    return Array.from(this.registeredModules.values());
  }

  /**
   * Unregister a module
   */
  unregisterModule(name: string): void {
    if (this.registeredModules.delete(name)) {
      this.logger.log(`Dynamic module '${name}' unregistered`);
    }
  }
}
```

#### **3.2 Service Discovery**
```typescript
// apps/api/src/common/services/service-discovery.service.ts
import { Injectable, Logger } from '@nestjs/common';

export interface ServiceInfo {
  name: string;
  version: string;
  host: string;
  port: number;
  health: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class ServiceDiscoveryService {
  private readonly logger = new Logger(ServiceDiscoveryService.name);
  private services = new Map<string, ServiceInfo>();

  /**
   * Register a service
   */
  registerService(service: ServiceInfo): void {
    this.services.set(service.name, service);
    this.logger.log(`Service '${service.name}' registered`);
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
      this.logger.log(`Service '${name}' health updated: ${health}`);
    }
  }
}
```

---

## 🎯 **Phase 4 Implementation Status**

### **✅ Completed**
- **Dynamic Configuration Service**: Runtime configuration management
- **Configuration Validation**: Comprehensive validation rules
- **Environment-Specific Configs**: Development and production configurations
- **Feature Flags System**: Runtime feature toggling
- **Plugin Architecture**: Extensible plugin system
- **Service Discovery**: Dynamic service registration

### **🔄 In Progress**
- **Plugin Manager**: Complete plugin lifecycle management
- **Hook System**: Event-driven extension points
- **Module Federation**: Microservices-ready modules
- **API Versioning**: Flexible versioning strategy

### **📋 Next Steps**
- **Plugin Marketplace**: Standardized plugin interface
- **Configuration Hot Reloading**: Live configuration updates
- **Advanced Feature Flags**: A/B testing and gradual rollouts
- **Service Mesh Integration**: Advanced service discovery

---

## 🚀 **Benefits Achieved**

### **Flexibility**
- **Runtime Configuration**: Change settings without deployments
- **Feature Flags**: Enable/disable features dynamically
- **Plugin System**: Extend functionality without code changes
- **Environment Management**: Easy environment-specific configurations

### **Extensibility**
- **Plugin Architecture**: Third-party extensions
- **Hook System**: Event-driven customization
- **Service Discovery**: Dynamic service registration
- **Module System**: Flexible module composition

### **Maintainability**
- **Configuration Validation**: Prevent configuration errors
- **Service Health**: Monitor service status
- **Plugin Management**: Easy plugin lifecycle management
- **Environment Isolation**: Clear environment boundaries

---

**Phase 4: Flexibility & Extensibility is now in progress with comprehensive configuration management, plugin architecture, and enhanced modularity!** 🚀
