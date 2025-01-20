"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
exports.AuthController = void 0;
const user_service_1 = require("../../services/user/user.service");
const response_1 = require("../../utils/response");
const statusCodes_1 = require("../../constants/statusCodes");
const HttpException_1 = __importDefault(require("../../utils/HttpException"));
const tsyringe_1 = require("tsyringe");
const env_config_1 = require("../../config/env.config");
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_service_1 = __importDefault(require("../../services/email.service"));
const generateOtp_1 = __importDefault(require("../../utils/generateOtp"));
const otp_model_1 = __importDefault(require("../../models/otp.model"));
const token_model_1 = __importDefault(require("../../models/token.model"));
const crypto = __importStar(require("crypto"));
let AuthController = class AuthController {
    constructor(userService) {
        this.userService = userService;
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { firstName, lastName, email, password, role, phoneNumber } = req.body;
            const userData = { firstName, lastName, email, password, role, phoneNumber };
            const newUser = yield this.userService.createUser(userData);
            const otp = (0, generateOtp_1.default)();
            const otpDocument = new otp_model_1.default({
                userId: newUser._id,
                otp,
                expiresAt: Date.now() + 5 * 60 * 1000,
            });
            yield otpDocument.save();
            const emailContent = `<p>Dear ${firstName},</p>
                          <p>Your OTP for email verification is: <b>${otp}</b></p>
                          <p>This OTP is valid for 10 minutes.</p>`;
            yield (0, email_service_1.default)(email, 'Email Verification OTP', emailContent);
            res.status(statusCodes_1.StatusCodes.CREATED).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.CREATED, 'Verification Email Sent', {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role,
            }));
        });
    }
    verifyOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, otp } = req.body;
            try {
                if (!userId || !otp) {
                    throw HttpException_1.default.BadRequest('User ID and OTP are required.');
                }
                const otpRecord = yield otp_model_1.default.findOne({ userId });
                if (!otpRecord) {
                    throw HttpException_1.default.NotFound('OTP record not found.');
                }
                if (otpRecord.expiresAt.getTime() < Date.now()) {
                    throw HttpException_1.default.BadRequest('OTP has expired.');
                }
                const isOtpValid = yield otpRecord.isOtpCorrect(otp);
                if (!isOtpValid) {
                    throw HttpException_1.default.Unauthorized('Invalid OTP.');
                }
                const updatedUser = yield this.userService.updateUser(userId, { isEmailVerified: true });
                yield otp_model_1.default.deleteOne({ userId });
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Email verified and user successfully updated', {
                    id: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser._id,
                    firstName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.firstName,
                    lastName: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.lastName,
                    email: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.email,
                    role: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.role,
                    isEmailVerified: updatedUser === null || updatedUser === void 0 ? void 0 : updatedUser.isEmailVerified,
                }));
            }
            catch (error) {
                console.error('Error during OTP verification:', error);
                throw HttpException_1.default.InternalServer('Unable to verify OTP');
            }
        });
    }
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const user = yield this.userService.findByEmail(email);
            if (!user) {
                throw HttpException_1.default.Unauthorized('Invalid email or password');
            }
            if (!user.isEmailVerified) {
                res.status(statusCodes_1.StatusCodes.FORBIDDEN).json((0, response_1.createResponse)(false, statusCodes_1.StatusCodes.FORBIDDEN, 'Email is not verified. Please verify your email before logging in.', {
                    isEmailVerified: false,
                }));
                return;
            }
            const isPasswordValid = yield user.isPasswordCorrect(password);
            if (!isPasswordValid) {
                throw HttpException_1.default.Unauthorized('Invalid email or password');
            }
            const accessToken = yield user.generateAccessToken();
            const refreshToken = yield user.generateRefreshToken();
            user.refreshToken = refreshToken;
            yield user.save();
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Login successful', {
                id: user._id,
                token: accessToken,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            }));
        });
    }
    refresh(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw HttpException_1.default.Forbidden('No refresh token provided');
            }
            const user = yield this.userService.findByRefreshToken(refreshToken);
            if (!user) {
                throw HttpException_1.default.Forbidden('Invalid refresh token');
            }
            try {
                if (user.isGoogleUser) {
                    const googleResponse = yield axios_1.default.post('https://oauth2.googleapis.com/token', {
                        client_id: env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_ID,
                        client_secret: env_config_1.EnvironmentConfiguration.GOOGLE_CLIENT_SECRET,
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token',
                    }, { headers: { 'Content-Type': 'application/json' } });
                    const newAccessToken = googleResponse.data.access_token;
                    res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Token refreshed', {
                        token: newAccessToken,
                    }));
                }
                else {
                    const newAccessToken = yield user.generateAccessToken();
                    const newRefreshToken = yield user.generateRefreshToken();
                    user.refreshToken = newRefreshToken;
                    yield user.save();
                    res.cookie('refreshToken', newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 7 * 24 * 60 * 60 * 1000,
                    });
                    res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Token refreshed', {
                        token: newAccessToken,
                    }));
                }
            }
            catch (error) {
                console.error('Failed to refresh token:', error);
                throw HttpException_1.default.InternalServer('Unable to refresh token');
            }
        });
    }
    forgotPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.body;
            try {
                if (!email) {
                    throw HttpException_1.default.BadRequest('Email is required.');
                }
                const user = yield this.userService.findByEmail(email);
                if (!user) {
                    throw HttpException_1.default.NotFound('No user found with this email.');
                }
                const uniqueString = crypto.randomBytes(32).toString('hex');
                const token = new token_model_1.default({
                    userId: user._id,
                    uniqueString,
                    createdAt: new Date(),
                    expiresAt: new Date(Date.now() + 15 * 60 * 1000),
                });
                yield token.save();
                const resetLink = `${env_config_1.EnvironmentConfiguration.CLIENT_URL}/reset-password/${token.generateToken()}`;
                yield (0, email_service_1.default)(user.email, 'Password Reset Request', `Click the link below to reset your password:\n\n${resetLink}`);
                res.status(200).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Password reset link sent to your email.'));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to password reset link');
            }
        });
    }
    resetForgottenPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { token, newPassword } = req.body;
            try {
                const payload = jsonwebtoken_1.default.verify(token, env_config_1.EnvironmentConfiguration.VERIFICATION_TOKEN_SECRET);
                const existingToken = yield token_model_1.default.findOne({ userId: payload.userId });
                if (!existingToken) {
                    throw HttpException_1.default.BadRequest('Invalid or expired token.');
                }
                const isValid = yield existingToken.isUniqueStringCorrect(payload.uniqueString);
                if (!isValid) {
                    throw HttpException_1.default.BadRequest('Invalid token');
                }
                const user = yield this.userService.findUserById(payload.userId);
                if (!user) {
                    throw HttpException_1.default.NotFound('User not found');
                }
                user.password = newPassword;
                yield user.save();
                yield token_model_1.default.deleteOne({ userId: payload.userId });
                return res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, 200, 'Password changed successfully.'));
            }
            catch (error) {
                console.log('An error occured', error);
                throw HttpException_1.default.InternalServer('Internal Server Error');
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { oldPassword, newPassword } = req.body;
            const userId = req.user._id;
            try {
                const user = yield this.userService.findUserById(userId);
                if (!user) {
                    throw HttpException_1.default.NotFound('User not found');
                }
                const isMatch = yield user.isPasswordCorrect(oldPassword);
                if (!isMatch) {
                    throw HttpException_1.default.BadRequest('Old password is incorrect');
                }
                user.password = newPassword;
                yield user.save();
                res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, 200, 'Password changed successfully.'));
            }
            catch (error) {
                console.log('An error occurred', error);
                throw HttpException_1.default.InternalServer('Internal Server Error');
            }
        });
    }
    googleAuth(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Google Auth initiated'));
        });
    }
    googleAuthCallback(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            if (!user) {
                res
                    .status(statusCodes_1.StatusCodes.UNAUTHORIZED)
                    .json((0, response_1.createResponse)(false, statusCodes_1.StatusCodes.UNAUTHORIZED, 'Authentication failed'));
                return;
            }
            const { googleRefreshToken } = user;
            user.refreshToken = googleRefreshToken;
            user.isGoogleUser = true;
            yield user.save();
            const token = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, env_config_1.EnvironmentConfiguration.ACCESS_TOKEN_SECRET, {
                expiresIn: '1h',
            });
            res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Authentication successful', {
                token,
            }));
        });
    }
    logout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { refreshToken } = req.cookies;
            if (!refreshToken) {
                throw HttpException_1.default.BadRequest('No refresh token provided');
            }
            const user = yield this.userService.findByRefreshToken(refreshToken);
            if (user) {
                user.refreshToken = undefined;
                yield user.save();
            }
            res.clearCookie('refreshToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            });
            res.status(statusCodes_1.StatusCodes.SUCCESS).json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Logout successful'));
        });
    }
    completeProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userId, phoneNumber, role, storeName } = req.body;
            try {
                const updatedUser = yield this.userService.updateUser(userId, Object.assign({ phoneNumber,
                    role }, (role === 'Store' && { storeName })));
                res
                    .status(statusCodes_1.StatusCodes.SUCCESS)
                    .json((0, response_1.createResponse)(true, statusCodes_1.StatusCodes.SUCCESS, 'Profile updated successfully', updatedUser));
            }
            catch (error) {
                throw HttpException_1.default.InternalServer('Failed to update profile');
            }
        });
    }
};
exports.AuthController = AuthController;
exports.AuthController = AuthController = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map