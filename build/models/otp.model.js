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
const mongoose_1 = require("mongoose");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const otpSchema = new mongoose_1.Schema({
    userID: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, {
    timestamps: true,
});
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
otpSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isNew) {
            this.otp = yield bcrypt_utils_1.BcryptService.hash(this.otp);
        }
        next();
    });
});
otpSchema.methods.isOtpCorrect = function (otp) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_utils_1.BcryptService.compare(otp, this.otp);
    });
};
const OTP = (0, mongoose_1.model)('OTP', otpSchema);
exports.default = OTP;
//# sourceMappingURL=otp.model.js.map