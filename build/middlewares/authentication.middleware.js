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
const env_config_1 = require("../config/env.config");
const message_1 = require("../constants/message");
const user_service_1 = require("../services/user/user.service");
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const webToken_utils_1 = require("../utils/webToken.utils");
const authentication = (allowedRoles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { authorization } = req.headers;
        if (!authorization) {
            return next(HttpException_1.default.NotFound('Authorization token not found'));
        }
        const [mode, token] = authorization.trim().split(' ');
        if (!token || mode !== 'Bearer') {
            return next(HttpException_1.default.BadRequest('Invalid token format'));
        }
        try {
            const decodedToken = new webToken_utils_1.WebToken().verify(token, env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_SECRET);
            if (!decodedToken) {
                return next(HttpException_1.default.Unauthorized(message_1.Message.tokenExpire));
            }
            const { id, role } = decodedToken;
            if (allowedRoles && Array.isArray(allowedRoles) && !allowedRoles.includes(role)) {
                return next(HttpException_1.default.Unauthorized(message_1.Message.NOT_AUTHORIZED_MESSAGE));
            }
            const user = yield new user_service_1.UserService().findUserById(id);
            if (!user) {
                return next(HttpException_1.default.Unauthorized('User not found or unauthorized'));
            }
            req.user = user;
            return next();
        }
        catch (err) {
            if (err.name === 'TokenExpiredError') {
                return next(HttpException_1.default.Unauthorized('Your token has expired. Please login again.'));
            }
            console.error('Authentication Middleware Error:', err);
            return next(HttpException_1.default.InternalServer('An error occurred during authentication'));
        }
    });
};
exports.default = authentication;
//# sourceMappingURL=authentication.middleware.js.map