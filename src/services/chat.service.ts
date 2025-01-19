import Chat from '../models/chat.model'

class ChatService {
  // Send a message in the chat
  async sendMessage(productId: string, senderId: string, receiverId: string, message: string): Promise<any> {
    const chatMessage = new Chat({
      productId,
      sender: senderId,
      receiver: receiverId,
      message,
      createdAt: new Date(),
    })
    await chatMessage.save()
    return chatMessage
  }

  // Get all messages related to a product
  async getMessagesForProduct(productId: string): Promise<any[]> {
    return Chat.find({ productId }).sort({ createdAt: 1 })
  }
}

export default new ChatService()
