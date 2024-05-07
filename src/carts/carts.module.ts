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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CategorySchemaClass.name, schema: CategorySchema },
      { name: CartSchemaClass.name, schema: CartSchema },
    ]),
    CacheModule.register(),
  ],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
