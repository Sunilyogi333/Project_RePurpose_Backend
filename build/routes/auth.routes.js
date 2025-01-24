"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const enum_1 = require("../constants/enum");
const auth_controller_1 = require("../controllers/auth/auth.controller");
const user_dto_1 = require("../dtos/user.dto");
const auth_dto_1 = require("../dtos/auth.dto");
const otp_dto_1 = require("../dtos/otp.dto");
const otp_dto_2 = require("../dtos/otp.dto");
const Request_Validator_1 = __importDefault(require("../middlewares/Request.Validator"));
const authentication_middleware_1 = __importDefault(require("../middlewares/authentication.middleware"));
const HttpException_1 = __importDefault(require("../utils/HttpException"));
const catchAsync_1 = require("../utils/catchAsync");
const tsyringe_1 = require("tsyringe");
const passport_config_1 = __importDefault(require("../config/passport.config"));
const router = (0, express_1.Router)();
const iocAuthController = tsyringe_1.container.resolve(auth_controller_1.AuthController);
router.post('/register', Request_Validator_1.default.validate(user_dto_1.RegisterUserDTO), (0, catchAsync_1.catchAsync)(iocAuthController.register.bind(iocAuthController)));
router.post('/verify-otp', Request_Validator_1.default.validate(otp_dto_1.VerifyOtpDTO), (0, catchAsync_1.catchAsync)(iocAuthController.verifyOtp.bind(iocAuthController)));
router.post('/resend-otp', Request_Validator_1.default.validate(otp_dto_2.ResendOtpDTO), (0, catchAsync_1.catchAsync)(iocAuthController.resendOTP.bind(iocAuthController)));
router.post('/login', Request_Validator_1.default.validate(auth_dto_1.LoginDTO), (0, catchAsync_1.catchAsync)(iocAuthController.login.bind(iocAuthController)));
router.get('/refresh', (0, catchAsync_1.catchAsync)(iocAuthController.refresh.bind(iocAuthController)));
router.post('/logout', (0, catchAsync_1.catchAsync)(iocAuthController.logout.bind(iocAuthController)));
router.post('/forgot-password', (0, catchAsync_1.catchAsync)(iocAuthController.forgotPassword.bind(iocAuthController)));
router.post('/reset-password', (0, catchAsync_1.catchAsync)(iocAuthController.resetForgottenPassword.bind(iocAuthController)));
router.patch('/change-password', (0, authentication_middleware_1.default)([enum_1.ROLE.MEMBER, enum_1.ROLE.SELLER, enum_1.ROLE.ADMIN]), (0, catchAsync_1.catchAsync)(iocAuthController.changePassword.bind(iocAuthController)));
router.get('/google', passport_config_1.default.authenticate('google', { scope: ['profile', 'email'] }), (0, catchAsync_1.catchAsync)(iocAuthController.googleAuth.bind(iocAuthController)));
router.get('/google/callback', passport_config_1.default.authenticate('google', { session: false }), (0, catchAsync_1.catchAsync)(iocAuthController.googleAuthCallback.bind(iocAuthController)));
router.post('/complete-profile', (0, catchAsync_1.catchAsync)(iocAuthController.completeProfile.bind(iocAuthController)));
router.all('/*', (req, res) => {
    throw HttpException_1.default.MethodNotAllowed('Route not allowed');
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map