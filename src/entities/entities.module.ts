import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaClass, ProductSchema } from './product.schema';
import { ProductSkuSchemaClass, ProductSkuSchema } from './product_sku.schema';
import { CategorySchemaClass, CategorySchema } from './category.schema';
import { OrderSchemaClass, OrderSchema } from './order.schema';
import {
  OrderDetailSchemaClass,
  OrderDetailSchema,
} from './order_detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: CategorySchemaClass.name, schema: CategorySchema },
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: OrderDetailSchemaClass.name, schema: OrderDetailSchema },
    ]),
  ],
})
export class EntitiesModule {}
