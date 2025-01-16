import mongoose, { Schema } from 'mongoose'
import { ICategory } from '../interfaces/category.interface'

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    subcategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }], 
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

const Category = mongoose.model<ICategory>('Category', categorySchema)
export default Category
