export declare class RegisterUserDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    storeName: string;
    address: string;
}
export declare class EditUserDTO {
    firstName: string;
    lastName: string;
    phoneNumber?: string;
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
export declare class UpdateProfilePictureDTO {
    profilePicture: string;
}
