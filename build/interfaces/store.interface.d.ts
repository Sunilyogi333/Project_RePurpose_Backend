import { Document, Types } from 'mongoose';
export interface IStore extends Document {
    _id: Types.ObjectId;
    userID: Types.ObjectId;
    storeName: string;
    ownerName: string;
    email: string;
    phoneNumber: string;
    storeAddress: string;
    storeNumber: string;
    status: string;
    businessRegNumber: string;
    passportPhoto: string;
    storeFrontImage: string;
    businessRegCertificate: string;
    createdAt?: Date;
    updatedAt?: Date;
}
