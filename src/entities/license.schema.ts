import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { now, HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';
import { ProductSkuSchemaClass } from './product_sku.schema';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type LicenseSchemaDocument = HydratedDocument<LicenseSchemaClass>;

export enum LicenseStatus {
  active = 'active',
  inactive = 'inactive',
}

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'licenses',
})
export class LicenseSchemaClass extends EntityDocumentHelper {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ProductSkuSchemaClass' })
  productSku: ProductSkuSchemaClass;

  @Prop({
    type: String,
  })
  key: string;

  @Prop({ default: now })
  expiredAt: Date;

  @Prop({
    type: String,
    default: LicenseStatus.active,
  })
  status: LicenseStatus;

  @Prop({ default: now })
  createdAt: Date;

  @Prop({ default: now })
  updatedAt: Date;

  @Prop()
  deletedAt: Date;
}

export const LicenseSchema = SchemaFactory.createForClass(LicenseSchemaClass);
