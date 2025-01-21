"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const notification_controller_1 = require("../controllers/notification/notification.controller");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const enum_1 = require("../constants/enum");
const notification_dto_1 = require("../dtos/notification.dto");
const catchAsync_1 = require("../utils/catchAsync");
const router = (0, express_1.Router)();
const notificationController = tsyringe_1.container.resolve(notification_controller_1.NotificationController);
router.post('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN]), Request_Validator_1.default.validate(notification_dto_1.CreateNotificationDTO), (0, catchAsync_1.catchAsync)(notificationController.createNotification.bind(notificationController)));
router.get('/:userId', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), (0, catchAsync_1.catchAsync)(notificationController.getNotificationsForUser.bind(notificationController)));
router.patch('/:notificationId/read', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), (0, catchAsync_1.catchAsync)(notificationController.markAsRead.bind(notificationController)));
exports.default = router;
//# sourceMappingURL=notification.routes.js.map