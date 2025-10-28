import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FeatureFlagsService {
  private readonly logger = new Logger(FeatureFlagsService.name);
  private flags: Map<string, boolean> = new Map();

  constructor(private configService: ConfigService) {
    this.loadFeatureFlags();
  }

  private loadFeatureFlags() {
    this.flags.set('enableNewDashboard', this.configService.get<boolean>('FEATURES_ENABLE_NEW_DASHBOARD', false));
    this.flags.set('enableRealtimeLeaderboard', this.configService.get<boolean>('FEATURES_ENABLE_REALTIME_LEADERBOARD', true));
    this.flags.set('enableEmailNotifications', this.configService.get<boolean>('FEATURES_ENABLE_EMAIL_NOTIFICATIONS', true));
    this.flags.set('enableAuditLogging', this.configService.get<boolean>('FEATURES_ENABLE_AUDIT_LOGGING', true));
    this.flags.set('enablePluginSystem', this.configService.get<boolean>('FEATURES_ENABLE_PLUGIN_SYSTEM', true));

    this.logger.log('Feature flags loaded:', Object.fromEntries(this.flags));
  }

  isEnabled(flagName: string): boolean {
    return this.flags.get(flagName) || false;
  }

  setFlag(flagName: string, enabled: boolean): void {
    this.flags.set(flagName, enabled);
    this.logger.warn(`Feature flag '${flagName}' set to ${enabled}`);
  }

  getAllFlags(): Record<string, boolean> {
    return Object.fromEntries(this.flags);
  }
}