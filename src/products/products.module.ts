import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';

import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductSchemaClass } from 'src/entities/product.schema';
import { FilesMinioModule } from 'src/minio/files.module';
import { FilesMinioService } from 'src/minio/files.service';
import {
  CategorySchema,
  CategorySchemaClass,
} from 'src/entities/category.schema';
import {
  ProductSkuSchema,
  ProductSkuSchemaClass,
} from 'src/entities/product_sku.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: CategorySchemaClass.name, schema: CategorySchema },
    ]),
    FilesMinioModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FilesMinioService],
  exports: [ProductsService],
})
export class ProductsModule {}
