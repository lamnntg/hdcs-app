import { Module } from '@nestjs/common';
import { CartsController } from './carts.controller';
import { CartsService } from './carts.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CategorySchema,
  CategorySchemaClass,
} from '../entities/category.schema';
import { CartSchemaClass, CartSchema } from '../entities/cart.schema';
import { CacheModule } from '@nestjs/cache-manager';
import {
  CartDetailSchema,
  CartDetailSchemaClass,
} from 'src/entities/cart_detail.schema';
import {
  ProductSkuSchema,
  ProductSkuSchemaClass,
} from 'src/entities/product_sku.schema';
import { FilesMinioService } from 'src/minio/files.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategorySchemaClass.name, schema: CategorySchema },
      { name: CartSchemaClass.name, schema: CartSchema },
      { name: CartDetailSchemaClass.name, schema: CartDetailSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [CartsController],
  providers: [CartsService, FilesMinioService],
  exports: [CartsService],
})
export class CartsModule {}
