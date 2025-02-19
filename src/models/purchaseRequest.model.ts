import mongoose, { Schema, Document } from 'mongoose';

export interface IPurchaseRequest extends Document {
  product: mongoose.Types.ObjectId;
  store: mongoose.Types.ObjectId;
  proposedPrice: number; // Store's offered price
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const purchaseRequestSchema = new Schema<IPurchaseRequest>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    store: { type: Schema.Types.ObjectId, ref: 'Store', required: true },
    proposedPrice: { type: Number, required: true }, // New field for negotiation
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const PurchaseRequest = mongoose.model<IPurchaseRequest>('PurchaseRequest', purchaseRequestSchema);
export default PurchaseRequest;
