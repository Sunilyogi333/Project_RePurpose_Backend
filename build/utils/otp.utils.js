"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateOtp = (length = 6) => {
    if (length <= 0) {
        throw new Error('Length must be a positive integer');
    }
    const otp = crypto_1.default.randomInt(10 ** (length - 1), 10 ** length).toString();
    return otp;
};
exports.generateOtp = generateOtp;
//# sourceMappingURL=otp.utils.js.map