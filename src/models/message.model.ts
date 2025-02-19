import { Schema, model } from 'mongoose'

export interface IMessage {
  sender: Schema.Types.ObjectId
  content: string
  chat: Schema.Types.ObjectId
}

const messageSchema = new Schema<IMessage>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: 'Chat' },
  },
  { timestamps: true }
)

const Message = model<IMessage>('Message', messageSchema)
export default Message
