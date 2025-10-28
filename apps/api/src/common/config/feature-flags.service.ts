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

  /**
   * Get feature flag by name
   */
  getFlag(name: string): FeatureFlag | undefined {
    return this.flags.get(name);
  }

  /**
   * Add new feature flag
   */
  addFlag(flag: FeatureFlag): void {
    this.flags.set(flag.name, flag);
    this.logger.log(`Feature flag '${flag.name}' added`);
  }

  /**
   * Remove feature flag
   */
  removeFlag(name: string): void {
    if (this.flags.delete(name)) {
      this.logger.log(`Feature flag '${name}' removed`);
    }
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
      {
        name: 'enable_circuit_breaker',
        enabled: true,
        description: 'Enable circuit breaker protection',
      },
      {
        name: 'enable_retry_logic',
        enabled: true,
        description: 'Enable intelligent retry logic',
      },
      {
        name: 'enable_performance_monitoring',
        enabled: true,
        description: 'Enable real-time performance monitoring',
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
