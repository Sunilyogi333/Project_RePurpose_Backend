import Notification from '../models/notification.model';

export class NotificationService {
  // Send notification to all stores
  async sendNotificationToStores(productId: string, message: string, storeIds: string[]): Promise<void> {
    const notifications = storeIds.map((storeId) => ({
      user: storeId,
      productId,
      message,
      createdAt: new Date(),
      read: false, // Mark notifications as unread
    }));
    await Notification.insertMany(notifications);
  }

  // Get notifications for a user (store)
  async getNotificationsForUser(userId: string): Promise<any[]> {
    return Notification.find({ user: userId }).sort({ createdAt: -1 });
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string): Promise<void> {
    const result = await Notification.findByIdAndUpdate(notificationId, { read: true });
    if (!result) {
      throw new Error('Notification not found');
    }
  }
}

export default new NotificationService();
