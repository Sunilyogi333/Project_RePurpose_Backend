import { Request, Response } from 'express'
import mongoose from 'mongoose';
import { io } from '../../server' // Import the io instance from server.ts
import ChatService from '../../services/chat.service'
import Chat from '../../models/chat.model'
import { StatusCodes } from '../../constants/statusCodes'
import HttpException from '../../utils/HttpException'
import User from '../../models/user.model'

// router.get("/",auth, fetchChats);

export class ChatController {
  async accessChat(req: Request, res: Response): Promise<Response> {
    try {
      console.log("req params", req.params);
      const { userId } = req.params;
      console.log("Received userId:", userId);
  
      // Validate userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
  
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      let isChat = await Chat.find({
        users: { $all: [req.user._id, new mongoose.Types.ObjectId(userId)] }, // Ensure userId is ObjectId
      })
        .populate("users", "-password")
        .populate("latestMessage");
  
      isChat = await Chat.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email profilePicture",
      });
  
      if (isChat.length > 0) {
        return res.status(200).json(isChat[0]);
      } else {
        const chatData = {
          chatName: "sender",
          users: [req.user._id, new mongoose.Types.ObjectId(userId)], // Convert userId to ObjectId
        };
  
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
  
        return res.status(201).json({ success: true, data: fullChat });
      }
    } catch (error: any) {
      console.error("Chat access error:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  

  async fetchChats(req: Request, res: Response): Promise<void> {
    try {
      const results = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })

      // Populate the sender field in the latestMessage
      const populatedResults = await User.populate(results, {
        path: 'latestMessage.sender',
        select: 'name email profilePicture',
      })

      // res.status(200).send(populatedResults);
      res.status(StatusCodes.SUCCESS).json({
        success: true,
        data: populatedResults,
      })
    } catch (error: any) {
      res.status(400).send({ error: error.message })
    }
  }

  //   // Send a message in the chat
  //   async sendMessage(req: Request, res: Response): Promise<void> {
  //     const { receiverId, message } = req.body
  //     const senderId = req.user._id

  //     try {
  //       // Save the message in the database via the service
  //       const chatMessage = await ChatService.sendMessage(senderId, receiverId, message)

  //       // Emit the message to the receiver in real-time
  //       io.emit('receiveMessage', {
  //         senderId,
  //         receiverId,
  //         message,
  //         createdAt: chatMessage.createdAt,
  //       })

  //       res.status(StatusCodes.CREATED).json({
  //         success: true,
  //         message: 'Message sent successfully',
  //         data: chatMessage, // You may want to return the message data as well
  //       })
  //     } catch (error) {
  //       throw HttpException.InternalServer('Failed to send message')
  //     }
  //   }

  //   // Get messages
  //   async getMessages(req: Request, res: Response): Promise<void> {
  //     const { receiverId } = req.query
  //     const senderId = req.user._id

  //     try {
  //       const messages = await ChatService.getMessages(senderId, receiverId as string) // Added type assertion
  //       res.status(StatusCodes.SUCCESS).json({
  //         success: true,
  //         data: messages,
  //       })
  //     } catch (error) {
  //       throw HttpException.InternalServer('Failed to fetch messages')
  //     }
  //   }

  //   async getAllChats(req: Request, res: Response): Promise<void> {
  //     const userId = req.user._id // Get current user's ID from the authentication middleware

  //     try {
  //       const chats = await ChatService.getAllChats(userId) // Fetch all chats for the user
  //       res.status(StatusCodes.SUCCESS).json({
  //         success: true,
  //         data: chats,
  //       })
  //     } catch (error) {
  //       throw HttpException.InternalServer('Failed to fetch chats')
  //     }
  //   }
}
