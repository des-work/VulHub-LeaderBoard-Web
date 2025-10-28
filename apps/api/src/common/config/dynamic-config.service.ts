import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ConfigWatcher {
  key: string;
  callback: (newValue: any, oldValue: any) => void;
}

export interface ConfigValidationRule {
  key: string;
  validator: (value: any) => boolean;
  errorMessage: string;
}

@Injectable()
export class DynamicConfigService implements OnModuleInit {
  private readonly logger = new Logger(DynamicConfigService.name);
  private configCache = new Map<string, any>();
  private watchers = new Map<string, Set<ConfigWatcher>>();
  private validationRules = new Map<string, ConfigValidationRule>();
  private configHistory = new Map<string, any[]>();

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    this.initializeDefaultValidationRules();
    await this.loadInitialConfig();
  }

  /**
   * Get configuration value with caching and validation
   */
  async get<T>(key: string, defaultValue?: T): Promise<T> {
    // Check cache first
    if (this.configCache.has(key)) {
      return this.configCache.get(key);
    }

    // Load from environment
    const value = this.configService.get<T>(key, defaultValue);
    
    // Validate if rule exists
    if (this.validationRules.has(key)) {
      const rule = this.validationRules.get(key)!;
      if (!rule.validator(value)) {
        throw new Error(`Configuration validation failed for ${key}: ${rule.errorMessage}`);
      }
    }

    // Cache the value
    this.configCache.set(key, value);
    
    // Record in history
    this.recordConfigChange(key, value);
    
    return value;
  }

  /**
   * Set configuration value dynamically
   */
  async set<T>(key: string, value: T): Promise<void> {
    const oldValue = this.configCache.get(key);
    
    // Validate if rule exists
    if (this.validationRules.has(key)) {
      const rule = this.validationRules.get(key)!;
      if (!rule.validator(value)) {
        throw new Error(`Configuration validation failed for ${key}: ${rule.errorMessage}`);
      }
    }

    // Update cache
    this.configCache.set(key, value);
    
    // Record in history
    this.recordConfigChange(key, value);
    
    // Notify watchers
    this.notifyWatchers(key, value, oldValue);
    
    this.logger.log(`Configuration updated: ${key} = ${value}`);
  }

  /**
   * Watch for configuration changes
   */
  watch(key: string, callback: (newValue: any, oldValue: any) => void): () => void {
    if (!this.watchers.has(key)) {
      this.watchers.set(key, new Set());
    }
    
    const watcher: ConfigWatcher = { key, callback };
    this.watchers.get(key)!.add(watcher);
    
    this.logger.log(`Registered watcher for configuration: ${key}`);
    
    // Return unsubscribe function
    return () => {
      this.watchers.get(key)?.delete(watcher);
      this.logger.log(`Unregistered watcher for configuration: ${key}`);
    };
  }

  /**
   * Register validation rule for configuration key
   */
  registerValidationRule(rule: ConfigValidationRule): void {
    this.validationRules.set(rule.key, rule);
    this.logger.log(`Registered validation rule for: ${rule.key}`);
  }

  /**
   * Get all configuration keys
   */
  getAllKeys(): string[] {
    return Array.from(this.configCache.keys());
  }

  /**
   * Get configuration history for a key
   */
  getConfigHistory(key: string): any[] {
    return this.configHistory.get(key) || [];
  }

  /**
   * Clear configuration cache
   */
  clearCache(): void {
    this.configCache.clear();
    this.logger.log('Configuration cache cleared');
  }

  /**
   * Reload configuration from environment
   */
  async reloadConfig(): Promise<void> {
    this.clearCache();
    await this.loadInitialConfig();
    this.logger.log('Configuration reloaded from environment');
  }

  /**
   * Get configuration statistics
   */
  getConfigStats(): {
    totalKeys: number;
    cachedKeys: number;
    watchersCount: number;
    validationRulesCount: number;
  } {
    return {
      totalKeys: this.configCache.size,
      cachedKeys: this.configCache.size,
      watchersCount: Array.from(this.watchers.values()).reduce((sum, set) => sum + set.size, 0),
      validationRulesCount: this.validationRules.size
    };
  }

  /**
   * Export configuration (excluding sensitive data)
   */
  exportConfig(excludeSensitive: boolean = true): Record<string, any> {
    const config: Record<string, any> = {};
    const sensitiveKeys = ['password', 'secret', 'key', 'token', 'auth'];
    
    for (const [key, value] of this.configCache.entries()) {
      if (excludeSensitive && sensitiveKeys.some(sensitive => key.toLowerCase().includes(sensitive))) {
        config[key] = '[REDACTED]';
      } else {
        config[key] = value;
      }
    }
    
    return config;
  }

  private async loadInitialConfig(): Promise<void> {
    // Load common configuration keys
    const commonKeys = [
      'NODE_ENV',
      'PORT',
      'DATABASE_URL',
      'JWT_SECRET',
      'JWT_REFRESH_SECRET',
      'REDIS_HOST',
      'REDIS_PORT',
      'CORS_ORIGIN',
      'LOG_LEVEL',
      'ENABLE_WEBSOCKETS',
      'ENABLE_EMAIL_NOTIFICATIONS',
      'ENABLE_FILE_UPLOADS',
      'ENABLE_AUDIT_LOGGING',
      'ENABLE_METRICS',
      'ENABLE_RATE_LIMITING'
    ];

    for (const key of commonKeys) {
      try {
        const value = this.configService.get(key);
        if (value !== undefined) {
          this.configCache.set(key, value);
          this.recordConfigChange(key, value);
        }
      } catch (error) {
        this.logger.warn(`Failed to load configuration for ${key}:`, error);
      }
    }
  }

  private initializeDefaultValidationRules(): void {
    // Port validation
    this.registerValidationRule({
      key: 'PORT',
      validator: (value) => typeof value === 'number' && value > 0 && value < 65536,
      errorMessage: 'Port must be a number between 1 and 65535'
    });

    // JWT Secret validation
    this.registerValidationRule({
      key: 'JWT_SECRET',
      validator: (value) => typeof value === 'string' && value.length >= 32,
      errorMessage: 'JWT secret must be a string with at least 32 characters'
    });

    // Database URL validation
    this.registerValidationRule({
      key: 'DATABASE_URL',
      validator: (value) => typeof value === 'string' && value.startsWith('postgresql://'),
      errorMessage: 'Database URL must be a valid PostgreSQL connection string'
    });

    // Redis port validation
    this.registerValidationRule({
      key: 'REDIS_PORT',
      validator: (value) => typeof value === 'number' && value > 0 && value < 65536,
      errorMessage: 'Redis port must be a number between 1 and 65535'
    });

    // Boolean validation for feature flags
    const booleanKeys = [
      'ENABLE_WEBSOCKETS',
      'ENABLE_EMAIL_NOTIFICATIONS',
      'ENABLE_FILE_UPLOADS',
      'ENABLE_AUDIT_LOGGING',
      'ENABLE_METRICS',
      'ENABLE_RATE_LIMITING'
    ];

    booleanKeys.forEach(key => {
      this.registerValidationRule({
        key,
        validator: (value) => typeof value === 'boolean' || value === 'true' || value === 'false',
        errorMessage: `${key} must be a boolean value`
      });
    });
  }

  private recordConfigChange(key: string, value: any): void {
    if (!this.configHistory.has(key)) {
      this.configHistory.set(key, []);
    }
    
    const history = this.configHistory.get(key)!;
    history.push({
      value,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 changes per key
    if (history.length > 10) {
      history.splice(0, history.length - 10);
    }
  }

  private notifyWatchers(key: string, newValue: any, oldValue: any): void {
    const watchers = this.watchers.get(key);
    if (watchers) {
      watchers.forEach(watcher => {
        try {
          watcher.callback(newValue, oldValue);
        } catch (error) {
          this.logger.error(`Error in configuration watcher for ${key}:`, error);
        }
      });
    }
  }
}
