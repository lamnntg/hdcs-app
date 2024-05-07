import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { UserSchemaClass } from '../users/infrastructure/persistence/document/entities/user.schema';

export type CartSchemaDocument = HydratedDocument<CartSchemaClass>;

@Schema({
  timestamps: true,
  collection: 'carts',
})
export class CartSchemaClass {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSchemaClass',
    default: null,
  })
  userId: UserSchemaClass;

  @Prop({ required: true })
  total: number;
}

export const CartSchema = SchemaFactory.createForClass(CartSchemaClass);
