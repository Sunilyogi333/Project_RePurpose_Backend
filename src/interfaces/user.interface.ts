import { Document, ObjectId } from 'mongoose';
import { ROLE } from '../constants/enum'; // Import ROLES enum from constants

export interface IUser extends Document {
  _id: ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;  
  googleId?: string; 
  profileImage?: string;
  phoneNumber: string;
  role: ROLE;
  storeName?: string;
  isGoogleUser: boolean;
  isEmailVerified: boolean;
  isProfileCompleted: boolean;
  refreshToken?: string;
  totalRewardPoints: number;
  createdAt: Date;
  updatedAt: Date;

  // Methods
  isPasswordCorrect(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateRefreshToken(): Promise<string>;
}
