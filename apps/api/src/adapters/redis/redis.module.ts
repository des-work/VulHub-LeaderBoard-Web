import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: RedisService,
      useFactory: (configService: ConfigService) => {
        return new RedisService({
          host: configService.get<string>('app.redis.host'),
          port: configService.get<number>('app.redis.port'),
          password: configService.get<string>('app.redis.password'),
          db: configService.get<number>('app.redis.db'),
          keyPrefix: configService.get<string>('app.redis.keyPrefix'),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
