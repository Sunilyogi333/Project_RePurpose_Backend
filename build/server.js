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
exports.sellers = exports.stores = exports.users = exports.io = void 0;
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
exports.users = {};
exports.stores = {};
exports.sellers = {};
function bootStrap() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, mongoose_connection_1.default)();
            yield (0, middlewares_1.default)(app);
            exports.io.on('connection', (socket) => {
                console.log('A user connected:', socket.id);
                socket.on('register', (userId, role) => {
                    exports.users[userId] = socket.id;
                    if (role === 'store') {
                        if (!exports.stores[role])
                            exports.stores[role] = [];
                        exports.stores[role].push(socket.id);
                        console.log(`Store ${userId} registered with socket ID ${socket.id}`);
                    }
                    if (role === 'seller') {
                        if (!exports.sellers[role])
                            exports.sellers[role] = [];
                        exports.sellers[role].push(socket.id);
                        console.log(`Seller ${userId} registered with socket ID ${socket.id}`);
                    }
                });
                socket.on('productAdded', (productData) => {
                    console.log('New product added:', productData);
                    if (exports.stores['store']) {
                        exports.stores['store'].forEach((storeSocketId) => {
                            exports.io.to(storeSocketId).emit('receiveNotification', {
                                message: `New product added by Seller ${productData.sellerId}: ${productData.productName}`,
                                productId: productData.productId,
                            });
                        });
                    }
                });
                socket.on('sendMessage', (data) => {
                    const receiverSocketId = exports.users[data.receiverId];
                    if (receiverSocketId) {
                        exports.io.to(receiverSocketId).emit('receiveMessage', data);
                    }
                });
                socket.on('disconnect', () => {
                    let disconnectedUser = null;
                    for (const userId in exports.users) {
                        if (exports.users[userId] === socket.id) {
                            disconnectedUser = userId;
                            delete exports.users[userId];
                            console.log(`User ${userId} disconnected`);
                            break;
                        }
                    }
                    const removeFromRole = (roleMap, roleName) => {
                        var _a;
                        const index = (_a = roleMap[roleName]) === null || _a === void 0 ? void 0 : _a.indexOf(socket.id);
                        if (index > -1)
                            roleMap[roleName].splice(index, 1);
                    };
                    if (disconnectedUser) {
                        removeFromRole(exports.stores, 'store');
                        removeFromRole(exports.sellers, 'seller');
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