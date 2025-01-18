import { IUser } from '../../interfaces/user.interface';
export declare class UserService {
    findByEmail(email: string): Promise<IUser | null>;
    findByRefreshToken(refreshToken: string): Promise<(import("mongoose").Document<unknown, {}, IUser> & IUser & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    createUser(userData: Partial<IUser>): Promise<IUser>;
    updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser | null>;
    findUserById(id: string): Promise<IUser | null>;
    findByGoogleId(googleId: string): Promise<IUser | null>;
    deleteUser(userId: string): Promise<void>;
}
