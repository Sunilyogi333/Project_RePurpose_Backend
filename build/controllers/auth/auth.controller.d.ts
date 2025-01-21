import { Request, Response } from 'express';
import { UserService } from '../../services/user/user.service';
export declare class AuthController {
    private userService;
    constructor(userService: UserService);
    register(req: Request, res: Response): Promise<void>;
    verifyOtp(req: Request, res: Response): Promise<void>;
    resendOTP(req: Request, res: Response): Promise<void>;
    login(req: Request, res: Response): Promise<void>;
    refresh(req: Request, res: Response): Promise<void>;
    forgotPassword(req: Request, res: Response): Promise<void>;
    resetForgottenPassword(req: Request, res: Response): Promise<Response>;
    changePassword(req: Request, res: Response): Promise<void>;
    googleAuth(req: Request, res: Response): Promise<void>;
    googleAuthCallback(req: Request, res: Response): Promise<void>;
    logout(req: Request, res: Response): Promise<void>;
    completeProfile(req: Request, res: Response): Promise<void>;
}
