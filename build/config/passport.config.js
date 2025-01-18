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
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const user_service_1 = require("../services/user/user.service");
const env_config_1 = require("../config/env.config");
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_ID,
    clientSecret: env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_SECRET,
    callbackURL: env_config_1.EnvironmentConfiguration.CALLBACK_URL,
    passReqToCallback: true,
}, (req, accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    console.log('yaa samma ta pugya', refreshToken);
    try {
        const userService = new user_service_1.UserService();
        if (!profile.emails || profile.emails.length === 0) {
            return done(new Error('Google account does not have an email associated'));
        }
        let user = yield userService.findByGoogleId(profile.id);
        if (!user) {
            user = yield userService.createUser({
                firstName: ((_a = profile.name) === null || _a === void 0 ? void 0 : _a.givenName) || 'FirstName',
                lastName: ((_b = profile.name) === null || _b === void 0 ? void 0 : _b.familyName) || 'LastName',
                email: profile.emails[0].value,
                profileImage: ((_d = (_c = profile.photos) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.value) || '',
                isEmailVerified: true,
                googleId: profile.id,
                refreshToken: refreshToken,
            });
            console.log('refreshToken', refreshToken);
        }
        done(null, user);
    }
    catch (error) {
        console.log('Enver', env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_ID);
        console.log('Enver', env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_SECRET);
        console.log('Enver', env_config_1.EnvironmentConfiguration.CALLBACK_URL);
        done(error);
    }
})));
exports.default = passport_1.default;
//# sourceMappingURL=passport.config.js.map