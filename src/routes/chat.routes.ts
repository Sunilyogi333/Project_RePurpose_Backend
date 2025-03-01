import { Router } from 'express';
import { container } from 'tsyringe';
import { ChatController } from '../controllers/chat/chat.controller';
import RequestValidator from '../middlewares/Request.Validator'; 
import authentication from '../middlewares/authentication.middleware';
import HttpException from '../utils/HttpException';
import { catchAsync } from '../utils/catchAsync';
import { ROLE } from '../constants/enum';
import { SendMessageDTO, GetMessagesDTO } from '../dtos/chat.dto'

const router = Router();
const iocChatController = container.resolve(ChatController);

// Send a message
router.post(
  '/:userId',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocChatController.accessChat.bind(iocChatController))
);

// Get messages
router.get(
  '/',
  authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
  catchAsync(iocChatController.fetchChats.bind(iocChatController))
);

// router.get(
//   '/', 
//   authentication([ROLE.ADMIN, ROLE.MEMBER, ROLE.SELLER, ROLE.STORE]),
//   catchAsync(iocChatController.getAllChats.bind(iocChatController))  
// );

// Handle undefined routes
router.all('/*', (req, res) => {
  throw HttpException.MethodNotAllowed('Route not allowed');
});

export default router;
