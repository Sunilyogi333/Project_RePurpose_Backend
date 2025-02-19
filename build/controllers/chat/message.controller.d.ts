import { Request, Response } from 'express';
export declare class MessageController {
    sendMessages(req: Request, res: Response): Promise<void>;
    allMessages(req: Request, res: Response): Promise<void>;
}
