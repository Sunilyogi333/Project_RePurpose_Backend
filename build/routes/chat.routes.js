"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const chat_controller_1 = require("../controllers/chat/chat.controller");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const enum_1 = require("../constants/enum");
const chat_dto_1 = require("../dtos/chat.dto");
const router = (0, express_1.Router)();
const iocChatController = tsyringe_1.container.resolve(chat_controller_1.ChatController);
router.post('/send', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), Request_Validator_1.default.validate(chat_dto_1.SendMessageDTO), (0, catchAsync_1.catchAsync)(iocChatController.sendMessage.bind(iocChatController)));
router.get('/messages', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER]), (0, catchAsync_1.catchAsync)(iocChatController.getMessages.bind(iocChatController)));
router.get('/', (0, authentication_middleware_1.default)([enum_1.ROLE.ADMIN, enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.STORE]), (0, catchAsync_1.catchAsync)(iocChatController.getAllChats.bind(iocChatController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=chat.routes.js.map