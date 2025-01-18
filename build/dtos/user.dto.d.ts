import { ROLE } from '../constants/enum';
export declare class RegisterUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
}
export declare class UpdateUserDTO {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    profileImage?: string;
    role?: ROLE;
    isEmailVerified?: boolean;
    totalRewardPoints?: number;
}
export declare class VerifyUserDTO {
    email: string;
    isEmailVerified: boolean;
}
export declare class CompleteProfileDTO {
    userId: string;
    phoneNumber: string;
    role: string;
    storeName?: string;
}
