import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { CacheModule } from '@nestjs/cache-manager';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { TerminusModule } from '@nestjs/terminus';

// Configuration
import { DatabaseModule } from './adapters/database/database.module';
import { RedisModule } from './adapters/redis/redis.module';
import { StorageModule } from './adapters/storage/storage.module';
import { EmailModule } from './adapters/email/email.module';

// Core modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { SubmissionsModule } from './modules/submissions/submissions.module';
import { LeaderboardsModule } from './modules/leaderboards/leaderboards.module';
import { BadgesModule } from './modules/badges/badges.module';

// Common modules
import { HealthModule } from './common/health/health.module';
import { WebSocketModule } from './ws/websocket.module';

// Configuration
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
      envFilePath: ['.env.local', '.env'],
    }),

    // Rate limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    // Caching
    CacheModule.register({
      isGlobal: true,
      ttl: 300, // 5 minutes
    }),

    // Event system
    EventEmitterModule.forRoot(),

    // Scheduling
    ScheduleModule.forRoot(),

    // Queue system
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Health checks
    TerminusModule,

    // Infrastructure adapters
    DatabaseModule,
    RedisModule,
    StorageModule,
    EmailModule,

    // Core business modules
    AuthModule,
    UsersModule,
    ProjectsModule,
    SubmissionsModule,
    LeaderboardsModule,
    BadgesModule,

    // Common modules
    HealthModule,
    WebSocketModule,
  ],
})
export class AppModule {}
