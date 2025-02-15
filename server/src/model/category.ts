import { Schema, model, Document, SchemaType } from 'mongoose';

export interface Category extends Document {
  _id: number;
  title: string;
  description: string;
  previewImage: string;
  order: number;
}

export const categorySchema = new Schema<Category>(
  {
    _id: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    previewImage: {
      type: String
    },
    order: {
      type: Number,
      required: true
    }
  },
  {
    collection: 'categories',
    versionKey: false
  }
);

export const CategoryModel = model<Category>('Category', categorySchema);
