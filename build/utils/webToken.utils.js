"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_config_1 = require("../config/env.config");
const tsyringe_1 = require("tsyringe");
let WebToken = class WebToken {
    sign(user, options, role) {
        return jsonwebtoken_1.default.sign({
            id: user.id,
            role,
        }, options.secret, {
            expiresIn: options.expiresIn,
        });
    }
    verify(token, secret) {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    generateTokens(user, role) {
        const accessToken = this.sign(user, {
            expiresIn: env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_EXPIRES_IN,
            secret: env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_SECRET,
        }, role);
        const refreshToken = this.sign(user, {
            expiresIn: env_config_1.EnvironmentConfiguration.REFRESH_TOKEN_EXPIRES_IN,
            secret: env_config_1.EnvironmentConfiguration.REFRESH_TOKEN_SECRET,
        }, role);
        return { accessToken, refreshToken };
    }
};
exports.WebToken = WebToken;
exports.WebToken = WebToken = __decorate([
    (0, tsyringe_1.autoInjectable)()
], WebToken);
//# sourceMappingURL=webToken.utils.js.map