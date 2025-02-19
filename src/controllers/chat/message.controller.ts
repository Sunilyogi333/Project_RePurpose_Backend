import { Request, Response } from 'express'
import Chat from '../../models/chat.model'
import { StatusCodes } from '../../constants/statusCodes'
import HttpException from '../../utils/HttpException'
import User from '../../models/user.model'
import Message from '../../models/message.model'

// router.get("/",auth, fetchChats);

export class MessageController {
  async sendMessages(req: Request, res: Response): Promise<void> {
    const { userId } = req.body
    const { content, chatId } = req.body

    // if (!content || !chatId) {
    //   console.log("Invalid data passed into request");
    //   return res.sendStatus(400);
    // }
    console.log("yo ho hai content", content)
    console.log("yo ho hai req body purai", req.body)

    const newMessage = {
      sender: req.user._id,
      content: content,
      chat: chatId,
    }

    try {
      // Create new message
      let message = await Message.create(newMessage)

      // Populate the sender details
      message = await message.populate('sender', 'firstName lastName profilePicture')
      // Populate chat details
      message = await message.populate('chat')
      // Populate user details for the chat users
      message = await Message.populate(message, {
        path: 'chat.users',
        select: 'name email image',
      })

      // Update the chat with the latest message
      await Chat.findByIdAndUpdate(chatId, { latestMessage: message })

      // res.status(200).json(message)
      res.status(StatusCodes.SUCCESS).json({
        success: true,
        data: message,
      })
    } catch (error: any) {
      res.status(400).json({ error: error.message })
    }
  }

  async allMessages(req: Request, res: Response): Promise<void> {
    try {
      // Fetch all messages for a specific chat
      const messages = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'name image email')
        .populate('chat')

      // Return the fetched messages
      // res.status(200).json(messages)
         res.status(StatusCodes.SUCCESS).json({
        success: true,
        data: messages,
      })
    } catch (error: any) {
      // Error handling
      res.status(400).json({ error: error.message })
    }
  }
}
