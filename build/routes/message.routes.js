"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const enum_1 = require("../constants/enum");
const message_controller_1 = require("../controllers/chat/message.controller");
const router = (0, express_1.Router)();
const iocChatController = tsyringe_1.container.resolve(message_controller_1.MessageController);
router.post('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(iocChatController.sendMessages.bind(iocChatController)));
router.get('/:chatId', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(iocChatController.allMessages.bind(iocChatController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=message.routes.js.map