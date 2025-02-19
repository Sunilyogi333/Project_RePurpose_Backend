import { Schema, model } from 'mongoose'

export interface IChat {
  users: Schema.Types.ObjectId
  chatName: string
  latestMessage: Schema.Types.ObjectId
  createdAt: Date
}

const chatSchema = new Schema<IChat>(
  {
    chatName: { type: String, trim: true },

    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  },
  { timestamps: true }
)

const Chat = model<IChat>('Chat', chatSchema)
export default Chat
