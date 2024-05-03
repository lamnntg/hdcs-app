import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';

import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductSchemaClass } from 'src/entities/product.schema';
import { FilesMinioModule } from 'src/minio/files.module';
import { FilesMinioService } from 'src/minio/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
    ]),
    FilesMinioModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FilesMinioService],
  exports: [ProductsService],
})
export class ProductsModule {}
