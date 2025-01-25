import Chat from '../models/chat.model'

class ChatService {
  // Send a message in the chat
  async sendMessage( senderId: string, receiverId: string, message: string): Promise<any> {
    const chatMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      message,
      createdAt: new Date(),
    })
    await chatMessage.save()
    return chatMessage
  }

  async getMessages(senderId: string, receiverId: string):Promise<any> {
    // Logic to fetch messages from the database
    return await Chat.find({ sender: senderId, receiver: receiverId });
  }

  async getAllChats(userId: string): Promise<any[]> {
    try {
      // Fetch all chats where the user is either sender or receiver
      const chats = await Chat.aggregate([
        {
          $match: {
            $or: [{ sender: userId }, { receiver: userId }],  // Match if user is sender or receiver
          },
        },
        {
          $group: {
            _id: {
              $cond: [{ $eq: ['$sender', userId] }, '$receiver', '$sender'],  // Group by the other participant's ID
            },
            latestMessage: { $last: '$message' },  // Optionally, fetch the last message
            createdAt: { $last: '$createdAt' },  // Optionally, fetch the timestamp of the last message
          },
        },
        {
          $lookup: {
            from: 'users',  // Lookup to get user info from the "User" collection
            localField: '_id',
            foreignField: '_id',
            as: 'participant',  // Create a field to hold participant data
          },
        },
        {
          $unwind: '$participant',  // Flatten the array of participant info
        },
        {
          $project: {
            participantName: '$participant.name',  // Adjust based on the actual field in the user schema
            participantId: '$participant._id',
            latestMessage: 1,
            createdAt: 1,
          },
        },
      ]);

      return chats;  // Return the aggregated chat list
    } catch (error) {
      throw new Error('Error fetching chats');
    }
  }

}

export default new ChatService()
