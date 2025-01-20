"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
class NotificationService {
    sendNotificationToStores(productId, message, storeIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const notifications = storeIds.map((storeId) => ({
                user: storeId,
                productId,
                message,
                createdAt: new Date(),
                read: false,
            }));
            yield notification_model_1.default.insertMany(notifications);
        });
    }
    getNotificationsForUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return notification_model_1.default.find({ user: userId }).sort({ createdAt: -1 });
        });
    }
    markNotificationAsRead(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield notification_model_1.default.findByIdAndUpdate(notificationId, { read: true });
            if (!result) {
                throw new Error('Notification not found');
            }
        });
    }
}
exports.NotificationService = NotificationService;
exports.default = new NotificationService();
//# sourceMappingURL=notification.service.js.map