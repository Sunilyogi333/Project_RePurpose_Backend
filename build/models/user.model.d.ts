import { Schema, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
declare const User: import("mongoose").Model<IUser, {}, {}, {}, Document<unknown, {}, IUser> & IUser & Required<{
    _id: Schema.Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default User;
