import { Document, Types } from "mongoose";

export interface IProduct extends Document {
  _id: Types.ObjectId
  name: string;
  slug: string;
  description: string;
  partName: string;
  materialName: string;
  ecoFriendly: Boolean;
  price: number;
  images: string[];
  categories: Types.ObjectId[];
  attributes: { name: string; value: string }[];
  condition: number;
  code: string;
  seller: Types.ObjectId;
  soldTo: Types.ObjectId;
  soldPrice: number;
  contributionToEnvironment: number;
  rewardPoints: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
