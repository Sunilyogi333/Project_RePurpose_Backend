"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateOtp;
function generateOtp() {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Generated OTP:', otp);
    return otp;
}
//# sourceMappingURL=generateOtp.js.map