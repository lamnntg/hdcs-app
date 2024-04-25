import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';
import { CategorySchemaClass } from './category.schema';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type ProductSchemaDocument = HydratedDocument<ProductSchemaClass>;

export enum ProductStatus {
  active = 'active',
  inactive = 'inactive',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'products',
})
export class ProductSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'CategorySchemaClass' })
  category: CategorySchemaClass;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: String,
    default: ProductStatus.active,
  })
  status: ProductStatus;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ProductSchema = SchemaFactory.createForClass(ProductSchemaClass);
