import { Request, Response } from 'express';
import { io } from '../../server'; // Import the io instance from server.ts
import ChatService from '../../services/chat.service';
import { StatusCodes } from '../../constants/statusCodes';
import HttpException from '../../utils/HttpException';

export class ChatController {
  // Send a message in the chat
  async sendMessage(req: Request, res: Response): Promise<void> {
    const {receiverId, message } = req.body;
    const senderId = req.user._id;

    try {
      // Save the message in the database via the service
      const chatMessage = await ChatService.sendMessage(senderId, receiverId, message);

      // Emit the message to the receiver in real-time
      io.emit('receiveMessage', {
        senderId,
        receiverId,
        message,
        createdAt: chatMessage.createdAt,
      });

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'Message sent successfully',
        data: chatMessage,  // You may want to return the message data as well
      });
    } catch (error) {
      throw HttpException.InternalServer('Failed to send message');
    }
  }

  // Get messages
  async getMessages(req: Request, res: Response): Promise<void> {
    const { receiverId } = req.query;
    const senderId = req.user._id;

    try {
      const messages = await ChatService.getMessages(senderId, receiverId as string); // Added type assertion
      res.status(StatusCodes.SUCCESS).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch messages');
    }
  }

  async getAllChats(req: Request, res: Response): Promise<void> {
    const userId = req.user._id;  // Get current user's ID from the authentication middleware

    try {
      const chats = await ChatService.getAllChats(userId);  // Fetch all chats for the user
      res.status(StatusCodes.SUCCESS).json({
        success: true,
        data: chats,
      });
    } catch (error) {
      throw HttpException.InternalServer('Failed to fetch chats');
    }
  }
}
