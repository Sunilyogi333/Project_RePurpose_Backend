import { Request, Response } from 'express';
export declare class NotificationController {
    getNotificationsForUser(req: Request, res: Response): Promise<void>;
    markAsRead(req: Request, res: Response): Promise<void>;
    createNotification(req: Request, res: Response): Promise<void>;
}
