import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/product.interface";

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    images: { type: [String] },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
    attributes: [{ name: { type: String }, value: { type: String } }],
    condition: { type: Number, min: 1, max: 5 },
    code: { type: String },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: "User", },
    status: {
      type: String,
      enum: ["AVAILABLE", "ORDERED", "SOLD", "DONATED"],
      default: "AVAILABLE",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product
