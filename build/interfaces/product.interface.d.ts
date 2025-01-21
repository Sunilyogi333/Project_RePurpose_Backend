import { Document, Types } from "mongoose";
export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    partName: string;
    materialName: string;
    ecoFriendly: Boolean;
    price: number;
    images: string[];
    categories: Types.ObjectId[];
    attributes: {
        name: string;
        value: string;
    }[];
    condition: number;
    code: string;
    seller: Types.ObjectId;
    postedBy: Types.ObjectId;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}
