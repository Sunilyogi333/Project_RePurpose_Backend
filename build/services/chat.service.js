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
const chat_model_1 = __importDefault(require("../models/chat.model"));
class ChatService {
    sendMessage(productId, senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatMessage = new chat_model_1.default({
                productId,
                sender: senderId,
                receiver: receiverId,
                message,
                createdAt: new Date(),
            });
            yield chatMessage.save();
            return chatMessage;
        });
    }
    getMessagesForProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chat_model_1.default.find({ productId }).sort({ createdAt: 1 });
        });
    }
}
exports.default = new ChatService();
//# sourceMappingURL=chat.service.js.map