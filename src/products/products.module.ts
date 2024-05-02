import { Module } from '@nestjs/common';

import { ProductsController } from './products.controller';

import { ProductsService } from './products.service';
import { FilesModule } from '../files/files.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema, ProductSchemaClass } from 'src/entities/product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductSchemaClass.name, schema: ProductSchema },
    ]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
