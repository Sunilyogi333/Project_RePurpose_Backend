import { Router } from 'express';
import { ROLE } from '../constants/enum'; 
import { AuthController } from '../controllers/auth/auth.controller'; 
import { RegisterUserDTO } from '../dtos/user.dto';
import { LoginDTO } from '../dtos/auth.dto';
import { VerifyOtpDTO } from '../dtos/otp.dto';
import { ResendOtpDTO } from '../dtos/otp.dto';  
import RequestValidator from '../middlewares/Request.Validator'; 
import authentication from '../middlewares/authentication.middleware'; 
import HttpException from '../utils/HttpException'; 
import { catchAsync } from '../utils/catchAsync'; 
import { container } from 'tsyringe';
import passport from '../config/passport.config';

const router = Router();
const iocAuthController = container.resolve(AuthController);

// User registration route
router.post(
  '/register',
  // RequestValidator.validate(RegisterUserDTO),
  catchAsync(iocAuthController.register.bind(iocAuthController))
);

// OTP verification route
router.post(
  '/verify-otp',
  RequestValidator.validate(VerifyOtpDTO), 
  catchAsync(iocAuthController.verifyOtp.bind(iocAuthController))
);

router.post(
  '/resend-otp',
  RequestValidator.validate(ResendOtpDTO), // Validate the resend OTP request
  catchAsync(iocAuthController.resendOTP.bind(iocAuthController)) // Call the resendOtp method in AuthController
);

// User login route
router.post(
  '/login',
  RequestValidator.validate(LoginDTO),
  catchAsync(iocAuthController.login.bind(iocAuthController))
);

// Token refresh route
router.get(
  '/refresh',
  catchAsync(iocAuthController.refresh.bind(iocAuthController))
);

// Logout route
router.post(
  '/logout',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.STORE, ROLE.ADMIN]),
  catchAsync(iocAuthController.logout.bind(iocAuthController))
);

// Forgot password route
router.post(
  '/forgot-password',
  catchAsync(iocAuthController.forgotPassword.bind(iocAuthController))
);

// Reset forgotten password route
router.post(
  '/reset-password',
  catchAsync(iocAuthController.resetForgottenPassword.bind(iocAuthController))
);

// Change password route
router.patch(
  '/change-password',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN]),
  catchAsync(iocAuthController.changePassword.bind(iocAuthController))
);

router.delete(
  '/me',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN]),
  catchAsync(iocAuthController.deleteMyAccount.bind(iocAuthController))
)

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  catchAsync(iocAuthController.googleAuth.bind(iocAuthController))
);

// Google authentication callback
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  catchAsync(iocAuthController.googleAuthCallback.bind(iocAuthController))
);

router.post(
  '/complete-profile',
  catchAsync(iocAuthController.completeProfile.bind(iocAuthController))
);

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
