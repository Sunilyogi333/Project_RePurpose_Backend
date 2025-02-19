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
const mongoose_1 = __importDefault(require("mongoose"));
const chat_model_1 = __importDefault(require("../../models/chat.model"));
const statusCodes_1 = require("../../constants/statusCodes");
const user_model_1 = __importDefault(require("../../models/user.model"));
class ChatController {
    accessChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("req params", req.params);
                const { userId } = req.params;
                console.log("Received userId:", userId);
                if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
                    return res.status(400).json({ message: "Invalid user ID" });
                }
                if (!req.user) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                let isChat = yield chat_model_1.default.find({
                    users: { $all: [req.user._id, new mongoose_1.default.Types.ObjectId(userId)] },
                })
                    .populate("users", "-password")
                    .populate("latestMessage");
                isChat = yield chat_model_1.default.populate(isChat, {
                    path: "latestMessage.sender",
                    select: "name email profilePicture",
                });
                if (isChat.length > 0) {
                    return res.status(200).json(isChat[0]);
                }
                else {
                    const chatData = {
                        chatName: "sender",
                        users: [req.user._id, new mongoose_1.default.Types.ObjectId(userId)],
                    };
                    const createdChat = yield chat_model_1.default.create(chatData);
                    const fullChat = yield chat_model_1.default.findOne({ _id: createdChat._id }).populate("users", "-password");
                    return res.status(201).json({ success: true, data: fullChat });
                }
            }
            catch (error) {
                console.error("Chat access error:", error);
                return res.status(500).json({ message: "Internal Server Error" });
            }
        });
    }
    fetchChats(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const results = yield chat_model_1.default.find({ users: { $elemMatch: { $eq: req.user._id } } })
                    .populate('users', '-password')
                    .populate('latestMessage')
                    .sort({ updatedAt: -1 });
                const populatedResults = yield user_model_1.default.populate(results, {
                    path: 'latestMessage.sender',
                    select: 'name email profilePicture',
                });
                res.status(statusCodes_1.StatusCodes.SUCCESS).json({
                    success: true,
                    data: populatedResults,
                });
            }
            catch (error) {
                res.status(400).send({ error: error.message });
            }
        });
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=chat.controller.js.map