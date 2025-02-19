import { IStore } from '../interfaces/store.interface';
declare const Store: import("mongoose").Model<IStore, {}, {}, {}, import("mongoose").Document<unknown, {}, IStore> & IStore & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
}, any>;
export default Store;
