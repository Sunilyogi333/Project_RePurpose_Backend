import { Schema } from 'mongoose';
interface INotification {
    user: Schema.Types.ObjectId;
    message: string;
    productId: Schema.Types.ObjectId;
    read: {
        type: Boolean;
        default: false;
    };
    createdAt: Date;
}
declare const Notification: import("mongoose").Model<INotification, {}, {}, {}, import("mongoose").Document<unknown, {}, INotification> & INotification & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Notification;
