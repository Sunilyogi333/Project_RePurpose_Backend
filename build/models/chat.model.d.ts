import { Schema } from 'mongoose';
interface IChat {
    productId: Schema.Types.ObjectId;
    sender: Schema.Types.ObjectId;
    receiver: Schema.Types.ObjectId;
    message: string;
    createdAt: Date;
}
declare const Chat: import("mongoose").Model<IChat, {}, {}, {}, import("mongoose").Document<unknown, {}, IChat> & IChat & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Chat;
