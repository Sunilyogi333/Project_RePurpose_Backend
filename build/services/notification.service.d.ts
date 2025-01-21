export declare class NotificationService {
    sendNotificationToStores(productId: string, message: string, storeIds: string[]): Promise<void>;
    getNotificationsForUser(userId: string): Promise<any[]>;
    markNotificationAsRead(notificationId: string): Promise<void>;
}
declare const _default: NotificationService;
export default _default;
