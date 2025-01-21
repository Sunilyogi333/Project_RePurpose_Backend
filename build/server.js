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
exports.io = void 0;
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const mongoose_connection_1 = __importDefault(require("./db/mongoose.connection"));
const env_config_1 = require("./config/env.config");
const middlewares_1 = __importDefault(require("./middlewares"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
let users = {};
let stores = {};
function bootStrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_connection_1.default)();
            yield (0, middlewares_1.default)(app);
            exports.io.on('connection', (socket) => {
                console.log('A user connected:', socket.id);
                socket.on('register', (userId, role) => {
                    users[userId] = socket.id;
                    if (role === 'store') {
                        if (!stores[role]) {
                            stores[role] = [];
                        }
                        stores[role].push(socket.id);
                        console.log(`Store ${userId} registered with socket ID ${socket.id}`);
                    }
                });
                socket.on('sendMessage', (data) => {
                    console.log('Sending private message:', data);
                    const receiverSocketId = users[data.receiverId];
                    if (receiverSocketId) {
                        exports.io.to(receiverSocketId).emit('receiveMessage', {
                            productId: data.productId,
                            senderId: data.senderId,
                            receiverId: data.receiverId,
                            message: data.message,
                            createdAt: new Date(),
                        });
                        console.log('Private message sent to:', data.receiverId);
                    }
                    else {
                        console.log('Receiver not connected:', data.receiverId);
                    }
                });
                socket.on('productAdded', (productData) => {
                    console.log('New product added:', productData);
                    if (stores['store']) {
                        stores['store'].forEach((storeSocketId) => {
                            exports.io.to(storeSocketId).emit('receiveNotification', {
                                message: `New product added by Seller ${productData.sellerId}: ${productData.productName}`,
                                productId: productData.productId,
                            });
                        });
                    }
                });
                socket.on('disconnect', () => {
                    for (let userId in users) {
                        if (users[userId] === socket.id) {
                            delete users[userId];
                            console.log(`User ${userId} disconnected`);
                            break;
                        }
                    }
                    for (let role in stores) {
                        const index = stores[role].indexOf(socket.id);
                        if (index > -1) {
                            stores[role].splice(index, 1);
                            console.log(`Store disconnected, removed socket ID: ${socket.id}`);
                            break;
                        }
                    }
                });
            });
            server.listen(env_config_1.EnvironmentConfiguration.PORT, () => {
                console.info(`Server started at http://localhost:${env_config_1.EnvironmentConfiguration.PORT}`);
            });
        }
        catch (error) {
            console.error('Error during server setup:', error);
            process.exit(1);
        }
    });
}
bootStrap();
//# sourceMappingURL=server.js.map