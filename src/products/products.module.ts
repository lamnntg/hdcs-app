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
import { CategoriesService } from 'src/categories/categories.service';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: CategorySchemaClass.name, schema: CategorySchema },
    ]),
    CacheModule.register(),
    FilesMinioModule,
  ],
  controllers: [ProductsController],
  providers: [ProductsService, FilesMinioService, CategoriesService],
  exports: [ProductsService],
})
export class ProductsModule {}
