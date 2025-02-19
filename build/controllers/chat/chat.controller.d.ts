import { Request, Response } from 'express';
export declare class ChatController {
    accessChat(req: Request, res: Response): Promise<Response>;
    fetchChats(req: Request, res: Response): Promise<void>;
}
