import { Router } from 'express';
import { ROLE } from '../constants/enum';
import { UserController } from '../controllers/user/user.controller';
import { EditUserDTO, UpdateProfilePictureDTO } from '../dtos/user.dto';
import RequestValidator from '../middlewares/Request.Validator'; // Validation middleware
import authentication from '../middlewares/authentication.middleware'; // Auth middleware
import { catchAsync } from '../utils/catchAsync'; // Utility to handle async errors
import { container } from 'tsyringe';
import upload from '../middlewares/multer.middleware'; // Multer middleware for file uploads
import HttpException from '../utils/HttpException'; // Custom HTTP exception handler

const router = Router();
const iocUserController = container.resolve(UserController);

// Get current user details
router.get(
  '/me',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.ADMIN, ROLE.STORE]),
  catchAsync(iocUserController.getCurrentUser.bind(iocUserController))
);

// Update profile picture
router.patch(
  '/profile-picture',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  upload.single('profilePicture'), // Middleware for handling single file upload
  // RequestValidator.validate(UpdateProfilePictureDTO),
  catchAsync(iocUserController.editProfilePicture.bind(iocUserController))
);

// Edit account details
router.patch(
  '/edit',
  authentication([ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  RequestValidator.validate(EditUserDTO),
  catchAsync(iocUserController.editAccountDetails.bind(iocUserController))
);

// Get all users (admin only)
router.get(
  '/all',
  // authentication([ROLE.ADMIN]),l
  catchAsync(iocUserController.getAllUsers.bind(iocUserController))
);

router.get(
  '/',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.allUsers.bind(iocUserController))
);

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
