import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';
import { UserSchemaClass } from '../users/infrastructure/persistence/document/entities/user.schema';
// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type OrderSchemaDocument = HydratedDocument<OrderSchemaClass>;

export enum OrderStatus {
  processing = 'processing',
  cancel = 'cancel',
  done = 'done',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'orders',
})
export class OrderSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'UserSchemaClass' })
  user: UserSchemaClass;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
  })
  shippingAddress: string;

  @Prop({
    type: String,
  })
  phone: string;

  @Prop({
    type: String,
    default: OrderStatus.processing,
  })
  status: OrderStatus;

  @Prop({
    type: String,
    default: null,
  })
  message: string | null;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const OrderSchema = SchemaFactory.createForClass(OrderSchemaClass);
