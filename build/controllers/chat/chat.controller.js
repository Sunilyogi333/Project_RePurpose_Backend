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
exports.ChatController = void 0;
const server_1 = require("../../server");
const chat_service_1 = __importDefault(require("../../services/chat.service"));
const statusCodes_1 = require("../../constants/statusCodes");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
class ChatController {
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receiverId, message } = req.body;
            const senderId = req.user._id;
            try {
                const chatMessage = yield chat_service_1.default.sendMessage(senderId, receiverId, message);
                server_1.io.emit('receiveMessage', {
                    senderId,
                    receiverId,
                    message,
                    createdAt: chatMessage.createdAt,
                });
                res.status(statusCodes_1.StatusCodes.CREATED).json({
                    success: true,
                    message: 'Message sent successfully',
                    data: chatMessage,
                });
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to send message');
            }
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { receiverId } = req.query;
            const senderId = req.user._id;
            try {
                const messages = yield chat_service_1.default.getMessages(senderId, receiverId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({
                    success: true,
                    data: messages,
                });
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch messages');
            }
        });
    }
    getAllChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.user._id;
            try {
                const chats = yield chat_service_1.default.getAllChats(userId);
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({
                    success: true,
                    data: chats,
                });
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to fetch chats');
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map