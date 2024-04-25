import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';
import { ProductSchemaClass } from './product.schema';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type ProductSkuSchemaDocument = HydratedDocument<ProductSkuSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'product_skus',
})
export class ProductSkuSchemaClass extends EntityDocumentHelper {
  @Prop({
    type: String,
  })
  code: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSchemaClass' })
  product: ProductSchemaClass;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
    default: null,
  })
  description: string;

  @Prop({
    type: String,
  })
  categoryId: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const ProductSkuSchema = SchemaFactory.createForClass(
  ProductSkuSchemaClass,
);
