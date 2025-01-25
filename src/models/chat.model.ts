import { Schema, model } from 'mongoose';

export interface IChat {
  sender: Schema.Types.ObjectId;
  receiver: Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Chat = model<IChat>('Chat', chatSchema);
export default Chat;
