import mongoose, { Document } from 'mongoose';
export interface IPurchaseRequest extends Document {
    product: mongoose.Types.ObjectId;
    store: mongoose.Types.ObjectId;
    proposedPrice: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}
declare const PurchaseRequest: mongoose.Model<IPurchaseRequest, {}, {}, {}, mongoose.Document<unknown, {}, IPurchaseRequest> & IPurchaseRequest & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export default PurchaseRequest;
