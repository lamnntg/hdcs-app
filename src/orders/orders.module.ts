import { Module } from '@nestjs/common';

import { OrdersController } from './orders.controller';

import { OrdersService } from './orders.service';
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
import { OrderSchema, OrderSchemaClass } from 'src/entities/order.schema';
import {
  OrderDetailSchema,
  OrderDetailSchemaClass,
} from 'src/entities/order_detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: CategorySchemaClass.name, schema: CategorySchema },
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: OrderDetailSchemaClass.name, schema: OrderDetailSchema },
    ]),
    FilesMinioModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService, FilesMinioService],
  exports: [OrdersService],
})
export class OrdersModule {}
