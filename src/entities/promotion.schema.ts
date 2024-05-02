import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type PromotionSchemaDocument = HydratedDocument<PromotionSchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'promotions',
})
export class PromotionSchemaClass extends EntityDocumentHelper {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop() // Lưu trữ URL hoặc đường dẫn đến hình ảnh
  imageUrl: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  discountType: string;

  @Prop()
  discountValue: number;

  @Prop()
  minOrderAmount: number;

  @Prop()
  maxDiscountAmount: number;

  @Prop()
  couponCode: string;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;
}

export const PromotionSchema =
  SchemaFactory.createForClass(PromotionSchemaClass);
