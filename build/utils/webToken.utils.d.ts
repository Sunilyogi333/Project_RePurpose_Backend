import { IJwtOptions, IJwtPayload, JwtVerified } from '../interfaces/jwt.interface';
import { ROLE } from '../constants/enum';
export declare class WebToken {
    sign(user: IJwtPayload, options: IJwtOptions, role: ROLE): string;
    verify<T extends JwtVerified>(token: string, secret: string): T;
    generateTokens(user: IJwtPayload, role: ROLE): {
        accessToken: string;
        refreshToken: string;
    };
}
