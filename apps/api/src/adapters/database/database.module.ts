import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { TenantService } from './tenant.service';

@Global()
@Module({
  providers: [
    PrismaService,
    TenantService,
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async (configService: ConfigService) => {
        const prismaService = new PrismaService();
        await prismaService.$connect();
        return prismaService;
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService, TenantService, 'DATABASE_CONNECTION'],
})
export class DatabaseModule {}
