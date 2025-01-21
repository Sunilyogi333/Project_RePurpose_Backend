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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const webToken_utils_1 = require("../utils/webToken.utils");
const google_auth_library_1 = require("google-auth-library");
const env_config_1 = require("../config/env.config");
const webToken = new webToken_utils_1.WebToken();
class TokenService {
    static generateAccessToken(user) {
        return webToken.sign({
            id: user._id.toString(),
            role: user.role,
        }, {
            expiresIn: env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_EXPIRES_IN,
            secret: env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_SECRET,
        }, user.role);
    }
    static generateRefreshToken(user) {
        return webToken.sign({ id: user._id.toString() }, {
            expiresIn: env_config_1.EnvironmentConfiguration.REFRESH_TOKEN_EXPIRES_IN,
            secret: env_config_1.EnvironmentConfiguration.REFRESH_TOKEN_SECRET,
        }, user.role);
    }
    static refreshAccessToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const oauth2Client = new google_auth_library_1.OAuth2Client(env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_ID, env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_SECRET, env_config_1.EnvironmentConfiguration.CALLBACK_URL);
                oauth2Client.setCredentials({ refresh_token: refreshToken });
                const res = yield oauth2Client.getAccessToken();
                return res.token || '';
            }
            catch (error) {
                console.error('Error refreshing access token:', error);
                throw new Error('Error while refreshing access token');
            }
        });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=token.service.js.map