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
exports.MessageController = void 0;
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const statusCodes_1 = require("../../constants/statusCodes");
const message_model_1 = __importDefault(require("../../models/message.model"));
class MessageController {
    sendMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId } = req.body;
            const { content, chatId } = req.body;
            console.log("yo ho hai content", content);
            console.log("yo ho hai req body purai", req.body);
            const newMessage = {
                sender: req.user._id,
                content: content,
                chat: chatId,
            };
            try {
                let message = yield message_model_1.default.create(newMessage);
                message = yield message.populate('sender', 'firstName lastName profilePicture');
                message = yield message.populate('chat');
                message = yield message_model_1.default.populate(message, {
                    path: 'chat.users',
                    select: 'name email image',
                });
                yield chat_model_1.default.findByIdAndUpdate(chatId, { latestMessage: message });
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({
                    success: true,
                    data: message,
                });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
    allMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const messages = yield message_model_1.default.find({ chat: req.params.chatId })
                    .populate('sender', 'name image email')
                    .populate('chat');
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({
                    success: true,
                    data: messages,
                });
            }
            catch (error) {
                res.status(400).json({ error: error.message });
            }
        });
    }
}
exports.MessageController = MessageController;
//# sourceMappingURL=message.controller.js.map