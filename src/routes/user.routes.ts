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
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getCurrentUser.bind(iocUserController))
);

// Update profile picture
router.patch(
  '/profile-picture',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  upload.single('profilePicture'), // Middleware for handling single file upload
  // RequestValidator.validate(UpdateProfilePictureDTO),
  catchAsync(iocUserController.editProfilePicture.bind(iocUserController))
);

// Edit account details
router.patch(
  '/edit',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  // RequestValidator.validate(EditUserDTO),
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

router.delete(
  '/:userId',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.deleteUserById.bind(iocUserController))
);

router.get(
  '/sellers',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getUserWithRoleSeller.bind(iocUserController))
);

router.get(
  '/stores',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getUserWithRoleStore.bind(iocUserController))
);

router.post(
  '/report',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  upload?.single('attachment'), 
  catchAsync(iocUserController.addReport.bind(iocUserController))
);

router.get(
  '/reports',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getAllReports.bind(iocUserController))
);

router.get(
  '/reports/status/:status',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getReportsBasedOnStatus.bind(iocUserController))
);

// Edit account details
router.patch(
  '/reports/status/:reportId',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.updateReportStatus.bind(iocUserController))
);

router.get(
  '/seller/dashboard-stats',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getSellerDashboardStats.bind(iocUserController))
)

router.get(
  '/store/dashboard-stats',
  authentication([ROLE.ADMIN, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocUserController.getStoreDashboardStats.bind(iocUserController))
)

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
