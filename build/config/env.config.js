"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentConfiguration = void 0;
require("dotenv/config");
exports.EnvironmentConfiguration = {
    NODE_ENV: (_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : '',
    APP_NAME: (_b = process.env.APP_NAME) !== null && _b !== void 0 ? _b : '',
    PORT: process.env.PORT !== undefined ? parseInt(process.env.PORT) : 5000,
    BASE_URL: (_c = process.env.BASE_URL) !== null && _c !== void 0 ? _c : '',
    CLIENT_URL: (_d = process.env.CLIENT_URL) !== null && _d !== void 0 ? _d : '',
    MONGODB_URL: (_e = process.env.MONGODB_URL) !== null && _e !== void 0 ? _e : '',
    DB_NAME: (_f = process.env.DB_NAME) !== null && _f !== void 0 ? _f : '',
    ACCESS_TOKEN_SECRET: (_g = process.env.ACCESS_TOKEN_SECRET) !== null && _g !== void 0 ? _g : '',
    ACCESS_TOKEN_EXPIRES_IN: (_h = process.env.ACCESS_TOKEN_EXPIRES_IN) !== null && _h !== void 0 ? _h : '',
    REFRESH_TOKEN_SECRET: (_j = process.env.REFRESH_TOKEN_SECRET) !== null && _j !== void 0 ? _j : '',
    REFRESH_TOKEN_EXPIRES_IN: (_k = process.env.REFRESH_TOKEN_EXPIRES_IN) !== null && _k !== void 0 ? _k : '',
    FORGET_PASSWORD_SECRET: (_l = process.env.FORGET_PASSWORD_SECRET) !== null && _l !== void 0 ? _l : '',
    FORGET_PASSWORD_EXPIRES_IN: (_m = process.env.FORGET_PASSWORD_EXPIRES_IN) !== null && _m !== void 0 ? _m : '',
    VERIFICATION_TOKEN_SECRET: (_o = process.env.VERIFICATION_TOKEN) !== null && _o !== void 0 ? _o : '',
    VERIFICATION_TOKEN_EXPIRES_IN: (_p = process.env.VERIFICATION_TOKEN_EXPIRES_IN) !== null && _p !== void 0 ? _p : '',
    GOOGLE_CLIENT_ID: (_q = process.env.GOOGLE_CLIENT_ID) !== null && _q !== void 0 ? _q : '',
    GOOGLE_CLIENT_SECRET: (_r = process.env.GOOGLE_CLIENT_SECRET) !== null && _r !== void 0 ? _r : '',
    CALLBACK_URL: (_s = process.env.CALLBACK_URL) !== null && _s !== void 0 ? _s : '',
    GOOGLE_REFRESH_TOKEN: (_t = process.env.GOOGLE_REFRESH_TOKEN) !== null && _t !== void 0 ? _t : '',
    GOOGLE_ACCESS_TOKEN: (_u = process.env.GOOGLE_ACCESS_TOKEN) !== null && _u !== void 0 ? _u : '',
    CLOUD_NAME: (_v = process.env.CLOUD_NAME) !== null && _v !== void 0 ? _v : '',
    CLOUD_API_KEY: (_w = process.env.CLOUD_API_KEY) !== null && _w !== void 0 ? _w : '',
    CLOUD_API_SECRET: (_x = process.env.CLOUD_API_SECRET) !== null && _x !== void 0 ? _x : '',
    DEFAULT_PER_PAGE: process.env.DEFAULT_PER_PAGE !== undefined ? parseInt(process.env.DEFAULT_PER_PAGE) : 20,
    SALT_ROUNDS: process.env.SALT_ROUNDS !== undefined ? parseInt(process.env.SALT_ROUNDS) : 10,
};
//# sourceMappingURL=env.config.js.map