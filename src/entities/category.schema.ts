import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { EntityDocumentHelper } from '../utils/document-entity-helper';

// We use class-transformer in schema and domain entity.
// We duplicate these rules because you can choose not to use adapters
// in your project and return an schema entity directly in response.
export type CategorySchemaDocument = HydratedDocument<CategorySchemaClass>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
  },
  collection: 'categories',
})
export class CategorySchemaClass extends EntityDocumentHelper {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CategorySchemaClass',
    default: null,
  })
  parent: CategorySchemaClass | null;

  @Prop({
    type: String,
  })
  name: string;

  @Prop({
    type: String,
    unique: true,
  })
  slug: string;

  @Prop({
    type: String,
  })
  description: string | null;
}

export const CategorySchema = SchemaFactory.createForClass(CategorySchemaClass);
