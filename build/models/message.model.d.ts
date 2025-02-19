import { Schema } from 'mongoose';
export interface IMessage {
    sender: Schema.Types.ObjectId;
    content: string;
    chat: Schema.Types.ObjectId;
}
declare const Message: import("mongoose").Model<IMessage, {}, {}, {}, import("mongoose").Document<unknown, {}, IMessage> & IMessage & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>;
export default Message;
