import mongoose, { Document, Model } from "mongoose";
export interface IToken extends Document {
    userId: mongoose.Types.ObjectId;
    uniqueString: string;
    createdAt: Date;
    expiresAt: Date;
    generateToken(): string;
    isUniqueStringCorrect(uniqueString: string): Promise<boolean>;
}
declare const Token: Model<IToken>;
export default Token;
