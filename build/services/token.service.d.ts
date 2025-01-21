import { IUser } from '../interfaces/user.interface';
export declare class TokenService {
    static generateAccessToken(user: IUser): string;
    static generateRefreshToken(user: IUser): string;
    static refreshAccessToken(refreshToken: string): Promise<string>;
}
