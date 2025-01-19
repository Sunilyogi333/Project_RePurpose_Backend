import { Router } from 'express';
import { container } from 'tsyringe';
import { NotificationController } from '../controllers/notification/notification.controller'
import RequestValidator from '../middlewares/Request.Validator';
import authentication from '../middlewares/authentication.middleware';
import { ROLE } from '../constants/enum';
import { CreateNotificationDTO, MarkAsReadDTO } from '../dtos/notification.dto';
import { catchAsync } from '../utils/catchAsync';

const router = Router();
const notificationController = container.resolve(NotificationController);

// Create a notification (send to stores)
router.post(
  '/',
  authentication([ROLE.ADMIN]),
  RequestValidator.validate(CreateNotificationDTO),
  catchAsync(notificationController.createNotification.bind(notificationController))
);

// Get all notifications for a user (store)
router.get(
  '/:userId',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER]),
  catchAsync(notificationController.getNotificationsForUser.bind(notificationController))
);

// Mark notification as read
router.patch(
  '/:notificationId/read',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER]),
  catchAsync(notificationController.markAsRead.bind(notificationController))
);

export default router;
