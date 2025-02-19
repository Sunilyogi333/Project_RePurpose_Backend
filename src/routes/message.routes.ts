import { Router } from 'express';
import { container } from 'tsyringe';
import RequestValidator from '../middlewares/Request.Validator'; 
import authentication from '../middlewares/authentication.middleware';
import HttpException from '../utils/HttpException';
import { catchAsync } from '../utils/catchAsync';
import { ROLE } from '../constants/enum';
// import { SendMessageDTO, GetMessagesDTO } from '../dtos/chat.dto'
import { MessageController } from '../controllers/chat/message.controller';

const router = Router();
const iocChatController = container.resolve(MessageController);

// Send a message
router.post(
  '/',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
//   RequestValidator.validate(SendMessageDTO),
  catchAsync(iocChatController.sendMessages.bind(iocChatController))
);

// Get messages
router.get(
  '/:chatId',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocChatController.allMessages.bind(iocChatController))
);

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
