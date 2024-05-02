import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchemaClass, ProductSchema } from './product.schema';
import { ProductSkuSchemaClass, ProductSkuSchema } from './product_sku.schema';
import { CategorySchemaClass, CategorySchema } from './category.schema';
import { OrderSchemaClass, OrderSchema } from './order.schema';
import { PromotionSchemaClass, PromotionSchema } from './promotion.schema';
import { LicenseSchemaClass, LicenseSchema } from './license.schema';

import {
  OrderDetailSchemaClass,
  OrderDetailSchema,
} from './order_detail.schema';

import { CategorySeeder } from './seeders/category.seeder';
import { ProductSeeder } from './seeders/product.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
      { name: ProductSkuSchemaClass.name, schema: ProductSkuSchema },
      { name: CategorySchemaClass.name, schema: CategorySchema },
      { name: OrderSchemaClass.name, schema: OrderSchema },
      { name: OrderDetailSchemaClass.name, schema: OrderDetailSchema },
      { name: PromotionSchemaClass.name, schema: PromotionSchema },
      { name: LicenseSchemaClass.name, schema: LicenseSchema },
    ]),
  ],
  providers: [CategorySeeder, ProductSeeder],
  exports: [CategorySeeder, ProductSeeder],
})
export class EntitiesModule {}
