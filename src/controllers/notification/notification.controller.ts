import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import NotificationService from '../../services/notification.service';
import User from '../../models/user.model';
import HttpException from '../../utils/HttpException';
import { StatusCodes } from '../../constants/statusCodes';

@injectable()
export class NotificationController {
  // Get notifications for a user (store)
  async getNotificationsForUser(req: Request, res: Response): Promise<void> {
    const { userId } = req.params;
    try {
      const notifications = await NotificationService.getNotificationsForUser(userId);
      res.status(StatusCodes.SUCCESS).json(notifications);
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch notifications');
    }
  }

  // Mark notification as read
  async markAsRead(req: Request, res: Response): Promise<void> {
    const { notificationId } = req.params;
    try {
      await NotificationService.markNotificationAsRead(notificationId);
      res.status(StatusCodes.SUCCESS).json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
      throw HttpException.InternalServer('Failed to mark notification as read');
    }
  }

  // Create notification (used when new product is created)
  async createNotification(req: Request, res: Response): Promise<void> {
    const { message, productId, userIds } = req.body;
    try {
      await NotificationService.sendNotificationToStores(productId, message, userIds);
      res.status(StatusCodes.CREATED).json({ success: true, message: 'Notifications sent successfully' });
    } catch (error) {
      throw HttpException.InternalServer('Failed to send notifications');
    }
  }
}
