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
    sendMessage(senderId, receiverId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const chatMessage = new chat_model_1.default({
                sender: senderId,
                receiver: receiverId,
                message,
                createdAt: new Date(),
            });
            yield chatMessage.save();
            return chatMessage;
        });
    }
    getMessages(senderId, receiverId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield chat_model_1.default.find({ sender: senderId, receiver: receiverId });
        });
    }
    getAllChats(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chats = yield chat_model_1.default.aggregate([
                    {
                        $match: {
                            $or: [{ sender: userId }, { receiver: userId }],
                        },
                    },
                    {
                        $group: {
                            _id: {
                                $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'],
                            },
                            latestMessage: { $last: '$message' },
                            createdAt: { $last: '$createdAt' },
                        },
                    },
                    {
                        $lookup: {
                            from: 'users',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'participant',
                        },
                    },
                    {
                        $unwind: '$participant',
                    },
                    {
                        $project: {
                            participantName: '$participant.name',
                            participantId: '$participant._id',
                            latestMessage: 1,
                            createdAt: 1,
                        },
                    },
                ]);
                return chats;
            }
            catch (error) {
                throw new Error('Error fetching chats');
            }
        });
    }
}
exports.default = new ChatService();
//# sourceMappingURL=chat.service.js.map