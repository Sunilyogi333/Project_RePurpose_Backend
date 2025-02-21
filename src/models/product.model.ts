import mongoose, { Schema } from 'mongoose'
import { IProduct } from '../interfaces/product.interface'

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String] },
    partName: {
      type: String,
      enum: ['Interior', 'Exterior'],
    },
    ecoFriendly: {
      type: Boolean,
    },
    materialName: {
      type: String,
      enum: [
        'Elastane',
        'Viscose',
        'Acrylic',
        'Cotton',
        'Lyocell',
        'Polyamide',
        'Nylon',
        'Fiber',
        'Modal',
        'Camel',
        'Linen',
        'Wool',
        'Cupro',
      ],
    },
    categories: [{ type: Schema.Types.ObjectId, ref: 'Category', required: true }],
    attributes: [{ name: { type: String }, value: { type: String } }],
    condition: { type: Number, min: 1, max: 5 },
    code: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    soldTo: { type: Schema.Types.ObjectId, ref: "Store" }, // Store that purchased
    soldPrice: { type: Number }, // Final sold price   
     status: {
      type: String,
      enum: ['AVAILABLE', 'ORDERED', 'SOLD', 'DONATED'],
      default: 'AVAILABLE',
    },
    rewardPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const Product = mongoose.model<IProduct>('Product', productSchema)
export default Product
