import { Document, Types } from "mongoose";
export interface ICategory extends Document {
    name: string;
    slug: string;
    parentCategory: Types.ObjectId | null;
    subcategories: Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
