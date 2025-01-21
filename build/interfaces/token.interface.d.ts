import { Document, Schema } from 'mongoose';
export interface IToken extends Document {
    userId: Schema.Types.ObjectId;
    uniqueString: string;
    createdAt: Date;
    expiresAt: Date;
    generateToken(): string;
    isUniqueStringCorrect(uniqueString: string): Promise<boolean>;
}
