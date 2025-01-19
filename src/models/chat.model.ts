import { Schema, model } from 'mongoose'

interface IChat {
  productId: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
)

const Chat = model<IChat>('Chat', chatSchema)

export default Chat
