import { Schema } from 'mongoose';
export interface IChat {
    users: Schema.Types.ObjectId;
    chatName: string;
    latestMessage: Schema.Types.ObjectId;
    createdAt: Date;
}
declare const Chat: import("mongoose").Model<IChat, {}, {}, {}, import("mongoose").Document<unknown, {}, IChat> & IChat & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Chat;
