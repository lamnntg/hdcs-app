import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ProductSkuSchemaClass } from './product_sku.schema';
import { CartSchemaClass } from './cart.schema';

export type CartDetailSchemaDocument = HydratedDocument<CartDetailSchemaClass>;

@Schema({
  timestamps: true,
  collection: 'cart_details',
})
export class CartDetailSchemaClass {
  @Prop({
    required: true,
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CartSchemaClass',
  })
  cart: CartSchemaClass;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSchemaClass' })
  productSku: ProductSkuSchemaClass;

  @Prop({ required: true })
  quantity: number;

  @Prop({ required: true })
  price: number;
}

export const CartDetailSchema = SchemaFactory.createForClass(
  CartDetailSchemaClass,
);
