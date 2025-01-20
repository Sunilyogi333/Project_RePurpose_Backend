import { Document, Types } from "mongoose";
export interface IStore extends Document {
    userID: Types.ObjectId;
    storeName: string;
    ownerName: string;
    email: string;
    phoneNumber: string;
    passportPhoto: string;
    businessRegistrationNumber: string;
    storeAddress: {
        country: string;
        state: string;
        city: string;
        postalCode: string;
    };
    ownerGovernmentID: string;
    businessRegistrationCertificate: string;
    storefrontImage: string;
    createdAt?: Date;
    updatedAt?: Date;
}
