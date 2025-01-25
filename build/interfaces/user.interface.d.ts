import { Document, ObjectId } from 'mongoose';
import { ROLE } from '../constants/enum';
export interface IUser extends Document {
    _id: ObjectId;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    googleId?: string;
    profilePicture?: string;
    phoneNumber: string;
    role: ROLE;
    storeName?: string;
    storeStatus?: string;
    isGoogleUser: boolean;
    isEmailVerified: boolean;
    isProfileCompleted: boolean;
    refreshToken?: string;
    totalRewardPoints: number;
    createdAt: Date;
    updatedAt: Date;
    isPasswordCorrect(password: string): Promise<boolean>;
    generateAccessToken(): Promise<string>;
    generateRefreshToken(): Promise<string>;
}
