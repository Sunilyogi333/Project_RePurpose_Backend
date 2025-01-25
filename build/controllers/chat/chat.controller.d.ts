import { Request, Response } from 'express';
export declare class ChatController {
    sendMessage(req: Request, res: Response): Promise<void>;
    getMessages(req: Request, res: Response): Promise<void>;
    getAllChats(req: Request, res: Response): Promise<void>;
}
