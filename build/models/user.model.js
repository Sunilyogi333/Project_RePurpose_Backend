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
const enum_1 = require("../constants/enum");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const token_service_1 = require("../services/token.service");
const userSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 255,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 255,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId;
        },
        minlength: 4,
        maxlength: 1024,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    profilePicture: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        enum: [enum_1.ROLE.STORE, enum_1.ROLE.SELLER, enum_1.ROLE.ADMIN],
        default: enum_1.ROLE.SELLER,
    },
    storeName: {
        type: String,
    },
    isGoogleUser: { type: Boolean, default: false },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isStoreVerified: {
        type: Boolean, default: false
    },
    isProfileCompleted: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String,
    },
    totalRewardPoints: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('password')) {
            this.password = yield bcrypt_utils_1.BcryptService.hash(this.password);
        }
        next();
    });
});
userSchema.methods.isPasswordCorrect = function (password) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_utils_1.BcryptService.compare(password, this.password);
    });
};
userSchema.methods.generateAccessToken = function () {
    return token_service_1.TokenService.generateAccessToken(this);
};
userSchema.methods.generateRefreshToken = function () {
    return token_service_1.TokenService.generateRefreshToken(this);
};
const User = (0, mongoose_1.model)('User', userSchema);
exports.default = User;
//# sourceMappingURL=user.model.js.map