import { Request, Response } from 'express';
import { io } from '../../server'; // Import the io instance from server.ts
import ChatService from '../../services/chat.service';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';

export class ChatController {
  // Send a message in the chat
  async sendMessage(req: Request, res: Response): Promise<void> {
    const { productId, receiverId, message } = req.body;
    const senderId = req.user._id;

    try {
      // Send the message to the database
      const chatMessage = await ChatService.sendMessage(productId, senderId, receiverId, message);

      // Emit the message to the connected clients for real-time updates using Socket.IO
      io.emit('receiveMessage', {
        productId,
        senderId,
        receiverId,
        message,
        createdAt: chatMessage.createdAt,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Message sent successfully',
        data: chatMessage,
      });
    } catch (error) {
      throw HttpException.InternalServer('Failed to send message');
    }
  }
}
