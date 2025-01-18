import { Document, Schema } from 'mongoose';
export interface IOTP extends Document {
    userId: Schema.Types.ObjectId;
    otp: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
    isOtpCorrect(otp: string): Promise<boolean>;
}
