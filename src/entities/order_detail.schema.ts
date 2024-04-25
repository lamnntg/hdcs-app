import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';
import { OrderSchemaClass } from './order.schema';
import { ProductSchemaClass } from './product.schema';
// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type OrderDetailSchemaDocument =
  HydratedDocument<OrderDetailSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'order_details',
})
export class OrderDetailSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'OrderSchemaClass' })
  order: OrderSchemaClass;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSchemaClass' })
  product: ProductSchemaClass;

  @Prop({
    type: String,
  })
  description: string;

  @Prop({
    type: Number,
  })
  quantity: number;

  @Prop({
    type: Number,
  })
  unitPrice: number;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const OrderDetailSchema = SchemaFactory.createForClass(
  OrderDetailSchemaClass,
);
