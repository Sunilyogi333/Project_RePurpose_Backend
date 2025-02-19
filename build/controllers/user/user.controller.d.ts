import { Request, Response } from 'express';
import { UserService } from '../../services/user/user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getCurrentUser(req: Request, res: Response): Promise<void>;
    editProfilePicture(req: Request, res: Response): Promise<void>;
    editAccountDetails(req: Request, res: Response): Promise<void>;
    getAllUsers(req: Request, res: Response): Promise<void>;
    allUsers(req: Request, res: Response): Promise<void>;
}
