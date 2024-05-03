import { Module } from '@nestjs/common';
import { FilesMinioController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FilesMinioService } from './files.service';

import { DocumentFilePersistenceModule } from '../files/infrastructure/persistence/document/document-persistence.module';
import { RelationalFilePersistenceModule } from '../files/infrastructure/persistence/relational/relational-persistence.module';
import { DatabaseConfig } from '../database/config/database-config.type';
import databaseConfig from '../database/config/database.config';

// <database-block>
const infrastructurePersistenceModule = (databaseConfig() as DatabaseConfig)
  .isDocumentDatabase
  ? DocumentFilePersistenceModule
  : RelationalFilePersistenceModule;
// </database-block>

@Module({
  imports: [infrastructurePersistenceModule, ConfigModule],
  controllers: [FilesMinioController],
  providers: [FilesMinioService, ConfigService],
  exports: [FilesMinioService],
})
export class FilesMinioModule {}
