"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.NotificationController = void 0;
const tsyringe_1 = require("tsyringe");
const notification_service_1 = __importDefault(require("../../services/notification.service"));
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const statusCodes_1 = require("../../constants/statusCodes");
let NotificationController = class NotificationController {
    getNotificationsForUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.params;
            try {
                const notifications = yield notification_service_1.default.getNotificationsForUser(userId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json(notifications);
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch notifications');
            }
        });
    }
    markAsRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { notificationId } = req.params;
            try {
                yield notification_service_1.default.markNotificationAsRead(notificationId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({ success: true, message: 'Notification marked as read' });
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to mark notification as read');
            }
        });
    }
    createNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { message, productId, userIds } = req.body;
            try {
                yield notification_service_1.default.sendNotificationToStores(productId, message, userIds);
                res.status(statusCodes_1.StatusCodes.CREATED).json({ success: true, message: 'Notifications sent successfully' });
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to send notifications');
            }
        });
    }
};
exports.NotificationController = NotificationController;
exports.NotificationController = NotificationController = __decorate([
    (0, tsyringe_1.injectable)()
], NotificationController);
//# sourceMappingURL=notification.controller.js.map