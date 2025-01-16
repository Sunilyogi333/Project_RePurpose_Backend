import { Router } from 'express';
import { ROLE } from '../constants/enum'; 
import { AuthController } from '../controllers/auth/auth.controller'; 
import { RegisterUserDTO } from '../dtos/user.dto';
import { LoginDTO } from '../dtos/auth.dto';
import RequestValidator from '../middlewares/Request.Validator'; // Validation middleware
import authentication from '../middlewares/authentication.middleware'; // Auth middleware
import HttpException from '../utils/HttpException'; // Custom HTTP exception handler
import { catchAsync } from '../utils/catchAsync'; // Utility to handle async errors
import { container } from 'tsyringe';
import passport from '../config/passport.config';

const router = Router();
const iocAuthController = container.resolve(AuthController);

// User registration route
router.post(
  '/register',
  RequestValidator.validate(RegisterUserDTO),
  catchAsync(iocAuthController.register.bind(iocAuthController))
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
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN]), // Adjust roles as per your project
  catchAsync(iocAuthController.logout.bind(iocAuthController))
);

// // Change password route
// router.patch(
//   '/change-password',
//   authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN]),
//   catchAsync(iocAuthController.changePassword?.bind(authController)) // Add this method in AuthController if applicable
// );

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
  catchAsync(iocAuthController.googleAuth.bind(iocAuthController))
);

// router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));


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
