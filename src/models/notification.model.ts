import { Schema, model } from 'mongoose'

interface INotification {
  user: Schema.Types.ObjectId; // The user who will receive the notification (e.g., stores)
  message: string; // The content of the notification
  productId: Schema.Types.ObjectId; // The product related to the notification
  read: { type: Boolean; default: false }; // Whether the notification is read
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Notification = model<INotification>('Notification', notificationSchema)

export default Notification
