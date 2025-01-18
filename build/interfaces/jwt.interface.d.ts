import { ROLE } from '../constants/enum';
export interface IJwtOptions {
    secret: string;
    expiresIn: string;
}
export interface IJwtPayload {
    id: string;
    role?: ROLE;
}
export interface JwtVerified {
    id: string;
    role: ROLE;
    iat: number;
    exp: number;
}
