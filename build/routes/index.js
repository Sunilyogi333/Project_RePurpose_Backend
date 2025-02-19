"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const message_1 = require("../constants/message");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const user_routes_1 = __importDefault(require("./user.routes"));
const store_routes_1 = __importDefault(require("./store.routes"));
const product_routes_1 = __importDefault(require("./product.routes"));
const category_routes_1 = __importDefault(require("./category.routes"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const message_routes_1 = __importDefault(require("./message.routes"));
const notification_routes_1 = __importDefault(require("./notification.routes"));
const router = (0, express_1.Router)();
const routes = [
    {
        path: '/auth',
        route: auth_routes_1.default,
    },
    {
        path: '/user',
        route: user_routes_1.default,
    },
    {
        path: '/store',
        route: store_routes_1.default,
    },
    {
        path: '/product',
        route: product_routes_1.default
    },
    {
        path: '/category',
        route: category_routes_1.default
    },
    {
        path: '/chat',
        route: chat_routes_1.default
    },
    {
        path: '/message',
        route: message_routes_1.default
    },
    {
        path: '/notifications',
        route: notification_routes_1.default
    }
];
routes.forEach((route) => {
    router.use(route.path, route.route);
});
router.get('/', (req, res) => {
    res.send({
        success: true,
        message: message_1.Message['welcomeMessage'],
        data: [],
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map