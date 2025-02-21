import { Document, ObjectId } from 'mongoose';
import { ROLE } from '../constants/enum'; // Import ROLES enum from constants

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
  address?: string;
  about?: string;
  storeStatus?: string;
  isGoogleUser: boolean;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  refreshToken?: string;
  totalRewardPoints: number;
  socialMediaHandles?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    tiktok?: string;
  };
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}
