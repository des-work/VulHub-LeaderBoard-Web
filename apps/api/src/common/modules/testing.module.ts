import { Module } from '@nestjs/common';
import { TestConfigService } from './test-config.service';
import { TestDatabaseService } from './test-database.service';
import { TestUtilsService } from './test-utils.service';

@Module({
  providers: [
    TestConfigService,
    TestDatabaseService,
    TestUtilsService,
  ],
  exports: [
    TestConfigService,
    TestDatabaseService,
    TestUtilsService,
  ],
})
export class TestingModule {}
